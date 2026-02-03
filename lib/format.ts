const DEFAULT_LOCALE = "en-NG";
const DEFAULT_CURRENCY = "NGN";

export type FormatCurrencyOptions = {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

/**
 * Formats a number as currency. Reusable across the project (dashboard, orders, finance, products, etc.).
 * @param amount - Value to format
 * @param options - Optional overrides (defaults: en-NG, NGN, 0 fraction digits)
 */
const FRACTION_DIGITS_MIN = 0;
const FRACTION_DIGITS_MAX = 20;

export function formatCurrency(
  amount: number,
  options?: FormatCurrencyOptions
): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    minimumFractionDigits = 0,
    maximumFractionDigits,
  } = options ?? {};

  const min = Math.max(
    FRACTION_DIGITS_MIN,
    Math.min(FRACTION_DIGITS_MAX, minimumFractionDigits)
  );
  const max =
    maximumFractionDigits !== undefined
      ? Math.max(
          FRACTION_DIGITS_MIN,
          Math.min(FRACTION_DIGITS_MAX, maximumFractionDigits)
        )
      : min;
  const resolvedMax = Math.max(min, max);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: min,
    maximumFractionDigits: resolvedMax,
  }).format(amount);
}
