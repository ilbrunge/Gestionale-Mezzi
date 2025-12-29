
import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleType, MaintenanceRecord } from './types';
import { Dashboard } from './components/Dashboard';
import { VehicleForm } from './components/VehicleForm';
import { MaintenanceForm } from './components/MaintenanceForm';
import { AIAssistant } from './components/AIAssistant';
import { MaintenanceHistoryModal } from './components/MaintenanceHistoryModal';
import { UsageUpdateModal } from './components/UsageUpdateModal';
import { 
  LayoutDashboard, 
  Truck, 
  PlusCircle, 
  Sparkles, 
  Settings,
  Clock,
  Navigation,
  LogOut,
  Bell,
  ChevronRight,
  Calendar,
  History,
  Hash,
  Edit2,
  Trash2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'ai'>('dashboard');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isAddingMaintenance, setIsAddingMaintenance] = useState(false);
  const [viewHistoryVehicleId, setViewHistoryVehicleId] = useState<string | null>(null);
  const [updatingUsageVehicleId, setUpdatingUsageVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('fleet_data');
    if (saved) setVehicles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fleet_data', JSON.stringify(vehicles));
  }, [vehicles]);

  const handleSaveVehicle = (v: Vehicle) => {
    const newVehicle = { ...v, id: v.id || crypto.randomUUID(), maintenanceHistory: v.maintenanceHistory || [] };
    if (v.id) {
      setVehicles(prev => prev.map(item => item.id === v.id ? newVehicle : item));
    } else {
      setVehicles(prev => [...prev, newVehicle]);
    }
    setIsAddingVehicle(false);
    setEditVehicleId(null);
  };

  const handleUpdateUsage = (id: string, newValue: number) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, currentUsage: newValue } : v));
    setUpdatingUsageVehicleId(null);
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo mezzo dalla flotta? Questa azione è irreversibile.')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      setEditVehicleId(null);
    }
  };

  const handleSaveMaintenance = (record: MaintenanceRecord) => {
    if (!selectedVehicleId) return;
    setVehicles(prev => prev.map(v => {
      if (v.id === selectedVehicleId) {
        return {
          ...v,
          currentUsage: record.usageValue,
          maintenanceHistory: [record, ...v.maintenanceHistory]
        };
      }
      return v;
    }));
    setIsAddingMaintenance(false);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={20} fill={activeTab === id ? 'currentColor' : 'none'} />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-72 bg-white border-r h-screen sticky top-0 flex-col p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl">
            <Truck size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-900">FleetPro</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="fleet" icon={Truck} label="La tua Flotta" />
          <NavItem id="ai" icon={Sparkles} label="Intelligenza AI" />
        </nav>

        <div className="pt-6 border-t space-y-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 w-full transition-colors">
            <Settings size={20} />
            <span className="text-sm font-semibold">Impostazioni</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-semibold">Esci</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header - Responsive */}
        <header className="bg-white/80 backdrop-blur-md border-b px-4 lg:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Truck size={18} />
            </div>
            <h1 className="text-lg font-bold">FleetPro</h1>
          </div>
          
          <div className="hidden lg:block">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {activeTab === 'dashboard' ? 'Overview Aziendale' : activeTab === 'fleet' ? 'Gestione Parco Mezzi' : 'AI Analysis'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full border-2 border-white shadow-sm cursor-pointer"></div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full pb-28 lg:pb-8">
          {activeTab === 'dashboard' && <Dashboard vehicles={vehicles} />}

          {activeTab === 'fleet' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">La tua Flotta</h2>
                  <p className="text-gray-500">Gestisci {vehicles.length} mezzi aziendali</p>
                </div>
                <button 
                  onClick={() => setIsAddingVehicle(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <PlusCircle size={20} />
                  Nuovo Mezzo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map(v => (
                  <div key={v.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group relative">
                    <div className="flex flex-col lg:flex-row h-full">
                      <div className="w-full lg:w-48 h-48 lg:h-auto bg-gray-50 relative overflow-hidden">
                        {v.photo ? (
                          <img src={v.photo} alt={v.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Truck size={48} />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm ${
                            v.type === VehicleType.ROAD ? 'bg-indigo-600/90 text-white backdrop-blur-md' : 'bg-orange-600/90 text-white backdrop-blur-md'
                          }`}>
                            {v.type === VehicleType.ROAD ? 'Stradale' : 'Edile'}
                          </span>
                          <span className="bg-gray-900/90 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                            <Hash size={10}/> {v.vehicleNumber || 'S/N'}
                          </span>
                        </div>
                        
                        {/* Edit Button overlay */}
                        <button 
                          onClick={() => setEditVehicleId(v.id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-gray-700 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Modifica impostazioni mezzo"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{v.brand} {v.model}</h3>
                                <button 
                                  onClick={() => setEditVehicleId(v.id)}
                                  className="lg:hidden text-gray-400 hover:text-blue-600"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                              <p className="text-sm font-mono text-gray-400 mt-1 uppercase tracking-tighter">{v.licensePlate || 'Targa non presente'}</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setUpdatingUsageVehicleId(v.id)}
                                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                                  title={`Aggiorna ${v.type === VehicleType.ROAD ? 'Kilometri' : 'Ore'}`}
                                >
                                  <RefreshCw size={18} />
                                </button>
                                <p className="text-2xl font-black text-blue-600 tracking-tighter leading-none">{v.currentUsage.toLocaleString()}</p>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{v.type === VehicleType.ROAD ? 'Kilometri' : 'Ore Lavoro'}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-gray-50">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1"><Clock size={10}/> Manutenzione</span>
                              <span className="text-sm font-semibold">{v.maintenanceIntervalMonths} mesi</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1"><ShieldCheck size={10}/> Revisione</span>
                              <span className="text-sm font-semibold">{v.type === VehicleType.ROAD ? `${v.inspectionIntervalMonths || 24} mesi` : 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-2">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedVehicleId(v.id);
                                setIsAddingMaintenance(true);
                              }}
                              className="flex-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
                            >
                              Intervento
                            </button>
                            <button 
                              onClick={() => {
                                setViewHistoryVehicleId(v.id);
                              }}
                              className="flex-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                              <History size={14} /> Cronologia
                            </button>
                          </div>
                          <button 
                             onClick={() => {
                               setSelectedVehicleId(v.id);
                               setIsAddingMaintenance(true);
                             }}
                             className="w-full py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 border border-blue-100"
                          >
                             <Calendar size={12} /> Programma Prossima (Calendar)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {vehicles.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Nessun mezzo in flotta</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mt-2">Inizia aggiungendo i tuoi mezzi aziendali per monitorarne la manutenzione.</p>
                  <button 
                    onClick={() => setIsAddingVehicle(true)}
                    className="mt-6 text-blue-600 font-bold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    Aggiungi ora il primo mezzo <ChevronRight size={16}/>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && <AIAssistant vehicles={vehicles} />}
        </main>
      </div>

      {/* Modals */}
      {(isAddingVehicle || editVehicleId) && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-2xl transform animate-in zoom-in-95 duration-300 relative">
            <VehicleForm 
              initialData={editVehicleId ? vehicles.find(v => v.id === editVehicleId) : undefined}
              onSave={handleSaveVehicle} 
              onCancel={() => {
                setIsAddingVehicle(false);
                setEditVehicleId(null);
              }} 
            />
            {editVehicleId && (
              <button 
                onClick={() => handleDeleteVehicle(editVehicleId)}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 text-red-500 font-bold hover:text-red-600 bg-red-50 px-6 py-3 rounded-2xl transition-all"
              >
                <Trash2 size={18} /> Elimina Mezzo dalla Flotta
              </button>
            )}
          </div>
        </div>
      )}

      {isAddingMaintenance && selectedVehicleId && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-xl transform animate-in zoom-in-95 duration-300">
            <MaintenanceForm 
              vehicleId={selectedVehicleId}
              onSave={handleSaveMaintenance}
              onCancel={() => setIsAddingMaintenance(false)}
              currentUsage={vehicles.find(v => v.id === selectedVehicleId)?.currentUsage || 0}
            />
          </div>
        </div>
      )}

      {viewHistoryVehicleId && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
          <MaintenanceHistoryModal 
            vehicle={vehicles.find(v => v.id === viewHistoryVehicleId)!}
            onClose={() => setViewHistoryVehicleId(null)}
          />
        </div>
      )}

      {updatingUsageVehicleId && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
          <UsageUpdateModal 
            vehicle={vehicles.find(v => v.id === updatingUsageVehicleId)!}
            onSave={handleUpdateUsage}
            onClose={() => setUpdatingUsageVehicleId(null)}
          />
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t px-6 py-3 flex justify-around items-center z-40 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} fill={activeTab === 'dashboard' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Dash</span>
        </button>
        <button 
          onClick={() => setActiveTab('fleet')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'fleet' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <Truck size={24} fill={activeTab === 'fleet' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Flotta</span>
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'ai' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <Sparkles size={24} fill={activeTab === 'ai' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Fleet AI</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
