import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Bookmark } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookmarksContextType {
  bookmarks: Bookmark[];
  addBookmark: (book: string, chapter: number, verse: number, text: string) => void;
  removeBookmark: (id: string) => void;
  clearAllBookmarks: () => void;
  isBookmarked: (book: string, chapter: number, verse: number) => boolean;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    AsyncStorage.getItem('bookmarks').then(data => {
      if (data) setBookmarks(JSON.parse(data));
    });
  }, []);

  // Save bookmarks on change
  useEffect(() => {
    AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((book: string, chapter: number, verse: number, text: string) => {
    const existingBookmark = bookmarks.find(
      b => b.book === book && b.chapter === chapter && b.verse === verse
    );
    if (existingBookmark) {
      removeBookmark(existingBookmark.id);
      return;
    }
    const newBookmark: Bookmark = {
      id: `${book}-${chapter}-${verse}`,
      book,
      chapter,
      verse,
      text,
      timestamp: Date.now(),
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  }, [bookmarks]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  }, []);

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  const isBookmarked = useCallback((book: string, chapter: number, verse: number) => {
    return bookmarks.some(
      b => b.book === book && b.chapter === chapter && b.verse === verse
    );
  }, [bookmarks]);

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, clearAllBookmarks, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error('useBookmarks must be used within a BookmarksProvider');
  return context;
};