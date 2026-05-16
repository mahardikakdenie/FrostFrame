import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setHeadingFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  setBorderRadius: (radius: string) => void;
  resetTheme: () => void;
}

const defaultTheme = {
  primaryColor: '#4f46e5', // Indigo 600
  secondaryColor: '#0f172a', // Slate 900
  accentColor: '#10b981', // Emerald 500
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  borderRadius: '0.75rem', // 12px
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...defaultTheme,

      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setSecondaryColor: (secondaryColor) => set({ secondaryColor }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setHeadingFont: (headingFont) => set({ headingFont }),
      setBodyFont: (bodyFont) => set({ bodyFont }),
      setBorderRadius: (borderRadius) => set({ borderRadius }),
      resetTheme: () => set(defaultTheme),
    }),
    {
      name: 'lando-theme-storage',
    }
  )
);
