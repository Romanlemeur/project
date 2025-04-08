import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { signUp } from './database/auth';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { success, errorMessage } = await signUp(email, password);
      if (!success) {
        setError(errorMessage ?? 'Une erreur est survenue');
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-4xl flex flex-col items-center gap-6"
      >
        <h1 className="text-2xl font-bold text-black mt-[-80px]">Connexion</h1>

        {error && (
          <div className="w-full max-w-md p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full max-w-md p-3 bg-green-100 border border-green-300 text-green-700 text-sm rounded-md">
            Inscription réussie ! Vérifiez votre email.
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-[95%] px-4 py-3 bg-[#fdf1c8] border border-black rounded-md placeholder-black focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-[95%] px-4 py-3 bg-[#fdf1c8] border border-black rounded-md placeholder-black focus:outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full max-w-[70%] bg-[#f4a261] text-white font-semibold py-3 rounded-full hover:opacity-90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Chargement...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </div>
  );
}

export default App;
