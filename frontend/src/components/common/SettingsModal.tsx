import React, { useState } from 'react';
import { X, Sliders, ShieldCheck, Key, CheckCircle, Loader2 } from 'lucide-react';
import { SettingsStatus } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsStatus | null;
  onSaveSettings: (keys: { tinyfish_api_key?: string; gemini_api_key?: string; groq_api_key?: string }) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [tinyfishKey, setTinyfishKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const payload: any = {};
    if (tinyfishKey.trim()) payload.tinyfish_api_key = tinyfishKey.trim();
    if (geminiKey.trim()) payload.gemini_api_key = geminiKey.trim();
    if (groqKey.trim()) payload.groq_api_key = groqKey.trim();

    try {
      await onSaveSettings(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-[#232936] rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#212735]">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">API Credentials & Provider Status</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* TinyFish */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-mono font-semibold text-zinc-300">TinyFish API Key (Search & Web Extraction)</label>
              <span className={`text-[10px] font-mono ${settings?.tinyfish.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {settings?.tinyfish.configured ? `Active (${settings.tinyfish.masked_key})` : 'Sandbox Mode'}
              </span>
            </div>
            <input
              type="password"
              placeholder="Paste TINYFISH_API_KEY..."
              value={tinyfishKey}
              onChange={(e) => setTinyfishKey(e.target.value)}
              className="w-full rounded bg-[#07090e] border border-[#1f2535] text-white p-2.5 focus:border-emerald-500 font-mono"
            />
            <p className="text-[10px] text-zinc-500 mt-1">Free search & fetch queries at api.search.tinyfish.ai</p>
          </div>

          {/* Gemini */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-mono font-semibold text-zinc-300">Google Gemini API Key (Evaluation & Strategy)</label>
              <span className={`text-[10px] font-mono ${settings?.gemini.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {settings?.gemini.configured ? `Active (${settings.gemini.masked_key})` : 'Sandbox Mode'}
              </span>
            </div>
            <input
              type="password"
              placeholder="Paste GEMINI_API_KEY..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full rounded bg-[#07090e] border border-[#1f2535] text-white p-2.5 focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Groq */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-mono font-semibold text-zinc-300">Groq API Key (Brutally Honest Critic)</label>
              <span className={`text-[10px] font-mono ${settings?.groq.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {settings?.groq.configured ? `Active (${settings.groq.masked_key})` : 'Sandbox Mode'}
              </span>
            </div>
            <input
              type="password"
              placeholder="Paste GROQ_API_KEY..."
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="w-full rounded bg-[#07090e] border border-[#1f2535] text-white p-2.5 focus:border-emerald-500 font-mono"
            />
          </div>

          {success && (
            <div className="p-2.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>API credentials updated and active!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center space-x-1.5 shadow-glow-sm cursor-pointer"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

