import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface NotificationContextType {
  showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const showNotification = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setVisible(false));
    }, 1800);
  }, [fadeAnim]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {visible && (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}> 
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toastText: {
    backgroundColor: '#222',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    overflow: 'hidden',
  },
});