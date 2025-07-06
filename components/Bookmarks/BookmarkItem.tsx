import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import { ExternalLink, Trash } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Bookmark } from '@/types';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
  isEditing: boolean;
}

export default function BookmarkItem({ bookmark, onRemove, isEditing }: BookmarkItemProps) {
  const { theme } = useTheme();
  
  const handleNavigateToVerse = () => {
    if (isEditing) return;
    
    // Navigate to the specific verse in the Bible reader
    router.push(`/(tabs)/index?book=${bookmark.book}&chapter=${bookmark.chapter}&verse=${bookmark.verse}`);
  };
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
    >
      <TouchableOpacity 
        style={[
          styles.bookmarkCard,
          { backgroundColor: Colors[theme].card }
        ]}
        onPress={handleNavigateToVerse}
      >
        <View style={styles.header}>
          <Text style={[styles.reference, { color: Colors[theme].text }]}>
            {bookmark.book} {bookmark.chapter}:{bookmark.verse}
          </Text>
          
          {isEditing ? (
            <TouchableOpacity 
              style={[
                styles.removeButton, 
                { backgroundColor: Colors[theme].error }
              ]} 
              onPress={() => onRemove(bookmark.id)}
            >
              <Trash size={16} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleNavigateToVerse}>
              <ExternalLink size={18} color={Colors[theme].tint} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text 
          style={[styles.verseText, { color: Colors[theme].text }]}
          numberOfLines={3}
        >
          {bookmark.text}
        </Text>
        
        <Text style={[styles.date, { color: Colors[theme].textSecondary }]}>
          {new Date(bookmark.timestamp).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  bookmarkCard: {
    borderRadius: 12,
    padding: 16,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
  verseText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});