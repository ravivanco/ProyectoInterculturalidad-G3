import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type Props = { title: string; description?: string; selected: boolean; onPress: () => void };

export function SelectionCard({ title, description, selected, onPress }: Props) {
  return <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={[styles.card, selected ? styles.selected : undefined]}><View style={[styles.radio, selected ? styles.radioSelected : undefined]} /><View style={styles.copy}><Text style={[styles.title, selected ? styles.titleSelected : undefined]}>{title}</Text>{description ? <Text style={styles.description}>{description}</Text> : null}</View></Pressable>;
}

const styles = StyleSheet.create({
  card: { alignItems: 'flex-start', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 16 },
  selected: { backgroundColor: colors.primarySoft, borderColor: colors.primary }, radio: { borderColor: colors.border, borderRadius: 99, borderWidth: 2, height: 20, marginTop: 1, width: 20 },
  radioSelected: { backgroundColor: colors.primary, borderColor: colors.primary, borderWidth: 5 }, copy: { flex: 1 }, title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  titleSelected: { color: colors.primaryDark }, description: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 4 },
});
