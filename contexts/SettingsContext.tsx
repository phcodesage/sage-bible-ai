import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([
      'colorScheme',
      'translation',
      'fontSize',
      'textOnly',
    ]).then(results => {
      results.forEach(([key, value]) => {
        if (value !== null) {
          switch (key) {
            case 'colorScheme': setColorScheme(value as ColorScheme); break;
            case 'translation': setTranslation(value as BibleTranslation); break;
            case 'fontSize': setFontSize(value as FontSize); break;
            case 'textOnly': setTextOnly(value === 'true'); break;
          }
        }
      });
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) return null; // Or a loading spinner

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