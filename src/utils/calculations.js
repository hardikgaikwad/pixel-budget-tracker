/**
 * Budget and transaction calculation model.
 *
 * Rules:
 * - Spent = sum of expense transactions (type === 'spent')
 * - Saved = sum of saving transactions (type === 'saved')
 * - Remaining = budget - spent
 * - Available to spend = budget - spent
 * - Savings are tracked separately and DO NOT inflate remaining budget.
 */

export function calculateWeeklyTotals(budget = 0, transactions = []) {
  const numBudget = Math.max(0, Number(budget) || 0);

  let totalSpent = 0;
  let totalSaved = 0;

  for (const tx of transactions) {
    const amt = Number(tx.amount) || 0;
    if (amt <= 0) continue;

    if (tx.type === 'spent') {
      totalSpent += amt;
    } else if (tx.type === 'saved') {
      totalSaved += amt;
    }
  }

  const remaining = numBudget - totalSpent;
  const isOverBudget = numBudget > 0 ? totalSpent > numBudget : totalSpent > 0;

  let percentUsed = 0;
  if (numBudget > 0) {
    percentUsed = Math.min(999, Math.round((totalSpent / numBudget) * 100));
  } else if (totalSpent > 0) {
    percentUsed = 100;
  }

  // Derive contextual message reflecting actual state
  let message = 'YOUR MONEY IS SAFE. KEEP GOING!';
  let messageType = 'safe'; // 'safe' | 'caution' | 'warning' | 'saved'

  if (isOverBudget) {
    message = 'WARNING: BUDGET EXCEEDED!';
    messageType = 'warning';
  } else if (numBudget > 0 && (totalSpent / numBudget) >= 0.8) {
    message = 'CAUTION: OVER 80% OF BUDGET USED!';
    messageType = 'caution';
  } else if (totalSaved > 0 && totalSpent <= numBudget * 0.5) {
    message = 'NICE SAVE! YOUR PIGGY IS GROWING.';
    messageType = 'saved';
  }

  return {
    budget: numBudget,
    spent: totalSpent,
    saved: totalSaved,
    remaining,
    isOverBudget,
    percentUsed,
    message,
    messageType
  };
}

/**
 * Filter transactions for a given week.
 */
export function filterTransactionsByWeek(transactions = [], weekKey) {
  return transactions.filter(tx => tx.weekKey === weekKey);
}
