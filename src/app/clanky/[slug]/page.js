'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ArticleQuiz from '@/components/ArticleQuiz';
import { getArticleBySlug } from '@/data/articleData';
import { 
  addComment, 
  subscribeToComments, 
  deleteComment,
  formatCommentDate,
  validateComment 
} from '@/lib/firebaseComments';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/lib/firebaseProfile';
import { 
  ArrowLeft, Calendar, User, Eye, Heart, Share2, 
  MessageCircle, Send, Trash2, Edit2, AlertCircle,
  Loader, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Načíst článek
  useEffect(() => {
    const loadArticle = () => {
      const articleData = getArticleBySlug(params.slug);
      if (!articleData) {
        router.push('/clanky');
        return;
      }
      setArticle(articleData);
      setLoading(false);
    };
    
    loadArticle();
  }, [params.slug, router]);

  // Načíst profil uživatele
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const profileData = await getUserProfile(user.uid);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Subscribovat na komentáře
  useEffect(() => {
    if (!article) return;

    const unsubscribe = subscribeToComments(article.id, (newComments) => {
      setComments(newComments);
    });

    return () => unsubscribe();
  }, [article]);

  // Odeslat komentář
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Pro přidání komentáře se musíte přihlásit');
      return;
    }

    const validationError = validateComment(newComment);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await addComment(
        article.id,
        user.uid,
        profile?.displayName || 'Hráč',
        profile?.avatar || null,
        newComment
      );

      setNewComment('');
      setSuccess('Komentář byl přidán!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Nepodařilo se přidat komentář');
    } finally {
      setSubmitting(false);
    }
  };

  // Smazat komentář
  const handleDeleteComment = async (commentId) => {
    if (!confirm('Opravdu chcete smazat tento komentář?')) return;

    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Nepodařilo se smazat komentář');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Loader className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!article) return null;

  // Zkontrolovat, zda článek má kvíz
  const hasQuiz = article.slug === 'straubing-2025-hokejovy-vikend';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Navigace zpět */}
          <Link href="/clanky" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-6">
            <ArrowLeft size={20} />
            <span>Zpět na články</span>
          </Link>

          {/* Článek */}
          <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Featured Image */}
            {article.featuredImage && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  {article.category}
                </span>
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar size={16} />
                  {article.date}
                </span>
              </div>
              
              <h1 className="text-4xl font-black text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{article.author.name}</div>
                    <div className="text-sm text-gray-500">Autor článku</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye size={18} />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={18} />
                    {article.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={18} />
                    {comments.length}
                  </span>
                  <button className="hover:text-red-600 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Obsah článku */}
            <div className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Tagy */}
            {article.tags && article.tags.length > 0 && (
              <div className="px-8 pb-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 text-sm">Tagy:</span>
                  {article.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* KVÍZ KOMPONENTA - zobrazí se pouze pro článek o Straubingu */}
          {hasQuiz && (
            <ArticleQuiz quizId="straubing-2025-quiz" />
          )}

          {/* Sekce komentářů */}
          <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle size={28} />
                Komentáře ({comments.length})
              </h2>
            </div>

            {/* Formulář pro přidání komentáře */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="p-6 border-b border-gray-200">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center flex-shrink-0">
                    {profile?.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Napište komentář..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                      maxLength={1000}
                    />
                    
                    {error && (
                      <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}
                    
                    {success && (
                      <div className="mt-2 text-green-600 text-sm flex items-center gap-1">
                        <CheckCircle size={16} />
                        {success}
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {newComment.length}/1000 znaků
                      </span>
                      <button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <Loader className="animate-spin" size={18} />
                        ) : (
                          <Send size={18} />
                        )}
                        Odeslat
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <p className="text-gray-600 text-center">
                  Pro přidání komentáře se musíte{' '}
                  <Link href="/games/cards" className="text-red-600 font-semibold hover:text-red-700">
                    přihlásit
                  </Link>
                </p>
              </div>
            )}

            {/* Seznam komentářů */}
            <div className="p-6">
              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center flex-shrink-0">
                        {comment.userAvatar ? (
                          <Image
                            src={comment.userAvatar}
                            alt={comment.userDisplayName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {comment.userDisplayName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCommentDate(comment.createdAt)}
                              {comment.editedAt && ' (upraveno)'}
                            </div>
                          </div>
                          
                          {user && user.uid === comment.userId && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        
                        <div className="mt-2 text-gray-700">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Zatím žádné komentáře</p>
                  <p className="text-gray-400 text-sm mt-1">Buďte první, kdo okomentuje tento článek!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}