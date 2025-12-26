import React from 'react';
import { X, Type, LayoutTemplate } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl z-10 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
             <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
               <Type size={16} /> Font Size
             </label>
             <div className="flex bg-gray-100 rounded-xl p-1">
               {(['small', 'medium', 'large'] as const).map(size => (
                 <button
                   key={size}
                   onClick={() => onUpdateSettings({ ...settings, fontSize: size })}
                   className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                     settings.fontSize === size ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                   }`}
                 >
                   {size}
                 </button>
               ))}
             </div>
          </div>

          {/* Spacing / Compact */}
          <div>
             <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
               <LayoutTemplate size={16} /> View Density
             </label>
             <div className="flex bg-gray-100 rounded-xl p-1">
               <button
                 onClick={() => onUpdateSettings({ ...settings, compact: false })}
                 className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                   !settings.compact ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 Normal
               </button>
               <button
                 onClick={() => onUpdateSettings({ ...settings, compact: true })}
                 className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                   settings.compact ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 Compact
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
