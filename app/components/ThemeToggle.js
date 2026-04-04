'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 group ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
      )}
    </button>
  );
}
