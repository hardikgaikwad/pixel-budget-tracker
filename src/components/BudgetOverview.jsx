import React from 'react';
import PiggyBank from './PiggyBank';
import PixelProgressBar from './PixelProgressBar';
import { formatINR } from '../utils/currency';

/**
 * Visual Centerpiece of the Application:
 * Shows Piggy Bank, Core Financial Metrics, Contextual Terminal Message, and Pixel Progress Bar.
 */
export default function BudgetOverview({
  totals,
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

  // Derive style for context message banner
  let bannerBorder = 'border-yellow';
  let bannerTextColor = 'text-yellow';
  let bannerBg = 'bg-[#0c0c0c]';

  if (messageType === 'warning') {
    bannerBorder = 'border-expense';
    bannerTextColor = 'text-expense';
    bannerBg = 'bg-expense-bg';
  } else if (messageType === 'caution') {
    bannerBorder = 'border-yellow-light';
    bannerTextColor = 'text-yellow-light';
  } else if (messageType === 'saved') {
    bannerBorder = 'border-yellow';
    bannerTextColor = 'text-yellow';
  }

  return (
    <section className="w-full bg-[#0a0a0a] border-2 border-yellow p-4 md:p-6 pixel-shadow-black">
      
      {/* Top Banner: Context Message Terminal */}
      <div
        className={`w-full p-2.5 mb-5 border ${bannerBorder} ${bannerBg} flex items-center justify-between gap-2`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-pixel text-[11px] text-yellow shrink-0">&gt;</span>
          <span className={`font-arcade text-xs md:text-sm font-bold tracking-wider truncate ${bannerTextColor}`}>
            {message}
          </span>
        </div>
        <span className="font-arcade text-[10px] text-text-muted uppercase tracking-wider shrink-0 hidden sm:inline">
          [SYSTEM OK]
        </span>
      </div>

      {/* Main Grid: Piggy Bank Hero (Left) + 4-Metric Grid & Bar (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left Column: Piggy Bank Hero */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-black border border-[#262626]">
          <div className="text-[10px] font-arcade text-text-dim uppercase tracking-widest mb-1 self-start px-1">
            DIGITAL_VAULT//
          </div>
          <PiggyBank
            isOverBudget={isOverBudget}
            isDroppingCoin={isDroppingCoin}
            lastSavedAmount={lastSavedAmount}
            percentUsed={percentUsed}
            onClick={onPiggyClick}
          />
        </div>

        {/* Right Column: 4 Stat Panels + Progress Bar */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            
            {/* 1. Weekly Budget */}
            <div className="bg-black border border-[#262626] p-3 flex flex-col justify-between">
              <span className="font-arcade text-[10px] text-text-muted uppercase tracking-wider">
                WEEKLY BUDGET
              </span>
              <div className="font-arcade text-base sm:text-lg font-bold text-text-main mt-1 truncate">
                {formatINR(budget)}
              </div>
              <span className="font-mono text-[10px] text-text-dim mt-1">
                Target Cap
              </span>
            </div>

            {/* 2. Total Spent */}
            <div className="bg-black border border-[#262626] p-3 flex flex-col justify-between">
              <span className="font-arcade text-[10px] text-text-muted uppercase tracking-wider">
                TOTAL SPENT
              </span>
              <div
                className={`font-arcade text-base sm:text-lg font-bold mt-1 truncate ${
                  spent > 0 ? 'text-expense' : 'text-text-main'
                }`}
              >
                {spent > 0 ? `−${formatINR(spent)}` : formatINR(0)}
              </div>
              <span className="font-mono text-[10px] text-text-dim mt-1">
                {budget > 0 ? `${percentUsed}% used` : 'No budget set'}
              </span>
            </div>

            {/* 3. Total Saved */}
            <div className="bg-black border border-[#262626] p-3 flex flex-col justify-between">
              <span className="font-arcade text-[10px] text-text-muted uppercase tracking-wider flex items-center justify-between">
                <span>TOTAL SAVED</span>
                <span className="text-yellow text-xs">★</span>
              </span>
              <div
                className={`font-arcade text-base sm:text-lg font-bold mt-1 truncate ${
                  saved > 0 ? 'text-yellow' : 'text-text-main'
                }`}
              >
                {saved > 0 ? `+${formatINR(saved)}` : formatINR(0)}
              </div>
              <span className="font-mono text-[10px] text-text-dim mt-1">
                Preserved
              </span>
            </div>

            {/* 4. Remaining Budget */}
            <div
              className={`p-3 flex flex-col justify-between bg-black border ${
                isOverBudget ? 'border-expense' : 'border-yellow'
              }`}
            >
              <span className="font-arcade text-[10px] text-text-muted uppercase tracking-wider">
                {isOverBudget ? 'DEFICIT' : 'REMAINING'}
              </span>
              <div
                className={`font-arcade text-base sm:text-lg font-bold mt-1 truncate ${
                  isOverBudget ? 'text-expense font-bold' : 'text-yellow'
                }`}
              >
                {isOverBudget ? `−${formatINR(Math.abs(remaining))}` : formatINR(remaining)}
              </div>
              <span
                className={`font-mono text-[10px] mt-1 ${
                  isOverBudget ? 'text-expense font-bold' : 'text-text-dim'
                }`}
              >
                {isOverBudget ? 'EXCEEDED!' : 'Available to spend'}
              </span>
            </div>

          </div>

          {/* Pixel Progress Bar */}
          <div className="bg-black border border-[#262626] p-3">
            <PixelProgressBar
              percentUsed={percentUsed}
              isOverBudget={isOverBudget}
            />
          </div>

        </div>

      </div>

    </section>
  );
}
