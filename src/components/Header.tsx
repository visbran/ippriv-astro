import { useState } from 'react';
import { Moon, Sun, Shield, Menu, X } from 'lucide-react';
import { useAutoTheme } from '@/hooks/useAutoTheme';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it Works' },
  { href: '/api-docs', label: 'API Docs' },
  { href: '/blog', label: 'Blog' },
];

const Header = () => {
  const { theme, toggleTheme } = useAutoTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="section-container">
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          <a href="/" className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-primary" strokeWidth={2} aria-hidden="true" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">IPPriv</span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="/ip-lookup"
              className="hidden sm:inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px transition-colors"
            >
              Try IP Lookup
            </a>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        <div id="mobile-menu" hidden={!menuOpen} className="md:hidden border-t border-border py-3">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/ip-lookup"
              className="sm:hidden mt-2 inline-flex justify-center px-3.5 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground"
            >
              Try IP Lookup
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
