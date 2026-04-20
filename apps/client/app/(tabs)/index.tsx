import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@eazyfitness/shared/auth';

export default function HomeScreen() {
  const { profile, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hey, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
      </Text>
      <Text style={styles.subtitle}>Ready to train?</Text>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 40,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
