import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Modal
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
// Remove: import { ChevronRight, X } from 'lucide-react-native';

interface Option {
  label: string;
  value: string;
}

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  type?: 'switch' | 'select' | 'button';
  value?: boolean | string;
  options?: Option[];
  onValueChange?: (value: boolean) => void;
  onSelect?: (value: string) => void;
  onPress?: () => void;
  chevron?: boolean;
}

export default function SettingsItem({
  icon,
  title,
  description,
  type = 'button',
  value,
  options = [],
  onValueChange,
  onSelect,
  onPress,
  chevron = false,
}: SettingsItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();
  
  const handlePress = () => {
    if (type === 'select') {
      setModalVisible(true);
    } else if (type === 'button' && onPress) {
      onPress();
    }
  };
  
  const handleOptionSelect = (optionValue: string) => {
    if (onSelect) {
      onSelect(optionValue);
    }
    setModalVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container,
          { borderBottomColor: Colors[theme].border }
        ]}
        onPress={handlePress}
        disabled={type === 'switch'}
      >
        <View style={styles.iconContainer}>
          {icon}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: Colors[theme].text }]}>
            {title}
          </Text>
          
          {description && (
            <Text style={[styles.description, { color: Colors[theme].textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
        
        <View style={styles.controlContainer}>
          {type === 'switch' && onValueChange && (
            <Switch
              value={value as boolean}
              onValueChange={onValueChange}
              trackColor={{ 
                false: Colors[theme].switchTrack, 
                true: Colors[theme].tint 
              }}
              thumbColor="#fff"
            />
          )}
          
          {(type === 'select' || chevron) && (
            <Feather name="chevron-right" size={18} color={Colors[theme].textSecondary} />
          )}
        </View>
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
                Select {title}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity 
                  key={option.value}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: Colors[theme].border },
                    value === option.value && { 
                      backgroundColor: Colors[theme].highlightLight
                    }
                  ]}
                  onPress={() => handleOptionSelect(option.value)}
                >
                  <Text style={[
                    styles.optionText, 
                    { color: Colors[theme].text },
                    value === option.value && { 
                      color: Colors[theme].tint,
                      fontFamily: 'Inter-SemiBold'
                    }
                  ]}>
                    {option.label}
                  </Text>
                  
                  {value === option.value && (
                    <View style={[
                      styles.selectedIndicator,
                      { backgroundColor: Colors[theme].tint }
                    ]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  controlContainer: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});