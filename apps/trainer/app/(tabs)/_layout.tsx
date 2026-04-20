import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="clients" options={{ title: 'Clients' }} />
      <Tabs.Screen name="programs" options={{ title: 'Programs' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
    </Tabs>
  );
}
