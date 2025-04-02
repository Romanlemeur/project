import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Settings, Heart, Clock, LogOut } from 'lucide-react-native';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      <View style={styles.menuSection}>
        <Pressable style={styles.menuItem}>
          <Settings color="#3b82f6" size={24} />
          <Text style={styles.menuText}>Settings</Text>
        </Pressable>
        
        <Pressable style={styles.menuItem}>
          <Heart color="#3b82f6" size={24} />
          <Text style={styles.menuText}>Favorites</Text>
        </Pressable>
        
        <Pressable style={styles.menuItem}>
          <Clock color="#3b82f6" size={24} />
          <Text style={styles.menuText}>History</Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton}>
        <LogOut color="#ef4444" size={24} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  menuSection: {
    marginTop: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuText: {
    marginLeft: 16,
    fontSize: 18,
    color: '#1e293b',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 18,
    color: '#ef4444',
    fontWeight: 'bold',
  },
});