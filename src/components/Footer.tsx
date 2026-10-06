import { Shield, Github } from 'lucide-react';

const linkGroups = [
  {
    title: 'Tools',
    links: [
      { href: '/ip-lookup', label: 'IP Lookup' },
      { href: '/api-docs', label: 'API Docs' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms' },
      { href: '/legal', label: 'Legal Notice' },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="section-container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-3">
            <a href="/" className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="text-[15px] font-semibold tracking-tight text-foreground">IPPriv</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-[32ch]">
              Free IP lookup and geolocation. No account, no ads.
            </p>
            <a
              href="https://github.com/visbran"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit p-2 -ml-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <nav className="contents" aria-label="Footer navigation">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-medium text-foreground mb-3">{group.title}</p>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground">
          © {currentYear} IPPriv
        </p>
      </div>
    </footer>
  );
};

export default Footer;
