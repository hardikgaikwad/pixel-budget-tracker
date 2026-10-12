import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import BudgetOverview from './components/BudgetOverview';
import BudgetControls from './components/BudgetControls';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import PixelModal from './components/PixelModal';

import {
  getWeekKey,
  getPrevWeekKey,
  getNextWeekKey,
  isCurrentWeek,
  formatWeekRange
} from './utils/date';
import { calculateWeeklyTotals } from './utils/calculations';
import { loadState, saveState, getSampleData, clearStorage } from './utils/storage';
import { playCoinSound, playCashRegisterSound, playBlipSound } from './utils/sound';

export default function App() {
  // 1. Core State
  const initialData = useRef(loadState());

  const [currentWeekKey, setCurrentWeekKey] = useState(() => getWeekKey(new Date()));
  const [budgets, setBudgets] = useState(() => {
    if (initialData.current && initialData.current.budgets) {
      return initialData.current.budgets;
    }
    // Default initial budget for active week
    const thisWeek = getWeekKey(new Date());
    return { [thisWeek]: 7500 };
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

  // 2. Animation & Interaction State
  const [isDroppingCoin, setIsDroppingCoin] = useState(false);
  const [lastSavedAmount, setLastSavedAmount] = useState(0);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  // 3. Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 4. Persistence to localStorage
  useEffect(() => {
    saveState({
      budgets,
      transactions,
      soundEnabled
    });
  }, [budgets, transactions, soundEnabled]);

  // 5. Week-specific data filtering and calculations
  const weekTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.weekKey === currentWeekKey);
  }, [transactions, currentWeekKey]);

  const activeBudget = budgets[currentWeekKey] || 0;

  const weeklyTotals = useMemo(() => {
    return calculateWeeklyTotals(activeBudget, weekTransactions);
  }, [activeBudget, weekTransactions]);

  // 6. Handlers
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
      // Trigger Coin Drop Animation & sound
      playCoinSound(soundEnabled);
      setLastSavedAmount(newTx.amount);
      setIsDroppingCoin(true);
      setTimeout(() => setIsDroppingCoin(false), 700);
    } else {
      // Trigger Cash Register Animation & sound
      playCashRegisterSound(soundEnabled);
    }

    // Clear recently added pulse after animation concludes
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === newTx.id ? null : curr));
    }, 1800);
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
    // Merge or replace
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
    <div className="min-h-screen bg-black text-warm flex flex-col pixel-grid-bg">
      {/* 1. Header with Week Navigation & Tools */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* 2. Centerpiece: Weekly Budget Overview */}
        <BudgetOverview
          totals={weeklyTotals}
          isDroppingCoin={isDroppingCoin}
          lastSavedAmount={lastSavedAmount}
          onPiggyClick={handlePiggyClick}
        />

        {/* 3. Weekly Budget Controls */}
        <BudgetControls
          weekKey={currentWeekKey}
          currentBudget={activeBudget}
          onSaveBudget={handleSaveBudget}
        />

        {/* 4. Split Section: Add Transaction Panel (Left) & Money Log (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Add Transaction Form (5 cols on md+) */}
          <div className="md:col-span-5">
            <TransactionForm
              selectedWeekKey={currentWeekKey}
              onAddTransaction={handleAddTransaction}
            />
          </div>

          {/* Transaction History / Money Log (7 cols on md+) */}
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

      {/* Retro Footer */}
      <footer className="w-full border-t border-border-subtle bg-black py-4 px-4 text-center text-xs text-text-dim font-arcade">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PIGGY//BANK // RETRO WEEKLY BUDGET TRACKER</span>
          <span className="text-yellow">ALL DATA PERSISTED LOCALLY IN STORAGE</span>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      <PixelModal
        isOpen={Boolean(deleteTarget)}
        title="DELETE TRANSACTION"
        message={`Are you sure you want to delete "${deleteTarget?.description}"? This will immediately recalculate your weekly budget.`}
        confirmLabel="DELETE ENTRY"
        cancelLabel="CANCEL"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Reset Storage Confirmation Modal */}
      <PixelModal
        isOpen={isResetModalOpen}
        title="RESET ALL DATA"
        message="Are you sure you want to erase all weekly budgets, transactions, and saved settings? This cannot be undone."
        confirmLabel="RESET EVERYTHING"
        cancelLabel="CANCEL"
        isDanger={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
