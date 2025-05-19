import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Price Grid',
  description: 'Responsive price table using Next.js + TailwindCSS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
