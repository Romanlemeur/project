import React from 'react';
import { Slot } from 'expo-router';

// Ce fichier indique à Expo Router que ce dossier n'est pas une route publique
// mais plutôt un dossier contenant des utilitaires
export default function DatabaseLayout() {
  return <Slot />;
}