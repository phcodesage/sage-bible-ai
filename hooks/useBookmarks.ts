import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '@/types';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  // Load bookmarks from storage on initial load
  useEffect(() => {
    // In a real app, load from AsyncStorage
    // For MVP, we'll use a simple mock implementation
    const mockBookmarks: Bookmark[] = [
      {
        id: '1',
        book: 'John',
        chapter: 3,
        verse: 16,
        text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        timestamp: Date.now() - 86400000 // 1 day ago
      },
      {
        id: '2',
        book: 'Psalm',
        chapter: 23,
        verse: 1,
        text: 'The LORD is my shepherd; I shall not want.',
        timestamp: Date.now() - 172800000 // 2 days ago
      }
    ];
    
    setBookmarks(mockBookmarks);
  }, []);
  
  const addBookmark = useCallback((book: string, chapter: number, verse: number, text: string) => {
    // Check if already bookmarked
    const existingBookmark = bookmarks.find(
      b => b.book === book && b.chapter === chapter && b.verse === verse
    );
    
    if (existingBookmark) {
      // Remove if already bookmarked (toggle behavior)
      removeBookmark(existingBookmark.id);
      return;
    }
    
    const newBookmark: Bookmark = {
      id: `${book}-${chapter}-${verse}`,
      book,
      chapter,
      verse,
      text,
      timestamp: Date.now()
    };
    
    setBookmarks(prev => [newBookmark, ...prev]);
    
    // In a real app, save to AsyncStorage
  }, [bookmarks]);
  
  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    
    // In a real app, save to AsyncStorage
  }, []);
  
  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
    
    // In a real app, clear from AsyncStorage
  }, []);
  
  const isBookmarked = useCallback((book: string, chapter: number, verse: number) => {
    return bookmarks.some(
      b => b.book === book && b.chapter === chapter && b.verse === verse
    );
  }, [bookmarks]);
  
  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    clearAllBookmarks,
    isBookmarked,
  };
}