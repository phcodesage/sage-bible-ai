import { useState, useEffect } from 'react';
import { sampleVerses } from '@/constants/BibleData';
import { useSettings } from './useSettings';

interface BibleContent {
  book: string;
  chapter: number;
  verses: Array<{
    number: number;
    text: string;
  }>;
}

export function useBible(book: string, chapter: number) {
  const [bibleContent, setBibleContent] = useState<BibleContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { translation } = useSettings();
  
  useEffect(() => {
    const fetchBibleContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would fetch from a Bible API
        // This is a mock implementation for the MVP
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, just use sample data
        const content: BibleContent = {
          book,
          chapter,
          verses: sampleVerses,
        };
        
        setBibleContent(content);
      } catch (err) {
        console.error('Error fetching Bible content:', err);
        setError('Failed to load Bible content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBibleContent();
  }, [book, chapter, translation]);
  
  return {
    bibleContent,
    loading,
    error,
  };
}