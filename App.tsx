import React, { useState, useEffect } from 'react';
import { Vehicle, MaintenanceRecord } from './types';
import { Dashboard } from './components/Dashboard';
import { VehicleForm } from './components/VehicleForm';
import { MaintenanceForm } from './components/MaintenanceForm';
import { AIAssistant } from './components/AIAssistant';
import { MaintenanceHistoryModal } from './components/MaintenanceHistoryModal';
import { UsageUpdateModal } from './components/UsageUpdateModal';
import { Login } from './components/Login';
import { 
  LayoutDashboard, 
  Truck, 
  PlusCircle, 
  Sparkles, 
  Settings,
  LogOut,
  Bell,
  RefreshCw,
  Edit2,
  Trash2
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
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
    
    const auth = sessionStorage.getItem('fleet_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('fleet_data', JSON.stringify(vehicles));
    }
  }, [vehicles, isAuthenticated]);

  const handleLogin = (password: string) => {
    const validCode = process.env.COMPANY_CODE || '1234';
    if (password === validCode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('fleet_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Codice non valido. Riprova.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fleet_auth');
  };

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
    if (window.confirm('Sei sicuro di voler eliminare questo mezzo dalla flotta?')) {
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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

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
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-semibold">Esci</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
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
                <button onClick={() => setIsAddingVehicle(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-blue-200">
                  <PlusCircle size={20} /> Nuovo Mezzo
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
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><Truck size={48} /></div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm ${v.type === 'ROAD' ? 'bg-indigo-600/90 text-white' : 'bg-orange-600/90 text-white'}`}>
                            {v.type === 'ROAD' ? 'Stradale' : 'Edile'}
                          </span>
                        </div>
                        <button onClick={() => setEditVehicleId(v.id)} className="absolute top-3 right-3 p-2 bg-white/90 text-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={16} /></button>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-extrabold text-gray-900">{v.brand} {v.model}</h3>
                              <p className="text-sm font-mono text-gray-400 mt-1 uppercase">{v.licensePlate || 'N°: ' + v.vehicleNumber}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <button onClick={() => setUpdatingUsageVehicleId(v.id)} className="p-2.5 bg-blue-600 text-white rounded-xl active:scale-95 transition-transform"><RefreshCw size={18} /></button>
                                <p className="text-2xl font-black text-blue-600">{v.currentUsage.toLocaleString()}</p>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{v.type === 'ROAD' ? 'Km' : 'Ore'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedVehicleId(v.id); setIsAddingMaintenance(true); }} className="flex-1 bg-gray-900 text-white text-[10px] font-black uppercase py-3 rounded-xl transition-colors hover:bg-blue-600">Intervento</button>
                            <button onClick={() => setViewHistoryVehicleId(v.id)} className="flex-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase py-3 rounded-xl transition-colors hover:bg-gray-200">Cronologia</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'ai' && <AIAssistant vehicles={vehicles} />}
        </main>
      </div>

      {(isAddingVehicle || editVehicleId) && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-2xl relative">
            <VehicleForm 
              initialData={editVehicleId ? vehicles.find(v => v.id === editVehicleId) : undefined}
              onSave={handleSaveVehicle} 
              onCancel={() => { setIsAddingVehicle(false); setEditVehicleId(null); }} 
            />
            {editVehicleId && (
              <button onClick={() => handleDeleteVehicle(editVehicleId)} className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 text-red-500 font-bold bg-red-50 px-6 py-3 rounded-2xl transition-all hover:bg-red-100">
                <Trash2 size={18} /> Elimina Mezzo
              </button>
            )}
          </div>
        </div>
      )}
      {isAddingMaintenance && selectedVehicleId && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-xl">
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

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t px-6 py-3 flex justify-around items-center z-40 pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}>
          <LayoutDashboard size={24} /><span className="text-[10px] font-bold uppercase">Dash</span>
        </button>
        <button onClick={() => setActiveTab('fleet')} className={`flex flex-col items-center gap-1 ${activeTab === 'fleet' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Truck size={24} /><span className="text-[10px] font-bold uppercase">Flotta</span>
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Sparkles size={24} /><span className="text-[10px] font-bold uppercase">AI</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
