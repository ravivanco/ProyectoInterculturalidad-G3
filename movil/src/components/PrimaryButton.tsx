import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';

type Props = { title: string; onPress: () => void; disabled?: boolean; loading?: boolean };

export function PrimaryButton({ title, onPress, disabled, loading }: Props) {
  const unavailable = disabled || loading;
  return (
    <Pressable accessibilityRole="button" disabled={unavailable} onPress={onPress} style={({ pressed }) => [styles.button, unavailable ? styles.disabled : undefined, pressed && !unavailable ? styles.pressed : undefined]}>
      {loading ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, justifyContent: 'center', minHeight: 52, paddingHorizontal: 20 },
  disabled: { backgroundColor: colors.disabled },
  pressed: { backgroundColor: colors.primaryDark },
  text: { color: colors.surface, fontSize: 16, fontWeight: '700' },
});
