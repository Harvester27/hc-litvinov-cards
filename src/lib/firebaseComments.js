// 🔥 Firebase Comments Management
// Tento soubor obsahuje všechny funkce pro práci s komentáři

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  getDocs, 
  deleteDoc, 
  updateDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';

// ========================================
// KOMENTÁŘE
// ========================================

// Přidat komentář
export const addComment = async (articleId, userId, userDisplayName, userAvatar, content) => {
  try {
    const commentData = {
      articleId,
      userId,
      userDisplayName,
      userAvatar: userAvatar || null,
      content,
      createdAt: serverTimestamp(),
      editedAt: null,
      likes: 0,
      likedBy: [],
      isDeleted: false
    };
    
    const docRef = await addDoc(collection(db, 'comments'), commentData);
    
    return {
      id: docRef.id,
      ...commentData,
      createdAt: new Date() // Pro okamžité zobrazení
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Získat komentáře pro článek
export const getComments = async (articleId) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Real-time listener pro komentáře
export const subscribeToComments = (articleId, callback) => {
  const q = query(
    collection(db, 'comments'),
    where('articleId', '==', articleId),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(comments);
  });
};

// Upravit komentář
export const editComment = async (commentId, newContent) => {
  try {
    await updateDoc(doc(db, 'comments', commentId), {
      content: newContent,
      editedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error editing comment:', error);
    throw error;
  }
};

// Smazat komentář (soft delete)
export const deleteComment = async (commentId) => {
  try {
    await updateDoc(doc(db, 'comments', commentId), {
      isDeleted: true,
      deletedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Lajknout/odlajknout komentář
export const toggleCommentLike = async (commentId, userId) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      throw new Error('Komentář neexistuje');
    }
    
    const data = commentDoc.data();
    const likedBy = data.likedBy || [];
    
    let newLikedBy;
    let newLikes;
    
    if (likedBy.includes(userId)) {
      // Odebrat like
      newLikedBy = likedBy.filter(id => id !== userId);
      newLikes = Math.max(0, (data.likes || 0) - 1);
    } else {
      // Přidat like
      newLikedBy = [...likedBy, userId];
      newLikes = (data.likes || 0) + 1;
    }
    
    await updateDoc(commentRef, {
      likedBy: newLikedBy,
      likes: newLikes
    });
    
    return {
      liked: !likedBy.includes(userId),
      likes: newLikes
    };
  } catch (error) {
    console.error('Error toggling comment like:', error);
    throw error;
  }
};

// Získat počet komentářů pro článek
export const getCommentCount = async (articleId) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId),
      where('isDeleted', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
};

// Získat nejnovější komentáře (pro dashboard)
export const getRecentComments = async (limitCount = 5) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const comments = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting recent comments:', error);
    return [];
  }
};

// Získat komentáře uživatele
export const getUserComments = async (userId) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('userId', '==', userId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting user comments:', error);
    return [];
  }
};

// ========================================
// HELPER FUNKCE
// ========================================

// Formátovat datum komentáře
export const formatCommentDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'právě teď';
  if (minutes < 60) return `před ${minutes} ${minutes === 1 ? 'minutou' : minutes < 5 ? 'minutami' : 'minutami'}`;
  if (hours < 24) return `před ${hours} ${hours === 1 ? 'hodinou' : hours < 5 ? 'hodinami' : 'hodinami'}`;
  if (days < 7) return `před ${days} ${days === 1 ? 'dnem' : days < 5 ? 'dny' : 'dny'}`;
  
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

// Validace komentáře
export const validateComment = (content) => {
  if (!content || content.trim().length === 0) {
    return 'Komentář nemůže být prázdný';
  }
  
  if (content.length > 1000) {
    return 'Komentář může mít maximálně 1000 znaků';
  }
  
  // Kontrola spamu (například opakující se znaky)
  const repeatedChars = /(.)\1{9,}/;
  if (repeatedChars.test(content)) {
    return 'Komentář obsahuje příliš mnoho opakujících se znaků';
  }
  
  return null; // Validní
};