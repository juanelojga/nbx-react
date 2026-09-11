import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataRowPrimaryCellProps {
  text: string;
  /** Tooltip text; defaults to `text`. */
  title?: string;
  /** Monospace styling for identifiers/barcodes. */
  mono?: boolean;
  className?: string;
}

/** First cell of a data row: truncated primary text with a hover underline. */
export function DataRowPrimaryCell({
  text,
  title,
  mono = false,
  className,
}: DataRowPrimaryCellProps) {
  return (
    <TableCell>
      <div className="relative">
        <div
          className={cn(
            "truncate text-xs font-medium text-foreground transition-colors duration-300",
            mono && "font-mono font-semibold tracking-wide tabular-nums",
            className
          )}
          title={title ?? text}
        >
          {text}
        </div>
        <div
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-secondary opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100"
        />
      </div>
    </TableCell>
  );
}
