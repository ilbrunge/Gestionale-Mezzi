
import React from 'react';
import { Vehicle, VehicleType } from '../types';
import { Truck, HardHat, AlertTriangle, CheckCircle2, TrendingUp, Calendar, Clock, Navigation, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  vehicles: Vehicle[];
}

export const Dashboard: React.FC<DashboardProps> = ({ vehicles }) => {
  const isCritical = (v: Vehicle) => {
    const lastMaintenance = v.maintenanceHistory[0];
    const lastUsage = lastMaintenance?.usageValue || 0;
    const lastDate = lastMaintenance ? new Date(lastMaintenance.date) : new Date(v.purchaseDate);
    
    // Check maintenance usage interval (KM or Hours)
    const usageOverdue = (v.currentUsage - lastUsage) > v.maintenanceFrequency * 0.9;
    
    // Check maintenance time interval (Months)
    const monthsDiff = (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const timeOverdue = v.maintenanceIntervalMonths ? monthsDiff > v.maintenanceIntervalMonths * 0.9 : false;
    
    // Check inspection interval (Revisione) - only for road vehicles
    let inspectionOverdue = false;
    if (v.type === VehicleType.ROAD && v.lastInspectionDate && v.inspectionIntervalMonths) {
      const lastInspDate = new Date(v.lastInspectionDate);
      const inspectionMonthsDiff = (new Date().getTime() - lastInspDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
      inspectionOverdue = inspectionMonthsDiff > v.inspectionIntervalMonths * 0.9;
    }
    
    return { 
      isOverdue: usageOverdue || timeOverdue || inspectionOverdue, 
      reason: inspectionOverdue ? 'REVISIONE' : (usageOverdue ? 'USO' : 'TEMPO') 
    };
  };

  const criticalVehicles = vehicles.filter(v => isCritical(v).isOverdue);

  const stats = {
    total: vehicles.length,
    road: vehicles.filter(v => v.type === VehicleType.ROAD).length,
    construction: vehicles.filter(v => v.type === VehicleType.CONSTRUCTION).length,
    critical: criticalVehicles.length
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Totale Mezzi', val: stats.total, icon: <Truck size={24}/>, color: 'blue', trend: 'Monitorati' },
          { label: 'Veicoli Stradali', val: stats.road, icon: <Navigation size={24}/>, color: 'indigo', trend: 'KM tracciati' },
          { label: 'Macchine Edili', val: stats.construction, icon: <HardHat size={24}/>, color: 'orange', trend: 'Ore tracciate' },
          { label: 'Allarmi Manutenzione', val: stats.critical, icon: <AlertTriangle size={24}/>, color: 'red', trend: stats.critical > 0 ? 'Urgenti' : 'Ok' },
        ].map((s, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all group`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors bg-${s.color}-50 text-${s.color}-600 group-hover:bg-${s.color}-600 group-hover:text-white`}>
              {s.icon}
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-3xl font-black text-gray-900">{s.val}</div>
            <div className={`mt-4 text-[10px] font-bold flex items-center gap-1 ${s.val > 0 && s.color === 'red' ? 'text-red-500' : 'text-gray-400'}`}>
              <TrendingUp size={12}/>
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6">Elenco Allarmi Prioritari</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalVehicles.map(v => {
              const status = isCritical(v);
              return (
                <div key={v.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${status.reason === 'REVISIONE' ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-transparent hover:border-red-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${status.reason === 'REVISIONE' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}>
                    {status.reason === 'REVISIONE' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{v.brand} {v.model}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                      Scadenza per: <span className={status.reason === 'REVISIONE' ? 'text-indigo-600' : 'text-red-600'}>
                        {status.reason === 'REVISIONE' ? 'Revisione Legale' : (status.reason === 'USO' ? (v.type === VehicleType.ROAD ? 'Chilometraggio' : 'Ore Lavoro') : 'Tempo (Mesi)')}
                      </span>
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                       <div className="flex items-center gap-1 text-[10px] font-black text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100 uppercase">
                          <Clock size={12} /> {v.currentUsage} {v.type === VehicleType.ROAD ? 'KM' : 'H'}
                       </div>
                       <div className="flex items-center gap-1 text-[10px] font-black text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100 uppercase">
                          <Calendar size={12} /> {new Date(v.purchaseDate).toLocaleDateString()}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {criticalVehicles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-lg font-black text-gray-900">Ottimo Lavoro!</h4>
                <p className="text-sm text-gray-400 max-w-xs mt-1">Tutti i mezzi della tua flotta sono entro i limiti di manutenzione stabiliti.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
            Riepilogo Scadenze
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{stats.critical}</span>
          </h3>
          <div className="space-y-4 flex-1">
             <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Stato Flotta</p>
                <div className="flex items-end justify-between">
                   <p className="text-2xl font-black text-blue-900">{((stats.total - stats.critical) / stats.total * 100 || 0).toFixed(0)}%</p>
                   <p className="text-xs font-bold text-blue-600 pb-1">Mezzi in regola</p>
                </div>
                <div className="w-full h-2 bg-blue-100 rounded-full mt-2 overflow-hidden">
                   <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{ width: `${((stats.total - stats.critical) / stats.total * 100) || 0}%` }}
                   ></div>
                </div>
             </div>
             <p className="text-xs text-gray-400 font-medium px-2 italic">
               * Il sistema ora calcola anche la scadenza della revisione a tempo per i mezzi stradali.
             </p>
          </div>
          <button className="mt-6 w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2">
            Esporta Report Flotta
          </button>
        </div>
      </div>
    </div>
  );
};
