import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { View } from '../types';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  setView: (view: View) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Successful login
      setView(View.HOME);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-offWhite px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-panamaBlue p-4 rounded-full text-white mb-4 shadow-lg">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Acceso Administrativo</h2>
          <p className="text-gray-500 text-center mt-2">
            Ingresa tus credenciales para gestionar el contenido del sitio.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-panamaBlue focus:border-transparent outline-none transition-all"
              placeholder="admin@tradicion.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-panamaBlue focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-3">
             <button
              type="button"
              onClick={() => setView(View.HOME)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-panamaBlue text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors flex justify-center items-center shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};