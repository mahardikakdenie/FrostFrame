import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  activeTheme: string;
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
  setActiveTheme: (theme: string) => void;
  applyThemePreset: (themeName: string) => void;
  resetTheme: () => void;
}

export const THEME_PRESETS: Record<string, any> = {
  lando: {
    activeTheme: 'lando',
    primaryColor: '#4f46e5',
    secondaryColor: '#0f172a',
    accentColor: '#10b981',
    headingFont: 'Inter, sans-serif',
    borderRadius: '0.75rem',
  },
  bootstrap: {
    activeTheme: 'bootstrap',
    primaryColor: '#0d6efd',
    secondaryColor: '#212529',
    accentColor: '#198754',
    headingFont: 'system-ui, sans-serif',
    borderRadius: '0.375rem',
  },
  material: {
    activeTheme: 'material',
    primaryColor: '#6200ea',
    secondaryColor: '#121212',
    accentColor: '#03dac6',
    headingFont: '"Roboto", sans-serif',
    borderRadius: '0.25rem',
  },
  flat: {
    activeTheme: 'flat',
    primaryColor: '#2c3e50',
    secondaryColor: '#34495e',
    accentColor: '#1abc9c',
    headingFont: '"Lato", sans-serif',
    borderRadius: '0px',
  }
};

const defaultTheme = {
  activeTheme: 'lando',
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
      setActiveTheme: (activeTheme) => set({ activeTheme }),
      applyThemePreset: (name) => {
        const preset = THEME_PRESETS[name];
        if (preset) {
           set({ ...preset });
        }
      },
      resetTheme: () => set(defaultTheme),
    }),
    {
      name: 'lando-theme-storage',
    }
  )
);
