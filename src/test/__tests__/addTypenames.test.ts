import { parse } from "graphql";

import { addTypenames } from "@/test/addTypenames";

const QUERY = parse(`
  fragment ClientSummary on ClientType { id fullName email }
  query GetPackage($id: ID!) {
    package(id: $id) {
      id
      client { ...ClientSummary }
    }
  }
`);

describe("addTypenames", () => {
  it("adds __typename through fields and fragment spreads", () => {
    const data = addTypenames(QUERY, {
      package: {
        id: "1",
        client: { id: "c", fullName: "Ana", email: "a@b.co" },
      },
    });

    expect(data.package).toMatchObject({ __typename: "PackageType" });
    expect(data.package.client).toMatchObject({ __typename: "ClientType" });
  });

  it("handles lists and nulls", () => {
    const LIST = parse(`query Q { allClients(page: 1) { results { id } } }`);
    const data = addTypenames(LIST, {
      allClients: { results: [{ id: "1" }, null] },
    });

    expect(data.allClients).toMatchObject({ __typename: "ClientConnection" });
    expect(data.allClients.results[0]).toMatchObject({
      __typename: "ClientType",
    });
    expect(data.allClients.results[1]).toBeNull();
  });
});
