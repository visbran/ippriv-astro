import { motion } from 'framer-motion';
import { Moon, Sun, Shield } from 'lucide-react';
import { useAutoTheme } from '@/hooks/useAutoTheme';

const Header = () => {
  const { theme, toggleTheme } = useAutoTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b"
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              IPPriv
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="/api-docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              API Docs
            </a>
            <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-foreground" />
              )}
            </button>
            <a
              href="/ip-lookup"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
