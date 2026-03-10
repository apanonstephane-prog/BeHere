'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/artists', label: 'Artistes' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="BeHere"
            className="h-12 w-12 object-contain"
          />
          <span className="text-white font-bold text-lg tracking-wider">
            Be<span className="text-amber-400">Here</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? 'text-amber-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/rejoindre"
            className="text-sm px-4 py-1.5 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-colors"
          >
            Créer ma page
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-zinc-800 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm ${pathname === l.href ? 'text-amber-400' : 'text-zinc-400'}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/rejoindre"
            className="text-sm px-4 py-2 bg-amber-500 text-black font-semibold rounded-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            Créer ma page
          </Link>
        </div>
      )}
    </nav>
  );
}
