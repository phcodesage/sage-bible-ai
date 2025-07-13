import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  ActivityIndicator,
  useColorScheme as _useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
// Change this:
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import SettingsItem from '@/components/Settings/SettingsItem';
import SettingsSection from '@/components/Settings/SettingsSection';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  // We're using _useColorScheme because we already defined useColorScheme in the settings hook
  const { theme, toggleTheme } = useTheme();
  const { 
    translation, 
    setTranslation,
    fontSize, 
    setFontSize,
    textOnly,
    setTextOnly,
  } = useSettings();
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  const handleSetFontSize = (value: string) => setFontSize(value as 'small' | 'medium' | 'large');
  const handleSetTranslation = (value: string) => setTranslation(value as 'kjv' | 'niv' | 'esv');

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}> 
        <ActivityIndicator 
          size="large" 
          color={Colors[theme].tint} 
        />
      </View>
    );
  }

  const isDarkMode = theme === 'dark';

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  const handleTextOnlyToggle = () => {
    setTextOnly(!textOnly);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <SettingsSection title="Appearance">
          <SettingsItem
            icon={isDarkMode ? <Feather name="moon" size={22} color={Colors[theme].textSecondary} /> : <Feather name="sun" size={22} color={Colors[theme].textSecondary} />}
            title="Dark Mode"
            type="switch"
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
          />
          <SettingsItem
            icon={<Feather name="file-text" size={22} color={Colors[theme].textSecondary} />}
            title="Text Only Mode"
            description="Hide verse numbers and chapter headings"
            type="switch"
            value={textOnly}
            onValueChange={handleTextOnlyToggle}
          />
          <SettingsItem
            icon={<Feather name="book-open" size={22} color={Colors[theme].textSecondary} />}
            title="Font Size"
            description={`${fontSize === 'small' ? 'Small' : fontSize === 'medium' ? 'Medium' : 'Large'}`}
            type="select"
            value={fontSize}
            options={[
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
            ]}
            onSelect={handleSetFontSize}
          />
        </SettingsSection>

        <SettingsSection title="Bible">
          <SettingsItem
            icon={<Feather name="book-open" size={22} color={Colors[theme].textSecondary} />}
            title="Translation"
            description={`${translation === 'kjv' ? 'King James Version' : 
              translation === 'niv' ? 'New International Version' : 'English Standard Version'}`}
            type="select"
            value={translation}
            options={[
              { label: 'King James Version (KJV)', value: 'kjv' },
              { label: 'New International Version (NIV)', value: 'niv' },
              { label: 'English Standard Version (ESV)', value: 'esv' },
            ]}
            onSelect={handleSetTranslation}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsItem
            icon={<Feather name="info" size={22} color={Colors[theme].textSecondary} />}
            title="About Sage Bible"
            chevron
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Feather name="share" size={22} color={Colors[theme].textSecondary} />}
            title="Share App"
            chevron
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Feather name="heart" size={22} color={Colors[theme].textSecondary} />}
            title="Rate App"
            chevron
            onPress={() => {}}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 2,
  },
  scrollView: {
    flex: 1,
  },
});