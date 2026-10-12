import React from 'react';

/**
 * Pixel-Art Segmented Progress Bar.
 * Renders discrete pixel blocks for authentic 8-bit game HUD feel.
 */
export default function PixelProgressBar({
  percentUsed = 0,
  isOverBudget = false,
  totalSegments = 20
}) {
  const clampedPercent = Math.max(0, percentUsed);
  const filledSegments = Math.min(
    totalSegments,
    Math.round((clampedPercent / 100) * totalSegments)
  );

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="font-arcade text-text-muted flex items-center gap-2">
          <span>BUDGET CONSUMPTION:</span>
          {isOverBudget ? (
            <span className="text-expense font-bold animate-blink">
              [OVER-BUDGET]
            </span>
          ) : percentUsed >= 80 ? (
            <span className="text-yellow-light font-bold">
              [HIGH USAGE]
            </span>
          ) : (
            <span className="text-yellow font-bold">
              [NORMAL]
            </span>
          )}
        </span>
        <span
          className={`font-arcade font-bold ${
            isOverBudget ? 'text-expense' : 'text-yellow'
          }`}
        >
          {percentUsed}%
        </span>
      </div>

      {/* Outer Pixel Frame */}
      <div
        className={`p-1 bg-black border ${
          isOverBudget ? 'border-expense' : 'border-yellow'
        }`}
      >
        {/* Segmented Pixel Grid */}
        <div className="flex items-center gap-1 h-5 w-full bg-dark-900 px-0.5">
          {Array.from({ length: totalSegments }).map((_, index) => {
            const isFilled = index < filledSegments;

            let blockColor = 'bg-dark-700 opacity-40'; // empty block
            if (isFilled) {
              if (isOverBudget) {
                blockColor = 'bg-expense shadow-[0_0_2px_#FF5252]';
              } else if (index >= totalSegments * 0.8) {
                blockColor = 'bg-yellow-light';
              } else {
                blockColor = 'bg-yellow';
              }
            }

            return (
              <div
                key={index}
                className={`flex-1 h-3.5 transition-colors duration-150 ${blockColor}`}
                style={{
                  minWidth: '2px'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Scale markers: 0%, 50%, 100% */}
      <div className="flex justify-between items-center mt-1 px-1 text-[10px] font-arcade text-text-dim">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
        {isOverBudget && <span className="text-expense font-bold">&gt;100%</span>}
      </div>
    </div>
  );
}
