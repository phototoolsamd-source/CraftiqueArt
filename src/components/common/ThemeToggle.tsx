import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, isDark, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const options: { mode: ThemeMode; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      mode: 'system',
      label: 'સિસ્ટમ મુજબ (System Auto)',
      sub: isDark ? 'Auto (Currently Dark)' : 'Auto (Currently Light)',
      icon: <Monitor className="w-4 h-4 text-amber-700 dark:text-amber-400" />
    },
    {
      mode: 'light',
      label: 'લાઇટ મોડ (Light)',
      sub: 'Always light theme',
      icon: <Sun className="w-4 h-4 text-amber-500" />
    },
    {
      mode: 'dark',
      label: 'ડાર્ક મોડ (Dark)',
      sub: 'Always dark theme',
      icon: <Moon className="w-4 h-4 text-indigo-400" />
    }
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2 sm:p-2.5 rounded-full bg-white dark:bg-stone-800 border border-[#E2D8C9] dark:border-stone-700 text-slate-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer group"
        title={`Theme: ${theme === 'system' ? `System Auto (${isDark ? 'Dark' : 'Light'})` : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}`}
        aria-label="Toggle Dark / Light / System Mode"
      >
        {theme === 'system' ? (
          <div className="relative flex items-center justify-center">
            <Monitor className="w-4 h-4 text-amber-800 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-stone-900" />
          </div>
        ) : isDark ? (
          <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20 group-hover:scale-110 transition-transform" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 fill-amber-600/20 group-hover:scale-110 transition-transform" />
        )}

        {showLabel && (
          <span className="text-xs font-semibold capitalize hidden sm:inline">
            {theme === 'system' ? 'Auto' : theme}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1A1816] border border-[#E8DFD0] dark:border-stone-800 shadow-xl py-1.5 z-50 animate-scale-in">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-stone-800/80 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400">
              થીમ પસંદગી (Theme Mode)
            </span>
          </div>

          {options.map((opt) => {
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold'
                    : 'text-slate-700 dark:text-stone-300 hover:bg-slate-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-stone-500 font-normal">
                      {opt.sub}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
