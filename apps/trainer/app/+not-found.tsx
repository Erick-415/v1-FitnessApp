import { StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>This screen doesn&apos;t exist.</Text>
      <Link href="/" style={styles.link}>
        Go home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 48, fontWeight: '700' },
  subtitle: { fontSize: 18, color: '#666', marginTop: 8 },
  link: { marginTop: 24, color: '#000', fontWeight: '600' },
});
