import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[
        styles.sectionTitle, 
        { color: Colors[theme].tint }
      ]}>
        {title}
      </Text>
      <View style={[
        styles.contentContainer,
        { backgroundColor: Colors[theme].card }
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  contentContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});