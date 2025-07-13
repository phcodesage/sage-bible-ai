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
      // API endpoint for Bible search
      const apiUrl = `https://api.scripture.api.bible/v1/bibles/${translation}/search?query=${encodeURIComponent(query)}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'api-key': process.env.EXPO_PUBLIC_BIBLE_API_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      
      // Transform API response to our SearchResult format
      const searchResults: SearchResult[] = data.data.verses.map((verse: any) => ({
        id: verse.id,
        book: verse.reference.split(' ')[0],
        chapter: parseInt(verse.reference.split(':')[0].split(' ')[1]),
        verse: parseInt(verse.reference.split(':')[1]),
        text: verse.text,
        searchTerm: query
      }));

      if (searchResults.length === 0) {
        setError('No verses found matching your search. Try different words or check your spelling.');
      } else {
        setResults(searchResults);
      }
    } catch (err) {
      console.error('Error searching Bible:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [translation]);

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