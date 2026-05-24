import React from 'react';

/**
 * Premium Studio Background for the Editor canvas.
 * Includes mesh glows, dot grid, and subtle noise texture.
 */
export const EditorBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Ambient Glows (Mesh Gradient Style) - Improved Light Mode Colors */}
      <div className="absolute -top-[5%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 dark:bg-indigo-950/20 blur-[120px] animate-pulse duration-[12s]" />
      <div className="absolute top-[15%] -right-[5%] w-[50%] h-[50%] rounded-full bg-purple-100/30 dark:bg-rose-950/10 blur-[100px] animate-pulse duration-[8s]" />
      <div className="absolute -bottom-[15%] left-[10%] w-[60%] h-[60%] rounded-full bg-amber-50/40 dark:bg-slate-800/10 blur-[120px]" />
      
      {/* 🌫️ PREMIUM NOISE TEXTURE: Gives it that 'physical' frosted feel */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Modern Dot Grid Layer - Better contrast for Light Mode */}
      <div 
        className="absolute inset-0 opacity-[0.5] dark:opacity-[0.15]" 
        style={{ 
          backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`, 
          backgroundSize: '40px 40px' 
        }} 
      />
      
      {/* Central Stage Guide (Subtle Highlight for the main area) */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-6xl border-x border-slate-200/30 dark:border-slate-800/20 bg-white/10 dark:bg-transparent" />
    </div>
  );
};
