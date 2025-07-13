import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ColorScheme = 'light' | 'dark';
type BibleTranslation = 'kjv' | 'akjv' | 'ceb';
type FontSize = 'small' | 'medium' | 'large';

interface SettingsContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  translation: BibleTranslation;
  setTranslation: (t: BibleTranslation) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  textOnly: boolean;
  setTextOnly: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [textOnly, setTextOnly] = useState(false);

  // Optionally: load/save from AsyncStorage here

  return (
    <SettingsContext.Provider value={{ colorScheme, setColorScheme, translation, setTranslation, fontSize, setFontSize, textOnly, setTextOnly }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};