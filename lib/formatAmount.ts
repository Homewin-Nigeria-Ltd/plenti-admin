// lib/formatAmount.ts

/**
 * Formats a number as a currency string, using M for millions and B for billions.
 * Only applies abbreviation for millions and billions, otherwise returns with commas.
 * @param amount The amount to format
 * @returns Formatted string (e.g. 1.2M, 3.4B, 12,000)
 */
export function formatLargeAmount(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  return amount.toLocaleString();
}
