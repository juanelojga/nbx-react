import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComingSoonCardProps {
  intro: string;
  features: string[];
}

/** Placeholder body for sections that are not implemented yet. */
export function ComingSoonCard({ intro, features }: ComingSoonCardProps) {
  const t = useTranslations("common");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("comingSoon")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{intro}</p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
