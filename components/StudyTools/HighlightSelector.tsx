import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import { HighlightColor } from '@/types/studyTools';

interface HighlightSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectColor: (color: HighlightColor) => void;
  onRemoveHighlight: () => void;
  hasExistingHighlight: boolean;
}

export default function HighlightSelector({
  isVisible,
  onClose,
  onSelectColor,
  onRemoveHighlight,
  hasExistingHighlight,
}: HighlightSelectorProps) {
  const { theme } = useTheme();
  
  const highlightColors: { name: HighlightColor; label: string }[] = [
    { name: 'yellow', label: 'Yellow' },
    { name: 'green', label: 'Green' },
    { name: 'blue', label: 'Blue' },
    { name: 'pink', label: 'Pink' },
    { name: 'purple', label: 'Purple' },
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[
          styles.container,
          { backgroundColor: Colors[theme].background }
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.headerTitle,
              { color: Colors[theme].text }
            ]}>
              Highlight Verse
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors[theme].text} />
            </TouchableOpacity>
          </View>

          <View style={styles.colorGrid}>
            {highlightColors.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorOption,
                  { backgroundColor: getColorValue(color.name) }
                ]}
                onPress={() => {
                  onSelectColor(color.name);
                  onClose();
                }}
              >
                <Text style={styles.colorLabel}>{color.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {hasExistingHighlight && (
            <TouchableOpacity
              style={[
                styles.removeButton,
                { borderColor: Colors[theme].error }
              ]}
              onPress={() => {
                onRemoveHighlight();
                onClose();
              }}
            >
              <Text style={[
                styles.removeButtonText,
                { color: Colors[theme].error }
              ]}>
                Remove Highlight
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Helper function to get color values
function getColorValue(colorName: HighlightColor): string {
  const colors = {
    yellow: '#FFEB3B80', // Yellow with transparency
    green: '#4CAF5080',  // Green with transparency
    blue: '#2196F380',   // Blue with transparency
    pink: '#E91E6380',   // Pink with transparency
    purple: '#9C27B080', // Purple with transparency
  };
  
  return colors[colorName];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  closeButton: {
    padding: 5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  colorOption: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  colorLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  removeButton: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  removeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});
