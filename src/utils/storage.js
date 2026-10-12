/**
 * LocalStorage state persistence with safe fallbacks and corrupted data recovery.
 */

import { getWeekKey, formatISODate } from './date.js';

const STORAGE_KEY = 'pixel_budget_tracker_v1';

export const INITIAL_STATE = {
  budgets: {},      // { [weekKey]: number }
  transactions: [], // Array of { id, weekKey, type, amount, description, category, date, createdAt }
  soundEnabled: true
};

/**
 * Load state from localStorage with robust error handling.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);

    // Validate structure
    const budgets = (parsed && typeof parsed.budgets === 'object' && parsed.budgets !== null)
      ? parsed.budgets
      : {};

    const transactions = (parsed && Array.isArray(parsed.transactions))
      ? parsed.transactions.filter(isValidTransaction)
      : [];

    const soundEnabled = typeof parsed.soundEnabled === 'boolean'
      ? parsed.soundEnabled
      : true;

    return {
      budgets,
      transactions,
      soundEnabled
    };
  } catch (err) {
    console.warn('[PixelBudget] Corrupted storage data detected. Falling back to defaults.', err);
    return null;
  }
}

/**
 * Save state to localStorage.
 */
export function saveState(state) {
  try {
    const serialized = JSON.stringify({
      budgets: state.budgets || {},
      transactions: state.transactions || [],
      soundEnabled: state.soundEnabled !== false,
      lastUpdated: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error('[PixelBudget] Failed to save state to localStorage:', err);
    return false;
  }
}

/**
 * Clear all data from localStorage.
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('[PixelBudget] Failed to clear storage:', err);
    return false;
  }
}

/**
 * Validate a transaction object.
 */
function isValidTransaction(tx) {
  return (
    tx &&
    typeof tx === 'object' &&
    typeof tx.id === 'string' &&
    (tx.type === 'spent' || tx.type === 'saved') &&
    typeof tx.amount === 'number' &&
    tx.amount > 0 &&
    typeof tx.description === 'string' &&
    typeof tx.date === 'string'
  );
}

/**
 * Generate rich sample demo data for immediate testing.
 */
export function getSampleData() {
  const currentWeek = getWeekKey(new Date());
  const today = formatISODate(new Date());

  const sampleTransactions = [
    {
      id: 'tx_sample_1',
      weekKey: currentWeek,
      type: 'spent',
      amount: 420,
      description: 'Pixel Ramen Bowl',
      category: 'Food',
      date: today,
      createdAt: Date.now() - 3600000 * 5
    },
    {
      id: 'tx_sample_2',
      weekKey: currentWeek,
      type: 'saved',
      amount: 500,
      description: 'Skipped Cab (Bicycled)',
      category: 'Transport savings',
      date: today,
      createdAt: Date.now() - 3600000 * 4
    },
    {
      id: 'tx_sample_3',
      weekKey: currentWeek,
      type: 'spent',
      amount: 250,
      description: 'Metro Smart Card Recharge',
      category: 'Transport',
      date: today,
      createdAt: Date.now() - 3600000 * 3
    },
    {
      id: 'tx_sample_4',
      weekKey: currentWeek,
      type: 'saved',
      amount: 1000,
      description: 'Unspent Weekly Allowance',
      category: 'Unspent allowance',
      date: today,
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'tx_sample_5',
      weekKey: currentWeek,
      type: 'spent',
      amount: 1450,
      description: 'Web Dev Mastery Book',
      category: 'Education',
      date: today,
      createdAt: Date.now() - 3600000
    }
  ];

  return {
    budgets: {
      [currentWeek]: 8000
    },
    transactions: sampleTransactions,
    soundEnabled: true
  };
}
