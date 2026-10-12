import React from 'react';

/**
 * Pixel Art Coin Icon for Saving transactions.
 */
export default function CoinIcon({ isNew = false, size = 20 }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        isNew ? 'animate-stat-pulse' : ''
      }`}
      style={{ width: size, height: size }}
      title="Saving: Pixel Coin"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        shapeRendering="crispEdges"
      >
        {/* Outer Black Pixel Outline */}
        <rect x="5" y="1" width="6" height="1" fill="#000000" />
        <rect x="3" y="2" width="2" height="1" fill="#000000" />
        <rect x="11" y="2" width="2" height="1" fill="#000000" />
        <rect x="2" y="3" width="1" height="2" fill="#000000" />
        <rect x="13" y="3" width="1" height="2" fill="#000000" />
        <rect x="1" y="5" width="1" height="6" fill="#000000" />
        <rect x="14" y="5" width="1" height="6" fill="#000000" />
        <rect x="2" y="11" width="1" height="2" fill="#000000" />
        <rect x="13" y="11" width="1" height="2" fill="#000000" />
        <rect x="3" y="13" width="2" height="1" fill="#000000" />
        <rect x="11" y="13" width="2" height="1" fill="#000000" />
        <rect x="5" y="14" width="6" height="1" fill="#000000" />

        {/* Outer Rim Gold */}
        <rect x="5" y="2" width="6" height="1" fill="#FFF176" />
        <rect x="3" y="3" width="10" height="1" fill="#FFF176" />
        <rect x="2" y="5" width="12" height="6" fill="#FFD600" />
        <rect x="3" y="11" width="10" height="2" fill="#D4B000" />
        <rect x="5" y="13" width="6" height="1" fill="#D4B000" />

        {/* Center Pixel Art Emblem (₹ Sign or Star) */}
        <rect x="5" y="5" width="6" height="1" fill="#000000" />
        <rect x="5" y="7" width="5" height="1" fill="#000000" />
        <rect x="7" y="5" width="2" height="6" fill="#000000" />
        <rect x="9" y="8" width="2" height="3" fill="#000000" />
      </svg>
    </div>
  );
}
