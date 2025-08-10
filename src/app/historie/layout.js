// app/historie/layout.js
export const metadata = {
    metadataBase: new URL('https://www.litvinov-lancers.cz'),
    title: 'Historie klubu - HC Litvínov Lancers',
    description:
      'Od roku 2006 s láskou k hokeji! Kompletní historie klubu HC Litvínov Lancers od založení AHC Litvínov až po současné úspěchy v KHLA.',
    alternates: { canonical: '/historie' },
    openGraph: {
      title: 'Historie klubu - HC Litvínov Lancers',
      description:
        'Od roku 2006 s láskou k hokeji! 19 let nezlomné vášně, přátelství a hokejových bitev.',
      url: '/historie',
      siteName: 'HC Litvínov Lancers',
      images: [
        {
          // ABSOLUTNÍ URL – to je pro Facebook klíčové
          url: 'https://www.litvinov-lancers.cz/images/historie/zrozeni4.jpg',
          alt: 'Historie HC Litvínov Lancers',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Historie klubu - HC Litvínov Lancers',
      description: 'Od roku 2006 s láskou k hokeji! 19 let historie.',
      images: ['https://www.litvinov-lancers.cz/images/historie/zrozeni4.jpg'],
    },
  };
  
  export default function HistorieLayout({ children }) {
    return children;
  }
  