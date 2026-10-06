import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CellNoor (v1.0 AML Flagship) | Sovereign Research Environment',
  description: 'Evidence-centric research operating environment targeting Menin-inhibitor escape in NPM1/KMT2A-driven AML stem-like cells.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-void text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
