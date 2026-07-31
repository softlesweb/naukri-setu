"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { notificationCategories, sectionMeta } from "../content";

export function MainNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    ...notificationCategories.map((category) => ({
      href: `/${category}`,
      label: sectionMeta[category].shortTitle,
    })),
  ];

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return <>
    <nav className="desktop-navigation" aria-label="Primary navigation">
      {links.map((link) => <Link className={isActive(link.href) ? "active" : ""} href={link.href} key={link.href}>{link.label}</Link>)}
    </nav>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen((value) => !value)}>
      <span /><span /><span />
    </button>
    <nav className={`mobile-navigation ${open ? "open" : ""}`} id="mobile-navigation" aria-label="Mobile navigation">
      {links.map((link) => <Link className={isActive(link.href) ? "active" : ""} href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}<span>›</span></Link>)}
      <Link className="mobile-search-link" href="/#updates" onClick={() => setOpen(false)}>Search updates<span>⌕</span></Link>
    </nav>
  </>;
}
