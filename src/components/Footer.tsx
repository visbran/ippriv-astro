import { Shield } from 'lucide-react';

const GROUPS = [
  {
    title: 'Tools',
    links: [
      { href: '/ip-lookup', label: 'IP Lookup' },
      { href: '/api-docs', label: 'API Docs' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'IPPriv',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: 'https://github.com/visbran', label: 'GitHub', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms' },
      { href: '/legal', label: 'Legal notice' },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <div className="section-container">
        <div className="grid gap-10 md:grid-cols-[1fr_auto]">
          {/* Logo & Copyright */}
          <div className="flex flex-col gap-2">
            <a href="/" className="flex w-fit items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-foreground">IPPriv</span>
            </a>
            <p className="text-sm text-muted-foreground">
              © {currentYear} IPPriv. Privacy-focused IP tools.
            </p>
          </div>

          {/* Link groups */}
          <nav className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3" aria-label="Footer navigation">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-medium text-foreground">{group.title}</h2>
                <ul className="mt-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex min-h-11 sm:min-h-9 items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
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
      </div>
    </footer>
  );
};

export default Footer;
