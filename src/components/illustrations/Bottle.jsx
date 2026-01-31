import React from 'react';
import { cn } from '../../lib/utils';

export function Bottle({ children, index, className, noRotation = false }) {
    // Generate a slightly different rotation/wobble for each bottle to make it feel organic
    const rotation = noRotation ? 0 : (index % 3 - 1) * 2; // -2, 0, 2 degrees

    return (
        <div className={cn("relative flex flex-col items-center group", className)}>
            {/* Bottle SVG */}
            <div
                className="relative w-48 h-[340px] drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <svg viewBox="0 0 100 240" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                        </linearGradient>
                        <filter id="liquidGlow">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
                        </filter>
                    </defs>

                    {/* Bottle Shape - Body */}
                    <path
                        d="M20,70 Q10,75 10,100 V220 Q10,235 25,235 H75 Q90,235 90,220 V100 Q90,75 80,70 L65,30 V10 H35 V30 Z"
                        fill="rgba(255, 255, 255, 0.2)"
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth="1"
                    />

                    {/* Liquid Level */}
                    <path
                        d="M12,120 Q50,115 88,120 V215 Q88,230 75,230 H25 Q12,230 12,215 Z"
                        fill="#FDE68A"
                        opacity="0.6"
                    />
                    {/* Bubbles */}
                    <circle cx="30" cy="200" r="1.5" fill="white" opacity="0.6" className="animate-pulse" />
                    <circle cx="50" cy="180" r="1" fill="white" opacity="0.5" className="animate-pulse delay-75" />
                    <circle cx="70" cy="190" r="2" fill="white" opacity="0.4" className="animate-pulse delay-150" />
                    <circle cx="40" cy="150" r="1.5" fill="white" opacity="0.5" className="animate-pulse delay-300" />

                    {/* Glass Reflection/Highlight */}
                    <path
                        d="M20,70 Q10,75 10,100 V220 Q10,235 25,235 H75 Q90,235 90,220 V100 Q90,75 80,70 L65,30 V10 H35 V30 Z"
                        fill="url(#glassGradient)"
                    />

                    {/* Swing Top Stopper details */}
                    <rect x="33" y="28" width="34" height="4" fill="#E5E7EB" rx="1" />
                    <path d="M35,10 H65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                    <path d="M48,10 V28" stroke="#9CA3AF" strokeWidth="2" />
                    <circle cx="30" cy="30" r="2" fill="#4B5563" />
                    <circle cx="70" cy="30" r="2" fill="#4B5563" />

                    {/* Label Area Background */}
                    <rect x="15" y="130" width="70" height="60" rx="2" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="0.5" />
                </svg>

                {/* Content Container (Label) */}
                <div className="absolute top-[185px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[22%] flex flex-col items-center justify-center p-1 text-center">
                    {children}
                </div>
            </div>

            <div className="mt-2 w-32 h-4 bg-black/10 rounded-[100%] blur-md" />
        </div>
    );
}
