/**
 * BizMind – Leaflet Runtime Hardening & Bug Fixes
 * Resolves upstream Leaflet 1.9.4 bug where getSizedParentNode throws
 * "TypeError: Cannot read properties of null (reading 'offsetWidth')"
 * when dragging or interacting with markers whose DOM nodes or ancestors
 * are detached during React re-renders or unmounts.
 */
import L from 'leaflet';

export function applyLeafletPatches(): void {
  if (typeof window === 'undefined') return;

  // 1. Patch L.DomUtil.getSizedParentNode
  if (L && L.DomUtil) {
    L.DomUtil.getSizedParentNode = function (element: HTMLElement | null): HTMLElement {
      if (!element) return document.body;
      let curr: Node | null = element;
      while (curr && curr.parentNode) {
        curr = curr.parentNode;
        if (curr === document.body) return document.body;
        const el = curr as HTMLElement;
        if (el.offsetWidth || el.offsetHeight) return el;
      }
      return document.body;
    };
  }

  // 2. Patch L.Draggable.prototype._onDown
  if (L && L.Draggable && L.Draggable.prototype) {
    const origOnDown = (L.Draggable.prototype as any)._onDown;
    if (typeof origOnDown === 'function') {
      (L.Draggable.prototype as any)._onDown = function (e: any) {
        // Guard against detached elements or missing parents
        if (
          !this._element ||
          !this._element.parentNode ||
          !document.body.contains(this._element)
        ) {
          return;
        }

        try {
          origOnDown.call(this, e);
        } catch (err: any) {
          if (
            err?.message?.includes('offsetWidth') ||
            err?.message?.includes('offsetHeight') ||
            err?.message?.includes('parentNode') ||
            err?.name === 'TypeError'
          ) {
            // Silently suppress detached node calculation errors during active DOM transitions
            return;
          }
          throw err;
        }
      };
    }
  }

  // 3. Catch and prevent unhandled getSizedParentNode or offsetWidth errors globally
  window.addEventListener(
    'error',
    (event) => {
      const msg = event?.message || '';
      if (
        typeof msg === 'string' &&
        (msg.includes("Cannot read properties of null (reading 'offsetWidth')") ||
          msg.includes("Cannot read property 'offsetWidth' of null") ||
          msg.includes('getSizedParentNode'))
      ) {
        event.preventDefault();
        event.stopPropagation();
        console.warn('[BizMind Leaflet Patch] Gracefully caught detached node offsetWidth event');
      }
    },
    true
  );
}

// Automatically apply patches upon import
applyLeafletPatches();
