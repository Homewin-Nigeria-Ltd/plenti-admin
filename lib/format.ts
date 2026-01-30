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
export function formatCurrency(
  amount: number,
  options?: FormatCurrencyOptions
): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options ?? {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}
