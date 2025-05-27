import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert 
} from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Share as ShareIcon, Bookmark, Copy, X } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import Animated, { FadeIn } from 'react-native-reanimated';

interface VerseProps {
  verse: {
    number: number;
    text: string;
  };
  book: string;
  chapter: number;
  isBookmarked: boolean;
  onBookmark: () => void;
}

export default function VerseItem({ verse, book, chapter, isBookmarked, onBookmark }: VerseProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const { fontSize, textOnly } = useSettings();
  
  const handleLongPress = () => {
    setModalVisible(true);
  };
  
  const handleShareVerse = () => {
    setModalVisible(false);
    // Share functionality would be here
    Alert.alert('Shared', `${book} ${chapter}:${verse.number} has been shared.`);
  };
  
  const handleCopyVerse = () => {
    setModalVisible(false);
    // Copy functionality would be here
    Alert.alert('Copied', `${book} ${chapter}:${verse.number} has been copied to clipboard.`);
  };
  
  const handleBookmarkVerse = () => {
    setModalVisible(false);
    onBookmark();
  };
  
  const getFontSize = () => {
    switch(fontSize) {
      case 'small': return 16;
      case 'large': return 20;
      default: return 18;
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onLongPress={handleLongPress}
        style={styles.verseContainer}
      >
        <View style={styles.verseContent}>
          {!textOnly && (
            <Text style={[
              styles.verseNumber, 
              { color: Colors[colorScheme ?? 'light'].tint }
            ]}>
              {verse.number}
            </Text>
          )}
          <Text style={[
            styles.verseText, 
            { 
              color: Colors[colorScheme ?? 'light'].text,
              fontSize: getFontSize(),
            }
          ]}>
            {verse.text} {isBookmarked && (
              <Bookmark 
                size={16} 
                color={Colors[colorScheme ?? 'light'].tint} 
                fill={Colors[colorScheme ?? 'light'].tint}
              />
            )}
          </Text>
        </View>
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <Animated.View 
            entering={FadeIn.duration(200)}
            style={[
              styles.modalContainer, 
              { backgroundColor: Colors[colorScheme ?? 'light'].card }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                {book} {chapter}:{verse.number}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            
            <Text style={[
              styles.modalVerseText, 
              { color: Colors[colorScheme ?? 'light'].text }
            ]}>
              {verse.text}
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleShareVerse}
              >
                <ShareIcon size={22} color={Colors[colorScheme ?? 'light'].tint} />
                <Text style={[
                  styles.actionText, 
                  { color: Colors[colorScheme ?? 'light'].text }
                ]}>
                  Share
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleCopyVerse}
              >
                <Copy size={22} color={Colors[colorScheme ?? 'light'].tint} />
                <Text style={[
                  styles.actionText, 
                  { color: Colors[colorScheme ?? 'light'].text }
                ]}>
                  Copy
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleBookmarkVerse}
              >
                <Bookmark 
                  size={22} 
                  color={Colors[colorScheme ?? 'light'].tint}
                  fill={isBookmarked ? Colors[colorScheme ?? 'light'].tint : 'transparent'} 
                />
                <Text style={[
                  styles.actionText, 
                  { color: Colors[colorScheme ?? 'light'].text }
                ]}>
                  {isBookmarked ? 'Unbookmark' : 'Bookmark'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  verseContainer: {
    paddingVertical: 6,
  },
  verseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verseNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  verseText: {
    fontFamily: 'PlayfairDisplay-Regular',
    lineHeight: 28,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  modalVerseText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 5,
  },
});