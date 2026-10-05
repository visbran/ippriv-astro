import { motion } from 'framer-motion';
import { Moon, Sun, Shield, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAutoTheme } from '@/hooks/useAutoTheme';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const NAV = [
  { href: '/ip-lookup', label: 'IP Lookup' },
  { href: '/blog', label: 'Blog' },
  { href: '/api-docs', label: 'API Docs' },
];

const MORE = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/contact', label: 'Contact' },
];

const Header = ({ path = '' }: { path?: string }) => {
  const { theme, toggleTheme } = useAutoTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const norm = path.replace(/\/$/, '') || '/';
  const isCurrent = (href: string) => norm === href || norm.startsWith(`${href}/`);
  // The homepage has its own lookup form right under the readout
  const showCta = norm !== '/';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-card bg-background/90 border-b"
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16" aria-label="Main">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              IPPriv
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV.filter((l) => l.href !== '/ip-lookup').map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={isCurrent(l.href) ? 'page' : undefined}
                className="text-sm text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:font-medium transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-200"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-foreground" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-foreground" aria-hidden="true" />
              )}
            </button>
            {showCta && (
              <a
                href="/ip-lookup"
                className="hidden md:inline-flex h-11 items-center px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Look up an IP
              </a>
            )}

            {/* Mobile menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-foreground" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[min(20rem,85vw)] flex-col gap-0 p-0">
                <SheetTitle className="flex h-16 items-center border-b border-border px-5 text-base font-semibold">
                  Menu
                </SheetTitle>
                <nav aria-label="Mobile" className="flex flex-col px-3 py-3">
                  {NAV.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      aria-current={isCurrent(l.href) ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-12 items-center rounded-lg px-3 text-base text-foreground hover:bg-secondary aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground aria-[current=page]:font-medium transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <nav aria-label="More" className="mx-3 flex flex-col border-t border-border px-0 py-3">
                  {MORE.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      aria-current={isCurrent(l.href) ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center rounded-lg px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:font-medium transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto border-t border-border p-5">
                  <a
                    href="/ip-lookup"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Look up an IP
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
