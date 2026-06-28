import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

export function OnboardingWelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completa tu perfil</Text>
      <Text style={styles.body}>Tu cuenta fue creada. A continuación registraremos tu información nutricional.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 24 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 12 },
  body: { color: colors.muted, fontSize: 16, lineHeight: 24 },
});
