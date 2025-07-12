import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
// Remove: import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { bibleBooks } from '@/constants/BibleData';

interface BibleNavigationProps {
  currentBook: string;
  currentChapter: number;
  onChangeSelection: (book: string, chapter: number) => void;
}

export default function BibleNavigation({ 
  currentBook, 
  currentChapter, 
  onChangeSelection 
}: BibleNavigationProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(currentBook);
  const { theme } = useTheme();
  
  const bookIndex = bibleBooks.findIndex(book => book.name === currentBook);
  const chapterCount = bibleBooks[bookIndex]?.chapters || 1;
  
  const goToPreviousChapter = () => {
    if (currentChapter > 1) {
      onChangeSelection(currentBook, currentChapter - 1);
    } else if (bookIndex > 0) {
      const prevBook = bibleBooks[bookIndex - 1];
      onChangeSelection(prevBook.name, prevBook.chapters);
    }
  };
  
  const goToNextChapter = () => {
    if (currentChapter < chapterCount) {
      onChangeSelection(currentBook, currentChapter + 1);
    } else if (bookIndex < bibleBooks.length - 1) {
      const nextBook = bibleBooks[bookIndex + 1];
      onChangeSelection(nextBook.name, 1);
    }
  };
  
  const openSelectionModal = () => {
    setModalVisible(true);
  };
  
  const selectBook = (book: string) => {
    setSelectedBook(book);
  };
  
  const confirmSelection = (book: string, chapter: number) => {
    onChangeSelection(book, chapter);
    setModalVisible(false);
  };
  
  // Generate array of chapter numbers for the selected book
  const getChapters = () => {
    const book = bibleBooks.find(b => b.name === selectedBook);
    return Array.from({ length: book?.chapters || 1 }, (_, i) => i + 1);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.navButton, styles.previousButton]} 
        onPress={goToPreviousChapter}
      >
        <Feather name="chevron-left" size={22} color={Colors[theme].text} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.selectionButton, 
          { backgroundColor: Colors[theme].card }
        ]} 
        onPress={openSelectionModal}
      >
        <Text style={[styles.selectionText, { color: Colors[theme].text }]}> {currentBook} {currentChapter} </Text>
        <Feather name="chevron-down" size={18} color={Colors[theme].text} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navButton, styles.nextButton]} 
        onPress={goToNextChapter}
      >
        <Feather name="chevron-right" size={22} color={Colors[theme].text} />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer, 
            { backgroundColor: Colors[theme].background }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors[theme].text }]}>
                Select Book & Chapter
              </Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={24} color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.selectionContent}>
              <View style={[
                styles.booksContainer, 
                { borderColor: Colors[theme].border }
              ]}>
                <FlatList
                  data={bibleBooks}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.bookItem, 
                        selectedBook === item.name && {
                          backgroundColor: Colors[theme].tint,
                        }
                      ]} 
                      onPress={() => selectBook(item.name)}
                    >
                      <Text style={[
                        styles.bookName, 
                        { color: selectedBook === item.name ? '#fff' : Colors[theme].text }
                      ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
              
              <View style={styles.chaptersContainer}>
                <FlatList
                  data={getChapters()}
                  keyExtractor={(item) => item.toString()}
                  numColumns={5}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.chapterItem, 
                        { borderColor: Colors[theme].border }
                      ]} 
                      onPress={() => confirmSelection(selectedBook, item)}
                    >
                      <Text style={[styles.chapterNumber, { color: Colors[theme].text }]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  previousButton: {
    marginRight: 10,
  },
  nextButton: {
    marginLeft: 10,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  selectionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  },
  closeButton: {
    padding: 5,
  },
  selectionContent: {
    flex: 1,
    flexDirection: 'row',
  },
  booksContainer: {
    flex: 1,
    borderRightWidth: 1,
    paddingVertical: 10,
  },
  bookItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  bookName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  chaptersContainer: {
    flex: 1,
    padding: 15,
  },
  chapterItem: {
    width: (width * 0.4) / 5,
    height: (width * 0.4) / 5,
    borderRadius: 8,
    borderWidth: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});