import { getArticleBySlug } from '@/data/articleData';
import ArticleDetailClient from './ArticleDetailClient';

// Generování dynamických metadat pro každý článek
export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Článek nenalezen | HC Litvínov Lancers',
      description: 'Požadovaný článek nebyl nalezen.',
    };
  }

  // Určit absolutní URL obrázku
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.litvinov-lancers.cz'
    : 'http://localhost:3000';
  
  const imageUrl = article.featuredImage 
    ? `${baseUrl}${article.featuredImage}`
    : `${baseUrl}/og-default.jpg`;

  return {
    title: `${article.title} | HC Litvínov Lancers`,
    description: article.excerpt || article.content.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      type: 'article',
      publishedTime: article.date,
      authors: [article.author?.name || 'HC Litvínov Lancers'],
      url: `${baseUrl}/clanky/${params.slug}`,
      siteName: 'HC Litvínov Lancers',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
      locale: 'cs_CZ',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/clanky/${params.slug}`,
    },
    keywords: article.tags ? article.tags.join(', ') : 'HC Litvínov, Lancers, hokej, článek',
  };
}

// Server Component - pouze předává data do Client Component
export default function ArticleDetailPage({ params }) {
  return <ArticleDetailClient slug={params.slug} />;
}