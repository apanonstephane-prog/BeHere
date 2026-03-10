import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'BeHere — La plateforme des artistes indépendants',
  description:
    "BeHere rassemble tous les artistes indépendants en un seul endroit. Musique, photos, clips, biographie — tout est là.",
  openGraph: {
    title: 'BeHere',
    description: 'La plateforme des artistes indépendants',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-black text-white min-h-screen">
        <Nav />
        <main className="pt-14 font-sans">{children}</main>
      </body>
    </html>
  );
}
