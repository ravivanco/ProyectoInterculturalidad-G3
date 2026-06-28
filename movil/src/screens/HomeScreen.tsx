import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export function HomeScreen() {
  return <View style={styles.container}><Text style={styles.brand}>DK-FITT</Text><Text style={styles.title}>Tu espacio nutricional</Text></View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 24 },
  brand: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 12 },
});
