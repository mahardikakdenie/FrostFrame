import React, { useEffect } from 'react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--heading-font', theme.headingFont);
    root.style.setProperty('--body-font', theme.bodyFont);
    root.style.setProperty('--border-radius', theme.borderRadius);
    
    // Add RGB variants for opacity support (Tailwind utility compatibility)
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r} ${g} ${b}`;
    };

    try {
        root.style.setProperty('--primary-color-rgb', hexToRgb(theme.primaryColor));
        root.style.setProperty('--secondary-color-rgb', hexToRgb(theme.secondaryColor));
        root.style.setProperty('--accent-color-rgb', hexToRgb(theme.accentColor));
    } catch (e) {
        console.warn('Theme hex color parsing failed', e);
    }
  }, [theme]);

  return <>{children}</>;
};
