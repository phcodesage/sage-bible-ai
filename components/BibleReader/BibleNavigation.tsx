import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { bibleBooks } from '../../constants/BibleData';
import { useTheme } from '../../contexts/ThemeContext';

interface BibleNavigationProps {
  currentBook: number;
  currentChapter: number;
  currentVerse?: number;
  onChangeSelection: (bookIndex: number, chapterIndex: number, verse: number | undefined) => void;
  verseCount: number;
}

const BibleNavigation: React.FC<BibleNavigationProps> = ({
  currentBook,
  currentChapter,
  currentVerse,
  onChangeSelection,
  verseCount,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState<'book' | 'chapter' | 'verse'>('book');
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const { theme } = useTheme();

  const openModal = () => {
    setStep('book');
    setSelectedBookIndex(null);
    setSelectedChapter(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBookSelect = (index: number) => {
    setSelectedBookIndex(index);
    setStep('chapter');
  };

  const handleChapterSelect = (index: number) => {
    setSelectedChapter(index);
    setStep('verse');
  };

  const handleVerseSelect = (verse: number) => {
    if (selectedBookIndex !== null && selectedChapter !== null) {
      onChangeSelection(selectedBookIndex, selectedChapter, verse);
      closeModal();
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      onChangeSelection(currentBook, currentChapter - 1, undefined);
    }
  };

  const handleNext = () => {
    const chaptersInBook = bibleBooks[currentBook].chapters;
    if (currentChapter < chaptersInBook - 1) {
      onChangeSelection(currentBook, currentChapter + 1, undefined);
    }
  };

  // Theme-based colors
  const colors = {
    background: theme === 'dark' ? '#222' : '#fff',
    overlay: 'rgba(0,0,0,0.7)',
    itemBg: theme === 'dark' ? '#333' : '#f0f0f0',
    itemText: theme === 'dark' ? '#fff' : '#222',
    closeBtn: theme === 'dark' ? '#444' : '#e0e0e0',
    closeText: theme === 'dark' ? '#fff' : '#222',
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
        <Text style={styles.arrow}>{'<'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.centerButton} onPress={openModal}>
        <Text style={styles.centerText}>
          {bibleBooks[currentBook].name} {currentChapter + 1}
          {typeof currentVerse === 'number' ? `:${currentVerse}` : ''}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={handleNext}>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}> 
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}> 
            {step === 'book' && (
              <FlatList
                data={bibleBooks}
                keyExtractor={(_, idx) => idx.toString()}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[styles.chapterItem, { backgroundColor: colors.itemBg, flex: 1, margin: 6 }]}
                    onPress={() => handleBookSelect(index)}
                  >
                    <Text style={[styles.chapterNumber, { color: colors.itemText }]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            {step === 'chapter' && selectedBookIndex !== null && (
              <FlatList
                data={Array.from({ length: bibleBooks[selectedBookIndex].chapters }, (_, i) => i + 1)}
                keyExtractor={(_, idx) => idx.toString()}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[styles.chapterItem, { backgroundColor: colors.itemBg, flex: 1, margin: 6 }]}
                    onPress={() => handleChapterSelect(index)}
                  >
                    <Text style={[styles.chapterNumber, { color: colors.itemText }]}>Ch {item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            {step === 'verse' && selectedBookIndex !== null && selectedChapter !== null && (
              <FlatList
                data={Array.from({ length: verseCount }, (_, i) => i + 1)}
                keyExtractor={(_, idx) => idx.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.verseNumber, { backgroundColor: colors.itemBg, flex: 1, margin: 6 }]}
                    onPress={() => handleVerseSelect(item)}
                  >
                    <Text style={{ color: colors.itemText }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.closeBtn }]} onPress={closeModal}>
              <Text style={{ color: colors.closeText }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  centerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  chapterItem: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
    alignItems: 'center',
  },
  chapterNumber: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  versesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  verseNumber: {
    padding: 8,
    margin: 4,
    borderRadius: 4,
    backgroundColor: '#e8e8e8',
    minWidth: 32,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#d9534f',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BibleNavigation;