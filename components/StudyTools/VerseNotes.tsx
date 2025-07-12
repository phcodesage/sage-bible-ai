import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import { Note, Annotation, CrossReference } from '@/types/studyTools';
import { Feather } from '@expo/vector-icons';

interface VerseNotesProps {
  verseId: string;
  notes: Note[];
  annotations: Annotation[];
  crossReferences: CrossReference[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onEditAnnotation: (annotation: Annotation) => void;
  onDeleteAnnotation: (annotationId: string) => void;
  onNavigateToCrossReference: (verseId: string) => void;
  onDeleteCrossReference: (crossReferenceId: string) => void;
}

export default function VerseNotes({
  verseId,
  notes,
  annotations,
  crossReferences,
  onEditNote,
  onDeleteNote,
  onEditAnnotation,
  onDeleteAnnotation,
  onNavigateToCrossReference,
  onDeleteCrossReference,
}: VerseNotesProps) {
  const { theme } = useTheme();
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const hasContent = notes.length > 0 || annotations.length > 0 || crossReferences.length > 0;

  if (!hasContent) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[
          styles.emptyText,
          { color: Colors[theme].textSecondary }
        ]}>
          No notes or annotations for this verse.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Notes section */}
      {notes.length > 0 && (
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: Colors[theme].text }
          ]}>
            Notes
          </Text>
          
          {notes.map((note) => (
            <View 
              key={note.id} 
              style={[
                styles.noteContainer,
                { backgroundColor: Colors[theme].cardBackground }
              ]}
            >
              <Text style={[
                styles.noteContent,
                { color: Colors[theme].text }
              ]}>
                {note.content}
              </Text>
              
              <View style={styles.noteFooter}>
                <Text style={[
                  styles.noteDate,
                  { color: Colors[theme].textSecondary }
                ]}>
                  {formatDate(note.updatedAt)}
                </Text>
                
                <View style={styles.noteActions}>
                  <TouchableOpacity 
                    onPress={() => onEditNote(note)}
                    style={styles.actionButton}
                  >
                    <Feather name="edit-3" size={16} color={Colors[theme].tint} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => onDeleteNote(note.id)}
                    style={styles.actionButton}
                  >
                    <Feather name="trash-2" size={16} color={Colors[theme].error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Annotations section */}
      {annotations.length > 0 && (
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: Colors[theme].text }
          ]}>
            Annotations
          </Text>
          
          {annotations.map((annotation) => (
            <View 
              key={annotation.id} 
              style={[
                styles.noteContainer,
                { backgroundColor: Colors[theme].cardBackground }
              ]}
            >
              <Text style={[
                styles.noteContent,
                { color: Colors[theme].text }
              ]}>
                {annotation.text}
              </Text>
              
              <View style={styles.noteFooter}>
                <Text style={[
                  styles.noteDate,
                  { color: Colors[theme].textSecondary }
                ]}>
                  {formatDate(annotation.updatedAt)}
                </Text>
                
                <View style={styles.noteActions}>
                  <TouchableOpacity 
                    onPress={() => onEditAnnotation(annotation)}
                    style={styles.actionButton}
                  >
                    <Feather name="edit-3" size={16} color={Colors[theme].tint} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => onDeleteAnnotation(annotation.id)}
                    style={styles.actionButton}
                  >
                    <Feather name="trash-2" size={16} color={Colors[theme].error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Cross References section */}
      {crossReferences.length > 0 && (
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: Colors[theme].text }
          ]}>
            Cross References
          </Text>
          
          {crossReferences.map((crossRef) => {
            const isSource = crossRef.sourceVerseId === verseId;
            const linkedVerseId = isSource ? crossRef.targetVerseId : crossRef.sourceVerseId;
            
            return (
              <View 
                key={crossRef.id} 
                style={[
                  styles.crossRefContainer,
                  { backgroundColor: Colors[theme].cardBackground }
                ]}
              >
                <View style={styles.crossRefHeader}>
                  <Text style={[
                    styles.crossRefVerse,
                    { color: Colors[theme].tint }
                  ]}>
                    {linkedVerseId}
                  </Text>
                  
                  <TouchableOpacity 
                    onPress={() => onNavigateToCrossReference(linkedVerseId)}
                    style={styles.navigateButton}
                  >
                    <Feather name="external-link" size={16} color={Colors[theme].tint} />
                  </TouchableOpacity>
                </View>
                
                {crossRef.note && (
                  <Text style={[
                    styles.crossRefNote,
                    { color: Colors[theme].text }
                  ]}>
                    {crossRef.note}
                  </Text>
                )}
                
                <View style={styles.noteFooter}>
                  <Text style={[
                    styles.noteDate,
                    { color: Colors[theme].textSecondary }
                  ]}>
                    {formatDate(crossRef.createdAt)}
                  </Text>
                  
                  <TouchableOpacity 
                    onPress={() => onDeleteCrossReference(crossRef.id)}
                    style={styles.actionButton}
                  >
                    <Feather name="trash-2" size={16} color={Colors[theme].error} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  noteContainer: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  noteContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  noteDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  noteActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  crossRefContainer: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  crossRefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crossRefVerse: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  navigateButton: {
    padding: 5,
  },
  crossRefNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    fontStyle: 'italic',
  },
});
