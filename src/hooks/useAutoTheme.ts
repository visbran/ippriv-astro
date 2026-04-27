import { useEffect, useState } from 'react';

export const useAutoTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Determine theme based on time (6am-6pm = light, otherwise dark)
  const getTimeBasedTheme = (): 'light' | 'dark' => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  };

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setTheme(newTheme);
  };

  // Toggle theme manually
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setIsManualOverride(true);
    localStorage.setItem('ippriv-theme', newTheme);
    localStorage.setItem('ippriv-theme-manual', 'true');
    applyTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ippriv-theme') as 'light' | 'dark' | null;
    const isManual = localStorage.getItem('ippriv-theme-manual') === 'true';

    if (savedTheme && isManual) {
      setIsManualOverride(true);
      applyTheme(savedTheme);
    } else {
      applyTheme(getTimeBasedTheme());
    }
  }, []);

  // Check time every minute for auto theme switching (only if not manually overridden)
  useEffect(() => {
    if (isManualOverride) return;

    const interval = setInterval(() => {
      applyTheme(getTimeBasedTheme());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isManualOverride]);

  // Reset to auto mode
  const resetToAuto = () => {
    setIsManualOverride(false);
    localStorage.removeItem('ippriv-theme');
    localStorage.removeItem('ippriv-theme-manual');
    applyTheme(getTimeBasedTheme());
  };

  return { theme, toggleTheme, isManualOverride, resetToAuto };
};
