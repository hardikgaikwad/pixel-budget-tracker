/**
 * Currency formatting utilities for Indian Rupee (INR ₹).
 * Uses standard Indian numbering system (lakhs, crores).
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0
});

/**
 * Format a number as standard INR currency: e.g. "₹5,000"
 */
export function formatINR(amount) {
  const num = Number(amount) || 0;
  return inrFormatter.format(Math.abs(num));
}

/**
 * Format transaction amount with sign:
 * - Spent: "−₹250"
 * - Saved: "+₹100"
 */
export function formatSignedINR(amount, type) {
  const num = Math.abs(Number(amount) || 0);
  const formatted = inrFormatter.format(num);
  if (type === 'spent' || type === 'expense') {
    return `−${formatted}`;
  }
  if (type === 'saved' || type === 'saving') {
    return `+${formatted}`;
  }
  return formatted;
}

/**
 * Clean & validate numeric input string
 */
export function sanitizeAmount(input) {
  if (typeof input === 'number') return input > 0 ? input : 0;
  if (!input) return 0;
  const str = String(input).trim();
  if (str.startsWith('-')) return 0;
  const cleaned = str.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) || parsed <= 0 ? 0 : parsed;
}
