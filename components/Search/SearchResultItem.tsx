import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
// Remove: import { ExternalLink, Bookmark } from 'lucide-react-native';
import { router } from 'expo-router';
import { SearchResult } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import Animated, { FadeIn } from 'react-native-reanimated';

interface SearchResultItemProps {
  result: SearchResult;
}

export default function SearchResultItem({ result }: SearchResultItemProps) {
  const { theme } = useTheme();
  const { addBookmark, isBookmarked } = useBookmarks();
  
  const handleNavigateToVerse = () => {
    router.push({
      pathname: "/(tabs)",
      params: {
        book: result.book,
        chapter: result.chapter,
        verse: result.verse
      }
    });
  };

  const handleBookmark = () => {
    addBookmark(result.book, result.chapter, result.verse, result.text);
  };
  
  const highlightSearchTerms = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    // Split the search term into individual words
    const words = searchTerm.toLowerCase().split(' ');
    
    // Create a regex pattern that matches whole words only
    const pattern = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
    
    // Split the text into parts using the pattern
    const parts = text.split(pattern);
    
    return (
      <Text style={[styles.text, { color: Colors[theme].text }]}>
        {parts.map((part, index) => {
          const isMatch = words.some(word => 
            part.toLowerCase() === word.toLowerCase()
          );
          
          return isMatch ? (
            <Text 
              key={index} 
              style={[
                styles.highlight,
                { backgroundColor: Colors[theme].highlight }
              ]}
            >
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          );
        })}
      </Text>
    );
  };
  
  const isVerseBookmarked = isBookmarked(result.book, result.chapter, result.verse);
  
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        { backgroundColor: Colors[theme].card }
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        onPress={handleNavigateToVerse}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={[styles.reference, { color: Colors[theme].text }]}>
            {result.book} {result.chapter}:{result.verse}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity 
              onPress={handleBookmark}
              style={styles.actionButton}
            >
              <Feather 
                name="bookmark"
                size={20}
                color={Colors[theme].tint}
                // Optionally, use filled bookmark if isVerseBookmarked
                // Feather does not support fill, so you may want to change color or use a different icon for filled state
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleNavigateToVerse}
              style={styles.actionButton}
            >
              <Feather name="external-link" size={20} color={Colors[theme].tint} />
            </TouchableOpacity>
          </View>
        </View>
        
        {highlightSearchTerms(result.text, result.searchTerm)}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reference: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  text: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  highlight: {
    borderRadius: 2,
    paddingHorizontal: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  }
});