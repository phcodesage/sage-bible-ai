import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Save, Search } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface CrossReferenceEditorProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (targetVerseId: string, note?: string) => void;
  sourceVerseId: string;
  sourceVerseText: string;
}

export default function CrossReferenceEditor({
  isVisible,
  onClose,
  onSave,
  sourceVerseId,
  sourceVerseText,
}: CrossReferenceEditorProps) {
  const [targetVerseId, setTargetVerseId] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; text: string }[]>([]);
  const colorScheme = useColorScheme();

  const handleSearch = () => {
    // This is a mock implementation. In a real app, you would search the Bible API
    // For now, we'll just show some dummy results
    if (searchQuery.trim()) {
      const mockResults = [
        { id: 'John:3:16', text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.' },
        { id: 'Romans:5:8', text: 'But God shows his love for us in that while we were still sinners, Christ died for us.' },
        { id: 'Ephesians:2:8-9', text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.' },
      ];
      setSearchResults(mockResults);
    }
  };

  const handleSelectVerse = (id: string, text: string) => {
    setTargetVerseId(id);
    // Clear search results after selection
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSave = () => {
    if (targetVerseId) {
      onSave(targetVerseId, note.trim() || undefined);
      onClose();
      // Reset state
      setTargetVerseId('');
      setNote('');
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? 'light'].background }
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.headerTitle,
              { color: Colors[colorScheme ?? 'light'].text }
            ]}>
              Add Cross Reference
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Source verse */}
            <View style={styles.sectionContainer}>
              <Text style={[
                styles.sectionTitle,
                { color: Colors[colorScheme ?? 'light'].textSecondary }
              ]}>
                From
              </Text>
              <View style={styles.verseContainer}>
                <Text style={[
                  styles.verseId,
                  { color: Colors[colorScheme ?? 'light'].tint }
                ]}>
                  {sourceVerseId}
                </Text>
                <Text style={[
                  styles.verseText,
                  { color: Colors[colorScheme ?? 'light'].text }
                ]}>
                  {sourceVerseText}
                </Text>
              </View>
            </View>

            {/* Search for target verse */}
            <View style={styles.sectionContainer}>
              <Text style={[
                styles.sectionTitle,
                { color: Colors[colorScheme ?? 'light'].textSecondary }
              ]}>
                To
              </Text>

              {targetVerseId ? (
                <View style={[
                  styles.selectedVerseContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
                ]}>
                  <Text style={[
                    styles.verseId,
                    { color: Colors[colorScheme ?? 'light'].tint }
                  ]}>
                    {targetVerseId}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTargetVerseId('')}
                    style={styles.changeButton}
                  >
                    <Text style={[
                      styles.changeButtonText,
                      { color: Colors[colorScheme ?? 'light'].tint }
                    ]}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.searchContainer}>
                  <View style={[
                    styles.searchInputContainer,
                    { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
                  ]}>
                    <TextInput
                      style={[
                        styles.searchInput,
                        { color: Colors[colorScheme ?? 'light'].text }
                      ]}
                      placeholder="Search by reference or keyword..."
                      placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onSubmitEditing={handleSearch}
                      returnKeyType="search"
                    />
                    <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                      <Search size={20} color={Colors[colorScheme ?? 'light'].tint} />
                    </TouchableOpacity>
                  </View>

                  {searchResults.length > 0 && (
                    <View style={styles.searchResultsContainer}>
                      {searchResults.map((result) => (
                        <TouchableOpacity
                          key={result.id}
                          style={[
                            styles.searchResultItem,
                            { borderBottomColor: 'rgba(0,0,0,0.1)' }
                          ]}
                          onPress={() => handleSelectVerse(result.id, result.text)}
                        >
                          <Text style={[
                            styles.searchResultId,
                            { color: Colors[colorScheme ?? 'light'].tint }
                          ]}>
                            {result.id}
                          </Text>
                          <Text
                            style={[
                              styles.searchResultText,
                              { color: Colors[colorScheme ?? 'light'].text }
                            ]}
                            numberOfLines={2}
                          >
                            {result.text}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Optional note */}
            <View style={styles.sectionContainer}>
              <Text style={[
                styles.sectionTitle,
                { color: Colors[colorScheme ?? 'light'].textSecondary }
              ]}>
                Note (Optional)
              </Text>
              <TextInput
                style={[
                  styles.noteInput,
                  { 
                    color: Colors[colorScheme ?? 'light'].text,
                    backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
                  }
                ]}
                placeholder="Add a note about this connection..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                !targetVerseId && styles.disabledButton
              ]}
              onPress={handleSave}
              disabled={!targetVerseId}
            >
              <Save size={20} color="#FFFFFF" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Cross Reference</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 10,
  },
  verseContainer: {
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  verseId: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 5,
  },
  verseText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  selectedVerseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  changeButton: {
    padding: 5,
  },
  changeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingVertical: 12,
  },
  searchButton: {
    padding: 5,
  },
  searchResultsContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  searchResultId: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 5,
  },
  searchResultText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  noteInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    padding: 15,
    borderRadius: 12,
    minHeight: 100,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
