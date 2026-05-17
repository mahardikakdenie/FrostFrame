import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/builder/ThemeProvider.tsx';

// 🚀 SECURITY FIX: Handle Trusted Types policy for Tiptap/ProseMirror
if ((window as any).trustedTypes && (window as any).trustedTypes.createPolicy) {
  if (!(window as any).trustedTypes.defaultPolicy) {
    try {
      (window as any).trustedTypes.createPolicy('default', {
        createHTML: (string: string) => string,
        // @ts-ignore
        createScript: (string: string) => string,
        // @ts-ignore
        createScriptURL: (string: string) => string,
      });
    } catch (e) {
      console.error('TrustedTypes policy creation failed:', e);
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
