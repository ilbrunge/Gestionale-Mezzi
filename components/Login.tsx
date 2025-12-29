
import React, { useState } from 'react';
import { Truck, ShieldCheck, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 mx-auto mb-6">
            <Truck size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">FleetPro</h1>
          <p className="text-slate-400 mt-2 font-medium">Gestionale Manutenzione Mezzi</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold">Accesso Protetto</h2>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-black">Area Riservata Aziendale</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Codice Aziendale
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci codice..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-center text-2xl font-black tracking-[0.5em] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Entra nel Gestore <ShieldCheck size={20} />
            </button>
          </form>

          <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-8">
            © 2024 FleetManager Pro • Accesso Monitorato
          </p>
        </div>
      </div>
    </div>
  );
};
