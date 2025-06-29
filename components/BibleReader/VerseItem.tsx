import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert,
  ScrollView
} from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Share as ShareIcon, Bookmark, Copy, X, Pencil, Link, Highlighter, MessageSquare } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import { useStudyTools } from '@/hooks/useStudyTools';
import Animated, { FadeIn } from 'react-native-reanimated';
import NoteEditor from '@/components/StudyTools/NoteEditor';
import HighlightSelector from '@/components/StudyTools/HighlightSelector';
import CrossReferenceEditor from '@/components/StudyTools/CrossReferenceEditor';
import VerseNotes from '@/components/StudyTools/VerseNotes';
import { HighlightColor } from '@/types/studyTools';

interface VerseProps {
  verse: {
    number: number;
    text: string;
  };
  book: string;
  chapter: number;
  isBookmarked: boolean;
  onBookmark: () => void;
  onNavigateToVerse?: (verseId: string) => void;
}

export default function VerseItem({ verse, book, chapter, isBookmarked, onBookmark, onNavigateToVerse }: VerseProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [noteEditorVisible, setNoteEditorVisible] = useState(false);
  const [highlightSelectorVisible, setHighlightSelectorVisible] = useState(false);
  const [crossRefEditorVisible, setCrossRefEditorVisible] = useState(false);
  const [notesVisible, setNotesVisible] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  const colorScheme = useColorScheme();
  const { fontSize, textOnly } = useSettings();
  const { 
    addNote, 
    updateNote, 
    deleteNote, 
    getNotesByVerse,
    addHighlight,
    removeHighlight,
    getHighlightForVerse,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getAnnotationsByVerse,
    addCrossReference,
    updateCrossReference,
    deleteCrossReference,
    getCrossReferencesByVerse
  } = useStudyTools();
  
  // Create a verseId in the format "BookName:Chapter:Verse"
  const verseId = `${book}:${chapter}:${verse.number}`;
  
  // Get study tools data for this verse
  const notes = getNotesByVerse(verseId);
  const highlight = getHighlightForVerse(verseId);
  const annotations = getAnnotationsByVerse(verseId);
  const crossReferences = getCrossReferencesByVerse(verseId);
  
  const handleLongPress = () => {
    setModalVisible(true);
  };
  
  // Note handling
  const handleAddNote = () => {
    setModalVisible(false);
    setNoteEditorVisible(true);
  };
  
  const handleSaveNote = (content: string) => {
    if (activeNoteId) {
      updateNote(activeNoteId, content);
    } else {
      addNote(verseId, content);
    }
    setActiveNoteId(null);
  };
  
  const handleEditNote = (noteId: string, content: string) => {
    setActiveNoteId(noteId);
    setNoteEditorVisible(true);
  };
  
  // Highlight handling
  const handleHighlight = () => {
    setModalVisible(false);
    setHighlightSelectorVisible(true);
  };
  
  const handleSelectHighlightColor = (color: HighlightColor) => {
    addHighlight(verseId, color);
  };
  
  // Cross reference handling
  const handleAddCrossReference = () => {
    setModalVisible(false);
    setCrossRefEditorVisible(true);
  };
  
  const handleSaveCrossReference = (targetVerseId: string, note?: string) => {
    addCrossReference(verseId, targetVerseId, note);
  };
  
  // View notes and annotations
  const handleViewNotes = () => {
    setModalVisible(false);
    setNotesVisible(true);
  };
  
  const handleNavigateToCrossReference = (linkedVerseId: string) => {
    setNotesVisible(false);
    if (onNavigateToVerse) {
      onNavigateToVerse(linkedVerseId);
    }
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
              backgroundColor: highlight ? highlight.color : 'transparent',
            }
          ]}>
            {verse.text} {isBookmarked && (
              <Bookmark 
                size={16} 
                color={Colors[colorScheme ?? 'light'].tint} 
                fill={Colors[colorScheme ?? 'light'].tint}
              />
            )}
            {notes.length > 0 && (
              <MessageSquare 
                size={16} 
                color={Colors[colorScheme ?? 'light'].tint} 
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
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleAddNote}
                >
                  <Pencil size={22} color={Colors[colorScheme ?? 'light'].tint} />
                  <Text style={[
                    styles.actionText, 
                    { color: Colors[colorScheme ?? 'light'].text }
                  ]}>
                    Add Note
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleHighlight}
                >
                  <Highlighter size={22} color={Colors[colorScheme ?? 'light'].tint} />
                  <Text style={[
                    styles.actionText, 
                    { color: Colors[colorScheme ?? 'light'].text }
                  ]}>
                    Highlight
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleAddCrossReference}
                >
                  <Link size={22} color={Colors[colorScheme ?? 'light'].tint} />
                  <Text style={[
                    styles.actionText, 
                    { color: Colors[colorScheme ?? 'light'].text }
                  ]}>
                    Cross Ref
                  </Text>
                </TouchableOpacity>
                
                {(notes.length > 0 || annotations.length > 0 || crossReferences.length > 0) && (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={handleViewNotes}
                  >
                    <MessageSquare size={22} color={Colors[colorScheme ?? 'light'].tint} />
                    <Text style={[
                      styles.actionText, 
                      { color: Colors[colorScheme ?? 'light'].text }
                    ]}>
                      View Notes
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      
      {/* Note Editor Modal */}
      <NoteEditor
        isVisible={noteEditorVisible}
        onClose={() => {
          setNoteEditorVisible(false);
          setActiveNoteId(null);
        }}
        onSave={handleSaveNote}
        verseId={verseId}
        verseText={verse.text}
        initialContent={activeNoteId ? notes.find(note => note.id === activeNoteId)?.content || '' : ''}
        isEditing={!!activeNoteId}
      />
      
      {/* Highlight Selector Modal */}
      <HighlightSelector
        isVisible={highlightSelectorVisible}
        onClose={() => setHighlightSelectorVisible(false)}
        onSelectColor={handleSelectHighlightColor}
        onRemoveHighlight={() => removeHighlight(verseId)}
        hasExistingHighlight={!!highlight}
      />
      
      {/* Cross Reference Editor Modal */}
      <CrossReferenceEditor
        isVisible={crossRefEditorVisible}
        onClose={() => setCrossRefEditorVisible(false)}
        onSave={handleSaveCrossReference}
        sourceVerseId={verseId}
        sourceVerseText={verse.text}
      />
      
      {/* Notes Viewer Modal */}
      <Modal
        visible={notesVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotesVisible(false)}
      >
        <View style={[styles.notesModalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.notesModalHeader}>
            <Text style={[styles.notesModalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Notes for {verseId}
            </Text>
            <TouchableOpacity onPress={() => setNotesVisible(false)} style={styles.closeButton}>
              <X size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          </View>
          
          <VerseNotes
            verseId={verseId}
            notes={notes}
            annotations={annotations}
            crossReferences={crossReferences}
            onEditNote={(note) => {
              setActiveNoteId(note.id);
              setNotesVisible(false);
              setNoteEditorVisible(true);
            }}
            onDeleteNote={deleteNote}
            onEditAnnotation={(annotation) => {
              // Annotation editing would go here
            }}
            onDeleteAnnotation={deleteAnnotation}
            onNavigateToCrossReference={handleNavigateToCrossReference}
            onDeleteCrossReference={deleteCrossReference}
          />
        </View>
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
  notesModalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  notesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  notesModalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  },
  closeButton: {
    padding: 5,
  },
});