import { Platform } from 'react-native';

const tintColorLight = '#1E3A8A'; // Deep blue
const tintColorDark = '#4F85E1';   // Lighter blue for dark mode

export default {
  light: {
    text: '#000',
    textSecondary: '#666',
    background: '#F9F9FB',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    card: '#fff',
    cardBackground: '#f0f0f5',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    highlight: '#F9E076',
    highlightLight: '#F5F5F5',
    searchBarBackground: '#EEEEF2',
    switchTrack: Platform.select({ ios: undefined, default: '#E5E7EB' }),
  },
  dark: {
    text: '#fff',
    textSecondary: '#A1A1AA',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    card: '#1E1E1E',
    cardBackground: '#2A2A2A',
    border: '#333',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    highlight: '#ffe066', // Brighter yellow for dark mode
    highlightLight: '#333',
    searchBarBackground: '#2A2A2A',
    switchTrack: Platform.select({ ios: undefined, default: '#555' }),
  },
};