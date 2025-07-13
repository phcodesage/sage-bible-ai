import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
// Remove: import { Search as SearchIcon, X } from 'lucide-react-native';
import { useBibleSearch } from '@/hooks/useBibleSearch';
import SearchResultItem from '@/components/Search/SearchResultItem';
import SearchHistory from '@/components/Search/SearchHistory';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(false);
  const { theme } = useTheme();
  const {
    results,
    loading,
    error,
    performSearch,
    searchHistory,
    addToHistory,
    clearInput,
    removeFromHistory,
    clearHistory,
  } = useBibleSearch();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </View>
    );
  }

  const handleSearch = () => {
    if (query.trim()) {
      performSearch(query);
      addToHistory(query);
      setActiveSearch(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearInput();
    setActiveSearch(false);
  };

  const handleHistoryItemPress = (historyItem: string) => {
    setQuery(historyItem);
    performSearch(historyItem);
    setActiveSearch(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}> 
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>
            Search Scriptures
          </Text>
          <Text style={[styles.headerSubtitle, { color: Colors[theme].textSecondary }]}>
            Find verses by keyword or reference
          </Text>
        </View>
        
        <View style={styles.searchInputContainer}>
          <View style={[
            styles.searchBar, 
            { 
              backgroundColor: Colors[theme].searchBarBackground,
              borderColor: activeSearch ? Colors[theme].tint : 'transparent',
            }
          ]}>
            <Feather name="search" size={20} color={Colors[theme].textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: Colors[theme].text }]}
              placeholder="Search by keyword, verse, or topic..."
              placeholderTextColor={Colors[theme].textSecondary}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <Feather name="x" size={18} color={Colors[theme].textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.searchButton, 
              { backgroundColor: Colors[theme].tint },
              query.length === 0 && styles.disabledButton
            ]} 
            onPress={handleSearch}
            disabled={query.length === 0}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[theme].tint} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: Colors[theme].error }]}>
              {error}
            </Text>
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) => `result-${index}-${item.id}`}
            renderItem={({ item }) => <SearchResultItem result={item} />}
            contentContainerStyle={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          !activeSearch && (
            <SearchHistory
              history={searchHistory}
              onPress={handleHistoryItemPress}
              removeFromHistory={removeFromHistory}
              clearHistory={clearHistory}
            />
          )
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 2,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});