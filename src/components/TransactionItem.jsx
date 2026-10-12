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

/**
 * Individual Transaction Row in the Money Log.
 * Supports inline editing, delete confirmation, and pixel-art animation indicators.
 */
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
  const [editError, setEditError] = useState('');

  const isExpense = tx.type === 'spent';
  const categories = isExpense ? EXPENSE_CATEGORIES : SAVING_CATEGORIES;

  const handleSaveEdit = () => {
    const num = sanitizeAmount(editAmount);
    if (!editDesc.trim()) {
      setEditError('DESCRIPTION CANNOT BE EMPTY');
      return;
    }
    if (num <= 0) {
      setEditError('AMOUNT MUST BE > 0');
      return;
    }

    onUpdate({
      ...tx,
      description: editDesc.trim(),
      amount: num,
      category: editCategory,
      date: editDate
    });
    setIsEditing(false);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditDesc(tx.description);
    setEditAmount(String(tx.amount));
    setEditCategory(tx.category);
    setEditDate(tx.date);
    setIsEditing(false);
    setEditError('');
  };

  if (isEditing) {
    return (
      <div className="p-3 bg-dark-800 border-2 border-yellow flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-arcade text-[10px] text-yellow uppercase font-bold">
            EDITING TRANSACTION
          </span>
          {editError && (
            <span className="font-arcade text-[10px] text-expense">
              ✖ {editError}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Description */}
          <input
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="pixel-input text-xs col-span-1 md:col-span-2"
            placeholder="Description"
          />

          {/* Amount */}
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-arcade text-xs text-yellow">
              ₹
            </span>
            <input
              type="number"
              min="1"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="pixel-input text-xs pl-6 font-arcade"
              placeholder="Amount"
            />
          </div>

          {/* Category */}
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="pixel-select text-xs"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-border-subtle">
          <button
            onClick={handleCancelEdit}
            className="pixel-btn-secondary px-2.5 py-1 text-[11px]"
          >
            <X size={12} />
            <span>CANCEL</span>
          </button>
          <button
            onClick={handleSaveEdit}
            className="pixel-btn-primary px-3 py-1 text-[11px]"
          >
            <Check size={12} />
            <span>SAVE</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center justify-between p-3 bg-black border transition-colors ${
        isRecentlyAdded
          ? isExpense
            ? 'border-expense bg-expense-bg/30'
            : 'border-yellow bg-yellow/5'
          : 'border-border-subtle hover:border-border-medium'
      }`}
    >
      {/* Left: Pixel Icon + Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Pixel Art Animation Indicator */}
        <div className="shrink-0 p-1 bg-dark-900 border border-border-subtle flex items-center justify-center">
          {isExpense ? (
            <CashRegisterIcon isNew={isRecentlyAdded} size={20} />
          ) : (
            <CoinIcon isNew={isRecentlyAdded} size={20} />
          )}
        </div>

        {/* Description & Category */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-sm text-text-main font-bold truncate">
              {tx.description}
            </h3>
            {isRecentlyAdded && (
              <span className="font-arcade text-[9px] bg-yellow text-black px-1 font-bold animate-blink">
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 mt-1 text-[11px]">
            <span className="font-arcade text-[10px] text-text-muted bg-[#141414] border border-[#2b2b2b] px-2 py-0.5 tracking-wider uppercase">
              {tx.category}
            </span>
            <span className="font-mono text-text-dim text-[11px]">
              {formatDisplayDate(tx.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Amount */}
        <span
          className={`font-arcade text-sm md:text-base font-bold ${
            isExpense ? 'text-expense' : 'text-yellow'
          }`}
        >
          {formatSignedINR(tx.amount, tx.type)}
        </span>

        {/* Action Buttons (Edit / Delete) */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-text-dim hover:text-yellow hover:bg-dark-800 border border-transparent hover:border-border-medium transition-colors"
            title="Edit Transaction"
            aria-label={`Edit ${tx.description}`}
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onRequestDelete(tx)}
            className="p-1.5 text-text-dim hover:text-expense hover:bg-expense-bg border border-transparent hover:border-expense-dim transition-colors"
            title="Delete Transaction"
            aria-label={`Delete ${tx.description}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
