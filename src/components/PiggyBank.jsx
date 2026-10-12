import React, { useState } from 'react';
import { formatINR } from '../utils/currency';

/**
 * PixelArt Piggy Bank Component.
 * Hand-crafted with crisp SVG rectangles on a pixel grid.
 * Features reactive expressions (normal, happy, warning) and coin drop animation.
 */
export default function PiggyBank({
  isOverBudget = false,
  isDroppingCoin = false,
  lastSavedAmount = 0,
  percentUsed = 0,
  onClick
}) {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
    if (onClick) onClick();
  };

  // Expression determination
  const isHappy = isDroppingCoin || (percentUsed <= 50 && !isOverBudget);
  const isWorried = isOverBudget;

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center justify-center p-3 select-none cursor-pointer transition-transform ${
        isWiggling || isDroppingCoin ? 'animate-pig-bounce' : ''
      }`}
      title="Click Piggy for good luck!"
    >
      {/* Falling Coin Animation */}
      {isDroppingCoin && (
        <div className="absolute top-0 z-20 pointer-events-none animate-coin-drop">
          <svg
            width="20"
            height="20"
            viewBox="0 0 10 10"
            shapeRendering="crispEdges"
            className="filter drop-shadow-[0_2px_0_#000]"
          >
            {/* 10x10 Pixel Gold Coin */}
            <rect x="3" y="1" width="4" height="1" fill="#FFD600" />
            <rect x="2" y="2" width="6" height="1" fill="#FFF176" />
            <rect x="1" y="3" width="8" height="4" fill="#FFD600" />
            <rect x="2" y="7" width="6" height="1" fill="#D4B000" />
            <rect x="3" y="8" width="4" height="1" fill="#D4B000" />
            {/* Coin ₹ Symbol / Pixel Mark */}
            <rect x="4" y="3" width="2" height="1" fill="#000000" />
            <rect x="4" y="4" width="2" height="2" fill="#000000" />
            <rect x="5" y="6" width="1" height="1" fill="#000000" />
          </svg>
        </div>
      )}

      {/* Floating text for saved amount */}
      {isDroppingCoin && lastSavedAmount > 0 && (
        <div className="absolute -top-3 right-0 z-30 font-arcade text-xs text-yellow font-bold animate-float-up pointer-events-none">
          +{formatINR(lastSavedAmount)}
        </div>
      )}

      {/* Sparks Burst Particles */}
      {isDroppingCoin && (
        <div className="absolute top-5 z-20 pointer-events-none w-full h-full">
          <div className="absolute left-1/2 top-4 w-1.5 h-1.5 bg-yellow-light animate-spark" style={{ '--dx': '-16px', '--dy': '-14px' }} />
          <div className="absolute left-1/2 top-4 w-1.5 h-1.5 bg-yellow animate-spark" style={{ '--dx': '16px', '--dy': '-16px' }} />
          <div className="absolute left-1/2 top-4 w-1.5 h-1.5 bg-white animate-spark" style={{ '--dx': '-18px', '--dy': '4px' }} />
          <div className="absolute left-1/2 top-4 w-1.5 h-1.5 bg-yellow animate-spark" style={{ '--dx': '18px', '--dy': '6px' }} />
          <div className="absolute left-1/2 top-4 w-1.5 h-1.5 bg-yellow-light animate-spark" style={{ '--dx': '0px', '--dy': '-20px' }} />
        </div>
      )}

      {/* Piggy Bank SVG (32x26 Pixel Art Grid) */}
      <svg
        width="144"
        height="117"
        viewBox="0 0 32 26"
        shapeRendering="crispEdges"
        className="transition-transform duration-100"
      >
        {/* Outer Black Pixel Outline */}
        {/* Top & Ears */}
        <rect x="7" y="3" width="3" height="3" fill="#000000" />
        <rect x="8" y="2" width="2" height="1" fill="#000000" />
        <rect x="11" y="5" width="13" height="1" fill="#000000" />
        <rect x="24" y="6" width="2" height="2" fill="#000000" />

        {/* Back / Tail */}
        <rect x="3" y="10" width="2" height="2" fill="#000000" />
        <rect x="2" y="11" width="2" height="3" fill="#000000" />
        <rect x="4" y="12" width="2" height="1" fill="#000000" />
        <rect x="4" y="8" width="3" height="3" fill="#000000" />
        <rect x="3" y="14" width="2" height="5" fill="#000000" />

        {/* Snout & Face Outline */}
        <rect x="27" y="10" width="3" height="6" fill="#000000" />
        <rect x="26" y="9" width="3" height="1" fill="#000000" />
        <rect x="26" y="16" width="2" height="1" fill="#000000" />

        {/* Bottom & Legs Outline */}
        <rect x="5" y="19" width="22" height="1" fill="#000000" />
        <rect x="7" y="20" width="4" height="4" fill="#000000" />
        <rect x="20" y="20" width="4" height="4" fill="#000000" />

        {/* MAIN BODY FILL (BRIGHT YELLOW #FFD600) */}
        <rect x="5" y="8" width="21" height="11" fill="#FFD600" />
        <rect x="7" y="6" width="17" height="3" fill="#FFD600" />
        <rect x="4" y="11" width="23" height="7" fill="#FFD600" />

        {/* BODY HIGHLIGHTS (LIGHT YELLOW #FFF176) */}
        <rect x="8" y="6" width="14" height="1" fill="#FFF176" />
        <rect x="6" y="7" width="2" height="2" fill="#FFF176" />
        <rect x="5" y="9" width="1" height="5" fill="#FFF176" />

        {/* EARS */}
        {/* Left Ear */}
        <rect x="8" y="3" width="2" height="3" fill="#FFD600" />
        <rect x="9" y="4" width="1" height="2" fill="#FFF176" />
        {/* Right Ear / Back ear */}
        <rect x="13" y="4" width="2" height="2" fill="#D4B000" />

        {/* COIN SLOT ON BACK */}
        <rect x="14" y="5" width="6" height="2" fill="#000000" />
        <rect x="15" y="6" width="4" height="1" fill="#333333" />

        {/* SNOUT */}
        <rect x="25" y="10" width="4" height="5" fill="#FFF176" />
        <rect x="28" y="11" width="1" height="1" fill="#000000" />
        <rect x="28" y="13" width="1" height="1" fill="#000000" />

        {/* PIGGY TAIL CURL */}
        <rect x="2" y="12" width="2" height="1" fill="#FFD600" />
        <rect x="3" y="11" width="1" height="2" fill="#FFD600" />

        {/* LEGS */}
        <rect x="8" y="19" width="2" height="3" fill="#FFD600" />
        <rect x="8" y="22" width="2" height="1" fill="#D4B000" />
        <rect x="21" y="19" width="2" height="3" fill="#FFD600" />
        <rect x="21" y="22" width="2" height="1" fill="#D4B000" />

        {/* EYE EXPRESSIONS */}
        {isWorried ? (
          // Worried / Over budget Eye: Wide scared pupil + red sweat drop
          <>
            <rect x="20" y="8" width="3" height="3" fill="#000000" />
            <rect x="21" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Sweat Drop */}
            <rect x="18" y="12" width="1" height="2" fill="#FF5252" />
            <rect x="19" y="13" width="1" height="2" fill="#FF5252" />
          </>
        ) : isHappy ? (
          // Happy / Winking Eye: Arcade arc ^ ^
          <>
            <rect x="20" y="9" width="1" height="1" fill="#000000" />
            <rect x="21" y="8" width="2" height="1" fill="#000000" />
            <rect x="23" y="9" width="1" height="1" fill="#000000" />
            {/* Rosy Cheek */}
            <rect x="21" y="12" width="2" height="1" fill="#FFA726" />
          </>
        ) : (
          // Normal Idle Eye: Classic pixel pupil
          <>
            <rect x="21" y="8" width="2" height="2" fill="#000000" />
            <rect x="21" y="8" width="1" height="1" fill="#FFFFFF" />
          </>
        )}

        {/* SHADOW BASE */}
        <rect x="7" y="24" width="18" height="1" fill="#1C1C1C" />
      </svg>

      {/* Status Badge beneath Pig */}
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className={`inline-block w-2 h-2 ${
            isOverBudget
              ? 'bg-expense animate-blink'
              : 'bg-yellow'
          }`}
        />
        <span
          className={`font-arcade text-[10px] tracking-wider uppercase ${
            isOverBudget ? 'text-expense' : 'text-text-muted'
          }`}
        >
          {isOverBudget ? 'ALERT: EXCEEDED' : isHappy ? 'HAPPY & SAVING' : 'READY TO DEPOSIT'}
        </span>
      </div>
    </div>
  );
}
