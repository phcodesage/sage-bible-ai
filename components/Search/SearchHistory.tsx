import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Clock, Trash2 } from 'lucide-react-native';
import { useBibleSearch } from '@/hooks/useBibleSearch';

interface SearchHistoryProps {
  history: string[];
  onPress: (query: string) => void;
}

export default function SearchHistory({ history, onPress }: SearchHistoryProps) {
  const colorScheme = useColorScheme();
  const { removeFromHistory, clearHistory } = useBibleSearch();
  
  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Clock size={50} color={Colors[colorScheme ?? 'light'].textSecondary} />
        <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          No recent searches
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Recent Searches
        </Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={[styles.clearText, { color: Colors[colorScheme ?? 'light'].tint }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item, index) => `history-${index}-${item}`}
        renderItem={({ item }) => (
          <View style={[
            styles.historyItem,
            { borderBottomColor: Colors[colorScheme ?? 'light'].border }
          ]}>
            <TouchableOpacity 
              style={styles.historyContent}
              onPress={() => onPress(item)}
            >
              <Clock size={16} color={Colors[colorScheme ?? 'light'].textSecondary} />
              <Text style={[styles.historyText, { color: Colors[colorScheme ?? 'light'].text }]}>
                {item}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => removeFromHistory(item)}>
              <Trash2 size={18} color={Colors[colorScheme ?? 'light'].textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  clearText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 12,
  },
});