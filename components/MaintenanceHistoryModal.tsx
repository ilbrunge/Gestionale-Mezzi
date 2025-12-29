
import React from 'react';
import { Vehicle, MaintenanceRecord } from '../types';
import { X, ClipboardList, Calendar, Check, Package } from 'lucide-react';

interface MaintenanceHistoryModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const MaintenanceHistoryModal: React.FC<MaintenanceHistoryModalProps> = ({ vehicle, onClose }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-300">
      <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">Storico Manutenzioni</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Mezzo: {vehicle.brand} {vehicle.model} ({vehicle.vehicleNumber})</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {vehicle.maintenanceHistory.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ClipboardList size={32} />
            </div>
            <p className="text-gray-500 font-bold">Nessun intervento registrato per questo mezzo.</p>
          </div>
        ) : (
          vehicle.maintenanceHistory.map((record) => (
            <div key={record.id} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 relative group hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-black text-gray-700 uppercase tracking-tighter">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    record.type === 'PROGRAMMATA' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {record.type}
                  </span>
                </div>
                <div className="text-right">
                   <p className="text-lg font-black text-gray-900 tracking-tighter">{record.usageValue.toLocaleString()} {vehicle.type === 'ROAD' ? 'KM' : 'Ore'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Olio', val: record.oilChange },
                    { label: 'F. Aria', val: record.airFilter },
                    { label: 'F. Olio', val: record.oilFilter },
                    { label: 'F. Carb.', val: record.fuelFilter },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                      item.val ? 'bg-white border-green-200 text-green-700' : 'bg-transparent border-gray-100 text-gray-300'
                    }`}>
                      {item.val ? <Check size={12}/> : <X size={12} className="opacity-20"/>}
                      {item.label}
                    </div>
                  ))}
                </div>

                {record.partsReplaced && (
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <Package size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dettaglio Intervento</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{record.partsReplaced}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-gray-50 border-t">
        <button 
          onClick={onClose}
          className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
        >
          Chiudi Storico
        </button>
      </div>
    </div>
  );
};
