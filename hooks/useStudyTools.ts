import { useState, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Note, Highlight, Annotation, CrossReference, HighlightColor } from '@/types/studyTools';

// Storage keys
const NOTES_STORAGE_KEY = 'bible-sage-notes';
const HIGHLIGHTS_STORAGE_KEY = 'bible-sage-highlights';
const ANNOTATIONS_STORAGE_KEY = 'bible-sage-annotations';
const CROSS_REFERENCES_STORAGE_KEY = 'bible-sage-cross-references';

// Color mapping for highlights
const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
  yellow: '#FFEB3B80', // Yellow with transparency
  green: '#4CAF5080',  // Green with transparency
  blue: '#2196F380',   // Blue with transparency
  pink: '#E91E6380',   // Pink with transparency
  purple: '#9C27B080', // Purple with transparency
};

export function useStudyTools() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [crossReferences, setCrossReferences] = useState<CrossReference[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all study tools data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load notes
        const notesData = await SecureStore.getItemAsync(NOTES_STORAGE_KEY);
        if (notesData) {
          setNotes(JSON.parse(notesData));
        }
        
        // Load highlights
        const highlightsData = await SecureStore.getItemAsync(HIGHLIGHTS_STORAGE_KEY);
        if (highlightsData) {
          setHighlights(JSON.parse(highlightsData));
        }
        
        // Load annotations
        const annotationsData = await SecureStore.getItemAsync(ANNOTATIONS_STORAGE_KEY);
        if (annotationsData) {
          setAnnotations(JSON.parse(annotationsData));
        }
        
        // Load cross references
        const crossReferencesData = await SecureStore.getItemAsync(CROSS_REFERENCES_STORAGE_KEY);
        if (crossReferencesData) {
          setCrossReferences(JSON.parse(crossReferencesData));
        }
      } catch (error) {
        console.error('Error loading study tools data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data to storage
  const saveData = async <T>(data: T[], storageKey: string) => {
    try {
      await SecureStore.setItemAsync(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${storageKey}:`, error);
    }
  };

  // Notes functions
  const addNote = useCallback(async (verseId: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      verseId,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await saveData(updatedNotes, NOTES_STORAGE_KEY);
    return newNote;
  }, [notes]);

  const updateNote = useCallback(async (id: string, content: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, content, updatedAt: Date.now() } 
        : note
    );
    
    setNotes(updatedNotes);
    await saveData(updatedNotes, NOTES_STORAGE_KEY);
  }, [notes]);

  const deleteNote = useCallback(async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await saveData(updatedNotes, NOTES_STORAGE_KEY);
  }, [notes]);

  const getNotesByVerse = useCallback((verseId: string) => {
    return notes.filter(note => note.verseId === verseId);
  }, [notes]);

  // Highlights functions
  const addHighlight = useCallback(async (verseId: string, colorName: HighlightColor) => {
    const color = HIGHLIGHT_COLORS[colorName];
    const existingHighlight = highlights.find(h => h.verseId === verseId);
    
    if (existingHighlight) {
      // Update existing highlight color
      const updatedHighlights = highlights.map(h => 
        h.verseId === verseId ? { ...h, color, updatedAt: Date.now() } : h
      );
      setHighlights(updatedHighlights);
      await saveData(updatedHighlights, HIGHLIGHTS_STORAGE_KEY);
      return existingHighlight;
    } else {
      // Create new highlight
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        verseId,
        color,
        createdAt: Date.now(),
      };
      
      const updatedHighlights = [...highlights, newHighlight];
      setHighlights(updatedHighlights);
      await saveData(updatedHighlights, HIGHLIGHTS_STORAGE_KEY);
      return newHighlight;
    }
  }, [highlights]);

  const removeHighlight = useCallback(async (verseId: string) => {
    const updatedHighlights = highlights.filter(h => h.verseId !== verseId);
    setHighlights(updatedHighlights);
    await saveData(updatedHighlights, HIGHLIGHTS_STORAGE_KEY);
  }, [highlights]);

  const getHighlightForVerse = useCallback((verseId: string) => {
    return highlights.find(h => h.verseId === verseId);
  }, [highlights]);

  // Annotations functions
  const addAnnotation = useCallback(async (verseId: string, text: string) => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      verseId,
      text,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    await saveData(updatedAnnotations, ANNOTATIONS_STORAGE_KEY);
    return newAnnotation;
  }, [annotations]);

  const updateAnnotation = useCallback(async (id: string, text: string) => {
    const updatedAnnotations = annotations.map(annotation => 
      annotation.id === id 
        ? { ...annotation, text, updatedAt: Date.now() } 
        : annotation
    );
    
    setAnnotations(updatedAnnotations);
    await saveData(updatedAnnotations, ANNOTATIONS_STORAGE_KEY);
  }, [annotations]);

  const deleteAnnotation = useCallback(async (id: string) => {
    const updatedAnnotations = annotations.filter(annotation => annotation.id !== id);
    setAnnotations(updatedAnnotations);
    await saveData(updatedAnnotations, ANNOTATIONS_STORAGE_KEY);
  }, [annotations]);

  const getAnnotationsByVerse = useCallback((verseId: string) => {
    return annotations.filter(annotation => annotation.verseId === verseId);
  }, [annotations]);

  // Cross References functions
  const addCrossReference = useCallback(async (sourceVerseId: string, targetVerseId: string, note?: string) => {
    const newCrossReference: CrossReference = {
      id: Date.now().toString(),
      sourceVerseId,
      targetVerseId,
      note,
      createdAt: Date.now(),
    };
    
    const updatedCrossReferences = [...crossReferences, newCrossReference];
    setCrossReferences(updatedCrossReferences);
    await saveData(updatedCrossReferences, CROSS_REFERENCES_STORAGE_KEY);
    return newCrossReference;
  }, [crossReferences]);

  const updateCrossReference = useCallback(async (id: string, note: string) => {
    const updatedCrossReferences = crossReferences.map(ref => 
      ref.id === id ? { ...ref, note } : ref
    );
    
    setCrossReferences(updatedCrossReferences);
    await saveData(updatedCrossReferences, CROSS_REFERENCES_STORAGE_KEY);
  }, [crossReferences]);

  const deleteCrossReference = useCallback(async (id: string) => {
    const updatedCrossReferences = crossReferences.filter(ref => ref.id !== id);
    setCrossReferences(updatedCrossReferences);
    await saveData(updatedCrossReferences, CROSS_REFERENCES_STORAGE_KEY);
  }, [crossReferences]);

  const getCrossReferencesByVerse = useCallback((verseId: string) => {
    return crossReferences.filter(ref => 
      ref.sourceVerseId === verseId || ref.targetVerseId === verseId
    );
  }, [crossReferences]);

  return {
    // Data
    notes,
    highlights,
    annotations,
    crossReferences,
    isLoading,
    
    // Notes functions
    addNote,
    updateNote,
    deleteNote,
    getNotesByVerse,
    
    // Highlights functions
    addHighlight,
    removeHighlight,
    getHighlightForVerse,
    highlightColors: HIGHLIGHT_COLORS,
    
    // Annotations functions
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getAnnotationsByVerse,
    
    // Cross References functions
    addCrossReference,
    updateCrossReference,
    deleteCrossReference,
    getCrossReferencesByVerse,
  };
}
