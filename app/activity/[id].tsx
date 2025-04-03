import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Star, MapPin, Clock, ArrowLeft, Heart } from 'lucide-react-native';
import { useState } from 'react';

// Mock data - replace with your actual data
const activities = [
  {
    id: '1',
    name: 'Chasse au trésor dans le Vieux Lyon',
    images: [
      'https://res.cloudinary.com/funbooker/image/upload/ar_4:3,c_fill,dpr_auto,f_auto,q_auto,w_900/v1/marketplace-listing/d67qhnutcu0luguvivhw',
      'https://res.cloudinary.com/funbooker/image/upload/ar_4:3,c_fill,dpr_auto,f_auto,q_auto,w_900/v1/marketplace-listing/tmmvejdyuxspyiigphta',
    ],
    price: 89,
    rating: 4.9,
    reviews: 128,
    duration: '3 heures',
    address: 'Place Saint-Jean, 69005 Lyon',
    category: 'Aventure',
    description: 'Explorez les traboules et ruelles secrètes du Vieux Lyon à travers une chasse au trésor interactive pleine de mystères et d’énigmes.',
  },
  {
    id: '2',
    name: 'Atelier de fabrication de pralines roses',
    images: [
      'https://chefsquare.fr/media/catalog/product/cache/ba664c13fa4d9dee95ca9c0cf96f6c50/p/r/praline-rose_base4.jpg',
      'https://chefsquare.fr/media/catalog/product/cache/087d549c2b4579daf25a5e588756a955/p/r/praline-rose_base2.jpg',
    ],
    price: 39,
    rating: 4.8,
    reviews: 75,
    duration: '2 heures',
    address: 'Cours Lafayette, 69003 Lyon',
    category: 'Gastronomie',
    description: 'Apprenez à réaliser la célèbre spécialité lyonnaise : les pralines roses. Repartez avec vos créations sucrées à déguster chez vous !',
  },
  {
    id: '3',
    name: 'Croisière apéritive sur la Saône',
    images: [
      'https://res.cloudinary.com/funbooker/image/upload/ar_4:3,c_fill,dpr_auto,f_auto,q_auto,w_900/v1/marketplace-listing/zejjoqmi8nm50skovipt',
      'https://res.cloudinary.com/funbooker/image/upload/ar_4:3,c_fill,dpr_auto,f_auto,q_auto,w_900/v1/marketplace-listing/roxcrlay3la8kwcomhdl',
    ],
    price: 49,
    rating: 4.7,
    reviews: 110,
    duration: '1.5 heures',
    address: 'Quai Rambaud, 69002 Lyon',
    category: 'Détente',
    description: 'Profitez d’un apéro convivial à bord d’un bateau tout en découvrant Lyon depuis la Saône au coucher du soleil.',
  },
  {
    id: '4',
    name: 'Visite guidée des traboules du Vieux Lyon',
    images: [
      'https://www.visiterlyon.com/var/site/storage/images/1/3/9/5/395931-3-fre-FR/81584ae3d2e3-Trabouble-vieux-lyon_J-V-L-10_07_2021-credit-briceROBERT-97_1920.jpg',
      'https://images.unsplash.com/photo-1581596541382-b2b08a112ee2?w=800https://www.visiterlyon.com/var/site/storage/images/2/4/8/7/767842-1-fre-FR/9e61a8948074-Maison-du-chamarier-2329-copyright-ONLYLYON-Tourisme-et-Congres_Tristan-Deschamps.jpg',
    ],
    price: 15,
    rating: 4.9,
    reviews: 200,
    duration: '2 heures',
    address: 'Cathédrale Saint-Jean, 69005 Lyon',
    category: 'Culture',
    description: 'Découvrez l’histoire fascinante de Lyon à travers ses célèbres traboules accompagnés d’un guide passionné.',
  },
  {
    id: '5',
    name: 'Cours de cuisine bouchon lyonnais',
    images: [
      'https://chefsquare.com/media/catalog/product/cache/087d549c2b4579daf25a5e588756a955/c/u/cuisine-traditionnelle-lyonnaise_base1.jpg',
      'https://chefsquare.com/media/catalog/product/cache/087d549c2b4579daf25a5e588756a955/c/u/cuisine-traditionnelle-lyonnaise_base2.jpg',
    ],
    price: 65,
    rating: 4.6,
    reviews: 68,
    duration: '3 heures',
    address: 'Rue Mercière, 69002 Lyon',
    category: 'Gastronomie',
    description: 'Participez à un atelier culinaire pour apprendre à cuisiner les classiques lyonnais comme la quenelle ou l’andouillette.',
  },
  {
    id: '6',
    name: 'Escape Game sur la Résistance',
    images: [
      'https://whereez.com/media/cache/product_carousel_webp/uploads/images/product/escape-game-outdoor-a-la-croix-rousse-rejoignez-la-resistance/escape-game-outdoor-a-la-croix-rousse-rejoignez-la-resistance-0-67a6601337019691622140.webp',
      'https://whereez.com/media/cache/product_carousel_webp/uploads/images/product/escape-game-outdoor-a-la-croix-rousse-rejoignez-la-resistance/escape-game-outdoor-a-la-croix-rousse-rejoignez-la-resistance-2-67a660133815d256834859.webp',
    ],
    price: 25,
    rating: 4.5,
    reviews: 91,
    duration: '1 heure',
    address: 'Rue Sainte-Hélène, 69002 Lyon',
    category: 'Aventure',
    description: 'Vivez une expérience immersive en tentant d’échapper à la Gestapo dans un scénario historique captivant.',
  },
  {
    id: '7',
    name: 'Balade à vélo électrique sur les berges',
    images: [
      'https://boutique.visiterlyon.com/media/catalog/product/cache/eba852a5c78b3a6cc0c2087b1359db88/m/o/mobilbaord-bike-circuit-2h-grand-tour-banniere.jpg',
      'https://cdn.getyourguide.com/img/tour/5db0391fe9a82.jpeg/98.jpg',
    ],
    price: 30,
    rating: 4.7,
    reviews: 80,
    duration: '2 heures',
    address: 'Parc de la Tête d’Or, 69006 Lyon',
    category: 'Sport',
    description: 'Découvrez les plus beaux spots de Lyon à vélo électrique avec un guide local enthousiaste.',
  },
  {
    id: '8',
    name: 'Atelier de création de soie',
    images: [
      'https://maisondescanuts.fr/wp-content/uploads/2025/01/ambiance-22-scaled.jpg',
      'https://maisondescanuts.fr/wp-content/uploads/2025/03/fleurs-scaled.jpeg',
    ],
    price: 55,
    rating: 4.8,
    reviews: 66,
    duration: '2 heures',
    address: 'Croix-Rousse, 69004 Lyon',
    category: 'Artisanat',
    description: 'Apprenez les techniques ancestrales de la soierie lyonnaise dans un atelier traditionnel du quartier Croix-Rousse.',
  },
  {
    id: '9',
    name: 'Séance de yoga au parc de la Tête d’Or',
    images: [
      'https://pandipandayoga.com/wp-content/uploads/2023/05/img_2851.jpeg',
      'https://pandipandayoga.com/wp-content/uploads/2023/05/img_2851.jpeg',
    ],
    price: 20,
    rating: 4.4,
    reviews: 43,
    duration: '1 heure',
    address: 'Parc de la Tête d’Or, 69006 Lyon',
    category: 'Bien-être',
    description: 'Détendez-vous au grand air avec une séance de yoga guidée dans le plus grand parc de Lyon.',
  },
  {
    id: '10',
    name: 'Street art tour à la Croix-Rousse',
    images: [
      'https://www.lyon-visite.info/wp-content/uploads/2019/08/toto_ld-spiderlyon-street-art-lyon-visite-1200.jpg',
      'https://www.lyon-visite.info/wp-content/uploads/2024/05/Street-art-Marie-Garnier-2-1024x1024.jpeg',
    ],
    price: 18,
    rating: 4.6,
    reviews: 58,
    duration: '1.5 heures',
    address: 'Boulevard de la Croix-Rousse, 69004 Lyon',
    category: 'Culture',
    description: 'Partez à la découverte des fresques murales et œuvres de street art emblématiques de la Croix-Rousse.',
  },

  {
    id: '11',
    name: 'Dégustation de vins du Beaujolais',
    images: [
      'https://www.oenotourisme.com/wp-content/uploads/2019/08/tane-3-5.jpg',
      'https://media.winalist.com/prod/uploads/domaine-du-chateau-de-la-chaize-visit-of-the-estate-and-tasting-of-three-wines-9312.jpg?twic=v1/cover=390x400',
    ],
    price: 60,
    rating: 4.9,
    reviews: 120,
    duration: '2 heures',
    address: 'Place Bellecour, 69002 Lyon',
    category: 'Gastronomie',
    description: 'Initiez-vous aux vins du Beaujolais avec un sommelier expert, accompagné de fromages locaux en plein cœur de Lyon.',
  },
  {
    id: '12',
    name: 'Atelier photo sur les quais de Saône',
    images: [
      'https://studiolecarre.com/wp-content/uploads/2020/05/2019-05-05-14-50-37-Amazing-Beach-Blanc-EVJF-Famille-FAMILY-Femme-fumee-Marine-Musique-PHOTOCALL-Z-Studiolecarre.com-L1024-200x200.jpg',
      'https://studiolecarre.com/wp-content/uploads/2020/05/2017-10-14-12-57-46-5-Etoiles-AMAZING-Amazing-Disco-Confinement-Couple-Enfant-Famille-Femme-groupe-homme-parent-L1024-200x200.jpg',
    ],
    price: 35,
    rating: 4.7,
    reviews: 52,
    duration: '2 heures',
    address: 'Quai Saint-Antoine, 69001 Lyon',
    category: 'Créatif',
    description: 'Apprenez à capturer les plus beaux clichés de Lyon avec un photographe professionnel lors d’une balade urbaine.',
  },
  {
    id: '13',
    name: 'Spectacle de Guignol traditionnel',
    images: [
      'https://static.wixstatic.com/media/611a73_242098a39c574532972ae7c901725dc1~mv2.jpg/v1/fill/w_585,h_419,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/_MAG0252.jpg',
      'https://static.wixstatic.com/media/611a73_bb2da989b42146788b3b22feba328caa~mv2.jpg/v1/crop/x_9,y_0,w_5188,h_3712/fill/w_585,h_419,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/TMG-2022-30.jpg',
    ],
    price: 10,
    rating: 4.5,
    reviews: 134,
    duration: '45 minutes',
    address: 'Théâtre Le Guignol de Lyon, 69005',
    category: 'Culture',
    description: 'Assistez à une représentation du célèbre Guignol lyonnais, un moment drôle et authentique pour petits et grands.',
  },
  {
    id: '14',
    name: 'Baptême de l’air en montgolfière près de Lyon',
    images: [
      'https://media.sport-decouverte.com/images/productcard/t365x365/30252/0/vol-en-montgolfiere-pres-de-lyon--survol-du-beaujolais.jpg?v=4Dfcb',
      'https://media.sport-decouverte.com/images/productcard/t365x365/30252/3/vol-en-montgolfiere-pres-de-lyon--survol-du-beaujolais.jpg?v=PMDGF',
    ],
    price: 190,
    rating: 4.9,
    reviews: 47,
    duration: '3 heures',
    address: 'Monts du Lyonnais, 69850',
    category: 'Aventure',
    description: 'Vivez un moment inoubliable avec un vol en montgolfière au lever du soleil, vue panoramique garantie sur Lyon et ses environs.',
  },
  {
    id: '15',
    name: 'Brunch musical dans un rooftop',
    images: [
      'https://i0.wp.com/lyon.citycrunch.fr/wp-content/uploads/sites/3/2024/02/mademoiselle-simone.jpg?w=1000&ssl=1',
      'https://i0.wp.com/lyon.citycrunch.fr/wp-content/uploads/sites/3/2024/02/salon-brunch.jpg?w=1000&ssl=1',
    ],
    price: 42,
    rating: 4.6,
    reviews: 78,
    duration: '2 heures',
    address: 'Rooftop Les Muses, 69001 Lyon',
    category: 'Détente',
    description: 'Savourez un brunch raffiné avec musique live dans l’un des plus beaux rooftops lyonnais avec vue sur Fourvière.',
  },
  {
    id: '16',
    name: 'Atelier création de parfum',
    images: [
      'https://res.cloudinary.com/funbooker/image/upload/ar_4:3,c_fill,dpr_2.0,f_auto,q_auto,w_300/v1/marketplace-listing/sshq1ygvviiyme5mmfvu',
      'https://res.cloudinary.com/funbooker/image/upload/ar_4:3,c_fill,dpr_2.0,f_auto,q_auto,w_300/v1/marketplace-listing/cwtgsfizmhgyvp07zrqy',
    ],
    price: 59,
    rating: 4.8,
    reviews: 41,
    duration: '1.5 heures',
    address: 'Rue de la République, 69002 Lyon',
    category: 'Créatif',
    description: 'Composez votre propre parfum sur mesure avec l’aide d’un parfumeur, et repartez avec un flacon unique.',
  },
  {
    id: '17',
    name: 'Session d’escalade en salle',
    images: [
      'https://lyon-gerland.climb-up.fr/wp-content/uploads/2024/04/P6A5249-scaled-e1708525464501.jpeg',
      'https://www.escalade-montagne.fr/wp-content/uploads/2020/04/escalade-lyon-confluence-climb-up.jpg',
    ],
    price: 22,
    rating: 4.4,
    reviews: 88,
    duration: '1 heure',
    address: 'Mur de Lyon, 69007 Lyon',
    category: 'Sport',
    description: 'Essayez l’escalade indoor dans l’une des plus grandes salles de France, avec encadrement pour débutants.',
  },
  {
    id: '18',
    name: 'Cours de dessin dans un café artistique',
    images: [
      'https://www.loutsa.fr/cdn/shop/files/latte_tasselifestyle.jpg?v=1725442478&width=600',
      'https://www.loutsa.fr/cdn/shop/files/apprendre_latte_art.jpg?v=1725442189&width=600',
    ],
    price: 27,
    rating: 4.7,
    reviews: 59,
    duration: '2 heures',
    address: 'Café l’Art pour Tous, 69001 Lyon',
    category: 'Créatif',
    description: 'Détendez-vous autour d’un café tout en apprenant les bases du croquis avec un artiste local.',
  },
  {
    id: '19',
    name: 'Initiation à la dégustation de chocolat',
    images: [
      'https://api.spotlag.com/cdn?src=https://api.spotlag.com/media/products/66261d6271a8d744457726.jpeg&quality=70&width=1080',
      'https://cdn.aws.wecandoo.com/6560effec9be8s8JIxktbeHDRzJ9a6tBX4fjSJtLcqtIuBEZlUaL1.jpg?width=1200',
    ],
    price: 30,
    rating: 4.8,
    reviews: 69,
    duration: '1.5 heures',
    address: 'Maison Bernachon, 69006 Lyon',
    category: 'Gastronomie',
    description: 'Explorez les arômes du chocolat haut de gamme à travers une dégustation guidée par un maître chocolatier.',
  },
  {
    id: '20',
    name: 'Visite nocturne contée de Lyon',
    images: [
      'https://cybele-lyon.fr/wp-content/uploads/2016/01/cybele-3-recadree-768x513.jpg.webp',
      
    ],
    price: 20,
    rating: 4.9,
    reviews: 101,
    duration: '1.5 heures',
    address: 'Place des Terreaux, 69001 Lyon',
    category: 'Culture',
    description: 'Redécouvrez Lyon à la tombée de la nuit avec un conteur qui vous plongera dans les légendes et secrets de la ville.',
  }
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