"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableActionButtons } from "@/components/common/TableActionButtons";
import type { ClientType } from "@/graphql/queries/clients";

interface ClientRowProps {
  client: ClientType;
  onView: (clientId: string) => void;
  onEdit: (client: ClientType) => void;
  onDelete: (client: ClientType) => void;
  animationDelay?: number;
}

export const ClientRow = memo(function ClientRow({
  client,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}: ClientRowProps) {
  const t = useTranslations("adminClients");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TableRow
      key={client.id}
      className="group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent hover:border-l-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationName: "fade-in",
        animationDuration: "0.4s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <TableCell>
        <div className="relative">
          <div
            className="max-w-[200px] truncate text-xs font-medium text-foreground transition-colors duration-300"
            title={client.fullName || "-"}
          >
            {client.fullName || "-"}
          </div>
          <div
            className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 ${
              isHovered ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[250px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
          title={client.email}
        >
          {client.email}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[200px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
          title={
            client.city && client.state
              ? `${client.city}, ${client.state}`
              : client.city || client.state || "-"
          }
        >
          {client.city && client.state
            ? `${client.city}, ${client.state}`
            : client.city || client.state || "-"}
        </div>
      </TableCell>
      <TableActionButtons
        onView={{
          onClick: () => onView(client.id),
          ariaLabel: `View ${client.fullName || client.email}`,
          tooltip: t("viewClient"),
        }}
        onEdit={{
          onClick: () => onEdit(client),
          ariaLabel: `Edit ${client.fullName || client.email}`,
          tooltip: t("editClient"),
        }}
        onDelete={{
          onClick: () => onDelete(client),
          ariaLabel: `Delete ${client.fullName || client.email}`,
          tooltip: t("deleteClient"),
        }}
      />
    </TableRow>
  );
});
