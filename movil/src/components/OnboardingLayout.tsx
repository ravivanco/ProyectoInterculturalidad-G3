import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { PrimaryButton } from './PrimaryButton';
import { ProgressBar } from './ProgressBar';

type Props = PropsWithChildren<{
  step: number; title: string; description: string; onNext: () => void; onBack?: () => void;
  nextDisabled?: boolean; nextTitle?: string; loading?: boolean;
}>;

export function OnboardingLayout({ step, title, description, onNext, onBack, nextDisabled, nextTitle = 'Siguiente', loading, children }: Props) {
  return <View style={styles.page}><ScrollView contentContainerStyle={styles.content}><ProgressBar step={step} total={7} /><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text><View style={styles.body}>{children}</View></ScrollView><View style={styles.footer}>{onBack ? <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>Anterior</Text></Pressable> : null}<View style={styles.next}><PrimaryButton disabled={nextDisabled} loading={loading} onPress={onNext} title={nextTitle} /></View></View></View>;
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 }, content: { flexGrow: 1, padding: 24, paddingTop: 56 },
  title: { color: colors.text, fontSize: 27, fontWeight: '800', marginTop: 28 }, description: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 8 }, body: { marginTop: 28 },
  footer: { alignItems: 'center', backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', gap: 12, padding: 16 },
  back: { paddingHorizontal: 12, paddingVertical: 16 }, backText: { color: colors.primary, fontWeight: '700' }, next: { flex: 1 },
});
