import { Tabs, useRouter, useSegments } from 'expo-router';

import { Compass, Search, User, Grid2x2 as Grid } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié, rediriger vers login
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          height: 50,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
      }}
      // Masquer les fichiers database, login et interests dans la barre de navigation
      >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <Grid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          href: null, // Masquer dans la barre de navigation
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          href: null, // Masquer dans la barre de navigation
        }}
      />
      <Tabs.Screen
        name="database"
        options={{
          href: null, // Masquer dans la barre de navigation
        }}
      />
      <Tabs.Screen
        name="styles"
        options={{
          href: null, // Masquer dans la barre de navigation
        }}
      />
    </Tabs>

  );
}