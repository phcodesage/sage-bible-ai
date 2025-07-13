import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useBible } from '@/hooks/useBible';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import BibleNavigation from '@/components/BibleReader/BibleNavigation';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Share } from 'react-native';
// Remove: import { Share, ChevronUp } from 'lucide-react-native';
import { useBookmarks } from '@/hooks/useBookmarks';
import Animated, { FadeIn } from 'react-native-reanimated';
import VerseItem from '@/components/BibleReader/VerseItem';
import React, { useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function ReadScreen() {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const { theme } = useTheme();
  const { bibleContent, loading, error } = useBible(book, chapter);
  const { addBookmark, isBookmarked } = useBookmarks();
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  const onScroll = useCallback(({ nativeEvent }: { nativeEvent: { contentOffset: { y: number } } }) => {
    const { contentOffset } = nativeEvent;
    setScrollToTopVisible(contentOffset.y > 200);
  }, []);

  const scrollToTop = useCallback((scrollViewRef: React.RefObject<ScrollView | null>) => {
    scrollViewRef?.current?.scrollTo({ y: 0, animated: true });
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </View>
    );
  }

  const handleChange = (newBook: string, newChapter: number) => {
    setBook(newBook);
    setChapter(newChapter);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <Text style={[styles.errorText, { color: Colors[theme].error }]}>
          Error loading Bible content. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>
          {book} {chapter}
        </Text>
        <BibleNavigation 
          currentBook={book} 
          currentChapter={chapter} 
          onChangeSelection={handleChange} 
        />
      </View>
      
      <ScrollView 
        ref={scrollViewRef} // <-- Add this line
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Text style={[styles.chapterTitle, { color: Colors[theme].text }]}>
          Chapter {chapter}
        </Text>
        
        <View style={styles.versesContainer}>
          {bibleContent?.verses?.map((verse) => (
            <Animated.View 
              key={`${book}-${chapter}-${verse.number}`}
              entering={FadeIn.delay(verse.number * 20)}
            >
              <VerseItem 
                verse={verse}
                book={book}
                chapter={chapter}
                isBookmarked={isBookmarked(book, chapter, verse.number)}
                onBookmark={() => addBookmark(book, chapter, verse.number, verse.text)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      
      {scrollToTopVisible && (
        <TouchableOpacity 
          style={[styles.scrollToTop, { backgroundColor: Colors[theme].tint }]} 
          onPress={() => {
            scrollToTop(scrollViewRef);
          }}
        >
          <Feather name="chevron-up" color="#FFF" size={24} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );

  const handleShare = async () => {
    try {
      const versesText = bibleContent?.verses?.map(v => `${v.number}. ${v.text}`).join('\n') || '';
      const message = `${book} ${chapter}\n\n${versesText}`;
      await Share.share({
        message,
        title: `${book} ${chapter}`,
      });
    } catch (error) {
      // Optionally handle error
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  chapterTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  versesContainer: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Inter-Regular',
  },
  scrollToTop: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
