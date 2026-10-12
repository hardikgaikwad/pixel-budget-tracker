import React, { useState, useEffect } from 'react';
import PiggyBank from './PiggyBank';
import PixelProgressBar from './PixelProgressBar';
import { formatINR, sanitizeAmount } from '../utils/currency';
import { formatWeekRange } from '../utils/date';
import { Edit2, Check, X } from 'lucide-react';

/**
 * Simplified, Unified Visual Centerpiece:
 * Features Piggy Bank hero, primary Remaining balance, sleek progress bar,
 * 3-stat breakdown, and an easy inline budget editor (no clunky separate section needed).
 */
export default function BudgetOverview({
  totals,
  weekKey,
  onSaveBudget,
  isDroppingCoin = false,
  lastSavedAmount = 0,
  onPiggyClick
}) {
  const {
    budget,
    spent,
    saved,
    remaining,
    isOverBudget,
    percentUsed,
    message,
    messageType
  } = totals;

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetVal, setBudgetVal] = useState(String(budget || ''));
  const [editError, setEditError] = useState('');

  useEffect(() => {
    setBudgetVal(budget > 0 ? String(budget) : '');
  }, [budget]);

  const handleSaveBudgetSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = sanitizeAmount(budgetVal);
    if (clean <= 0) {
      setEditError('Enter amount > 0');
      return;
    }
    onSaveBudget(weekKey, clean);
    setIsEditingBudget(false);
    setEditError('');
  };

  const handleQuickBudget = (amt) => {
    setBudgetVal(String(amt));
    onSaveBudget(weekKey, amt);
    setIsEditingBudget(false);
    setEditError('');
  };

  // Status message colors
  const msgColor = isOverBudget
    ? 'text-expense border-expense bg-expense-bg'
    : percentUsed >= 80
    ? 'text-yellow-light border-yellow-light/60 bg-dark-900'
    : 'text-yellow border-yellow/60 bg-dark-900';

  return (
    <section className="w-full bg-[#0a0a0a] border border-[#262626] p-5 md:p-6 pixel-shadow-black">
      
      {/* Friendly Speech Bubble / Status Message */}
      <div className={`p-2.5 mb-5 border text-center font-arcade text-xs md:text-sm font-bold tracking-wide transition-colors ${msgColor}`}>
        {message}
      </div>

      {/* Main Hero: Center Piggy + Hero Remaining Balance */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
        
        {/* Left: Interactive Pixel Piggy */}
        <div className="flex flex-col items-center">
          <PiggyBank
            isOverBudget={isOverBudget}
            isDroppingCoin={isDroppingCoin}
            lastSavedAmount={lastSavedAmount}
            percentUsed={percentUsed}
            onClick={onPiggyClick}
          />
        </div>

        {/* Right: Big Hero Number (Remaining) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[240px]">
          <span className="font-arcade text-xs text-text-muted uppercase tracking-wider">
            {isOverBudget ? 'BUDGET DEFICIT' : 'REMAINING THIS WEEK'}
          </span>
          <div
            className={`font-arcade text-3xl md:text-4xl font-bold mt-1 tracking-tight ${
              isOverBudget ? 'text-expense' : 'text-yellow'
            }`}
          >
            {isOverBudget ? `−${formatINR(Math.abs(remaining))}` : formatINR(remaining)}
          </div>
          <span className="font-mono text-xs text-text-dim mt-1">
            {isOverBudget
              ? 'Warning: You spent more than your budget'
              : `${formatINR(spent)} spent out of ${formatINR(budget)}`}
          </span>

          {/* Simple Clean Progress Bar */}
          <div className="w-full mt-3 max-w-xs">
            <PixelProgressBar
              percentUsed={percentUsed}
              isOverBudget={isOverBudget}
            />
          </div>
        </div>

      </div>

      {/* Inline Budget Editor Form (Expanded when editing) */}
      {isEditingBudget ? (
        <div className="mt-5 pt-4 border-t border-[#262626] bg-[#111111] p-4 border border-yellow">
          <div className="flex items-center justify-between mb-2">
            <span className="font-arcade text-xs text-yellow font-bold">
              SET WEEKLY BUDGET FOR {formatWeekRange(weekKey)}:
            </span>
            <button
              onClick={() => {
                setIsEditingBudget(false);
                setBudgetVal(String(budget || ''));
                setEditError('');
              }}
              className="text-text-muted hover:text-white p-1"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSaveBudgetSubmit} className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[140px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-arcade text-sm text-yellow pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                min="1"
                value={budgetVal}
                onChange={(e) => {
                  setBudgetVal(e.target.value);
                  if (editError) setEditError('');
                }}
                placeholder="5000"
                className="pixel-input pl-8 font-arcade text-sm py-1.5"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="pixel-btn-primary py-1.5 px-4 text-xs font-arcade"
            >
              <Check size={13} />
              <span>SAVE</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingBudget(false)}
              className="pixel-btn-secondary py-1.5 px-3 text-xs font-arcade"
            >
              CANCEL
            </button>
          </form>

          {/* Quick presets */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-arcade text-text-dim mr-1">QUICK:</span>
            {[2500, 5000, 8000, 10000, 15000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickBudget(amt)}
                className="px-2 py-0.5 text-[10px] font-arcade bg-black border border-[#333] text-text-muted hover:border-yellow hover:text-yellow transition-colors"
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>

          {editError && (
            <span className="block mt-2 font-arcade text-xs text-expense">
              ✖ {editError}
            </span>
          )}
        </div>
      ) : null}

      {/* 3 Summary Stats (Budget with Edit button, Spent, Saved) */}
      <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#202020]">
        
        {/* 1. Weekly Budget */}
        <div className="bg-black border border-[#222222] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-arcade text-[10px] text-text-muted uppercase">
              BUDGET
            </span>
            {!isEditingBudget && (
              <button
                onClick={() => setIsEditingBudget(true)}
                className="text-text-dim hover:text-yellow flex items-center gap-1 text-[10px] font-arcade transition-colors"
                title="Change Weekly Budget"
              >
                <Edit2 size={10} />
                <span>EDIT</span>
              </button>
            )}
          </div>
          <div className="font-arcade text-base sm:text-lg font-bold text-text-main mt-1 truncate">
            {formatINR(budget)}
          </div>
        </div>

        {/* 2. Total Spent */}
        <div className="bg-black border border-[#222222] p-3 flex flex-col justify-between">
          <span className="font-arcade text-[10px] text-text-muted uppercase">
            SPENT
          </span>
          <div
            className={`font-arcade text-base sm:text-lg font-bold mt-1 truncate ${
              spent > 0 ? 'text-expense' : 'text-text-main'
            }`}
          >
            {spent > 0 ? `−${formatINR(spent)}` : formatINR(0)}
          </div>
        </div>

        {/* 3. Total Saved */}
        <div className="bg-black border border-[#222222] p-3 flex flex-col justify-between">
          <span className="font-arcade text-[10px] text-text-muted uppercase flex items-center justify-between">
            <span>SAVED</span>
            <span className="text-yellow text-[11px]">★</span>
          </span>
          <div
            className={`font-arcade text-base sm:text-lg font-bold mt-1 truncate ${
              saved > 0 ? 'text-yellow' : 'text-text-main'
            }`}
          >
            {saved > 0 ? `+${formatINR(saved)}` : formatINR(0)}
          </div>
        </div>

      </div>

    </section>
  );
}
