
import React, { useState } from 'react';
import { Vehicle, VehicleType } from '../types';
import { X, Save, Navigation, Clock, TrendingUp } from 'lucide-react';

interface UsageUpdateModalProps {
  vehicle: Vehicle;
  onSave: (id: string, newValue: number) => void;
  onClose: () => void;
}

export const UsageUpdateModal: React.FC<UsageUpdateModalProps> = ({ vehicle, onSave, onClose }) => {
  const [value, setValue] = useState<number>(vehicle.currentUsage);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-300">
      <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            {vehicle.type === VehicleType.ROAD ? <Navigation size={20} /> : <Clock size={20} />}
          </div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Aggiorna Stato</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
          <X size={20} />
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div className="text-center">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mezzo: {vehicle.brand} {vehicle.model}</p>
          <p className="text-sm text-gray-500 font-medium">Inserisci il valore attuale visualizzato sul contatore del mezzo.</p>
        </div>

        <div className="relative">
          <input 
            type="number" 
            autoFocus
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full text-4xl font-black text-center py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-black"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black uppercase text-xs tracking-widest pointer-events-none">
            {vehicle.type === VehicleType.ROAD ? 'KM' : 'Ore'}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 py-2 px-4 rounded-full mx-auto w-fit">
          <TrendingUp size={12} />
          <span>Precedente: {vehicle.currentUsage.toLocaleString()}</span>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t flex gap-3">
        <button 
          onClick={onClose}
          className="flex-1 py-4 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
        >
          Annulla
        </button>
        <button 
          onClick={() => onSave(vehicle.id, value)}
          className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Conferma
        </button>
      </div>
    </div>
  );
};
