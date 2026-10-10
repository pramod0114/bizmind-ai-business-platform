import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import './utils/leafletPatch.ts';

// Early interceptor for Google Maps authentication & referrer error handling
if (typeof window !== 'undefined') {
  const origConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const msg = args.map((a) => String(a)).join(' ');
    if (
      msg.includes('RefererNotAllowedMapError') ||
      msg.includes('referer-not-allowed-map-error') ||
      msg.includes('ApiNotActivatedMapError') ||
      msg.includes('DeletedApiProjectMapError') ||
      msg.includes('InvalidKeyMapError')
    ) {
      console.warn('[BizMind Google Maps Referrer/Auth Notice]', ...args);
      if (typeof (window as any).gm_authFailure === 'function') {
        try {
          (window as any).gm_authFailure();
        } catch {}
      }
      return;
    }
    if (
      msg.includes("Cannot read properties of null (reading 'offsetWidth')") ||
      msg.includes('getSizedParentNode')
    ) {
      console.warn('[BizMind Leaflet Notice] Suppressed detached node offsetWidth notice');
      return;
    }
    origConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

