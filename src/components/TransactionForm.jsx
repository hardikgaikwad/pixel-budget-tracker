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
 * Simplified, Clean Transaction Form:
 * Easy-to-use toggle for Expense vs Saving, clear inputs, zero clutter.
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

  useEffect(() => {
    const todayISO = formatISODate(new Date());
    const bounds = getWeekBounds(selectedWeekKey);
    if (todayISO >= bounds.start && todayISO <= bounds.end) {
      setDate(todayISO);
    } else {
      setDate(bounds.start);
    }
  }, [selectedWeekKey]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'spent' ? EXPENSE_CATEGORIES[0] : SAVING_CATEGORIES[0]);
    setErrors((prev) => ({ ...prev, amount: null, description: null }));
  };

  const validate = () => {
    const newErrors = {};
    const numAmount = sanitizeAmount(amount);

    if (!amount || amount.trim() === '') {
      newErrors.amount = 'Enter an amount';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Must be > ₹0';
    }

    if (!description || description.trim() === '') {
      newErrors.description = 'Enter description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const numAmount = sanitizeAmount(amount);
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
    setAmount('');
    setDescription('');
    setErrors({});
  };

  const currentCategories = type === 'spent' ? EXPENSE_CATEGORIES : SAVING_CATEGORIES;
  const isExpense = type === 'spent';

  return (
    <section className="w-full bg-[#0a0a0a] border border-[#262626] p-4 md:p-5 pixel-shadow-black">
      
      {/* Title & Quick Type Toggle */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#202020]">
        <h2 className="font-arcade text-xs md:text-sm text-yellow tracking-wider font-bold">
          + ADD TRANSACTION
        </h2>
        
        {/* Simple Type Toggle */}
        <div className="flex items-center gap-1 bg-black p-0.5 border border-[#333]">
          <button
            type="button"
            onClick={() => handleTypeChange('spent')}
            className={`px-3 py-1 text-xs font-arcade transition-all ${
              isExpense
                ? 'bg-expense text-black font-bold'
                : 'text-text-muted hover:text-white'
            }`}
          >
            − SPENT
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('saved')}
            className={`px-3 py-1 text-xs font-arcade transition-all ${
              !isExpense
                ? 'bg-yellow text-black font-bold'
                : 'text-text-muted hover:text-white'
            }`}
          >
            + SAVED
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        
        {/* 1. Amount */}
        <div>
          <label htmlFor="tx-amount" className="block font-arcade text-[10px] text-text-muted mb-1">
            AMOUNT (INR ₹)
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
              className={`pixel-input pl-8 text-sm font-arcade py-2 ${
                errors.amount ? 'border-expense text-expense' : ''
              }`}
            />
          </div>
          {errors.amount && (
            <span className="block mt-1 font-arcade text-[10px] text-expense">
              ✖ {errors.amount}
            </span>
          )}
        </div>

        {/* 2. Description */}
        <div>
          <label htmlFor="tx-desc" className="block font-arcade text-[10px] text-text-muted mb-1">
            DESCRIPTION
          </label>
          <input
            id="tx-desc"
            type="text"
            value={description}
            maxLength={50}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
            }}
            placeholder={isExpense ? 'e.g. Lunch, Groceries, Movie' : 'e.g. Skipped Cab, Weekly Savings'}
            className={`pixel-input text-xs py-2 ${errors.description ? 'border-expense text-expense' : ''}`}
          />
          {errors.description && (
            <span className="block mt-1 font-arcade text-[10px] text-expense">
              ✖ {errors.description}
            </span>
          )}
        </div>

        {/* 3. Category & Date (2 clean columns) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Category */}
          <div>
            <label htmlFor="tx-cat" className="block font-arcade text-[10px] text-text-muted mb-1">
              CATEGORY
            </label>
            <select
              id="tx-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pixel-select text-xs py-2"
            >
              {currentCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="tx-date" className="block font-arcade text-[10px] text-text-muted mb-1">
              DATE
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pixel-input text-xs py-2 font-mono"
            />
          </div>
        </div>

        {/* 4. Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-2.5 px-4 font-arcade text-xs font-bold transition-all border ${
              isExpense
                ? 'bg-expense text-black border-expense hover:bg-red-400 pixel-shadow-button'
                : 'bg-yellow text-black border-yellow hover:bg-yellow-light pixel-shadow-button'
            }`}
          >
            {isExpense ? '− LOG EXPENSE' : '+ DEPOSIT SAVING'}
          </button>
        </div>

      </form>

    </section>
  );
}
