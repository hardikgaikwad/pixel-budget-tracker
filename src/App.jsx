import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import BudgetOverview from './components/BudgetOverview';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import PixelModal from './components/PixelModal';

import {
  getWeekKey,
  getPrevWeekKey,
  getNextWeekKey
} from './utils/date';
import { calculateWeeklyTotals } from './utils/calculations';
import { loadState, saveState, getSampleData, clearStorage } from './utils/storage';
import { playCoinSound, playCashRegisterSound, playBlipSound } from './utils/sound';

export default function App() {
  const initialData = useRef(loadState());

  const [currentWeekKey, setCurrentWeekKey] = useState(() => getWeekKey(new Date()));
  const [budgets, setBudgets] = useState(() => {
    if (initialData.current && initialData.current.budgets) {
      return initialData.current.budgets;
    }
    const thisWeek = getWeekKey(new Date());
    return { [thisWeek]: 8000 };
  });

  const [transactions, setTransactions] = useState(() => {
    if (initialData.current && Array.isArray(initialData.current.transactions)) {
      return initialData.current.transactions;
    }
    return [];
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (initialData.current && typeof initialData.current.soundEnabled === 'boolean') {
      return initialData.current.soundEnabled;
    }
    return true;
  });

  // Animation states
  const [isDroppingCoin, setIsDroppingCoin] = useState(false);
  const [lastSavedAmount, setLastSavedAmount] = useState(0);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    saveState({
      budgets,
      transactions,
      soundEnabled
    });
  }, [budgets, transactions, soundEnabled]);

  // Current week data
  const weekTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.weekKey === currentWeekKey);
  }, [transactions, currentWeekKey]);

  const activeBudget = budgets[currentWeekKey] || 0;

  const weeklyTotals = useMemo(() => {
    return calculateWeeklyTotals(activeBudget, weekTransactions);
  }, [activeBudget, weekTransactions]);

  // Handlers
  const handlePrevWeek = () => {
    playBlipSound(soundEnabled);
    setCurrentWeekKey((prev) => getPrevWeekKey(prev));
  };

  const handleNextWeek = () => {
    playBlipSound(soundEnabled);
    setCurrentWeekKey((prev) => getNextWeekKey(prev));
  };

  const handleResetToCurrentWeek = () => {
    playBlipSound(soundEnabled);
    setCurrentWeekKey(getWeekKey(new Date()));
  };

  const handleSaveBudget = (week, amount) => {
    playBlipSound(soundEnabled);
    setBudgets((prev) => ({
      ...prev,
      [week]: amount
    }));
  };

  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    setRecentlyAddedId(newTx.id);

    if (newTx.type === 'saved') {
      playCoinSound(soundEnabled);
      setLastSavedAmount(newTx.amount);
      setIsDroppingCoin(true);
      setTimeout(() => setIsDroppingCoin(false), 700);
    } else {
      playCashRegisterSound(soundEnabled);
    }

    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === newTx.id ? null : curr));
    }, 1500);
  };

  const handleUpdateTransaction = (updatedTx) => {
    playBlipSound(soundEnabled);
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    playBlipSound(soundEnabled);
    setTransactions((prev) => prev.filter((tx) => tx.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleLoadDemoData = () => {
    playCoinSound(soundEnabled);
    const demo = getSampleData();
    setBudgets((prev) => ({ ...prev, ...demo.budgets }));
    setTransactions((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const fresh = demo.transactions.filter((t) => !existingIds.has(t.id));
      return [...fresh, ...prev];
    });
  };

  const handleConfirmReset = () => {
    playBlipSound(soundEnabled);
    clearStorage();
    const thisWeek = getWeekKey(new Date());
    setCurrentWeekKey(thisWeek);
    setBudgets({ [thisWeek]: 0 });
    setTransactions([]);
    setIsResetModalOpen(false);
  };

  const handlePiggyClick = () => {
    playCoinSound(soundEnabled);
  };

  return (
    <div className="min-h-screen w-full bg-black text-[#f5f5f5] flex flex-col items-center pixel-grid-bg">
      {/* 1. Header */}
      <Header
        currentWeekKey={currentWeekKey}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onResetToCurrentWeek={handleResetToCurrentWeek}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onLoadDemoData={handleLoadDemoData}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Main Container - Centered, Focused, Breathable */}
      <main className="w-full max-w-5xl flex-1 px-4 sm:px-6 py-6 md:py-8 space-y-6">
        
        {/* 2. Visual Centerpiece: Piggy Bank + Remaining Budget + 3 Stats with Inline Budget Editor */}
        <BudgetOverview
          totals={weeklyTotals}
          weekKey={currentWeekKey}
          onSaveBudget={handleSaveBudget}
          isDroppingCoin={isDroppingCoin}
          lastSavedAmount={lastSavedAmount}
          onPiggyClick={handlePiggyClick}
        />

        {/* 3. Transaction Actions: Form (Left) & History Log (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Add Transaction Form (5 cols on md+) */}
          <div className="md:col-span-5">
            <TransactionForm
              selectedWeekKey={currentWeekKey}
              onAddTransaction={handleAddTransaction}
            />
          </div>

          {/* Money Log (7 cols on md+) */}
          <div className="md:col-span-7">
            <TransactionList
              transactions={weekTransactions}
              recentlyAddedId={recentlyAddedId}
              onUpdateTransaction={handleUpdateTransaction}
              onRequestDelete={(tx) => setDeleteTarget(tx)}
            />
          </div>

        </div>

      </main>

      {/* Simple Footer */}
      <footer className="w-full border-t border-[#1a1a1a] bg-black py-4 px-4 text-center text-xs text-text-dim font-arcade">
        <span>PIGGY//BANK • RETRO WEEKLY BUDGET QUEST • LOCAL DATA STORAGE</span>
      </footer>

      {/* Delete Confirmation Modal */}
      <PixelModal
        isOpen={Boolean(deleteTarget)}
        title="DELETE TRANSACTION"
        message={`Delete "${deleteTarget?.description}"? Your remaining budget will update immediately.`}
        confirmLabel="DELETE"
        cancelLabel="CANCEL"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Reset Confirmation Modal */}
      <PixelModal
        isOpen={isResetModalOpen}
        title="RESET EVERYTHING"
        message="Clear all weekly budgets and transaction history? This cannot be undone."
        confirmLabel="RESET"
        cancelLabel="CANCEL"
        isDanger={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
