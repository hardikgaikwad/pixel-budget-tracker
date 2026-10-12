import React, { useState, useMemo } from 'react';
import TransactionItem from './TransactionItem';
import { parseISODate } from '../utils/date';

/**
 * Money Log Transaction History Component.
 * Features type filtering, chronological sorting (newest first), and retro empty state.
 */
export default function TransactionList({
  transactions = [],
  recentlyAddedId,
  onUpdateTransaction,
  onRequestDelete
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'spent' | 'saved'

  // Sort newest first by date and creation timestamp
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dateA = parseISODate(a.date).getTime();
      const dateB = parseISODate(b.date).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [transactions]);

  // Apply filter
  const filteredTransactions = useMemo(() => {
    if (filter === 'spent') {
      return sortedTransactions.filter((tx) => tx.type === 'spent');
    }
    if (filter === 'saved') {
      return sortedTransactions.filter((tx) => tx.type === 'saved');
    }
    return sortedTransactions;
  }, [sortedTransactions, filter]);

  const spentCount = transactions.filter((tx) => tx.type === 'spent').length;
  const savedCount = transactions.filter((tx) => tx.type === 'saved').length;

  return (
    <section className="w-full bg-dark-900 border border-border-medium p-4 md:p-5 pixel-shadow-black">
      
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow inline-block" />
          <h2 className="font-arcade text-xs md:text-sm text-yellow tracking-wider font-bold">
            MONEY LOG
          </h2>
          <span className="font-arcade text-[10px] text-text-dim">
            [{transactions.length} ENTRIES]
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 text-[11px] font-arcade border transition-colors ${
              filter === 'all'
                ? 'bg-yellow text-black border-yellow font-bold'
                : 'bg-black text-text-muted border-border-medium hover:text-yellow'
            }`}
          >
            ALL ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('spent')}
            className={`px-2 py-1 text-[11px] font-arcade border transition-colors ${
              filter === 'spent'
                ? 'bg-expense text-black border-expense font-bold'
                : 'bg-black text-text-muted border-border-medium hover:text-expense'
            }`}
          >
            SPENT ({spentCount})
          </button>
          <button
            onClick={() => setFilter('saved')}
            className={`px-2 py-1 text-[11px] font-arcade border transition-colors ${
              filter === 'saved'
                ? 'bg-yellow text-black border-yellow font-bold'
                : 'bg-black text-text-muted border-border-medium hover:text-yellow'
            }`}
          >
            SAVED ({savedCount})
          </button>
        </div>
      </div>

      {/* Transaction List or Empty State */}
      {filteredTransactions.length === 0 ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-black border border-dashed border-border-medium">
          {/* Waiting Pixel Pig Illustration */}
          <div className="mb-3 opacity-75">
            <svg
              width="64"
              height="52"
              viewBox="0 0 32 26"
              shapeRendering="crispEdges"
            >
              <rect x="7" y="3" width="3" height="3" fill="#333333" />
              <rect x="8" y="2" width="2" height="1" fill="#333333" />
              <rect x="11" y="5" width="13" height="1" fill="#333333" />
              <rect x="5" y="8" width="21" height="11" fill="#444444" />
              <rect x="8" y="6" width="14" height="1" fill="#666666" />
              <rect x="25" y="10" width="4" height="5" fill="#666666" />
              <rect x="28" y="11" width="1" height="1" fill="#000000" />
              <rect x="20" y="8" width="2" height="2" fill="#000000" />
              <rect x="8" y="19" width="2" height="3" fill="#444444" />
              <rect x="21" y="19" width="2" height="3" fill="#444444" />
              <rect x="14" y="5" width="6" height="2" fill="#000000" />
            </svg>
          </div>
          <p className="font-arcade text-xs text-yellow tracking-wider font-bold mb-1">
            {filter === 'all'
              ? 'NO COINS LOGGED THIS WEEK...'
              : filter === 'spent'
              ? 'NO EXPENSES RECORDED YET!'
              : 'NO SAVINGS DEPOSITED YET!'}
          </p>
          <p className="font-mono text-xs text-text-dim max-w-xs">
            Feed your piggy bank using the transaction form above to record your money quest.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              tx={tx}
              isRecentlyAdded={tx.id === recentlyAddedId}
              onUpdate={onUpdateTransaction}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>
      )}

    </section>
  );
}
