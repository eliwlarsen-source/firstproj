"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "News" },
  { href: "/best-ai", label: "Find AI" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 flex items-center gap-1 h-12">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                  : "text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
