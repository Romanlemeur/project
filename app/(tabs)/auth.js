import { supabase } from './supabase.js';

// Fonction d'inscription avec hachage automatique par Supabase
export const signUp = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
        avatar_url: '' // Laissez vide pour une image par défaut
      }
    }
  });

  if (error) throw error;
  return data;
};

// Fonction de connexion
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

// Fonction de déconnexion
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Récupérer la session active
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};