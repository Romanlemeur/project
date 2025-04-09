import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { activities } from '../data/activities';
import { Image } from 'react-native';
const categories = [
  'All',
  'Détente',
  'Gastronomie',
  'Aventure',
  'Culture',
  'Sport',
  'Shopping',
  'Nature',
];

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filtrer les activités en fonction de la catégorie sélectionnée
  const filteredActivities = activities.filter(activity =>
    selectedCategory === 'All' ? true : activity.category === selectedCategory
  );
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesBar}>
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView style={styles.activitiesContainer}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <Image source={{ uri: activity.images[0] }} style={styles.activityImage} />
              <Text style={styles.activityTitle}>{activity.name}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityPrice}>Prix: {activity.price} €</Text>
              <Text style={styles.activityDuration}>Durée: {activity.duration}</Text>
              <Text style={styles.activityRating}>Note: {activity.rating} ({activity.reviews} avis)</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noActivitiesText}>Aucune activité à afficher pour cette catégorie.</Text>
        )}
      </ScrollView>
    </View>
);};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 25,
  },
  categoriesBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    color: '#64748b',
    fontSize: 16,
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  activitiesContainer: {
    flex: 1,
    padding: 16,
  },
  activityItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
  },
  activityImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  activityDescription: {
    marginVertical: 4,
  },
  activityPrice: {
    fontWeight: 'bold',
  },
  activityDuration: {
    color: '#64748b',
  },
  activityRating: {
    color: '#64748b',
  },
  noActivitiesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748b',
  },
});