import { describe, it, expect } from 'vitest';
import { calculateWeeklyTotals } from '../src/utils/calculations.js';
import { formatINR, formatSignedINR, sanitizeAmount } from '../src/utils/currency.js';
import {
  getMonday,
  getSunday,
  getWeekKey,
  getPrevWeekKey,
  getNextWeekKey,
  formatWeekRange,
  parseISODate,
  formatISODate
} from '../src/utils/date.js';

describe('Budget Calculations', () => {
  it('calculates totals with empty transactions', () => {
    const result = calculateWeeklyTotals(5000, []);
    expect(result.budget).toBe(5000);
    expect(result.spent).toBe(0);
    expect(result.saved).toBe(0);
    expect(result.remaining).toBe(5000);
    expect(result.isOverBudget).toBe(false);
    expect(result.percentUsed).toBe(0);
    expect(result.message).toBe('YOUR MONEY IS SAFE. KEEP GOING!');
  });

  it('reduces remaining budget by spent expense amount', () => {
    const transactions = [
      { id: '1', type: 'spent', amount: 250, description: 'Snack' }
    ];
    const result = calculateWeeklyTotals(1000, transactions);
    expect(result.spent).toBe(250);
    expect(result.remaining).toBe(750);
    expect(result.percentUsed).toBe(25);
    expect(result.isOverBudget).toBe(false);
  });

  it('increases saved total without inflating remaining budget or counting twice', () => {
    const transactions = [
      { id: '1', type: 'spent', amount: 250, description: 'Lunch' },
      { id: '2', type: 'saved', amount: 100, description: 'Saved from transport' }
    ];
    const result = calculateWeeklyTotals(1000, transactions);
    // Budget: 1000, Spent: 250 -> Remaining: 750 (NOT 850!)
    expect(result.spent).toBe(250);
    expect(result.saved).toBe(100);
    expect(result.remaining).toBe(750);
    expect(result.messageType).toBe('saved');
    expect(result.message).toBe('NICE SAVE! YOUR PIGGY IS GROWING.');
  });

  it('detects overspending correctly', () => {
    const transactions = [
      { id: '1', type: 'spent', amount: 1200, description: 'Gadget' }
    ];
    const result = calculateWeeklyTotals(1000, transactions);
    expect(result.spent).toBe(1200);
    expect(result.remaining).toBe(-200);
    expect(result.isOverBudget).toBe(true);
    expect(result.messageType).toBe('warning');
    expect(result.message).toBe('WARNING: BUDGET EXCEEDED!');
  });

  it('warns when >= 80% budget consumed', () => {
    const transactions = [
      { id: '1', type: 'spent', amount: 850, description: 'Groceries' }
    ];
    const result = calculateWeeklyTotals(1000, transactions);
    expect(result.percentUsed).toBe(85);
    expect(result.isOverBudget).toBe(false);
    expect(result.messageType).toBe('caution');
    expect(result.message).toBe('CAUTION: OVER 80% OF BUDGET USED!');
  });
});

describe('Currency Formatting', () => {
  it('formats positive INR amounts cleanly', () => {
    const str = formatINR(5000);
    expect(str).toContain('5,000');
    expect(str).toContain('₹');
  });

  it('formats signed transaction amounts', () => {
    const expense = formatSignedINR(250, 'spent');
    expect(expense).toContain('−');
    expect(expense).toContain('250');

    const saving = formatSignedINR(100, 'saved');
    expect(saving).toContain('+');
    expect(saving).toContain('100');
  });

  it('sanitizes amount correctly', () => {
    expect(sanitizeAmount('500.50')).toBe(500.5);
    expect(sanitizeAmount('-50')).toBe(0);
    expect(sanitizeAmount('abc')).toBe(0);
  });
});

describe('Date & Week Calculations', () => {
  it('finds Monday and Sunday for a Wednesday', () => {
    // 2026-10-14 is a Wednesday
    const wednesday = parseISODate('2026-10-14');
    const monday = getMonday(wednesday);
    const sunday = getSunday(wednesday);

    expect(formatISODate(monday)).toBe('2026-10-12');
    expect(formatISODate(sunday)).toBe('2026-10-18');
  });

  it('computes weekKey and transitions correctly', () => {
    const weekKey = '2026-10-12';
    expect(getPrevWeekKey(weekKey)).toBe('2026-10-05');
    expect(getNextWeekKey(weekKey)).toBe('2026-10-19');
  });

  it('formats date range within same month', () => {
    const range = formatWeekRange('2026-10-12');
    expect(range).toBe('OCT 12 — OCT 18');
  });

  it('formats date range crossing months', () => {
    const range = formatWeekRange('2026-10-26');
    expect(range).toBe('OCT 26 — NOV 01');
  });

  it('formats date range crossing years', () => {
    const range = formatWeekRange('2026-12-28');
    expect(range).toBe('DEC 28, 2026 — JAN 03, 2027');
  });
});
