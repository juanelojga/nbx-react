// In-memory GraphQL mock backend for Playwright E2E tests.
// State lives at module scope so it persists across browser contexts
// within a single worker (CI runs workers: 1).

type UUID = string;
type Nullable<T> = T | null;

interface MockClient {
  id: UUID;
  userId: UUID;
  firstName: string;
  lastName: string;
  email: string;
  identificationNumber: Nullable<string>;
  state: Nullable<string>;
  city: Nullable<string>;
  mainStreet: Nullable<string>;
  secondaryStreet: Nullable<string>;
  buildingNumber: Nullable<string>;
  mobilePhoneNumber: Nullable<string>;
  phoneNumber: Nullable<string>;
  createdAt: string;
  updatedAt: string;
}

interface MockPackage {
  id: UUID;
  clientId: UUID;
  barcode: string;
  courier: Nullable<string>;
  otherCourier: Nullable<string>;
  length: Nullable<number>;
  width: Nullable<number>;
  height: Nullable<number>;
  dimensionUnit: Nullable<string>;
  weight: Nullable<number>;
  weightUnit: Nullable<string>;
  description: Nullable<string>;
  purchaseLink: Nullable<string>;
  purchasedByNarbox: boolean;
  realPrice: Nullable<number>;
  arrivalDate: Nullable<string>;
  comments: Nullable<string>;
  createdAt: string;
  updatedAt: string;
}

interface MockConsolidate {
  id: UUID;
  description: string;
  status: string;
  deliveryDate: Nullable<string>;
  comment: Nullable<string>;
  extraAttributes: Nullable<string>;
  packageIds: UUID[];
  createdAt: string;
  updatedAt: string;
}

interface Store {
  nextId: number;
  adminUser: {
    id: UUID;
    email: string;
    firstName: string;
    lastName: string;
    isSuperuser: boolean;
  };
  clients: MockClient[];
  packages: MockPackage[];
  consolidates: MockConsolidate[];
  pricingConfig: {
    serviceFeePercentage: number;
    transportationRatePerLb: number;
    updatedAt: string;
  };
}

function nowIso() {
  return new Date().toISOString();
}

// Hand-built unsigned JWT with far-future exp so isTokenExpired returns false.
function makeJwt(): string {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    email: "admin@example.com",
    exp: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
    origIat: Math.floor(Date.now() / 1000),
  };
  const b64 = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  return `${b64(header)}.${b64(payload)}.signature`;
}

const store: Store = {
  nextId: 1000,
  adminUser: {
    id: "1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    isSuperuser: true,
  },
  clients: [
    {
      id: "100",
      userId: "200",
      firstName: "Seed",
      lastName: "Client",
      email: "seed.client@example.com",
      identificationNumber: "0000000000",
      state: "Pichincha",
      city: "Quito",
      mainStreet: "Av. Amazonas",
      secondaryStreet: null,
      buildingNumber: "1",
      mobilePhoneNumber: "0991111111",
      phoneNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  packages: [],
  consolidates: [],
  pricingConfig: {
    serviceFeePercentage: 10,
    transportationRatePerLb: 5,
    updatedAt: nowIso(),
  },
};

function genId(): string {
  return String(++store.nextId);
}

function fullName(c: MockClient) {
  return `${c.firstName} ${c.lastName}`;
}

function servicePrices(pkg: MockPackage) {
  const weight = pkg.weight ?? 0;
  const transportationCost = +(
    weight * store.pricingConfig.transportationRatePerLb
  ).toFixed(2);
  const realPrice = pkg.realPrice ?? 0;
  const serviceFee = +(
    realPrice *
    (store.pricingConfig.serviceFeePercentage / 100)
  ).toFixed(2);
  const servicePrice = +(transportationCost + serviceFee).toFixed(2);
  return { transportationCost, serviceFee, servicePrice };
}

function packageShape(pkg: MockPackage, full = false) {
  const { transportationCost, serviceFee, servicePrice } = servicePrices(pkg);
  const base = {
    id: pkg.id,
    barcode: pkg.barcode,
    description: pkg.description,
    purchasedByNarbox: pkg.purchasedByNarbox,
    realPrice: pkg.realPrice,
    servicePrice,
    transportationCost,
    serviceFee,
    weight: pkg.weight,
    weightUnit: pkg.weightUnit ?? "lb",
    createdAt: pkg.createdAt,
  };
  if (!full) return base;
  const client = store.clients.find((c) => c.id === pkg.clientId);
  return {
    ...base,
    courier: pkg.courier,
    otherCourier: pkg.otherCourier,
    length: pkg.length,
    width: pkg.width,
    height: pkg.height,
    dimensionUnit: pkg.dimensionUnit,
    purchaseLink: pkg.purchaseLink,
    arrivalDate: pkg.arrivalDate,
    comments: pkg.comments,
    client: client
      ? { id: client.id, fullName: fullName(client), email: client.email }
      : null,
    updatedAt: pkg.updatedAt,
  };
}

function clientShape(c: MockClient) {
  return {
    id: c.id,
    user: {
      id: c.userId,
      isSuperuser: false,
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
    },
    email: c.email,
    identificationNumber: c.identificationNumber,
    state: c.state,
    city: c.city,
    mainStreet: c.mainStreet,
    secondaryStreet: c.secondaryStreet,
    buildingNumber: c.buildingNumber,
    mobilePhoneNumber: c.mobilePhoneNumber,
    phoneNumber: c.phoneNumber,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    fullName: fullName(c),
  };
}

function consolidateShape(cs: MockConsolidate, detailed = false) {
  const pkgs = cs.packageIds
    .map((id) => store.packages.find((p) => p.id === id))
    .filter((p): p is MockPackage => !!p);
  const client = pkgs[0]
    ? store.clients.find((c) => c.id === pkgs[0].clientId)
    : undefined;

  const packagesRealPriceSum = pkgs.reduce((s, p) => s + (p.realPrice ?? 0), 0);
  const packagesServicePriceSum = pkgs.reduce(
    (s, p) => s + servicePrices(p).servicePrice,
    0
  );
  let extrasSum = 0;
  if (cs.extraAttributes) {
    try {
      const parsed = JSON.parse(cs.extraAttributes);
      if (Array.isArray(parsed)) {
        extrasSum = parsed.reduce(
          (s: number, e: { amount?: string | number }) => {
            const amt =
              typeof e.amount === "string"
                ? parseFloat(e.amount)
                : (e.amount ?? 0);
            return s + (isNaN(amt as number) ? 0 : (amt as number));
          },
          0
        );
      }
    } catch {
      /* ignore */
    }
  }
  const totalCost = +(
    packagesRealPriceSum +
    packagesServicePriceSum +
    extrasSum
  ).toFixed(2);

  const clientNode = client
    ? {
        id: client.id,
        fullName: fullName(client),
        email: client.email,
        ...(detailed ? { mobilePhoneNumber: client.mobilePhoneNumber } : {}),
      }
    : {
        id: "0",
        fullName: "Unknown",
        email: "unknown@example.com",
        ...(detailed ? { mobilePhoneNumber: null } : {}),
      };

  return {
    id: cs.id,
    description: cs.description,
    status: cs.status,
    deliveryDate: cs.deliveryDate,
    comment: cs.comment,
    extraAttributes: cs.extraAttributes,
    totalCost,
    client: clientNode,
    packages: pkgs.map((p) =>
      detailed
        ? {
            id: p.id,
            barcode: p.barcode,
            description: p.description,
            weight: p.weight,
            weightUnit: p.weightUnit ?? "lb",
            courier: p.courier,
            otherCourier: p.otherCourier,
            length: p.length,
            width: p.width,
            height: p.height,
            dimensionUnit: p.dimensionUnit,
            purchasedByNarbox: p.purchasedByNarbox,
            realPrice: p.realPrice,
            ...servicePrices(p),
            arrivalDate: p.arrivalDate,
          }
        : { id: p.id, barcode: p.barcode, description: p.description }
    ),
    createdAt: cs.createdAt,
    updatedAt: cs.updatedAt,
  };
}

// ─── Resolvers ───────────────────────────────────────────────

type Vars = Record<string, unknown>;

export const resolvers: Record<string, (vars: Vars) => unknown> = {
  // Auth
  Login: () => ({
    emailAuth: {
      token: makeJwt(),
      refreshToken: "mock-refresh-token",
      refreshExpiresIn: 7 * 24 * 3600,
      payload: {
        email: store.adminUser.email,
        exp: Math.floor(Date.now() / 1000) + 3600,
        origIat: Math.floor(Date.now() / 1000),
      },
    },
  }),
  RefreshToken: () => ({
    refreshWithToken: {
      token: makeJwt(),
      refreshToken: "mock-refresh-token-refreshed",
      refreshExpiresIn: 7 * 24 * 3600,
      payload: {
        email: store.adminUser.email,
        exp: Math.floor(Date.now() / 1000) + 3600,
        origIat: Math.floor(Date.now() / 1000),
      },
    },
  }),
  Logout: () => ({ revokeToken: { revoked: true } }),
  GetCurrentUser: () => ({ me: { ...store.adminUser } }),

  // Pricing
  GetPricingConfig: () => ({ pricingConfig: { ...store.pricingConfig } }),
  UpdatePricingConfig: (vars) => {
    if (typeof vars.serviceFeePercentage === "number")
      store.pricingConfig.serviceFeePercentage = vars.serviceFeePercentage;
    if (typeof vars.transportationRatePerLb === "number")
      store.pricingConfig.transportationRatePerLb =
        vars.transportationRatePerLb;
    store.pricingConfig.updatedAt = nowIso();
    return {
      updatePricingConfig: { pricingConfig: { ...store.pricingConfig } },
    };
  },

  // Dashboard
  GetDashboard: (vars) => {
    const recentPackagesLimit = (vars.recentPackagesLimit as number) ?? 5;
    const recentConsolidationsLimit =
      (vars.recentConsolidationsLimit as number) ?? 5;
    const packagesByDate = [...store.packages].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    const consolidationsByDate = [...store.consolidates].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    const totalRealPrice = store.packages.reduce(
      (s, p) => s + (p.realPrice ?? 0),
      0
    );
    const totalServicePrice = store.packages.reduce(
      (s, p) => s + servicePrices(p).servicePrice,
      0
    );
    return {
      dashboard: {
        stats: {
          totalPackages: store.packages.length,
          recentPackages: packagesByDate.length,
          packagesPending: store.packages.length,
          packagesInTransit: 0,
          packagesDelivered: 0,
          totalConsolidations: store.consolidates.length,
          consolidationsPending: store.consolidates.filter(
            (c) => c.status === "pending"
          ).length,
          consolidationsProcessing: store.consolidates.filter(
            (c) => c.status === "processing"
          ).length,
          consolidationsInTransit: store.consolidates.filter(
            (c) => c.status === "in_transit"
          ).length,
          consolidationsAwaitingPayment: store.consolidates.filter(
            (c) => c.status === "awaiting_payment"
          ).length,
          totalRealPrice: +totalRealPrice.toFixed(2),
          totalServicePrice: +totalServicePrice.toFixed(2),
          totalClients: store.clients.length,
        },
        recentPackages: packagesByDate
          .slice(0, recentPackagesLimit)
          .map((p) => {
            const client = store.clients.find((c) => c.id === p.clientId);
            const { servicePrice } = servicePrices(p);
            return {
              id: p.id,
              barcode: p.barcode,
              description: p.description,
              realPrice: p.realPrice,
              servicePrice,
              createdAt: p.createdAt,
              client: client
                ? {
                    id: client.id,
                    fullName: fullName(client),
                    email: client.email,
                  }
                : {
                    id: "0",
                    fullName: "Unknown",
                    email: "unknown@example.com",
                  },
            };
          }),
        recentConsolidations: consolidationsByDate
          .slice(0, recentConsolidationsLimit)
          .map((cs) => {
            const shaped = consolidateShape(cs);
            return {
              id: shaped.id,
              description: shaped.description,
              status: shaped.status,
              deliveryDate: shaped.deliveryDate,
              createdAt: shaped.createdAt,
              client: {
                id: shaped.client.id,
                fullName: shaped.client.fullName,
                email: shaped.client.email,
              },
              packages: shaped.packages.map((p) => ({
                id: p.id,
                barcode: p.barcode,
              })),
            };
          }),
      },
    };
  },

  // Clients
  GetAllClients: (vars) => {
    const search = ((vars.search as string) ?? "").toLowerCase();
    let results = store.clients;
    if (search) {
      results = results.filter(
        (c) =>
          fullName(c).toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search)
      );
    }
    const page = (vars.page as number) ?? 1;
    const pageSize = (vars.pageSize as number) ?? 10;
    const paged = results.slice((page - 1) * pageSize, page * pageSize);
    return {
      allClients: {
        results: paged.map(clientShape),
        totalCount: results.length,
        page,
        pageSize,
        hasNext: page * pageSize < results.length,
        hasPrevious: page > 1,
      },
    };
  },
  GetClient: (vars) => {
    const c = store.clients.find((x) => x.id === String(vars.id));
    if (!c) return { client: null };
    const shape = clientShape(c);
    // GetClient query doesn't include the user subfield, but returning the
    // superset is harmless since Apollo selects by selection set.
    return { client: shape };
  },
  CreateClient: (vars) => {
    const id = genId();
    const now = nowIso();
    const c: MockClient = {
      id,
      userId: genId(),
      firstName: String(vars.firstName),
      lastName: String(vars.lastName),
      email: String(vars.email),
      identificationNumber: (vars.identificationNumber as string) ?? null,
      state: (vars.state as string) ?? null,
      city: (vars.city as string) ?? null,
      mainStreet: (vars.mainStreet as string) ?? null,
      secondaryStreet: (vars.secondaryStreet as string) ?? null,
      buildingNumber: (vars.buildingNumber as string) ?? null,
      mobilePhoneNumber: (vars.mobilePhoneNumber as string) ?? null,
      phoneNumber: (vars.phoneNumber as string) ?? null,
      createdAt: now,
      updatedAt: now,
    };
    store.clients.push(c);
    const shape = clientShape(c);
    return {
      createClient: {
        client: {
          id: shape.id,
          fullName: shape.fullName,
          email: shape.email,
          identificationNumber: shape.identificationNumber,
          state: shape.state,
          city: shape.city,
          mainStreet: shape.mainStreet,
          secondaryStreet: shape.secondaryStreet,
          buildingNumber: shape.buildingNumber,
          mobilePhoneNumber: shape.mobilePhoneNumber,
          phoneNumber: shape.phoneNumber,
          createdAt: shape.createdAt,
          updatedAt: shape.updatedAt,
        },
      },
    };
  },
  UpdateClient: (vars) => {
    const c = store.clients.find((x) => x.id === String(vars.id));
    if (!c) throw new Error("Client not found");
    const assign = <K extends keyof MockClient>(key: K, v: unknown) => {
      if (v !== undefined && v !== null) (c[key] as unknown) = v;
    };
    assign("firstName", vars.firstName);
    assign("lastName", vars.lastName);
    assign("identificationNumber", vars.identificationNumber);
    assign("state", vars.state);
    assign("city", vars.city);
    assign("mainStreet", vars.mainStreet);
    assign("secondaryStreet", vars.secondaryStreet);
    assign("buildingNumber", vars.buildingNumber);
    assign("mobilePhoneNumber", vars.mobilePhoneNumber);
    assign("phoneNumber", vars.phoneNumber);
    c.updatedAt = nowIso();
    const s = clientShape(c);
    return {
      updateClient: {
        client: {
          id: s.id,
          fullName: s.fullName,
          email: s.email,
          city: s.city,
          state: s.state,
          mobilePhoneNumber: s.mobilePhoneNumber,
          phoneNumber: s.phoneNumber,
          identificationNumber: s.identificationNumber,
          mainStreet: s.mainStreet,
          secondaryStreet: s.secondaryStreet,
          buildingNumber: s.buildingNumber,
          updatedAt: s.updatedAt,
        },
      },
    };
  },
  DeleteClient: (vars) => {
    const idx = store.clients.findIndex((x) => x.id === String(vars.id));
    if (idx >= 0) {
      const clientId = store.clients[idx].id;
      store.clients.splice(idx, 1);
      // Also remove packages & consolidates for that client
      store.packages = store.packages.filter((p) => p.clientId !== clientId);
      store.consolidates = store.consolidates.filter((cs) => {
        const pkgs = cs.packageIds
          .map((id) => store.packages.find((p) => p.id === id))
          .filter((p): p is MockPackage => !!p);
        return pkgs.length > 0;
      });
    }
    return { deleteClient: { ok: true, message: "Deleted" } };
  },

  // Packages
  ResolveAllPackages: (vars) => {
    const clientId = String(vars.client_id);
    const search = ((vars.search as string) ?? "").toLowerCase();
    let results = store.packages.filter((p) => p.clientId === clientId);
    if (search) {
      results = results.filter(
        (p) =>
          p.barcode.toLowerCase().includes(search) ||
          (p.description ?? "").toLowerCase().includes(search)
      );
    }
    const page = (vars.page as number) ?? 1;
    const pageSize = (vars.page_size as number) ?? 10;
    const paged = results.slice((page - 1) * pageSize, page * pageSize);
    return {
      allPackages: {
        results: paged.map((p) => packageShape(p, false)),
        totalCount: results.length,
        page,
        pageSize,
        hasNext: page * pageSize < results.length,
        hasPrevious: page > 1,
      },
    };
  },
  GetPackage: (vars) => {
    const p = store.packages.find((x) => x.id === String(vars.id));
    return { package: p ? packageShape(p, true) : null };
  },
  CreatePackage: (vars) => {
    const id = genId();
    const now = nowIso();
    const p: MockPackage = {
      id,
      clientId: String(vars.clientId),
      barcode: String(vars.barcode),
      courier: (vars.courier as string) ?? null,
      otherCourier: (vars.otherCourier as string) ?? null,
      length: (vars.length as number) ?? null,
      width: (vars.width as number) ?? null,
      height: (vars.height as number) ?? null,
      dimensionUnit: (vars.dimensionUnit as string) ?? null,
      weight: (vars.weight as number) ?? null,
      weightUnit: (vars.weightUnit as string) ?? "lb",
      description: (vars.description as string) ?? null,
      purchaseLink: (vars.purchaseLink as string) ?? null,
      purchasedByNarbox: (vars.purchasedByNarbox as boolean) ?? false,
      realPrice: (vars.realPrice as number) ?? null,
      arrivalDate: (vars.arrivalDate as string) ?? null,
      comments: (vars.comments as string) ?? null,
      createdAt: now,
      updatedAt: now,
    };
    store.packages.push(p);
    return { createPackage: { package: packageShape(p, false) } };
  },
  UpdatePackage: (vars) => {
    const p = store.packages.find((x) => x.id === String(vars.id));
    if (!p) throw new Error("Package not found");
    const assign = <K extends keyof MockPackage>(key: K, v: unknown) => {
      if (v !== undefined) (p[key] as unknown) = v;
    };
    assign("courier", vars.courier);
    assign("otherCourier", vars.otherCourier);
    assign("length", vars.length);
    assign("width", vars.width);
    assign("height", vars.height);
    assign("dimensionUnit", vars.dimensionUnit);
    assign("weight", vars.weight);
    assign("weightUnit", vars.weightUnit);
    assign("description", vars.description);
    assign("purchaseLink", vars.purchaseLink);
    assign("realPrice", vars.realPrice);
    assign("purchasedByNarbox", vars.purchasedByNarbox);
    assign("arrivalDate", vars.arrivalDate);
    assign("comments", vars.comments);
    if (vars.clientId) p.clientId = String(vars.clientId);
    p.updatedAt = nowIso();
    return { updatePackage: { package: packageShape(p, true) } };
  },
  DeletePackage: (vars) => {
    const idx = store.packages.findIndex((x) => x.id === String(vars.id));
    if (idx >= 0) store.packages.splice(idx, 1);
    return { deletePackage: { success: true } };
  },

  // Consolidations
  GetAllConsolidates: (vars) => {
    const search = ((vars.search as string) ?? "").toLowerCase();
    const status = vars.status as string | undefined;
    let results = store.consolidates;
    if (status) results = results.filter((c) => c.status === status);
    if (search) {
      results = results.filter((c) => {
        if (c.description.toLowerCase().includes(search)) return true;
        const pkgs = c.packageIds
          .map((id) => store.packages.find((p) => p.id === id))
          .filter((p): p is MockPackage => !!p);
        const client = pkgs[0]
          ? store.clients.find((cl) => cl.id === pkgs[0].clientId)
          : undefined;
        if (client && fullName(client).toLowerCase().includes(search))
          return true;
        return false;
      });
    }
    const page = (vars.page as number) ?? 1;
    const pageSize = (vars.pageSize as number) ?? 10;
    const paged = results.slice((page - 1) * pageSize, page * pageSize);
    return {
      allConsolidates: {
        results: paged.map((c) => consolidateShape(c, false)),
        totalCount: results.length,
        page,
        pageSize,
        hasNext: page * pageSize < results.length,
        hasPrevious: page > 1,
      },
    };
  },
  GetConsolidateById: (vars) => {
    const c = store.consolidates.find((x) => x.id === String(vars.id));
    return { consolidateById: c ? consolidateShape(c, true) : null };
  },
  CreateConsolidate: (vars) => {
    const id = genId();
    const now = nowIso();
    const cs: MockConsolidate = {
      id,
      description: String(vars.description),
      status: String(vars.status),
      deliveryDate: (vars.deliveryDate as string) ?? null,
      comment: (vars.comment as string) ?? null,
      extraAttributes: (vars.extraAttributes as string) ?? null,
      packageIds: ((vars.packageIds as string[]) ?? []).map(String),
      createdAt: now,
      updatedAt: now,
    };
    store.consolidates.push(cs);
    return { createConsolidate: { consolidate: consolidateShape(cs, false) } };
  },
  UpdateConsolidate: (vars) => {
    const cs = store.consolidates.find((x) => x.id === String(vars.id));
    if (!cs) throw new Error("Consolidate not found");
    if (vars.description !== undefined && vars.description !== null)
      cs.description = String(vars.description);
    if (vars.status !== undefined && vars.status !== null)
      cs.status = String(vars.status);
    if (vars.deliveryDate !== undefined)
      cs.deliveryDate = (vars.deliveryDate as string) ?? null;
    if (vars.comment !== undefined)
      cs.comment = (vars.comment as string) ?? null;
    if (vars.extraAttributes !== undefined)
      cs.extraAttributes = (vars.extraAttributes as string) ?? null;
    if (vars.packageIds !== undefined && vars.packageIds !== null)
      cs.packageIds = (vars.packageIds as string[]).map(String);
    cs.updatedAt = nowIso();
    return { updateConsolidate: { consolidate: consolidateShape(cs, false) } };
  },
  DeleteConsolidate: (vars) => {
    const idx = store.consolidates.findIndex((x) => x.id === String(vars.id));
    if (idx >= 0) store.consolidates.splice(idx, 1);
    return { deleteConsolidate: { success: true } };
  },
};

export { store };
