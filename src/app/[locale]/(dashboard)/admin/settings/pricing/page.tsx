"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GET_PRICING_CONFIG,
  GetPricingConfigResponse,
} from "@/graphql/queries/pricing";
import {
  UPDATE_PRICING_CONFIG,
  UpdatePricingConfigVariables,
  UpdatePricingConfigResponse,
} from "@/graphql/mutations/pricing";
import { toast } from "sonner";

export default function PricingConfigPage() {
  const t = useTranslations("pricingConfig");

  const [transportationRate, setTransportationRate] = useState("");
  const [serviceFeePercentage, setServiceFeePercentage] = useState("");

  const { data, loading, error } =
    useQuery<GetPricingConfigResponse>(GET_PRICING_CONFIG);

  const [updatePricingConfig, { loading: saving }] = useMutation<
    UpdatePricingConfigResponse,
    UpdatePricingConfigVariables
  >(UPDATE_PRICING_CONFIG, {
    onCompleted: () => {
      toast.success(t("successTitle"), {
        description: t("successDescription"),
      });
    },
    onError: (err) => {
      toast.error(t("errorTitle"), {
        description: err.message,
      });
    },
    refetchQueries: [{ query: GET_PRICING_CONFIG }],
  });

  useEffect(() => {
    if (data?.pricingConfig) {
      queueMicrotask(() => {
        setTransportationRate(
          data.pricingConfig.transportationRatePerLb.toString()
        );
        setServiceFeePercentage(
          data.pricingConfig.serviceFeePercentage.toString()
        );
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const variables: UpdatePricingConfigVariables = {};

    if (transportationRate.trim()) {
      variables.transportationRatePerLb = parseFloat(transportationRate.trim());
    }
    if (serviceFeePercentage.trim()) {
      variables.serviceFeePercentage = parseFloat(serviceFeePercentage.trim());
    }

    await updatePricingConfig({ variables }).catch(() => {});
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("loadingError")}</AlertDescription>
        </Alert>
      )}

      {data?.pricingConfig && !loading && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="transportationRate">
                    {t("transportationRateLabel")}
                  </Label>
                  <Input
                    id="transportationRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={transportationRate}
                    onChange={(e) => setTransportationRate(e.target.value)}
                    disabled={saving}
                    placeholder={t("transportationRatePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceFeePercentage">
                    {t("serviceFeePercentageLabel")}
                  </Label>
                  <Input
                    id="serviceFeePercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={serviceFeePercentage}
                    onChange={(e) => setServiceFeePercentage(e.target.value)}
                    disabled={saving}
                    placeholder={t("serviceFeePercentagePlaceholder")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("serviceFeePercentageHelper")}
                  </p>
                </div>
              </div>

              {data.pricingConfig.updatedAt && (
                <p className="text-sm text-muted-foreground">
                  {t("lastUpdatedLabel")}:{" "}
                  {formatDateTime(data.pricingConfig.updatedAt)}
                </p>
              )}

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("saveButton")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
