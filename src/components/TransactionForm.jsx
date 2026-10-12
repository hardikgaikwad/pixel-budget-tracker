import React, { useState, useEffect } from 'react';
import { formatISODate, getWeekBounds, parseISODate, getWeekKey } from '../utils/date';
import { sanitizeAmount } from '../utils/currency';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Bills',
  'Other'
];

const SAVING_CATEGORIES = [
  'Unspent allowance',
  'Food savings',
  'Transport savings',
  'Other'
];

/**
 * Add Transaction Panel Component.
 * Supports SPENT and SAVED entries with inline validation and square toggle buttons.
 */
export default function TransactionForm({
  selectedWeekKey,
  onAddTransaction
}) {
  const [type, setType] = useState('spent'); // 'spent' | 'saved'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});

  // Ensure default date falls logically within selected week
  useEffect(() => {
    const todayISO = formatISODate(new Date());
    const bounds = getWeekBounds(selectedWeekKey);

    // If today is within this week, default to today; otherwise default to Monday of the week
    if (todayISO >= bounds.start && todayISO <= bounds.end) {
      setDate(todayISO);
    } else {
      setDate(bounds.start);
    }
  }, [selectedWeekKey]);

  // When type changes, default to first category of that type
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'spent' ? EXPENSE_CATEGORIES[0] : SAVING_CATEGORIES[0]);
    setErrors((prev) => ({ ...prev, type: null }));
  };

  const validate = () => {
    const newErrors = {};

    const numAmount = sanitizeAmount(amount);
    if (!amount || amount.trim() === '') {
      newErrors.amount = 'AMOUNT IS REQUIRED';
    } else if (numAmount <= 0) {
      newErrors.amount = 'AMOUNT MUST BE GREATER THAN ₹0';
    }

    if (!description || description.trim() === '') {
      newErrors.description = 'DESCRIPTION IS REQUIRED';
    } else if (description.trim().length < 2) {
      newErrors.description = 'DESCRIPTION TOO SHORT';
    }

    if (!category) {
      newErrors.category = 'SELECT A CATEGORY';
    }

    if (!date) {
      newErrors.date = 'DATE IS REQUIRED';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const numAmount = sanitizeAmount(amount);
    // Assign to selected week or derived from the transaction date
    const txWeekKey = getWeekKey(parseISODate(date));

    const newTx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      weekKey: txWeekKey,
      type,
      amount: numAmount,
      description: description.trim(),
      category,
      date,
      createdAt: Date.now()
    };

    onAddTransaction(newTx);

    // Clear form fields
    setAmount('');
    setDescription('');
    setErrors({});
  };

  const currentCategories = type === 'spent' ? EXPENSE_CATEGORIES : SAVING_CATEGORIES;
  const bounds = getWeekBounds(selectedWeekKey);

  return (
    <section className="w-full bg-dark-900 border border-border-medium p-4 md:p-5 pixel-shadow-black">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow inline-block" />
          <h2 className="font-arcade text-xs md:text-sm text-yellow tracking-wider font-bold uppercase">
            LOG TRANSACTION
          </h2>
        </div>
        <span className="font-arcade text-[10px] text-text-dim">
          ENTRY_PANEL//01
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        
        {/* 1. Transaction Type Toggle */}
        <div>
          <label className="block font-arcade text-[11px] text-text-muted mb-1.5 uppercase">
            TRANSACTION TYPE *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('spent')}
              className={`py-2 px-3 text-xs font-arcade font-bold flex items-center justify-center gap-2 transition-all border ${
                type === 'spent'
                  ? 'bg-expense text-black border-expense pixel-shadow-black'
                  : 'bg-black text-text-muted border-border-medium hover:border-expense hover:text-expense'
              }`}
            >
              <span>− SPENT (EXPENSE)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('saved')}
              className={`py-2 px-3 text-xs font-arcade font-bold flex items-center justify-center gap-2 transition-all border ${
                type === 'saved'
                  ? 'bg-yellow text-black border-yellow pixel-shadow-black'
                  : 'bg-black text-text-muted border-border-medium hover:border-yellow hover:text-yellow'
              }`}
            >
              <span>+ SAVED (DEPOSIT)</span>
            </button>
          </div>
        </div>

        {/* 2. Amount and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Amount */}
          <div>
            <label htmlFor="tx-amount" className="block font-arcade text-[11px] text-text-muted mb-1 uppercase">
              AMOUNT (INR ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-arcade text-sm text-yellow pointer-events-none">
                ₹
              </span>
              <input
                id="tx-amount"
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                }}
                placeholder="250"
                className={`pixel-input pl-8 font-arcade text-sm ${
                  errors.amount ? 'border-expense text-expense' : ''
                }`}
                aria-required="true"
              />
            </div>
            {errors.amount && (
              <span className="block mt-1 font-arcade text-[10px] text-expense animate-stat-pulse">
                ✖ {errors.amount}
              </span>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="tx-date" className="block font-arcade text-[11px] text-text-muted mb-1 uppercase">
              TRANSACTION DATE *
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              min={bounds.start}
              max={bounds.end}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
              }}
              className={`pixel-input font-mono text-xs ${
                errors.date ? 'border-expense' : ''
              }`}
              aria-required="true"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-text-dim">
              <span>Week span: {bounds.start} to {bounds.end}</span>
            </div>
            {errors.date && (
              <span className="block mt-1 font-arcade text-[10px] text-expense">
                ✖ {errors.date}
              </span>
            )}
          </div>

        </div>

        {/* 3. Description */}
        <div>
          <label htmlFor="tx-desc" className="block font-arcade text-[11px] text-text-muted mb-1 uppercase">
            DESCRIPTION *
          </label>
          <input
            id="tx-desc"
            type="text"
            value={description}
            maxLength={60}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
            }}
            placeholder={type === 'spent' ? 'e.g. Pixel Ramen Dinner' : 'e.g. Skipped Cab / Bicycled'}
            className={`pixel-input ${errors.description ? 'border-expense text-expense' : ''}`}
            aria-required="true"
          />
          {errors.description && (
            <span className="block mt-1 font-arcade text-[10px] text-expense">
              ✖ {errors.description}
            </span>
          )}
        </div>

        {/* 4. Category Selector */}
        <div>
          <label htmlFor="tx-category" className="block font-arcade text-[11px] text-text-muted mb-1 uppercase">
            CATEGORY *
          </label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pixel-select"
            aria-required="true"
          >
            {currentCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-2.5 px-4 font-arcade text-xs font-bold transition-all border ${
              type === 'spent'
                ? 'bg-expense text-black border-expense hover:bg-red-400 pixel-shadow-button'
                : 'bg-yellow text-black border-yellow hover:bg-yellow-light pixel-shadow-button'
            }`}
          >
            {type === 'spent' ? '+ LOG SPENT EXPENSE' : '+ DEPOSIT SAVINGS'}
          </button>
        </div>

      </form>
    </section>
  );
}
