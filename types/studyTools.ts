export interface Note {
  id: string;
  verseId: string; // Format: "BookName:Chapter:Verse" e.g. "Genesis:1:1"
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Highlight {
  id: string;
  verseId: string;
  color: string; // Hex color code
  createdAt: number;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface Annotation {
  id: string;
  verseId: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface CrossReference {
  id: string;
  sourceVerseId: string;
  targetVerseId: string;
  note?: string;
  createdAt: number;
}
