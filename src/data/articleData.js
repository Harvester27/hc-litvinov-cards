// /data/articleData.js
// Hlavní soubor pro správu všech článků

// Import jednotlivých článků z jejich souborů
import { articleHHCupLitvinov2025 } from './articles/article-hh-cup-litvinov-2025';
import { articleDvaTurnajeLitvinovOstrov2025 } from './articles/article-dva-turnaje-litvinov-ostrov-2025';
import { articleStraubing2025 } from './articles/article-straubing-2025';

// Databáze všech článků
export const articles = [
  articleHHCupLitvinov2025,
  articleDvaTurnajeLitvinovOstrov2025,
  articleStraubing2025
];

// Funkce pro získání článku podle ID
export const getArticleById = (id) => {
  return articles.find(article => article.id === id);
};

// Funkce pro získání článku podle slug
export const getArticleBySlug = (slug) => {
  return articles.find(article => article.slug === slug);
};

// Funkce pro získání všech článků
export const getAllArticles = () => {
  return articles.sort((a, b) => b.publishedAt - a.publishedAt);
};

// Funkce pro získání doporučených článků
export const getFeaturedArticles = () => {
  return articles.filter(article => article.featured);
};

// Funkce pro získání článků podle kategorie
export const getArticlesByCategory = (category) => {
  return articles.filter(article => article.category === category);
};

// Funkce pro získání nejnovějších článků
export const getLatestArticles = (count = 5) => {
  return getAllArticles().slice(0, count);
};

// Funkce pro získání souvisejících článků
export const getRelatedArticles = (articleId, count = 3) => {
  const currentArticle = getArticleById(articleId);
  if (!currentArticle) return [];
  
  // Najdeme články se stejnou kategorií nebo podobnými tagy
  const related = articles
    .filter(article => 
      article.id !== articleId && 
      (article.category === currentArticle.category ||
       article.tags?.some(tag => currentArticle.tags?.includes(tag)))
    )
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, count);
  
  return related;
};

// Export pro kompatibilitu
export default {
  articles,
  getArticleById,
  getArticleBySlug,
  getAllArticles,
  getFeaturedArticles,
  getArticlesByCategory,
  getLatestArticles,
  getRelatedArticles
};