import supabase  from './supabaseclient';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
      user: null,
    };
  }

  return {
    success: true,
    errorMessage: null,
    user: data.user,
  };
}
