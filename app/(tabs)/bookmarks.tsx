import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { X, Bookmark, BookmarkX } from 'lucide-react-native';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import BookmarkItem from '@/components/Bookmarks/BookmarkItem';
import EmptyState from '@/components/UI/EmptyState';

export default function BookmarksScreen() {
  const colorScheme = useColorScheme();
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmarks();
  const [isEditing, setIsEditing] = useState(false);
  
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

  const handleRemoveBookmark = (bookmarkId) => {
    removeBookmark(bookmarkId);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Bookmarks
          </Text>
          {bookmarks.length > 0 && (
            <Text style={[styles.bookmarkCount, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              {bookmarks.length} {bookmarks.length === 1 ? 'verse' : 'verses'}
            </Text>
          )}
        </View>
        
        {bookmarks.length > 0 && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.editButton, isEditing && styles.activeEditButton]} 
              onPress={toggleEditMode}
            >
              <Text style={[
                styles.editButtonText, 
                { color: isEditing ? '#fff' : Colors[colorScheme ?? 'light'].tint }
              ]}>
                {isEditing ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
            
            {isEditing && (
              <TouchableOpacity 
                style={[styles.clearButton, { borderColor: Colors[colorScheme ?? 'light'].error }]} 
                onPress={clearAllBookmarks}
              >
                <Text style={[styles.clearButtonText, { color: Colors[colorScheme ?? 'light'].error }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {bookmarks.length === 0 ? (
        <EmptyState 
          icon={<Bookmark size={60} color={Colors[colorScheme ?? 'light'].textSecondary} />}
          title="No bookmarks yet"
          message="Save your favorite verses for quick access later"
        />
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookmarkItem 
              bookmark={item} 
              onRemove={handleRemoveBookmark}
              isEditing={isEditing}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    marginBottom: 2,
  },
  bookmarkCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 10,
  },
  activeEditButton: {
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 10,
  },
  clearButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});