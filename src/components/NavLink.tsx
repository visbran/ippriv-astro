import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, to, href, ...props }, ref) => {
    const linkHref = to || href || '#';
    
    return (
      <a
        ref={ref}
        href={linkHref}
        className={cn(className)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
