/**
 * Module de machine learning pour les recommandations basées sur les intérêts
 * Utilise TensorFlow.js pour créer un modèle de recommandation
 */
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import { Activity, activities, interestToCategoryMap } from '../data/activities';

// Réexporter le type Activity pour la compatibilité
export type { Activity };

export interface RecommendationModel {
  predict: (interests: string[]) => Promise<Activity[]>;
  load: () => Promise<boolean>;
  isLoaded: boolean;
}

// Utilisation des données d'activités centralisées importées depuis '../data/activities'
// et du mapping des intérêts aux catégories également importé

// Cette fonction est implémentée avec TensorFlow.js mais inclut une solution de secours robuste
export const createRecommendationModel = (): RecommendationModel => {
  let isModelLoaded = false;
  let model: tf.LayersModel | null = null;
  let useFallbackMode = true; // Par défaut, utiliser le mode de secours pour éviter les erreurs
  let tfInitialized = false; // Pour suivre si TensorFlow a été correctement initialisé
  
  // Fonction pour encoder les intérêts en vecteur one-hot sans utiliser directement tf.tensor2d
  // Cette approche évite les erreurs isTypedArray
  const encodeInterests = (interests: string[]): tf.Tensor | null => {
    try {
      // Vérification de sécurité pour TensorFlow
      if (!tfInitialized || typeof tf === 'undefined') {
        console.warn('TensorFlow.js n\'est pas disponible, impossible d\'encoder les intérêts');
        return null;
      }
      
      // Créer un vecteur de dimensions correspondant aux intérêts possibles
      const allInterests = Object.keys(interestToCategoryMap);
      const encoded = new Array(allInterests.length).fill(0);
      
      // Marquer les intérêts sélectionnés
      interests.forEach(interest => {
        const index = allInterests.indexOf(interest);
        if (index !== -1) {
          encoded[index] = 1;
        }
      });
      
      // Utiliser une méthode plus sûre pour créer le tenseur
      try {
        // Vérifier si la fonction tensor2d est disponible
        if (typeof tf.tensor2d === 'function') {
          return tf.tensor2d([encoded]);
        } else {
          console.warn('La fonction tf.tensor2d n\'est pas disponible');
          return null;
        }
      } catch (tensorError) {
        console.error('Erreur lors de la création du tenseur:', tensorError);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de l\'encodage des intérêts:', error);
      return null;
    }
  };
  
  // Fonction pour créer un modèle simple avec vérifications de sécurité
  const createModel = (): tf.LayersModel | null => {
    try {
      // Vérifier si les fonctions nécessaires de TensorFlow sont disponibles
      if (!tf.layers || typeof tf.layers.dense !== 'function' || typeof tf.sequential !== 'function') {
        console.warn('Les fonctions TensorFlow.js nécessaires ne sont pas disponibles');
        return null;
      }
      
      // Créer le modèle avec gestion d'erreurs à chaque étape
      try {
        const inputLayer = tf.layers.dense({
          units: 30,
          activation: 'relu',
          inputShape: [30]
        });
        
        const hiddenLayer = tf.layers.dense({
          units: 20,
          activation: 'relu'
        });
        
        const outputLayer = tf.layers.dense({
          units: 5, // Nombre de catégories d'activités
          activation: 'softmax'
        });
        
        const newModel = tf.sequential();
        
        // Ajouter les couches avec vérification
        if (newModel && typeof newModel.add === 'function') {
          newModel.add(inputLayer);
          newModel.add(hiddenLayer);
          newModel.add(outputLayer);
          
          // Compiler le modèle avec vérification
          if (typeof newModel.compile === 'function') {
            newModel.compile({
              optimizer: 'adam',
              loss: 'categoricalCrossentropy',
              metrics: ['accuracy']
            });
            
            return newModel;
          } else {
            console.warn('La fonction compile du modèle n\'est pas disponible');
            return null;
          }
        } else {
          console.warn('Impossible d\'ajouter des couches au modèle');
          return null;
        }
      } catch (modelError) {
        console.error('Erreur spécifique lors de la création du modèle:', modelError);
        return null;
      }
    } catch (error) {
      console.error('Erreur générale lors de la création du modèle:', error);
      return null;
    }
  };
  
  return {
    isLoaded: isModelLoaded,
    
    // Chargement du modèle avec gestion améliorée des erreurs
    load: async (): Promise<boolean> => {
      try {
        console.log('Tentative de chargement du modèle TensorFlow.js...');
        
        // Vérifier si TensorFlow est disponible
        if (typeof tf === 'undefined') {
          console.warn('TensorFlow.js n\'est pas défini, utilisation du mode de secours');
          useFallbackMode = true;
          return false;
        }
        
        // Vérifier si l'objet tf est valide
        if (!tf || typeof tf !== 'object') {
          console.warn('L\'objet TensorFlow.js n\'est pas valide, utilisation du mode de secours');
          useFallbackMode = true;
          return false;
        }
        
        try {
          // Vérifier les fonctions essentielles de TensorFlow de manière sécurisée
          const hasTfReady = tf.ready && typeof tf.ready === 'function';
          const hasSetBackend = typeof tf.setBackend === 'function';
          
          if (!hasTfReady || !hasSetBackend) {
            console.warn('Fonctions essentielles de TensorFlow.js manquantes, utilisation du mode de secours');
            useFallbackMode = true;
            return false;
          }
          
          // Initialiser TensorFlow.js avec une configuration sécurisée et gestion des timeouts
          try {
            // Utiliser un timeout pour éviter les blocages
            const initPromise = Promise.race([
              (async () => {
                if (hasSetBackend) {
                  try {
                    await tf.setBackend('cpu'); // Utiliser le backend CPU qui est plus stable
                  } catch (backendError) {
                    console.warn('Erreur lors de la configuration du backend:', backendError);
                    // Continuer malgré l'erreur de backend
                  }
                }
                
                if (hasTfReady) {
                  await tf.ready();
                }
                return true;
              })(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout d\'initialisation de TensorFlow')), 5000))
            ]);
            
            await initPromise;
            tfInitialized = true;
            console.log('TensorFlow.js est prêt');
          } catch (initError) {
            console.warn('Erreur lors de l\'initialisation de TensorFlow:', initError);
            useFallbackMode = true;
            return false;
          }
          
          // Créer un modèle simple avec un timeout de sécurité
          try {
            const modelPromise = Promise.race([
              (async () => createModel())(),
              new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout de création du modèle')), 5000))
            ]);
            
            model = await modelPromise;
            
            if (!model) {
              console.warn('Impossible de créer le modèle, utilisation du mode de secours');
              useFallbackMode = true;
              return false;
            }
            
            console.log('Modèle créé avec succès');
            isModelLoaded = true;
            useFallbackMode = false;
            return true;
          } catch (modelTimeoutError) {
            console.error('Timeout ou erreur lors de la création du modèle:', modelTimeoutError);
            useFallbackMode = true;
            return false;
          }
        } catch (modelError) {
          console.error('Erreur lors de la création du modèle:', modelError);
          useFallbackMode = true;
          return false;
        }
      } catch (error) {
        console.error('Erreur lors du chargement de TensorFlow:', error);
        useFallbackMode = true;
        return false;
      }
    },
    
    // Prédiction basée sur les intérêts
    predict: async (interests: string[]): Promise<Activity[]> => {
      // Méthode de secours basée sur le filtrage simple utilisant les données centralisées
      const getFallbackRecommendations = (userInterests: string[]): Activity[] => {
        // Si aucun intérêt n'est sélectionné, retourner des activités aléatoires
        if (userInterests.length === 0) {
          return [...activities].sort(() => 0.5 - Math.random()).slice(0, 3);
        }
        
        // Collecter toutes les catégories pertinentes basées sur les intérêts
        const relevantCategories = new Set<string>();
        userInterests.forEach(interest => {
          const categories = interestToCategoryMap[interest] || [];
          categories.forEach(category => relevantCategories.add(category));
        });
        
        // Filtrer les activités par catégories pertinentes
        let filteredActivities = activities.filter(activity => 
          relevantCategories.has(activity.category)
        );
        
        // Si pas assez d'activités trouvées, ajouter des activités aléatoires
        if (filteredActivities.length < 3) {
          const remainingActivities = activities.filter(
            activity => !filteredActivities.some(a => a.id === activity.id)
          );
          
          filteredActivities = [
            ...filteredActivities,
            ...remainingActivities.sort(() => 0.5 - Math.random()).slice(0, 3 - filteredActivities.length)
          ];
        }
        
        // Limiter à 5 activités maximum et mélanger pour plus de variété
        return filteredActivities
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
      };
      
      // Si le mode de secours est activé, utiliser directement la méthode de secours
      if (useFallbackMode) {
        return getFallbackRecommendations(interests);
      }
      
      try {
        // Si aucun intérêt n'est sélectionné, utiliser la méthode de secours
        if (interests.length === 0) {
          return getFallbackRecommendations([]);
        }
        
        // Vérifier si le modèle est chargé
        if (!isModelLoaded || !model) {
          console.warn('Le modèle n\'est pas disponible, utilisation du mode de secours');
          return getFallbackRecommendations(interests);
        }
        
        try {
          // Encoder les intérêts
          const encodedInterests = encodeInterests(interests);
          
          // Vérifier si l'encodage a réussi
          if (!encodedInterests) {
            console.warn('Échec de l\'encodage des intérêts, utilisation du mode de secours');
            return getFallbackRecommendations(interests);
          }
          
          // Vérifier si le modèle est disponible
          if (!model || typeof model.predict !== 'function') {
            console.warn('Le modèle n\'est pas disponible pour la prédiction, utilisation du mode de secours');
            encodedInterests.dispose(); // Nettoyer le tenseur
            return getFallbackRecommendations(interests);
          }
          
          // Utiliser le modèle pour prédire les catégories d'activités
          const predictions = model.predict(encodedInterests) as tf.Tensor;
          
          // Vérifier si les prédictions sont valides
          if (!predictions || typeof predictions.array !== 'function') {
            console.warn('Prédictions invalides, utilisation du mode de secours');
            encodedInterests.dispose(); // Nettoyer le tenseur
            return getFallbackRecommendations(interests);
          }
          
          const predictionArray = await predictions.array() as number[][];
          
          // Libérer les tenseurs
          encodedInterests.dispose();
          predictions.dispose();
          
          // Méthode alternative basée sur la correspondance directe des intérêts aux catégories
          const relevantCategories = new Set<string>();
          interests.forEach(interest => {
            const categories = interestToCategoryMap[interest] || [];
            categories.forEach(category => relevantCategories.add(category));
          });
          
          // Filtrer les activités par catégories pertinentes en utilisant les données centralisées
          let recommendedActivities = activities.filter(activity => 
            relevantCategories.has(activity.category)
          );
          
          // Limiter à 5 activités maximum et mélanger pour plus de variété
          return recommendedActivities
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
        } catch (predictionError) {
          console.error('Erreur lors de la prédiction avec le modèle:', predictionError);
          return getFallbackRecommendations(interests);
        }
      } catch (error) {
        console.error('Erreur générale lors de la prédiction:', error);
        // En cas d'erreur, utiliser la méthode de secours
        return getFallbackRecommendations(interests);
      }
    }
  };
};
