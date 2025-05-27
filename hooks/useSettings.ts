import { useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';
type BibleTranslation = 'kjv' | 'niv' | 'esv';
type FontSize = 'small' | 'medium' | 'large';

export function useSettings() {
  const deviceColorScheme = useDeviceColorScheme() as ColorScheme || 'light';
  const [colorScheme, setColorScheme] = useState<ColorScheme>(deviceColorScheme);
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [textOnly, setTextOnly] = useState(false);
  
  // Load settings from storage on initial load
  useEffect(() => {
    // In a real app, load from AsyncStorage
    // For MVP, use device color scheme and defaults
    setColorScheme(deviceColorScheme);
  }, [deviceColorScheme]);
  
  // Save settings when they change
  useEffect(() => {
    // In a real app, save to AsyncStorage
    // For MVP, this is a no-op
  }, [colorScheme, translation, fontSize, textOnly]);
  
  return {
    colorScheme,
    setColorScheme,
    translation,
    setTranslation,
    fontSize,
    setFontSize,
    textOnly,
    setTextOnly,
  };
}