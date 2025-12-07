import * as tf from '@tensorflow/tfjs';

import { Activity, activities, interestToCategoryMap } from '../data/activities';

export type { Activity };

export interface RecommendationModel {
  predict: (interests: string[]) => Promise<Activity[]>;
  load: () => Promise<boolean>;
  isLoaded: boolean;
}
///mettre sur un serveur le model et le mettre a jours créer une api pour appel 

export const createRecommendationModel = (): RecommendationModel => {
  let isModelLoaded = false;
  let model: tf.LayersModel | null = null;
  let useFallbackMode = true; 
  let tfInitialized = false; 
  
  const encodeInterests = (interests: string[]): tf.Tensor | null => {
    try {
      if (!tfInitialized || typeof tf === 'undefined') {
        console.warn('TensorFlow.js n\'est pas disponible, impossible d\'encoder les intérêts');
        return null;
      }
      
      const allInterests = Object.keys(interestToCategoryMap);
      const encoded = new Array(allInterests.length).fill(0);
      
      interests.forEach(interest => {
        const index = allInterests.indexOf(interest);
        if (index !== -1) {
          encoded[index] = 1;
        }
      });
      
      try {
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
  
  const createModel = (): tf.LayersModel | null => {
    try {
      if (!tf.layers || typeof tf.layers.dense !== 'function' || typeof tf.sequential !== 'function') {
        console.warn('Les fonctions TensorFlow.js nécessaires ne sont pas disponibles');
        return null;
      }
      
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
          units: 5, 
          activation: 'softmax'
        });
        
        const newModel = tf.sequential();
        
        if (newModel && typeof newModel.add === 'function') {
          newModel.add(inputLayer);
          newModel.add(hiddenLayer);
          newModel.add(outputLayer);
          
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
    
    load: async (): Promise<boolean> => {
      try {
        console.log('Tentative de chargement du modèle TensorFlow.js...');
        
        if (typeof tf === 'undefined') {
          console.warn('TensorFlow.js n\'est pas défini, utilisation du mode de secours');
          useFallbackMode = true;
          return false;
        }
        
        if (!tf || typeof tf !== 'object') {
          console.warn('L\'objet TensorFlow.js n\'est pas valide, utilisation du mode de secours');
          useFallbackMode = true;
          return false;
        }
        
        try {
          
          const hasTfReady = tf.ready && typeof tf.ready === 'function';
          const hasSetBackend = typeof tf.setBackend === 'function';
          
          if (!hasTfReady || !hasSetBackend) {
            console.warn('Fonctions essentielles de TensorFlow.js manquantes, utilisation du mode de secours');
            useFallbackMode = true;
            return false;
          }
          
          try {
            
            const initPromise = Promise.race([
              (async () => {
                if (hasSetBackend) {
                  try {
                    await tf.setBackend('cpu'); 
                  } catch (backendError) {
                    console.warn('Erreur lors de la configuration du backend:', backendError);
                    
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
    
    predict: async (interests: string[]): Promise<Activity[]> => {
     
      const getFallbackRecommendations = (userInterests: string[]): Activity[] => {
       
        if (userInterests.length === 0) {
          return [...activities].sort(() => 0.5 - Math.random()).slice(0, 3);
        }
        
        const relevantCategories = new Set<string>();
        userInterests.forEach(interest => {
          const categories = interestToCategoryMap[interest] || [];
          categories.forEach(category => relevantCategories.add(category));
        });
        
        let filteredActivities = activities.filter(activity => 
          relevantCategories.has(activity.category)
        );
        
        if (filteredActivities.length < 3) {
          const remainingActivities = activities.filter(
            activity => !filteredActivities.some(a => a.id === activity.id)
          );
          
          filteredActivities = [
            ...filteredActivities,
            ...remainingActivities.sort(() => 0.5 - Math.random()).slice(0, 3 - filteredActivities.length)
          ];
        }
        
        return filteredActivities
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
      };
    
      if (useFallbackMode) {
        return getFallbackRecommendations(interests);
      }
      
      try {
        
        if (interests.length === 0) {
          return getFallbackRecommendations([]);
        }
        
        if (!isModelLoaded || !model) {
          console.warn('Le modèle n\'est pas disponible, utilisation du mode de secours');
          return getFallbackRecommendations(interests);
        }
        
        try {
          
          const encodedInterests = encodeInterests(interests);
          
          if (!encodedInterests) {
            console.warn('Échec de l\'encodage des intérêts, utilisation du mode de secours');
            return getFallbackRecommendations(interests);
          }
          
          if (!model || typeof model.predict !== 'function') {
            console.warn('Le modèle n\'est pas disponible pour la prédiction, utilisation du mode de secours');
            encodedInterests.dispose(); 
            return getFallbackRecommendations(interests);
          }
          
          const predictions = model.predict(encodedInterests) as tf.Tensor;
          
          if (!predictions || typeof predictions.array !== 'function') {
            console.warn('Prédictions invalides, utilisation du mode de secours');
            encodedInterests.dispose(); 
            return getFallbackRecommendations(interests);
          }
          
          const predictionArray = await predictions.array() as number[][];
          
          encodedInterests.dispose();
          predictions.dispose();
          
          const relevantCategories = new Set<string>();
          interests.forEach(interest => {
            const categories = interestToCategoryMap[interest] || [];
            categories.forEach(category => relevantCategories.add(category));
          });
          
          let recommendedActivities = activities.filter(activity => 
            relevantCategories.has(activity.category)
          );
          
          return recommendedActivities
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
        } catch (predictionError) {
          console.error('Erreur lors de la prédiction avec le modèle:', predictionError);
          return getFallbackRecommendations(interests);
        }
      } catch (error) {
        console.error('Erreur générale lors de la prédiction:', error);
        
        return getFallbackRecommendations(interests);
      }
    }
  };
};
