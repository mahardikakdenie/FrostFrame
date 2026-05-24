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
  sectionMargin: string;
  sectionPadding: string;
  colorMode: 'light' | 'dark';
  
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setHeadingFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  setBorderRadius: (radius: string) => void;
  setSectionMargin: (margin: string) => void;
  setSectionPadding: (padding: string) => void;
  setActiveTheme: (theme: string) => void;
  applyThemePreset: (themeName: string) => void;
  toggleColorMode: () => void;
  resetTheme: () => void;
}

export const THEME_PRESETS: Record<string, any> = {
  frosted: {
    activeTheme: 'frosted',
    primaryColor: '#6366f1',
    secondaryColor: '#f472b6',
    accentColor: '#34d399',
    headingFont: 'Outfit, Inter, sans-serif',
    borderRadius: '1.5rem',
    sectionMargin: '0rem',
    sectionPadding: '6rem 2rem',
  },
  genz: {
    activeTheme: 'genz',
    primaryColor: '#6366f1',
    secondaryColor: '#f472b6',
    accentColor: '#34d399',
    headingFont: 'Plus Jakarta Sans, Inter, sans-serif',
    borderRadius: '2rem',
    sectionMargin: '0rem',
    sectionPadding: '8rem 2rem',
  },
  bootstrap: {
    activeTheme: 'bootstrap',
    primaryColor: '#0d6efd',
    secondaryColor: '#212529',
    accentColor: '#198754',
    headingFont: 'system-ui, sans-serif',
    borderRadius: '0.375rem',
    sectionMargin: '0rem',
    sectionPadding: '4rem 1rem',
  },
  material: {
    activeTheme: 'material',
    primaryColor: '#6200ea',
    secondaryColor: '#121212',
    accentColor: '#03dac6',
    headingFont: '"Roboto", sans-serif',
    borderRadius: '0.25rem',
    sectionMargin: '0.5rem',
    sectionPadding: '5rem 2rem',
  },
  flat: {
    activeTheme: 'flat',
    primaryColor: '#2c3e50',
    secondaryColor: '#34495e',
    accentColor: '#1abc9c',
    headingFont: '"Lato", sans-serif',
    borderRadius: '0px',
    sectionMargin: '0rem',
    sectionPadding: '3rem 1.5rem',
  }
};

const defaultTheme = {
  activeTheme: 'frosted',
  primaryColor: '#6366f1',
  secondaryColor: '#f472b6',
  accentColor: '#34d399',
  headingFont: 'Outfit, Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  borderRadius: '1.5rem',
  sectionMargin: '0rem',
  sectionPadding: '6rem 2rem',
  colorMode: 'light' as const,
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
      setSectionMargin: (sectionMargin) => set({ sectionMargin }),
      setSectionPadding: (sectionPadding) => set({ sectionPadding }),
      setActiveTheme: (activeTheme) => set({ activeTheme }),
      applyThemePreset: (name) => {
        const preset = THEME_PRESETS[name];
        if (preset) {
           set({ ...preset });
        }
      },
      toggleColorMode: () => set((state) => ({ 
        colorMode: state.colorMode === 'light' ? 'dark' : 'light' 
      })),
      resetTheme: () => set(defaultTheme),
    }),
    {
      name: 'lando-theme-storage',
    }
  )
);
