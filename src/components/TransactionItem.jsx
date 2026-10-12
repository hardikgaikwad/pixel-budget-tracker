import React, { useState } from 'react';
import CashRegisterIcon from './CashRegisterIcon';
import CoinIcon from './CoinIcon';
import { formatSignedINR, sanitizeAmount } from '../utils/currency';
import { formatDisplayDate } from '../utils/date';
import { Edit2, Trash2, Check, X } from 'lucide-react';

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

export default function TransactionItem({
  tx,
  isRecentlyAdded = false,
  onUpdate,
  onRequestDelete
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(tx.description);
  const [editAmount, setEditAmount] = useState(String(tx.amount));
  const [editCategory, setEditCategory] = useState(tx.category);
  const [editDate, setEditDate] = useState(tx.date);

  const isExpense = tx.type === 'spent';
  const categories = isExpense ? EXPENSE_CATEGORIES : SAVING_CATEGORIES;

  const handleSaveEdit = () => {
    const num = sanitizeAmount(editAmount);
    if (!editDesc.trim() || num <= 0) return;

    onUpdate({
      ...tx,
      description: editDesc.trim(),
      amount: num,
      category: editCategory,
      date: editDate
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-2.5 bg-[#141414] border border-yellow flex flex-col gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="pixel-input text-xs sm:col-span-2 py-1"
            placeholder="Description"
          />
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-arcade text-xs text-yellow">
              ₹
            </span>
            <input
              type="number"
              min="1"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="pixel-input text-xs pl-6 py-1 font-arcade"
              placeholder="Amount"
            />
          </div>
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="pixel-select text-xs py-1"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => setIsEditing(false)}
            className="pixel-btn-secondary px-2 py-0.5 text-[10px]"
          >
            CANCEL
          </button>
          <button
            onClick={handleSaveEdit}
            className="pixel-btn-primary px-3 py-0.5 text-[10px]"
          >
            SAVE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center justify-between px-3 py-2 bg-black border transition-colors ${
        isRecentlyAdded
          ? isExpense
            ? 'border-expense bg-expense-bg/40'
            : 'border-yellow bg-yellow/10'
          : 'border-[#1a1a1a] hover:border-[#333333]'
      }`}
    >
      {/* Left: Pixel Icon + Info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="shrink-0 p-1 bg-[#111] border border-[#222]">
          {isExpense ? (
            <CashRegisterIcon isNew={isRecentlyAdded} size={16} />
          ) : (
            <CoinIcon isNew={isRecentlyAdded} size={16} />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs md:text-sm text-text-main font-semibold truncate">
              {tx.description}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="font-arcade text-text-dim">
              {tx.category}
            </span>
            <span className="text-[#333]">•</span>
            <span className="font-mono text-text-dim">
              {formatDisplayDate(tx.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`font-arcade text-xs md:text-sm font-bold ${
            isExpense ? 'text-expense' : 'text-yellow'
          }`}
        >
          {formatSignedINR(tx.amount, tx.type)}
        </span>

        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-text-dim hover:text-yellow transition-colors"
            title="Edit"
            aria-label={`Edit ${tx.description}`}
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onRequestDelete(tx)}
            className="p-1 text-text-dim hover:text-expense transition-colors"
            title="Delete"
            aria-label={`Delete ${tx.description}`}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
