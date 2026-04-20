import { StyleSheet, Text, View } from 'react-native';

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.empty}>No messages yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700' },
  empty: { marginTop: 24, color: '#666' },
});
