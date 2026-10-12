import React, { useState, useMemo } from 'react';
import TransactionItem from './TransactionItem';
import { parseISODate } from '../utils/date';

/**
 * Simplified, Clean Money Log:
 * Fast filters, clear chronological list, gentle pixel empty state.
 */
export default function TransactionList({
  transactions = [],
  recentlyAddedId,
  onUpdateTransaction,
  onRequestDelete
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'spent' | 'saved'

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dateA = parseISODate(a.date).getTime();
      const dateB = parseISODate(b.date).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'spent') {
      return sortedTransactions.filter((tx) => tx.type === 'spent');
    }
    if (filter === 'saved') {
      return sortedTransactions.filter((tx) => tx.type === 'saved');
    }
    return sortedTransactions;
  }, [sortedTransactions, filter]);

  return (
    <section className="w-full bg-[#0a0a0a] border border-[#262626] p-4 md:p-5 pixel-shadow-black">
      
      {/* Header & Filter Tabs */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#202020]">
        <div className="flex items-center gap-2">
          <h2 className="font-arcade text-xs md:text-sm text-yellow tracking-wider font-bold">
            MONEY LOG
          </h2>
          <span className="font-arcade text-[10px] text-text-dim">
            ({transactions.length})
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1">
          {['all', 'spent', 'saved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-[10px] font-arcade uppercase transition-colors border ${
                filter === f
                  ? f === 'spent'
                    ? 'bg-expense text-black border-expense font-bold'
                    : 'bg-yellow text-black border-yellow font-bold'
                  : 'bg-black text-text-muted border-[#333] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List or Empty State */}
      {filteredTransactions.length === 0 ? (
        <div className="py-10 px-4 flex flex-col items-center justify-center text-center bg-black border border-[#1a1a1a]">
          {/* Waiting Pixel Pig Illustration */}
          <div className="mb-2 opacity-50">
            <svg
              width="48"
              height="40"
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
          <p className="font-arcade text-xs text-text-muted font-bold mb-1">
            {filter === 'all'
              ? 'NO TRANSACTIONS THIS WEEK'
              : `NO ${filter.toUpperCase()} TRANSACTIONS`}
          </p>
          <p className="font-mono text-xs text-text-dim">
            Add an expense or saving to update your balance.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
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
