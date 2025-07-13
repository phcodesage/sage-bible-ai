import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface BibleContent {
  book: string;
  chapter: number;
  verses: Array<{
    number: number;
    text: string;
  }>;
}

interface KJVBook {
  name: string;
  chapters: Array<{
    chapter: number;
    verses: Array<{
      verse: number;
      text: string;
    }>;
  }>;
}

interface KJVData {
  translation: string;
  books: KJVBook[];
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
        let bibleData: KJVData;
        if (translation === 'kjv') {
          bibleData = (await import('../assets/bible-data/KJV.json')).default as KJVData;
        } else if (translation === 'akjv') {
          bibleData = (await import('../assets/bible-data/AKJV.json')).default as KJVData;
        } else if (translation === 'ceb') {
          bibleData = (await import('../assets/bible-data/CebPinadayag.json')).default as KJVData;
        } else {
          bibleData = (await import('../assets/bible-data/KJV.json')).default as KJVData;
        }
        const bookData = bibleData.books.find(b => b.name === book);
        if (!bookData) throw new Error('Book not found');
        const chapterData = bookData.chapters.find(c => c.chapter === chapter);
        if (!chapterData) throw new Error('Chapter not found');
        const verses = chapterData.verses.map(v => ({ number: v.verse, text: v.text }));
        setBibleContent({ book, chapter, verses });
      } catch (err) {
        console.error('Error fetching Bible content:', err);
        setError('Failed to load Bible content. Please try again later.');
        setBibleContent(null);
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