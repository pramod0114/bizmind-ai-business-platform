/**
 * BizMind – Number & Currency Formatters
 * Default Currency: INR (₹) with Indian Lakh/Crore numbering system support.
 */

export function formatCurrency(amount: number | null | undefined, currency = 'INR'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const locale = currency.toUpperCase() === 'INR' ? 'en-IN' : 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatPercentage(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.0%';
  }
  return `${value.toFixed(decimals)}%`;
}

export const formatPercent = formatPercentage;

export function formatNumber(num: number | null | undefined, locale = 'en-IN'): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCompactNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  const abs = Math.abs(num);
  if (abs >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
