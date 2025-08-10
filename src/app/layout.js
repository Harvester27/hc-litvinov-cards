import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production' 
      ? 'https://hc-litvinov-lancers.cz' // Zde dej svoji budoucí doménu
      : 'http://localhost:3000'
  ),
  title: 'HC Litvínov Lancers - Oficiální stránky',
  description: 'Oficiální stránky hokejového klubu HC Litvínov Lancers. Novinky, soupisky, tabulky, historie a sběratelská karetní hra HC Cards.',
  keywords: 'HC Litvínov, Lancers, hokej, KHLA, české hokejové kartičky, HC Cards',
  openGraph: {
    title: 'HC Litvínov Lancers',
    description: 'Oficiální stránky hokejového klubu HC Litvínov Lancers',
    images: ['/og-image.jpg'],
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}