import { getArticleBySlug } from '@/data/articleData';
import ArticleDetailClient from './ArticleDetailClient';

const siteUrl = 'https://www.litvinov-lancers.cz';

const isImagePath = (value) => typeof value === 'string'
  && /^(\/(?!\/)|https?:\/\/)/i.test(value)
  && /\.(avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i.test(value);

// Generování dynamických metadat pro každý článek
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Článek nenalezen | HC Litvínov Lancers',
      description: 'Požadovaný článek nebyl nalezen.',
    };
  }

  const articleUrl = `${siteUrl}/clanky/${slug}`;
  const imagePath = [article.socialImage, article.featuredImage, article.image]
    .find(isImagePath) || '/images/loga/lancers-logo.png';
  const imageUrl = new URL(imagePath, siteUrl).href;
  const description = article.excerpt || (article.content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const publishedAt = new Date(article.publishedAt);
  const publishedTime = Number.isNaN(publishedAt.getTime())
    ? undefined
    : publishedAt.toISOString();

  return {
    metadataBase: new URL(siteUrl),
    title: `${article.title} | HC Litvínov Lancers`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime,
      authors: [article.author?.name || 'HC Litvínov Lancers'],
      url: articleUrl,
      siteName: 'HC Litvínov Lancers',
      images: [
        {
          url: imageUrl,
          ...(imagePath === article.socialImage ? { width: 1200, height: 630 } : {}),
          alt: article.imageAlt || article.title,
        }
      ],
      locale: 'cs_CZ',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: articleUrl,
    },
    keywords: article.tags ? article.tags.join(', ') : 'HC Litvínov, Lancers, hokej, článek',
  };
}

// Server Component - pouze předává data do Client Component
export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  return <ArticleDetailClient slug={slug} />;
}
