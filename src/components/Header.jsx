import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { formatWeekRange, isCurrentWeek } from '../utils/date';

/**
 * Pixel Header with weekly navigation and game HUD controls.
 */
export default function Header({
  currentWeekKey,
  onPrevWeek,
  onNextWeek,
  onResetToCurrentWeek,
  soundEnabled,
  onToggleSound,
  onLoadDemoData,
  onOpenResetModal
}) {
  const isCurrent = isCurrentWeek(currentWeekKey);
  const weekLabel = formatWeekRange(currentWeekKey);

  return (
    <header className="w-full bg-black border-b-2 border-yellow pt-3 pb-3 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-3">
          {/* Mini Pixel Pig Logo */}
          <div className="w-10 h-10 border border-yellow bg-dark-900 flex items-center justify-center p-1 pixel-shadow-black">
            <svg
              width="28"
              height="24"
              viewBox="0 0 32 26"
              shapeRendering="crispEdges"
            >
              <rect x="7" y="3" width="3" height="3" fill="#000000" />
              <rect x="8" y="2" width="2" height="1" fill="#000000" />
              <rect x="11" y="5" width="13" height="1" fill="#000000" />
              <rect x="5" y="8" width="21" height="11" fill="#FFD600" />
              <rect x="8" y="6" width="14" height="1" fill="#FFF176" />
              <rect x="25" y="10" width="4" height="5" fill="#FFF176" />
              <rect x="28" y="11" width="1" height="1" fill="#000000" />
              <rect x="20" y="8" width="2" height="2" fill="#000000" />
              <rect x="8" y="19" width="2" height="3" fill="#FFD600" />
              <rect x="21" y="19" width="2" height="3" fill="#FFD600" />
              <rect x="14" y="5" width="6" height="2" fill="#000000" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-sm md:text-base text-yellow tracking-wider">
                PIGGY//BANK
              </h1>
              <span className="bg-yellow text-black font-arcade text-[10px] px-1 font-bold">
                v1.0
              </span>
            </div>
            <p className="font-arcade text-xs text-text-muted tracking-wide mt-0.5">
              YOUR WEEKLY MONEY QUEST
            </p>
          </div>
        </div>

        {/* Center: Week Selector Navigation */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevWeek}
              className="pixel-btn-secondary px-2.5 py-1 text-xs"
              title="Previous Week"
              aria-label="Previous Week"
            >
              ◀ PREV
            </button>

            <div className="px-3 py-1 bg-dark-900 border border-yellow min-w-[200px] text-center">
              <span className="font-arcade text-xs text-yellow tracking-wider font-bold">
                {weekLabel}
              </span>
            </div>

            <button
              onClick={onNextWeek}
              className="pixel-btn-secondary px-2.5 py-1 text-xs"
              title="Next Week"
              aria-label="Next Week"
            >
              NEXT ▶
            </button>
          </div>

          {/* Current Week Status / Reset Button */}
          <div className="flex items-center gap-2 text-[11px] font-arcade">
            {isCurrent ? (
              <span className="text-yellow flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-yellow inline-block animate-blink" />
                CURRENT ACTIVE WEEK
              </span>
            ) : (
              <button
                onClick={onResetToCurrentWeek}
                className="text-text-muted hover:text-yellow underline flex items-center gap-1 transition-colors"
              >
                <span>[JUMP TO CURRENT WEEK]</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Tools (SFX, Demo Data, Reset) */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`pixel-btn-secondary px-2.5 py-1.5 text-xs flex items-center gap-1.5 ${
              soundEnabled ? 'text-yellow border-yellow' : 'text-text-dim border-border-subtle'
            }`}
            title={soundEnabled ? 'Disable 8-bit Audio SFX' : 'Enable 8-bit Audio SFX'}
            aria-label={soundEnabled ? 'Sound is on' : 'Sound is off'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span className="hidden sm:inline">SFX: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Load Sample Demo Data */}
          <button
            onClick={onLoadDemoData}
            className="pixel-btn-secondary px-2 py-1.5 text-xs text-text-muted hover:text-yellow"
            title="Load Demo Transactions & Budget"
          >
            <Sparkles size={13} className="text-yellow" />
            <span className="hidden lg:inline">DEMO DATA</span>
          </button>

          {/* Reset All Data */}
          <button
            onClick={onOpenResetModal}
            className="pixel-btn-secondary px-2 py-1.5 text-xs text-text-muted hover:text-expense hover:border-expense"
            title="Clear all local data"
          >
            <RotateCcw size={13} />
            <span className="hidden lg:inline">RESET</span>
          </button>
        </div>

      </div>
    </header>
  );
}
