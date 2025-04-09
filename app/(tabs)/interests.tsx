import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useInterests } from '../context/InterestContext';
import { Link } from 'expo-router';

export const interests = [
    'Histoire', 'Art', 'Cuisine', 'Shopping', 'Sport', 
    'Architecture', 'Culture', 'Vie nocturne', 'Nature', 'Musique', 
    'Festivals', 'Théâtre', 'Cinéma', 'Photographie', 'Street Art', 
    'Science', 'Littérature', 'Vin', 'Luxe', 'Parcs', 
    'Musées', 'Sculpture', 'Monuments', 'Artisanat local', 'Gastronomie', 
    'Sites religieux', 'Centres commerciaux', 'Antiquités', 'Vignobles', 'Vélo'
  ];
  
  const InterestsScreen = ({ navigation }: { navigation: any }) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const { setInterests } = useInterests();
    const { recommendations, isLoading, error } = useRecommendations();
  
    const toggleInterest = (interest: string) => {
      if (selectedInterests.includes(interest)) {
        const newInterests = selectedInterests.filter(i => i !== interest);
        setSelectedInterests(newInterests);
        setInterests(newInterests);
      } else {
        if (selectedInterests.length < 7) {
          const newInterests = [...selectedInterests, interest];
          setSelectedInterests(newInterests);
          setInterests(newInterests);
        } else {
          Alert.alert('Limite atteinte', 'Vous pouvez sélectionner jusqu\'à 7 intérêts maximum.');
        }
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Choisissez vos centres d'intérêt (max 7)</Text>
        
        <ScrollView contentContainerStyle={styles.interestContainer}>
          {interests.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.interestBubble,
                selectedInterests.includes(item) && styles.selectedBubble,
                index % 2 === 0 ? styles.oddBubble : styles.evenBubble, 
              ]}
              onPress={() => toggleInterest(item)}
            >
              <Text style={styles.interestText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        
  
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('NextScreen', { selectedInterests })}
          disabled={selectedInterests.length === 0} 
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default InterestsScreen;
  