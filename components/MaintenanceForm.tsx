
import React, { useState } from 'react';
import { MaintenanceRecord, MaintenanceType } from '../types';
import { ClipboardList, Calendar, CheckSquare, Save, X } from 'lucide-react';

interface MaintenanceFormProps {
  vehicleId: string;
  onSave: (record: MaintenanceRecord) => void;
  onCancel: () => void;
  currentUsage: number;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ vehicleId, onSave, onCancel, currentUsage }) => {
  const [record, setRecord] = useState<MaintenanceRecord>({
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    type: MaintenanceType.SCHEDULED,
    partsReplaced: '',
    oilChange: false,
    airFilter: false,
    oilFilter: false,
    fuelFilter: false,
    usageValue: currentUsage
  });

  const toggleFilter = (key: keyof Pick<MaintenanceRecord, 'oilChange' | 'airFilter' | 'oilFilter' | 'fuelFilter'>) => {
    setRecord(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getGoogleCalendarUrl = () => {
    const title = `Manutenzione Mezzo - ${vehicleId}`;
    const details = `Pezzi: ${record.partsReplaced}. Filtri: ${record.oilChange ? 'Olio, ' : ''}${record.airFilter ? 'Aria, ' : ''}${record.oilFilter ? 'Filtro Olio, ' : ''}${record.fuelFilter ? 'Carburante' : ''}`;
    const dateStr = record.date.replace(/-/g, '');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dateStr}/${dateStr}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4 max-w-xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="text-blue-500" />
          Nuovo Intervento
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Intervento</label>
            <input 
              type="date" 
              value={record.date}
              onChange={e => setRecord({...record, date: e.target.value})}
              className="mt-1 block w-full rounded-lg border-gray-300 border bg-white shadow-sm p-2 text-black focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chilometri/Ore</label>
            <input 
              type="number" 
              value={record.usageValue}
              onChange={e => setRecord({...record, usageValue: Number(e.target.value)})}
              className="mt-1 block w-full rounded-lg border-gray-300 border bg-white shadow-sm p-2 text-black focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo Intervento</label>
          <div className="flex gap-2 mt-2">
            {[MaintenanceType.SCHEDULED, MaintenanceType.EXTRAORDINARY].map(type => (
              <button
                key={type}
                onClick={() => setRecord({...record, type})}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                  record.type === type 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filtri e Operazioni Rapide</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { id: 'oilChange', label: 'Cambio Olio' },
              { id: 'airFilter', label: 'Filtro Aria' },
              { id: 'oilFilter', label: 'Filtro Olio' },
              { id: 'fuelFilter', label: 'Filtro Carburante' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => toggleFilter(item.id as any)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                  (record as any)[item.id]
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                <CheckSquare size={16} className={(record as any)[item.id] ? 'fill-green-500' : ''} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pezzi Sostituiti</label>
          <textarea
            value={record.partsReplaced}
            onChange={e => setRecord({...record, partsReplaced: e.target.value})}
            className="mt-1 block w-full rounded-lg border-gray-300 border bg-white shadow-sm p-2 h-24 text-black focus:ring-blue-500"
            placeholder="Elenca i pezzi sostituiti..."
          />
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button 
          onClick={() => onSave(record)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Registra Intervento
        </button>
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Calendar size={20} className="text-red-500" />
          Aggiungi a Google Calendar
        </a>
      </div>
    </div>
  );
};
