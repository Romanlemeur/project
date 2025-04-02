import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

const categories = [
  'All',
  'Landmarks',
  'Food & Drink',
  'Adventure',
  'Culture',
  'Nature',
  'Shopping',
];

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        {/* Activities filtered by category will go here */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
});