"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export interface ExtraAttributeEntry {
  key: string;
  value: string;
}

interface ExtraAttributesEditorProps {
  value: ExtraAttributeEntry[];
  onChange: (entries: ExtraAttributeEntry[]) => void;
  disabled?: boolean;
  maxEntries?: number;
  labels: {
    title: string;
    description: string;
    addCharge: string;
    chargeName: string;
    chargeAmount: string;
    maxChargesReached: string;
  };
  errors?: Record<string, string | undefined>;
}

export function ExtraAttributesEditor({
  value,
  onChange,
  disabled = false,
  maxEntries = 5,
  labels,
  errors,
}: ExtraAttributesEditorProps) {
  const handleAdd = () => {
    if (value.length < maxEntries) {
      onChange([...value, { key: "", value: "" }]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const updated = value.map((entry, i) =>
      i === index ? { ...entry, [field]: newValue } : entry
    );
    onChange(updated);
  };

  const atMax = value.length >= maxEntries;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
          {labels.title}
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          {labels.description}
        </p>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((entry, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder={labels.chargeName}
                  value={entry.key}
                  onChange={(e) => handleChange(index, "key", e.target.value)}
                  disabled={disabled}
                  className={
                    errors?.[`extraAttributes_${index}_key`]
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors?.[`extraAttributes_${index}_key`] && (
                  <p className="text-xs text-destructive">
                    {errors[`extraAttributes_${index}_key`]}
                  </p>
                )}
              </div>
              <div className="w-32 space-y-1">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={labels.chargeAmount}
                  value={entry.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  disabled={disabled}
                  className={
                    errors?.[`extraAttributes_${index}_value`]
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors?.[`extraAttributes_${index}_value`] && (
                  <p className="text-xs text-destructive">
                    {errors[`extraAttributes_${index}_value`]}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {errors?.extraAttributes_general && (
        <p className="text-sm text-destructive">
          {errors.extraAttributes_general}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        disabled={disabled || atMax}
        className="gap-1"
      >
        <Plus className="h-3.5 w-3.5" />
        {atMax ? labels.maxChargesReached : labels.addCharge}
      </Button>
    </div>
  );
}

export function serializeExtraAttributes(
  entries: ExtraAttributeEntry[]
): string | undefined {
  const filtered = entries.filter(
    (e) => e.key.trim() !== "" && e.value.trim() !== ""
  );
  if (filtered.length === 0) return undefined;
  const obj: Record<string, string> = {};
  for (const entry of filtered) {
    obj[entry.key.trim()] = entry.value.trim();
  }
  return JSON.stringify(obj);
}

export function parseExtraAttributes(
  json: string | null
): ExtraAttributeEntry[] {
  if (!json) return [];
  try {
    const obj = JSON.parse(json);
    if (typeof obj !== "object" || obj === null || Array.isArray(obj))
      return [];
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  } catch {
    return [];
  }
}
