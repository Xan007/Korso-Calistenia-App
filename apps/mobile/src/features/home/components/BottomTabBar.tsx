import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '@/shared/theme';
import type { TabKey } from '../types';

interface TabItem {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

const TABS: TabItem[] = [
  { key: 'parque', label: 'Parque', icon: 'map-pin' },
  { key: 'passport', label: 'Passport', icon: 'award' },
  { key: 'progreso', label: 'Progreso', icon: 'activity' },
  { key: 'perfil', label: 'Perfil', icon: 'user' },
];

interface BottomTabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function BottomTabBar({ active, onChange }: BottomTabBarProps): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => (
        <TabButton
          key={tab.key}
          item={tab}
          active={active === tab.key}
          onPress={() => onChange(tab.key)}
        />
      ))}
    </View>
  );
}

interface TabButtonProps {
  item: TabItem;
  active: boolean;
  onPress: () => void;
}

function TabButton({ item, active, onPress }: TabButtonProps): ReactElement {
  const anim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: active ? 1 : 0,
      damping: 15,
      stiffness: 220,
      mass: 0.5,
      useNativeDriver: true,
    }).start();
  }, [active, anim]);

  const iconStyle = {
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }],
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={item.label}
      style={styles.tab}
    >
      <Animated.View style={iconStyle}>
        <Feather
          name={item.icon}
          size={24}
          color={active ? colors.accent.normal : colors.text.disabled}
        />
      </Animated.View>
      <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.text.disabled,
  },
  labelActive: {
    color: colors.accent.normal,
    fontFamily: 'Inter_600SemiBold',
  },
});
