import React, { useState, useEffect } from 'react';
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
import { X, Save } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';

interface NoteEditorProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  verseId: string;
  verseText: string;
  initialContent?: string;
  isEditing?: boolean;
}

export default function NoteEditor({
  isVisible,
  onClose,
  onSave,
  verseId,
  verseText,
  initialContent = '',
  isEditing = false,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const { theme } = useTheme();

  useEffect(() => {
    if (isVisible) {
      setContent(initialContent);
    }
  }, [isVisible, initialContent]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      onClose();
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
          { backgroundColor: Colors[theme].background }
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.headerTitle,
              { color: Colors[theme].text }
            ]}>
              {isEditing ? 'Edit Note' : 'Add Note'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors[theme].text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.verseContainer}>
              <Text style={[
                styles.verseId,
                { color: Colors[theme].tint }
              ]}>
                {verseId}
              </Text>
              <Text style={[
                styles.verseText,
                { color: Colors[theme].text }
              ]}>
                {verseText}
              </Text>
            </View>

            <TextInput
              style={[
                styles.noteInput,
                { 
                  color: Colors[theme].text,
                  backgroundColor: Colors[theme].cardBackground,
                }
              ]}
              placeholder="Write your note here..."
              placeholderTextColor={Colors[theme].textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: Colors[theme].tint },
                !content.trim() && styles.disabledButton
              ]}
              onPress={handleSave}
              disabled={!content.trim()}
            >
              <Save size={20} color="#FFFFFF" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Note</Text>
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
  verseContainer: {
    marginBottom: 20,
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
  noteInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    padding: 15,
    borderRadius: 12,
    minHeight: 200,
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
