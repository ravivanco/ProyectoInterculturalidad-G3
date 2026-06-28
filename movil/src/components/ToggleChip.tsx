import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
export function ToggleChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={onPress} style={[styles.chip, selected ? styles.selected : undefined]}><Text style={[styles.text, selected ? styles.textSelected : undefined]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({ chip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 11 }, selected: { backgroundColor: colors.primary, borderColor: colors.primary }, text: { color: colors.text, fontSize: 15, fontWeight: '600' }, textSelected: { color: colors.surface } });
