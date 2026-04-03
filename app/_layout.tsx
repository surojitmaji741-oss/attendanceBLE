import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import FloatingNav from '../components/FloatingNav'; // Import the component we create next

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      {/* This renders your individual pages like index.tsx or payment.tsx */}
      <Stack screenOptions={{ headerShown: false }} />

      {/* This ensures the Nav Bar is ALWAYS visible on every screen */}
      <FloatingNav />
    </View>
  );
}