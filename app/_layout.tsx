import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { SplashScreen } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Prevent splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // This hook must be called first and never removed
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Keep splash screen visible while fonts are loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { theme } = useTheme();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}