const title = 'Tipovačka – Lancers vs. HC Glacier Wolves';
const description = 'Tipuj zdarma zápas Lancers proti HC Glacier Wolves. Pět otázek a společná tabulka bodů. Uzávěrka 26. 9. 2026 v 19:15 českého času.';
const url = 'https://www.litvinov-lancers.cz/games/tipovacka';
const image = 'https://www.litvinov-lancers.cz/images/clanky/lancers-glacier-wolves-2026.jpg';
const imageAlt = 'Litvínov Lancers proti HC Glacier Wolves';

export const metadata = {
  metadataBase: new URL('https://www.litvinov-lancers.cz'),
  title: `${title} | HC Litvínov Lancers`,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'HC Litvínov Lancers',
    locale: 'cs_CZ',
    type: 'website',
    images: [{
      url: image,
      width: 1200,
      height: 675,
      type: 'image/jpeg',
      alt: imageAlt,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: image, alt: imageAlt }],
  },
};

export default function TipovackaLayout({ children }) {
  return children;
}
