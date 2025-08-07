import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HC Litvínov Cards - Sbírej hokejové kartičky!',
  description: 'Oficiální sběratelská karetní hra HC Litvínov. Sbírej, vyměňuj a vyhraj!',
  keywords: 'HC Litvínov, hokejové karty, sběratelská hra, české hokejové kartičky',
  openGraph: {
    title: 'HC Litvínov Cards',
    description: 'Sbírej hokejové kartičky HC Litvínov!',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body className={inter.className}>{children}</body>
    </html>
  );
}