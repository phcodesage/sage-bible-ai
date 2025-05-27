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
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { useBibleSearch } from '@/hooks/useBibleSearch';
import SearchResultItem from '@/components/Search/SearchResultItem';
import SearchHistory from '@/components/Search/SearchHistory';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';

function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(false);
  const colorScheme = useColorScheme();
  const { results, loading, error, performSearch, searchHistory, addToHistory, clearInput } = useBibleSearch();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
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

  const handleHistoryItemPress = (historyItem) => {
    setQuery(historyItem);
    performSearch(historyItem);
    setActiveSearch(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Search Scriptures
          </Text>
          <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Find verses by keyword or reference
          </Text>
        </View>
        
        <View style={styles.searchInputContainer}>
          <View style={[
            styles.searchBar, 
            { 
              backgroundColor: Colors[colorScheme ?? 'light'].searchBarBackground,
              borderColor: activeSearch ? Colors[colorScheme ?? 'light'].tint : 'transparent',
            }
          ]}>
            <SearchIcon size={20} color={Colors[colorScheme ?? 'light'].textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
              placeholder="Search by keyword, verse, or topic..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <X size={18} color={Colors[colorScheme ?? 'light'].textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.searchButton, 
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
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
            <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].error }]}>
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
          !activeSearch && <SearchHistory history={searchHistory} onPress={handleHistoryItemPress} />
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

export default SearchScreen;