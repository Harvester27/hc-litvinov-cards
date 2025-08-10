export const metadata = {
  title: 'Historie klubu - HC Litvínov Lancers',
  description: 'Od roku 2006 s láskou k hokeji! Kompletní historie klubu HC Litvínov Lancers od založení AHC Litvínov přes éru Lancers až po současné úspěchy v KHLA.',
  openGraph: {
    title: 'Historie klubu - HC Litvínov Lancers',
    description: 'Od roku 2006 s láskou k hokeji! 19 let nezlomné vášně, přátelství a hokejových bitev.',
    url: 'https://hc-litvinov-lancers.cz/historie',
    siteName: 'HC Litvínov Lancers',
    images: [
      {
        url: '/images/historie/zrozeni4.jpg',
        width: 1200,
        height: 800,
        alt: 'Historie HC Litvínov Lancers - Tým Litvínov Lancers',
      }
    ],
    locale: 'cs_CZ',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Historie klubu - HC Litvínov Lancers',
    description: 'Od roku 2006 s láskou k hokeji! 19 let historie.',
    images: ['/images/historie/zrozeni4.jpg'],
  },
};

export default function HistorieLayout({ children }) {
  return children;
}