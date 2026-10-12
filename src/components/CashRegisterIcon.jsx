import React from 'react';

/**
 * Pixel Art Cash Register Icon with dynamic drawer-open and receipt animation.
 */
export default function CashRegisterIcon({ isNew = false, size = 20 }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        isNew ? 'animate-register-pop' : ''
      }`}
      style={{ width: size, height: size }}
      title="Expense: Cash Register"
    >
      {/* Animated Pop-up Receipt for newly added expense */}
      {isNew && (
        <div className="absolute -top-3 left-1 z-10 animate-receipt pointer-events-none">
          <svg width="10" height="10" viewBox="0 0 5 6" shapeRendering="crispEdges">
            <rect x="0" y="0" width="5" height="5" fill="#FFFFFF" />
            <rect x="1" y="1" width="3" height="1" fill="#000000" />
            <rect x="1" y="3" width="2" height="1" fill="#FF5252" />
          </svg>
        </div>
      )}

      {/* Pixel Cash Register SVG (16x16 Grid) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        shapeRendering="crispEdges"
      >
        {/* Register Top Display Screen */}
        <rect x="5" y="1" width="6" height="3" fill="#222222" />
        <rect x="6" y="2" width="4" height="1" fill="#FF5252" />

        {/* Display Stem */}
        <rect x="7" y="4" width="2" height="1" fill="#333333" />

        {/* Main Body */}
        <rect x="2" y="5" width="12" height="6" fill="#1C1C1C" />
        <rect x="2" y="5" width="12" height="1" fill="#444444" />

        {/* Keypad Buttons */}
        <rect x="4" y="7" width="2" height="1" fill="#FFD600" />
        <rect x="7" y="7" width="2" height="1" fill="#FFD600" />
        <rect x="10" y="7" width="2" height="1" fill="#FFD600" />
        <rect x="4" y="9" width="2" height="1" fill="#999999" />
        <rect x="7" y="9" width="2" height="1" fill="#999999" />
        <rect x="10" y="9" width="2" height="1" fill="#999999" />

        {/* Cash Drawer Base */}
        <rect x="1" y="11" width="14" height="3" fill="#2A2A2A" />
        <rect x="1" y="11" width="14" height="1" fill="#555555" />
        {/* Keyhole / Drawer Handle */}
        <rect x="7" y="12" width="2" height="1" fill="#FFD600" />

        {/* Bottom Feet */}
        <rect x="2" y="14" width="2" height="1" fill="#000000" />
        <rect x="12" y="14" width="2" height="1" fill="#000000" />
      </svg>
    </div>
  );
}
