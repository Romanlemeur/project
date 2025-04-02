import { View, Text, ScrollView, StyleSheet, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { Star, MapPin } from 'lucide-react-native';
import { Link } from 'expo-router';

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
    address: 'Oia Port, Santorini, Greece',
    category: 'Adventure',
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
    address: 'Gion District, Kyoto, Japan',
    category: 'Culture',
  },
  {
    id: '3',
    name: 'Machu Picchu Guided Tour',
    images: [
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
    ],
    price: 120,
    rating: 4.9,
    address: 'Cusco Region, Peru',
    category: 'Landmarks',
  },
  {
    id: '4',
    name: 'Tuscan Cooking Class',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=800',
    ],
    price: 75,
    rating: 4.7,
    address: 'Florence, Italy',
    category: 'Food & Drink',
  },
  {
    id: '5',
    name: 'Northern Lights Tour',
    images: [
      'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800',
      'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800',
    ],
    price: 150,
    rating: 4.9,
    address: 'Tromsø, Norway',
    category: 'Nature',
  },
];

function ActivityCard({ activity }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Link href={`/activity/${activity.id}`} asChild>
      <Pressable style={styles.card}>
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
        <View style={styles.cardContent}>
          <Text style={styles.title}>{activity.name}</Text>
          <View style={styles.ratingContainer}>
            <Star color="#fbbf24" size={16} />
            <Text style={styles.rating}>{activity.rating}</Text>
          </View>
          <Text style={styles.price}>${activity.price}</Text>
          <View style={styles.addressContainer}>
            <MapPin color="#64748b" size={14} />
            <Text style={styles.address} numberOfLines={1}>{activity.address}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Experiences</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {activities.slice(0, 3).map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ScrollView>
      
      <Text style={styles.sectionTitle}>Popular Adventures</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {activities.slice(2).map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Cultural Experiences</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {activities.slice(1, 4).map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    padding: 16,
  },
  row: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  card: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    color: '#1e293b',
    marginLeft: 4,
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
    flex: 1,
  },
});