# PIGGY//BANK — Pixel-Art Weekly Budget Tracker 🐷🪙

A minimal, retro 8-bit weekly budget tracker with a digital arcade piggy bank aesthetic. Built from scratch with React, Vite, Tailwind CSS, and Web Audio API synthesizer.

---

## 🎮 Concept & Visual Identity

`PIGGY//BANK` is designed to feel like a tiny digital arcade pet and financial companion rather than a boring corporate dashboard.

- **Color System:** Pure black (`#000000`), bright arcade yellow (`#FFD600`), soft highlight yellow (`#FFF176`), warm white (`#F5F5F5`), and restrained muted red (`#FF5252`) reserved strictly for expenses and over-budget warnings.
- **Sharp Geometry:** `border-radius: 0` everywhere. Sharp square corners, thin crisp borders, and pixel scanline background.
- **Typography:** Authentic retro arcade fonts (`Press Start 2P`, `Silkscreen`, and `Space Mono`).
- **Interactive Animations:** Hand-crafted CSS/SVG pixel art with reactive expressions, animated coin drops, spark particle bursts, and cash-register drawer animations.
- **8-Bit Sound Effects:** Built-in Web Audio API synthesizer with Mario-style rising coin chimes, retro cash register clicks, and blips (with instant mute toggle).
- **Zero Backend / Complete Privacy:** All data persists locally in `localStorage`. Safe corrupted-data recovery and offline resilience.

---

## 📐 Calculation Rules & Financial Model

The app enforces a clean, unambiguous weekly budgeting model:

1. **Spent:** Sum of all expense transactions (`type: 'spent'`) for the selected week.
2. **Saved:** Sum of all saving deposits (`type: 'saved'`) for the selected week.
3. **Remaining:** `Weekly Budget − Total Spent`.
4. **Available to Spend:** `Weekly Budget − Total Spent`.
5. **Separate Savings Rule:** Savings deposits are tracked in your digital piggy bank vault and **do not inflate** the available spending budget or get counted twice.
6. **Deficit / Over-Budget:** If `Spent > Budget`, `Remaining` becomes a negative deficit (e.g., `−₹4,370`), the progress bar turns red with `[OVER-BUDGET]` status, the contextual terminal warning alerts `WARNING: BUDGET EXCEEDED!`, and the pixel pig displays a worried eye with a dripping sweat drop.
7. **Week Isolation:** Weeks run Monday to Sunday (ISO calendar standard). Navigating to another week displays that week's independent budget and history without data bleed.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (tested on Node.js v24)
- **npm**: v9.0.0 or higher

### Installation & Local Run

```bash
# 1. Clone repository
git clone https://github.com/hardikgaikwad/pixel-budget-tracker.git
cd pixel-budget-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Useful Commands

```bash
# Run unit test suite (Vitest)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Manual Testing & Verification Checklist

- [x] **Set Weekly Budget:** Enter an amount (e.g. `₹8,000`) or click a quick preset (`₹2,500`, `₹5,000`, `₹10,000`). Totals update immediately.
- [x] **Add Expense (SPENT):** Select `− SPENT`, amount `₹250`, description `Pixel Coffee`, category `Food`. Click `+ LOG SPENT EXPENSE`.
  - Cash register drawer animation triggers in the log.
  - Remaining budget decreases by exactly `₹250`.
  - 8-bit cash register sound plays.
- [x] **Add Saving (SAVED):** Select `+ SAVED`, amount `₹100`, description `Saved lunch money`, category `Food savings`. Click `+ DEPOSIT SAVINGS`.
  - Gold pixel coin drops into the piggy bank slot.
  - Yellow spark particle burst explodes.
  - Floating `+₹100` indicator drifts upward.
  - 8-bit coin chime plays.
  - Total saved increases by `₹100` without inflating remaining spending budget.
- [x] **Overspending Indicator:** Add an expense that exceeds the budget.
  - Banner shows `WARNING: BUDGET EXCEEDED!`.
  - Remaining box turns into `DEFICIT` with red border.
  - Piggy bank shows worried alert state with red sweat drop.
  - Progress bar turns red with `[OVER-BUDGET]` and percentage `>100%`.
- [x] **Edit Transaction:** Click the pencil icon on any transaction in `MONEY LOG` to edit description, amount, or category. Recalculates totals immediately.
- [x] **Delete Confirmation:** Click trash can icon. A retro confirmation dialog appears before removing the transaction.
- [x] **Week Navigation:** Click `◀ PREV` and `NEXT ▶` to switch weeks. Data remains strictly isolated per week. Click `[JUMP TO CURRENT WEEK]` to return instantly.
- [x] **Persistent Storage:** Reload the browser; all transactions, budgets, and sound settings persist in `localStorage`.
- [x] **Audio SFX Toggle:** Click `SFX: ON` to mute/unmute retro arcade sound effects.
- [x] **Demo Data & Reset:** Click `DEMO DATA` to populate sample transactions, or `RESET` to clear with confirmation.

---

## 📁 Project Architecture

```
pixel-budget-tracker/
├── index.html                  # HTML entry point with retro Google Fonts
├── package.json                # Project dependencies and test scripts
├── vite.config.js              # Vite & Vitest configuration
├── tailwind.config.js          # Tailwind theme tokens
├── postcss.config.js           # PostCSS configuration
├── tests/
│   └── budget.test.js          # Vitest unit tests (calculations & date utilities)
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Core application state & layout orchestrator
    ├── index.css               # Tailwind & Pixel styles import
    ├── styles/
    │   └── pixel.css           # 8-bit animations, scanlines, pixel button styles
    ├── utils/
    │   ├── date.js             # ISO week calculations, date ranges, week bounds
    │   ├── currency.js         # Indian Rupee (INR ₹) formatting with Intl
    │   ├── calculations.js     # Weekly financial totals, status messages, percentages
    │   ├── storage.js          # Safe localStorage serialization & demo data
    │   └── sound.js            # Web Audio API 8-bit sound synthesizer
    └── components/
        ├── Header.jsx          # Pixel logo, week navigation, sound toggle, reset
        ├── PiggyBank.jsx       # SVG pixel art pig with expressions & coin drop
        ├── BudgetOverview.jsx  # Centerpiece with 4 stats cards & status terminal
        ├── PixelProgressBar.jsx# 20-block segmented arcade progress gauge
        ├── BudgetControls.jsx  # Budget input, quick presets & validation
        ├── TransactionForm.jsx # SPENT / SAVED toggle form with category selection
        ├── TransactionList.jsx # MONEY LOG with filters (ALL, SPENT, SAVED)
        ├── TransactionItem.jsx # Row with cash register / coin icons & inline edit
        ├── CashRegisterIcon.jsx# SVG pixel register with pop-out drawer animation
        ├── CoinIcon.jsx        # SVG pixel coin icon with sparkle
        └── PixelModal.jsx      # Retro modal dialog for destructive actions
```

---

## 📜 License

MIT License — Built for the Pixel-Art Budget Tracker Coding Challenge.
