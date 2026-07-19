import type { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { colors, radius } from '@/shared/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accent?: 'normal' | 'hiberna';
}

const TRACK_W = 48;
const TRACK_H = 28;
const THUMB = 24;
const PAD = 2;

export function Toggle({ value, onValueChange, accent = 'normal' }: ToggleProps): ReactElement {
  const activeColor = colors.accent[accent];

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[styles.track, { backgroundColor: value ? activeColor : colors.border }]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Pressable style={[styles.thumb, { left: value ? TRACK_W - THUMB - PAD : PAD }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: radius.pill,
    padding: PAD,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    top: PAD,
    width: THUMB,
    height: THUMB,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
});
