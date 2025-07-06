import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  const { theme } = useTheme();
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(500).delay(300)}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      
      <Text style={[styles.title, { color: Colors[theme].text }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: Colors[theme].textSecondary }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});