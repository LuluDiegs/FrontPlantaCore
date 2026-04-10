/**
 * Formata números grandes de forma compacta:
 * 999 → "999"
 * 1200 → "1.2K"
 * 15000 → "15K"
 * 1500000 → "1.5M"
 */
export function compactNumber(num) {
  if (num === null || num === undefined) return '0';

  if (num < 1000) return String(num);

  if (num < 1_000_000) {
    const value = num / 1000;
    return value % 1 === 0 ? `${value}K` : `${value.toFixed(1)}K`;
  }

  const value = num / 1_000_000;
  return value % 1 === 0 ? `${value}M` : `${value.toFixed(1)}M`;
}
