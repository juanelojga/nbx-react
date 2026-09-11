"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { PageHeader } from "@/components/data-display/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  UPDATE_PRICING_CONFIG,
  type UpdatePricingConfigResponse,
  type UpdatePricingConfigVariables,
} from "@/graphql/mutations/pricing";
import {
  GET_PRICING_CONFIG,
  type GetPricingConfigResponse,
} from "@/graphql/queries/pricing";
import {
  createPricingFormSchema,
  type PricingFormValues,
} from "@/lib/validation/pricingFormSchema";

const EMPTY_PRICING_FORM: PricingFormValues = {
  transportationRatePerLb: "",
  serviceFeePercentage: "",
};

export function PricingConfigForm() {
  const t = useTranslations("pricingConfig");

  const schema = useMemo(() => createPricingFormSchema(t), [t]);
  const form = useForm<PricingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_PRICING_FORM,
  });
  const {
    register,
    reset,
    formState: { errors },
  } = form;

  const { data, loading, error } =
    useQuery<GetPricingConfigResponse>(GET_PRICING_CONFIG);
  const config = data?.pricingConfig;

  useEffect(() => {
    if (config) {
      reset({
        transportationRatePerLb: String(config.transportationRatePerLb),
        serviceFeePercentage: String(config.serviceFeePercentage),
      });
    }
  }, [config, reset]);

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
      toast.error(t("errorTitle"), { description: err.message });
    },
    refetchQueries: [{ query: GET_PRICING_CONFIG }],
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await updatePricingConfig({
      variables: {
        transportationRatePerLb: Number.parseFloat(
          values.transportationRatePerLb
        ),
        serviceFeePercentage: Number.parseFloat(values.serviceFeePercentage),
      },
    }).catch(() => undefined);
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />

      {loading && (
        <div
          className="flex items-center justify-center py-12"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className="h-12 w-12 animate-spin text-primary"
              aria-hidden
            />
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden />
          <AlertDescription>{t("loadingError")}</AlertDescription>
        </Alert>
      )}

      {config && !loading && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldWrapper
                  id="transportationRate"
                  label={t("transportationRateLabel")}
                  error={errors.transportationRatePerLb?.message}
                >
                  {(field) => (
                    <Input
                      {...field}
                      {...register("transportationRatePerLb")}
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={saving}
                      placeholder={t("transportationRatePlaceholder")}
                    />
                  )}
                </FormFieldWrapper>
                <FormFieldWrapper
                  id="serviceFeePercentage"
                  label={t("serviceFeePercentageLabel")}
                  hint={t("serviceFeePercentageHelper")}
                  error={errors.serviceFeePercentage?.message}
                >
                  {(field) => (
                    <Input
                      {...field}
                      {...register("serviceFeePercentage")}
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      disabled={saving}
                      placeholder={t("serviceFeePercentagePlaceholder")}
                    />
                  )}
                </FormFieldWrapper>
              </div>

              {config.updatedAt && (
                <p className="text-sm text-muted-foreground">
                  {t("lastUpdatedLabel")}: {formatDateTime(config.updatedAt)}
                </p>
              )}

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden
                    />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" aria-hidden />
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
