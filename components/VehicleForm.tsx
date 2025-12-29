
import React, { useState, useRef } from 'react';
import { Vehicle, VehicleType } from '../types';
import { Camera, Save, X, Clock, Navigation, Calendar, Settings, Hash, ShieldCheck } from 'lucide-react';
import { analyzeVehicleImage } from '../services/geminiService';

interface VehicleFormProps {
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
  initialData?: Vehicle;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>(initialData || {
    type: VehicleType.ROAD,
    vehicleNumber: '',
    brand: '',
    model: '',
    currentUsage: 0,
    maintenanceFrequency: 10000,
    maintenanceIntervalMonths: 12,
    inspectionIntervalMonths: 24,
    lastInspectionDate: new Date().toISOString().split('T')[0],
    registrationDate: new Date().toISOString().split('T')[0],
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, photo: base64 }));
      
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeVehicleImage(base64);
        setFormData(prev => ({
          ...prev,
          brand: analysis.brand || prev.brand,
          model: analysis.model || prev.model,
          licensePlate: analysis.licensePlate || prev.licensePlate
        }));
      } catch (err) {
        console.error("AI Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl space-y-6 max-w-2xl mx-auto border border-gray-100 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {initialData ? 'Modifica Mezzo' : 'Nuovo Mezzo'}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={24} />
        </button>
      </div>

      <div className="relative group w-full h-40 bg-gray-50 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-500 transition-all">
        {formData.photo ? (
          <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-blue-500">
            <Camera size={32} />
            <span className="mt-2 text-sm font-bold">Aggiungi Foto Mezzo</span>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          accept="image/*"
        />
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center text-blue-600 font-bold">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            AI sta analizzando...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-1">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Tipo Mezzo</label>
          <div className="flex gap-2">
            {[VehicleType.ROAD, VehicleType.CONSTRUCTION].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({...formData, type})}
                className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm ${
                  formData.type === type 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                }`}
              >
                {type === VehicleType.ROAD ? 'Stradale' : 'Edile'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">N° Mezzo (ID Aziendale)</label>
          <div className="relative">
            <input 
              type="text" 
              value={formData.vehicleNumber}
              onChange={e => setFormData({...formData, vehicleNumber: e.target.value})}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black"
              placeholder="es. M-01, Gru-5"
            />
            <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Marca</label>
          <input 
            type="text" 
            value={formData.brand}
            onChange={e => setFormData({...formData, brand: e.target.value})}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black"
            placeholder="es. Fiat, Caterpillar"
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Modello</label>
          <input 
            type="text" 
            value={formData.model}
            onChange={e => setFormData({...formData, model: e.target.value})}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black"
            placeholder="es. Ducato, 320 GC"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Targa</label>
          <input 
            type="text" 
            value={formData.licensePlate || ''}
            onChange={e => setFormData({...formData, licensePlate: e.target.value})}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black"
            placeholder="AA123BB"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            Uso Attuale ({formData.type === VehicleType.ROAD ? 'Km' : 'Ore'})
          </label>
          <div className="relative">
            <input 
              type="number" 
              value={formData.currentUsage}
              onChange={e => setFormData({...formData, currentUsage: Number(e.target.value)})}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {formData.type === VehicleType.ROAD ? <Navigation size={18}/> : <Clock size={18}/>}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
          <div className="md:col-span-2">
            <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
              <Settings size={16} /> Cadenza Manutenzione
            </h4>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">
              Ogni quanti {formData.type === VehicleType.ROAD ? 'Kilometri' : 'Ore'}
            </label>
            <input 
              type="number" 
              value={formData.maintenanceFrequency}
              onChange={e => setFormData({...formData, maintenanceFrequency: Number(e.target.value)})}
              className="w-full rounded-xl border border-blue-100 bg-white p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black shadow-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">
              Ogni quanti Mesi (Tempo)
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={formData.maintenanceIntervalMonths}
                onChange={e => setFormData({...formData, maintenanceIntervalMonths: Number(e.target.value)})}
                className="w-full rounded-xl border border-blue-100 bg-white p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black shadow-sm"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                <Calendar size={18}/>
              </div>
            </div>
          </div>
        </div>

        {formData.type === VehicleType.ROAD && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div className="md:col-span-2">
              <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} /> Scadenza Revisione (Legale)
              </h4>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
                Data Ultima Revisione
              </label>
              <input 
                type="date" 
                value={formData.lastInspectionDate}
                onChange={e => setFormData({...formData, lastInspectionDate: e.target.value})}
                className="w-full rounded-xl border border-indigo-100 bg-white p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-black shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
                Ogni quanti Mesi
              </label>
              <input 
                type="number" 
                value={formData.inspectionIntervalMonths}
                onChange={e => setFormData({...formData, inspectionIntervalMonths: Number(e.target.value)})}
                className="w-full rounded-xl border border-indigo-100 bg-white p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-black shadow-sm"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Data Immatricolazione</label>
          <input 
            type="date" 
            value={formData.registrationDate}
            onChange={e => setFormData({...formData, registrationDate: e.target.value})}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black"
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Data Acquisto</label>
          <input 
            type="date" 
            value={formData.purchaseDate}
            onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-black"
          />
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={() => onSave(formData as Vehicle)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Save size={20} />
          Salva Mezzo Aziendale
        </button>
      </div>
    </div>
  );
};
