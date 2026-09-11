import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ComingSoonCard } from "@/components/common/ComingSoonCard";
import { PageHeader } from "@/components/data-display/page-header";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clientPackages" });
  return { title: t("title") };
}

export default async function ClientPackagesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "clientPackages" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <ComingSoonCard
        intro={t("intro")}
        features={[
          t("feature1"),
          t("feature2"),
          t("feature3"),
          t("feature4"),
          t("feature5"),
        ]}
      />
    </div>
  );
}
