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
    <div className="min-h-screen flex items-center justify-center bg-background-dark px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-olive/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-card-dark p-10 rounded-3xl shadow-2xl max-w-md w-full border border-white/5 relative z-10 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-background-dark p-5 rounded-full text-gold mb-6 shadow-lg shadow-black/30 border border-gold/10">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ivory tracking-wide">Acceso Administrativo</h2>
          <p className="text-ivory/40 text-center mt-3 text-sm font-light">
            Ingresa tus credenciales para gestionar el contenido del sitio.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background-dark border border-white/10 p-4 rounded-xl focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all text-ivory placeholder-ivory/20"
              placeholder="admin@tradicion.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-dark border border-white/10 p-4 rounded-xl focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all text-ivory placeholder-ivory/20"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-300 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-500/20">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setView(View.HOME)}
              className="flex-1 bg-white/5 text-ivory/60 py-4 rounded-xl font-bold hover:bg-white/10 hover:text-ivory transition-colors uppercase tracking-wider text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gold text-background-dark py-4 rounded-xl font-bold hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 transition-all flex justify-center items-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};