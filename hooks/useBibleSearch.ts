import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { SearchResult } from '@/types';

export function useBibleSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { translation } = useSettings();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      // In a real app, this would load from AsyncStorage
      const mockHistory = ['love', 'faith', 'hope'];
      setSearchHistory(mockHistory);
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  };

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      type KJVData = {
        books: Array<{
          name: string;
          chapters: Array<{
            chapter: number;
            verses: Array<{ verse: number; text: string }>;
          }>;
        }>;
      };
      const kjvData = await import('@/assets/bible-data/KJV.json');
      const books = (kjvData as any).default ? (kjvData as any).default.books : (kjvData as any).books;
      const lowerQuery = query.toLowerCase();
      const localResults: SearchResult[] = [];
      books.forEach((book: any) => {
        book.chapters.forEach((chapter: any) => {
          chapter.verses.forEach((verse: any) => {
            if (verse.text.toLowerCase().includes(lowerQuery)) {
              localResults.push({
                id: `${book.name}-${chapter.chapter}-${verse.verse}`,
                book: book.name,
                chapter: chapter.chapter,
                verse: verse.verse,
                text: verse.text,
                searchTerm: query
              });
            }
          });
        });
      });
      if (localResults.length === 0) {
        setError('No verses found matching your search. Try different words or check your spelling.');
        setResults([]);
      } else {
        setResults(localResults);
      }
    } catch (err) {
      console.error('Error searching Bible:', err);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 10); // Keep only last 10 searches
    });
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory(prev => prev.filter(item => item !== query));
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const clearInput = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchHistory,
    performSearch,
    addToHistory,
    removeFromHistory,
    clearHistory,
    clearInput,
  };
}