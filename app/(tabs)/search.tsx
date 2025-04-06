import { View, TextInput, StyleSheet, ScrollView, Pressable, Text, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

// TypeScript interface pour les résultats de recherche
interface Activity {
  id: string;
  name: string;
  category: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Données fictives - à remplacer par votre vraie source de données
  const mockActivities: Activity[] = [
    { id: '1', name: 'Visite guidée de Lyon', category: 'Culture' },
    { id: '2', name: 'Atelier cuisine lyonnaise', category: 'Gastronomie' },
    { id: '3', name: 'Croisière sur la Saône', category: 'Détente' },
  ];

  // Filtrer les activités basées sur la recherche
  const filteredActivities = mockActivities.filter(activity =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
    }
    // Ici vous pourriez ajouter une logique pour une vraie recherche
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <MaterialIcons 
          name="search" 
          size={24} 
          color="#64748b" 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher des activités..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Résultats de recherche */}
      {searchQuery ? (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.resultItem}
              onPress={() => console.log('Activity selected:', item.id)}
            >
              <Text style={styles.resultTitle}>{item.name}</Text>
              <Text style={styles.resultCategory}>{item.category}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>Aucun résultat trouvé</Text>
          }
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
        /* Historique des recherches */
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recherches récentes</Text>
          {recentSearches.map((search, index) => (
            <Pressable
              key={index}
              style={styles.recentItem}
              onPress={() => setSearchQuery(search)}
            >
              <MaterialIcons name="history" size={20} color="#64748b" />
              <Text style={styles.recentText}>{search}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#1e293b',
    fontSize: 16,
    paddingVertical: 4,
  },
  resultsContainer: {
    paddingBottom: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 24,
    color: '#64748b',
  },
  recentContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentText: {
    marginLeft: 12,
    color: '#334155',
    fontSize: 15,
  },
});