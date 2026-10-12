/**
 * Date and Week utilities for Pixel Budget Tracker.
 * Weeks run Monday through Sunday (ISO standard).
 */

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

/**
 * Safely parse a YYYY-MM-DD string into a local Date object.
 */
export function parseISODate(isoString) {
  if (!isoString) return new Date();
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Noon prevents DST edge-cases
}

/**
 * Format a Date object to YYYY-MM-DD local string.
 */
export function formatISODate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the Monday Date of the week containing the given date.
 */
export function getMonday(date) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  // Distance from Monday: Sunday (0) is 6 days after Monday, Monday (1) is 0, etc.
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Get the Sunday Date of the week containing the given date.
 */
export function getSunday(date) {
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
}

/**
 * Unique week identifier: YYYY-MM-DD of Monday.
 */
export function getWeekKey(date = new Date()) {
  const monday = getMonday(date);
  return formatISODate(monday);
}

/**
 * Get the previous week key (-7 days).
 */
export function getPrevWeekKey(weekKey) {
  const monday = parseISODate(weekKey);
  monday.setDate(monday.getDate() - 7);
  return formatISODate(monday);
}

/**
 * Get the next week key (+7 days).
 */
export function getNextWeekKey(weekKey) {
  const monday = parseISODate(weekKey);
  monday.setDate(monday.getDate() + 7);
  return formatISODate(monday);
}

/**
 * Check if the given weekKey is the current calendar week.
 */
export function isCurrentWeek(weekKey) {
  const currentKey = getWeekKey(new Date());
  return weekKey === currentKey;
}

/**
 * Format date range for header:
 * - Same month & year: "OCT 12 — OCT 18"
 * - Different month, same year: "OCT 26 — NOV 01"
 * - Different year: "DEC 28, 2026 — JAN 03, 2027"
 */
export function formatWeekRange(weekKey) {
  const monday = parseISODate(weekKey);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startMonth = MONTH_NAMES[monday.getMonth()];
  const startDay = String(monday.getDate()).padStart(2, '0');
  const startYear = monday.getFullYear();

  const endMonth = MONTH_NAMES[sunday.getMonth()];
  const endDay = String(sunday.getDate()).padStart(2, '0');
  const endYear = sunday.getFullYear();

  if (startYear !== endYear) {
    return `${startMonth} ${startDay}, ${startYear} — ${endMonth} ${endDay}, ${endYear}`;
  }

  if (startMonth !== endMonth) {
    return `${startMonth} ${startDay} — ${endMonth} ${endDay}`;
  }

  return `${startMonth} ${startDay} — ${endMonth} ${endDay}`;
}

/**
 * Format a single transaction date for the log: e.g. "OCT 12"
 */
export function formatDisplayDate(dateInput) {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseISODate(dateInput) : dateInput;
  const month = MONTH_NAMES[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  return `${month} ${day}`;
}

/**
 * Return start and end ISO dates for input constraints (min/max).
 */
export function getWeekBounds(weekKey) {
  const monday = parseISODate(weekKey);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: formatISODate(monday),
    end: formatISODate(sunday)
  };
}
