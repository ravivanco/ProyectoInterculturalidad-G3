import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export function ProgressBar({ step, total }: { step: number; total: number }) {
  const percentage = Math.min(100, Math.max(0, (step / total) * 100));
  return <View style={styles.wrapper}><Text style={styles.label}>Paso {step} de {total}</Text><View style={styles.track}><View style={[styles.fill, { width: `${percentage}%` }]} /></View></View>;
}

const styles = StyleSheet.create({ wrapper: { gap: 8 }, label: { color: colors.muted, fontSize: 13, fontWeight: '700' }, track: { backgroundColor: colors.primarySoft, borderRadius: 99, height: 8, overflow: 'hidden' }, fill: { backgroundColor: colors.primary, borderRadius: 99, height: '100%' } });
