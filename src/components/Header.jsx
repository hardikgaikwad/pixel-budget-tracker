import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { formatWeekRange, isCurrentWeek } from '../utils/date';

/**
 * Clean, Compact Header:
 * Simple week navigation, retro piggy logo, and minimalist utility controls.
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
    <header className="w-full bg-black border-b border-[#262626] py-3 px-4 md:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 border border-yellow bg-[#0d0d0d] flex items-center justify-center p-0.5">
            <svg
              width="20"
              height="18"
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
            <span className="font-pixel text-xs text-yellow tracking-wider">
              PIGGY//BANK
            </span>
          </div>
        </div>

        {/* Center: Week Selector Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="pixel-btn-secondary px-2 py-1 text-xs"
            title="Previous Week"
            aria-label="Previous Week"
          >
            ◀
          </button>

          <div className="px-3 py-1 bg-[#0d0d0d] border border-[#333] text-center min-w-[170px]">
            <span className="font-arcade text-xs text-yellow tracking-wider font-bold">
              {weekLabel}
            </span>
          </div>

          <button
            onClick={onNextWeek}
            className="pixel-btn-secondary px-2 py-1 text-xs"
            title="Next Week"
            aria-label="Next Week"
          >
            ▶
          </button>

          {!isCurrent && (
            <button
              onClick={onResetToCurrentWeek}
              className="text-[10px] font-arcade text-yellow hover:underline ml-1"
              title="Jump to Current Week"
            >
              [TODAY]
            </button>
          )}
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 border transition-colors ${
              soundEnabled
                ? 'border-yellow text-yellow bg-[#121200]'
                : 'border-[#333] text-text-dim hover:text-white'
            }`}
            title={soundEnabled ? 'Mute 8-bit SFX' : 'Enable 8-bit SFX'}
            aria-label={soundEnabled ? 'Sound is on' : 'Sound is off'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* Demo Data */}
          <button
            onClick={onLoadDemoData}
            className="px-2 py-1 text-[10px] font-arcade text-text-muted hover:text-yellow border border-[#333] hover:border-yellow transition-colors flex items-center gap-1"
            title="Load sample transactions"
          >
            <Sparkles size={11} className="text-yellow" />
            <span>DEMO</span>
          </button>

          {/* Reset */}
          <button
            onClick={onOpenResetModal}
            className="p-1.5 text-text-dim hover:text-expense border border-[#333] hover:border-expense transition-colors"
            title="Reset data"
          >
            <RotateCcw size={13} />
          </button>
        </div>

      </div>
    </header>
  );
}
