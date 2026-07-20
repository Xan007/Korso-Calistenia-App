import { useState } from 'react';
import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/shared/theme';
import { ParqueScreen } from '@/features/parque/screens/ParqueScreen';
import { PlaceholderScreen } from '@/shared/components/PlaceholderScreen';
import { BottomTabBar } from '../components/BottomTabBar';
import type { TabKey } from '../types';

interface HomeScreenProps {
  nickname: string;
}

export function HomeScreen({ nickname }: HomeScreenProps): ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>('parque');

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {activeTab === 'parque' && <ParqueScreen nickname={nickname} />}
        {activeTab === 'passport' && (
          <PlaceholderScreen
            title="Passport"
            icon="award"
            caption="Tus sellos y etapas apareceran aca"
          />
        )}
        {activeTab === 'progreso' && (
          <PlaceholderScreen
            title="Progreso"
            icon="activity"
            caption="Tu resumen semanal y estadísticas"
          />
        )}
        {activeTab === 'perfil' && (
          <PlaceholderScreen title="Perfil" icon="user" caption="Configuracion y ajustes" />
        )}
      </View>
      <BottomTabBar active={activeTab} onChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
});
