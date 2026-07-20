import { useState } from 'react';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppFonts } from './src/shared/hooks';
import { colors } from './src/shared/theme';
import { OnboardingScreen } from './src/features/onboarding/screens/OnboardingScreen';
import { AuthScreen } from './src/features/auth/screens/AuthScreen';
import { HomeScreen } from './src/features/home/screens/HomeScreen';

export default function App(): ReactElement {
  const [fontsLoaded] = useAppFonts();
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  if (!onboardingDone) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <OnboardingScreen onComplete={() => setOnboardingDone(true)} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (!authenticated) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AuthScreen onAuthenticated={() => setAuthenticated(true)} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <HomeScreen nickname="Mateo" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
