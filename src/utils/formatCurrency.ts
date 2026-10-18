/**
 * Formats prices in Sierra Leonean Leones using the "Le" prefix (e.g., Le 220, Le 4,000).
 * Input is in cents (1 Leone = 100 cents).
 */
export const formatCurrency = (amountInCents: number | null | undefined): string => {
  if (amountInCents === null || amountInCents === undefined || isNaN(amountInCents)) {
    return "Le 0";
  }

  const leones = amountInCents / 100;
  const isWhole = Number.isInteger(leones);

  const formatted = leones.toLocaleString("en-US", {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `Le ${formatted}`;
};
