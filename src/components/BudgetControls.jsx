import React, { useState, useEffect } from 'react';
import { formatWeekRange } from '../utils/date';
import { sanitizeAmount, formatINR } from '../utils/currency';

/**
 * Budget Controls Component.
 * Enables setting/updating weekly spending cap with validation and presets.
 */
export default function BudgetControls({
  weekKey,
  currentBudget = 0,
  onSaveBudget
}) {
  const [budgetInput, setBudgetInput] = useState('');
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  // Synchronize when week or external budget changes
  useEffect(() => {
    setBudgetInput(currentBudget > 0 ? String(currentBudget) : '');
    setError('');
  }, [weekKey, currentBudget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const sanitized = sanitizeAmount(budgetInput);

    if (budgetInput.trim() === '') {
      setError('PLEASE ENTER A BUDGET AMOUNT');
      return;
    }

    if (sanitized <= 0) {
      setError('BUDGET MUST BE GREATER THAN ₹0');
      return;
    }

    onSaveBudget(weekKey, sanitized);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 2000);
  };

  const handlePreset = (amount) => {
    setBudgetInput(String(amount));
    setError('');
    onSaveBudget(weekKey, amount);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 2000);
  };

  const weekLabel = formatWeekRange(weekKey);
  const isBudgetSet = currentBudget > 0;

  return (
    <section className="w-full bg-[#0a0a0a] border border-[#2b2b2b] p-4 md:p-5 pixel-shadow-black">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-4 pb-2 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow inline-block" />
          <h2 className="font-arcade text-xs md:text-sm text-yellow tracking-wider font-bold">
            WEEKLY BUDGET CONTROLS
          </h2>
        </div>
        <div className="text-[11px] font-mono text-text-muted">
          EDITING WEEK: <span className="text-yellow-light font-bold">{weekLabel}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Input with ₹ prefix */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-arcade text-sm text-yellow pointer-events-none select-none">
            ₹
          </span>
          <input
            id="weekly-budget-input"
            type="number"
            min="1"
            step="1"
            value={budgetInput}
            onChange={(e) => {
              setBudgetInput(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. 5000"
            className="pixel-input pl-8 font-arcade text-sm"
            aria-label="Weekly budget amount in INR"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="pixel-btn-primary pixel-shadow-button py-2.5 px-6 shrink-0"
        >
          {isBudgetSet ? 'UPDATE BUDGET' : 'SET BUDGET'}
        </button>
      </form>

      {/* Preset Quick Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-arcade text-text-muted mr-1 shrink-0">
          QUICK PRESETS:
        </span>
        {[2500, 5000, 8000, 10000, 15000, 20000].map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => handlePreset(amt)}
            className={`px-2.5 py-1 text-[11px] font-arcade border transition-colors ${
              currentBudget === amt
                ? 'bg-yellow text-black border-yellow font-bold'
                : 'bg-black text-text-muted border-[#333333] hover:border-yellow hover:text-yellow'
            }`}
          >
            {formatINR(amt)}
          </button>
        ))}
      </div>

      {/* Inline Feedback Messages */}
      {error && (
        <div className="mt-3 text-xs font-arcade text-expense flex items-center gap-1.5 animate-stat-pulse">
          <span>✖</span>
          <span>{error}</span>
        </div>
      )}

      {successNotice && (
        <div className="mt-3 text-xs font-arcade text-yellow flex items-center gap-1.5 animate-stat-pulse">
          <span>✔</span>
          <span>BUDGET UPDATED FOR {weekLabel}!</span>
        </div>
      )}
    </section>
  );
}
