import React from 'react';
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
import { 
  ChevronRight, 
  Sun, 
  Moon, 
  BookOpen, 
  Share as ShareIcon, 
  Info, 
  FileText, 
  Heart,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useSettings } from '@/hooks/useSettings';
import SettingsItem from '@/components/Settings/SettingsItem';
import SettingsSection from '@/components/Settings/SettingsSection';

export default function SettingsScreen() {
  // We're using _useColorScheme because we already defined useColorScheme in the settings hook
  const systemColorScheme = _useColorScheme();
  const { 
    colorScheme, 
    setColorScheme, 
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

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      </View>
    );
  }

  const isDarkMode = colorScheme === 'dark';

  const handleDarkModeToggle = () => {
    setColorScheme(isDarkMode ? 'light' : 'dark');
  };

  const handleTextOnlyToggle = () => {
    setTextOnly(!textOnly);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme].text }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <SettingsSection title="Appearance">
          <SettingsItem
            icon={isDarkMode ? <Moon size={22} color={Colors[colorScheme].textSecondary} /> : <Sun size={22} color={Colors[colorScheme].textSecondary} />}
            title="Dark Mode"
            type="switch"
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
          />
          <SettingsItem
            icon={<FileText size={22} color={Colors[colorScheme].textSecondary} />}
            title="Text Only Mode"
            description="Hide verse numbers and chapter headings"
            type="switch"
            value={textOnly}
            onValueChange={handleTextOnlyToggle}
          />
          <SettingsItem
            icon={<BookOpen size={22} color={Colors[colorScheme].textSecondary} />}
            title="Font Size"
            description={`${fontSize === 'small' ? 'Small' : fontSize === 'medium' ? 'Medium' : 'Large'}`}
            type="select"
            value={fontSize}
            options={[
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
            ]}
            onSelect={setFontSize}
          />
        </SettingsSection>

        <SettingsSection title="Bible">
          <SettingsItem
            icon={<BookOpen size={22} color={Colors[colorScheme].textSecondary} />}
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
            onSelect={setTranslation}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsItem
            icon={<Info size={22} color={Colors[colorScheme].textSecondary} />}
            title="About Sage Bible"
            chevron
            onPress={() => {}}
          />
          <SettingsItem
            icon={<ShareIcon size={22} color={Colors[colorScheme].textSecondary} />}
            title="Share App"
            chevron
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Heart size={22} color={Colors[colorScheme].textSecondary} />}
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