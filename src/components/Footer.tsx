import { Shield, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <a href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">IPPriv</span>
            </a>
            <p className="text-sm text-muted-foreground">
              © {currentYear} IPPriv - Privacy-focused IP tools
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm" aria-label="Footer navigation">
            <a href="/ip-lookup" className="text-muted-foreground hover:text-foreground transition-colors">
              IP Lookup
            </a>
            <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
              API Docs
            </a>
            <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
