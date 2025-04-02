import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Star, MapPin, Clock, ArrowLeft, Heart } from 'lucide-react-native';
import { useState } from 'react';

// Mock data - replace with your actual data
const activities = [
  {
    id: '1',
    name: 'Santorini Sunset Cruise',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
      'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800',
    ],
    price: 89,
    rating: 4.9,
    reviews: 128,
    duration: '3 hours',
    address: 'Oia Port, Santorini, Greece',
    category: 'Adventure',
    description: 'Experience the magic of Santorini\'s world-famous sunset aboard our luxury catamaran. Sail along the caldera, enjoy Greek wine and fresh local cuisine, and swim in crystal-clear waters.',
  },
  {
    id: '2',
    name: 'Kyoto Tea Ceremony',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800',
    ],
    price: 45,
    rating: 4.8,
    reviews: 95,
    duration: '1.5 hours',
    address: 'Gion District, Kyoto, Japan',
    category: 'Culture',
    description: 'Immerse yourself in Japanese culture with a traditional tea ceremony in an authentic tea house. Learn about the history and significance of this ancient ritual from a master tea practitioner.',
  },
  // ... add details for other activities
];

export default function ActivityDetails() {
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const activity = activities.find(a => a.id === id);

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Activity not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#1e293b" size={24} />
        </Pressable>
        <Pressable style={styles.favoriteButton}>
          <Heart color="#3b82f6" size={24} />
        </Pressable>
      </View>

      <Pressable
        onPress={() => {
          setCurrentImageIndex((prev) => 
            prev === activity.images.length - 1 ? 0 : prev + 1
          );
        }}
      >
        <Image
          source={{ uri: activity.images[currentImageIndex] }}
          style={styles.image}
        />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>{activity.name}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Star color="#f59e0b" size={16} />
            <Text style={styles.rating}>{activity.rating}</Text>
            <Text style={styles.reviews}>({activity.reviews} reviews)</Text>
          </View>
          <View style={styles.durationContainer}>
            <Clock color="#64748b" size={16} />
            <Text style={styles.duration}>{activity.duration}</Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <MapPin color="#64748b" size={16} />
          <Text style={styles.address}>{activity.address}</Text>
        </View>

        <Text style={styles.price}>${activity.price} per person</Text>

        <Text style={styles.sectionTitle}>About this experience</Text>
        <Text style={styles.description}>{activity.description}</Text>

        <Pressable style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#1e293b',
    marginLeft: 4,
    fontWeight: '500',
  },
  reviews: {
    color: '#64748b',
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    color: '#64748b',
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    color: '#64748b',
    marginLeft: 8,
    flex: 1,
  },
  price: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 24,
  },
});