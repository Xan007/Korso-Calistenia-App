import type { ReactElement } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppFonts } from './src/shared/hooks';
import { colors } from './src/shared/theme';
import { OnboardingScreen } from './src/features/onboarding/screens/OnboardingScreen';

export default function App(): ReactElement {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <OnboardingScreen onComplete={() => {}} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
