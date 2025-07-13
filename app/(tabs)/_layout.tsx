import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { useNavigationState } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_CLEARED_KEY = 'bookmarks_lastCleared';
const BADGE_KEY = 'bookmarks_badge_count';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { bookmarks } = useBookmarks();
  const navigationState = useNavigationState(state => state);
  const [lastCleared, setLastCleared] = useState<number>(0);
  const [badgeCount, setBadgeCount] = useState(0);

  // Load lastCleared on mount
  useEffect(() => {
    AsyncStorage.getItem(LAST_CLEARED_KEY).then(val => {
      if (val) setLastCleared(Number(val));
    });
  }, []);

  // Reset lastCleared when Bookmarks tab is focused
  useEffect(() => {
    const currentRoute = navigationState.routes[navigationState.index]?.name;
    if (currentRoute === 'bookmarks') {
      const now = Date.now();
      setLastCleared(now);
      AsyncStorage.setItem(LAST_CLEARED_KEY, String(now));
    }
  }, [navigationState]);

  // Count only bookmarks added after lastCleared
  const newBookmarksCount = bookmarks.filter(b => (b.timestamp ?? 0) > lastCleared).length;

  // Load badge count on mount
  useEffect(() => {
    AsyncStorage.getItem(BADGE_KEY).then(val => {
      if (val) setBadgeCount(Number(val));
    });
  }, []);

  // Increment badge when a new bookmark is added (and not on Bookmarks tab)
  useEffect(() => {
    // Your logic to increment badgeCount when a new bookmark is added
    // For example, if you have a context or event for new bookmarks, call setBadgeCount(prev => prev + 1) and persist it
  }, [/* dependencies for new bookmarks */]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Read',
          tabBarIcon: ({ color, size }) => <Feather name="book" color={color} size={size} />, 
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} />, 
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: 'Ask AI',
          tabBarIcon: ({ color, size }) => <Feather name="message-square" color={color} size={size} />, 
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Feather name="bookmark" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />, 
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});