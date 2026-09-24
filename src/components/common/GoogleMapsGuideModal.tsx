import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck, X, Copy, Check } from 'lucide-react';

interface GoogleMapsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryGoogle?: () => void;
}

export const GoogleMapsGuideModal: React.FC<GoogleMapsGuideModalProps> = ({
  isOpen,
  onClose,
  onRetryGoogle,
}) => {
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const devWildcard = `${currentOrigin}/*`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111113] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#27272A] flex items-center justify-between bg-[#141417]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#FFBF24]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Maps Setup Required</h3>
              <p className="text-xs text-[#A1A1AA]">
                Maps JavaScript API is not enabled on your Google Cloud Project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#CBD5E1]">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
            <span className="font-semibold text-white">Why did Google Maps show an error?</span> Google Maps returned <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">ApiNotActivatedMapError</code>. Your API key is valid for Places API searches, but the <strong>Maps JavaScript API</strong> must also be toggled on in your Google Cloud Console.
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
              Quick 3-Minute Fix:
            </h4>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-[#18181B] border border-[#27272A] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FFBF24]/20 border border-[#FFBF24]/40 text-[#FFBF24] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <div className="font-semibold text-white text-xs">Enable "Maps JavaScript API"</div>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Open the Google Cloud Console API Library and click the blue <strong>ENABLE</strong> button.
                </p>
                <a
                  href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] font-bold text-xs transition-colors"
                >
                  <span>Open Maps JavaScript API in Cloud Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-[#18181B] border border-[#27272A] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FFBF24]/20 border border-[#FFBF24]/40 text-[#FFBF24] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1">
                <div className="font-semibold text-white text-xs">Authorize This Preview URL (If Website Restricted)</div>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  If your key has <em>Application restrictions &gt; Websites</em>, add this preview URL wildcard to the allowed list:
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="text-[11px] font-mono bg-black/60 border border-[#27272A] px-2.5 py-1.5 rounded text-amber-300 flex-1 truncate select-all">
                    {devWildcard}
                  </code>
                  <button
                    onClick={() => copyToClipboard(devWildcard, 'url')}
                    className="px-2.5 py-1.5 rounded bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedUrl === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-[#18181B] border border-[#27272A] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </span>
              <div className="flex-1">
                <div className="font-semibold text-white text-xs">Automatic OSM Fallback Active</div>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  BizMind is currently running on the high-performance <strong>OpenStreetMap / Leaflet</strong> dark engine. You can search, view competitor density, analyze radius footprints, and jump directly to Google Maps right now with zero interruption!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#27272A] bg-[#141417] flex items-center justify-between gap-3">
          <div className="text-xs text-[#71717A] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OpenStreetMap fallback keeps data 100% accessible</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#27272A] hover:bg-[#27272A] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            {onRetryGoogle && (
              <button
                onClick={() => {
                  onClose();
                  onRetryGoogle();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] text-xs font-bold transition-colors cursor-pointer"
              >
                Try Google Maps
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
