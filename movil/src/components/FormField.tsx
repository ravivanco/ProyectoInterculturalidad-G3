import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';

type Props = TextInputProps & { label: string; error?: string; rightAccessory?: ReactNode };

export function FormField({ label, error, rightAccessory, style, ...props }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : undefined]}>
        <TextInput {...props} accessibilityLabel={label} placeholderTextColor={colors.muted} style={[styles.input, style]} />
        {rightAccessory}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  inputRow: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: 'row', minHeight: 50, paddingHorizontal: 14 },
  inputError: { borderColor: colors.danger },
  input: { color: colors.text, flex: 1, fontSize: 16, paddingVertical: 12 },
  error: { color: colors.danger, fontSize: 13 },
});
