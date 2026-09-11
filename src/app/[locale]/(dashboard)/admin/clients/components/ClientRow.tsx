"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { TableCell } from "@/components/ui/table";
import { DataRowPrimaryCell } from "@/components/common/DataRowPrimaryCell";
import { DataRowShell } from "@/components/common/DataRowShell";

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

  return (
    <DataRowShell animationDelay={animationDelay}>
      <DataRowPrimaryCell
        text={client.fullName || "-"}
        className="max-w-[200px]"
      />
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
          ariaLabel: t("viewAriaLabel", {
            name: client.fullName || client.email,
          }),
          tooltip: t("viewClient"),
        }}
        onEdit={{
          onClick: () => onEdit(client),
          ariaLabel: t("editAriaLabel", {
            name: client.fullName || client.email,
          }),
          tooltip: t("editClient"),
        }}
        onDelete={{
          onClick: () => onDelete(client),
          ariaLabel: t("deleteAriaLabel", {
            name: client.fullName || client.email,
          }),
          tooltip: t("deleteClient"),
        }}
      />
    </DataRowShell>
  );
});
