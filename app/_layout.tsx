import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // Ensure this path is correct
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch the specific role from your 'users' collection
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!userRole && !inAuthGroup) {
      // Redirect to Login/Registration if not authenticated
      router.replace('/(auth)');
    } else if (userRole) {
      // Logic for Role-Based Redirection
      if (userRole === 'superadmin') router.replace('/(superadmin)');
      else if (userRole === 'teacher') router.replace('/(admin)/dashboard');
      else if (userRole === 'student') router.replace('/(student)');
    }
  }, [userRole, initializing, segments]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1B4D3E" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}