import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/shared/theme';
import { AccentButton } from '@/shared/components';

interface CheckinCardProps {
  spotName: string;
  description: string;
  onCheckin: () => void;
}

export function CheckinCard({ spotName, description, onCheckin }: CheckinCardProps): ReactElement {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Feather name="map-pin" size={20} color={colors.accent.normal} />
        <Text style={styles.title}>{spotName}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <AccentButton label="Check-in" onPress={onCheckin} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  description: {
    ...typography.body,
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 21,
  },
});
