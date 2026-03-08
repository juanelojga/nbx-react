export interface TableAction {
  onClick: () => void;
  ariaLabel: string;
  tooltip: string;
}

export type ActionVariant = "view" | "edit" | "delete";

export interface TableActionButtonsProps {
  onView?: TableAction;
  onEdit?: TableAction;
  onDelete?: TableAction;
}
