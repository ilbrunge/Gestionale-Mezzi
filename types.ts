
export enum VehicleType {
  ROAD = 'ROAD',
  CONSTRUCTION = 'CONSTRUCTION'
}

export enum MaintenanceType {
  SCHEDULED = 'PROGRAMMATA',
  EXTRAORDINARY = 'STRAORDINARIA'
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: MaintenanceType;
  partsReplaced: string;
  oilChange: boolean;
  airFilter: boolean;
  oilFilter: boolean;
  fuelFilter: boolean;
  usageValue: number; // KM or Hours at time of maintenance
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // N° Mezzo aziendale
  photo?: string;
  brand: string;
  model: string;
  licensePlate?: string;
  registrationDate: string;
  purchaseDate: string;
  type: VehicleType;
  currentUsage: number; // KM or Hours
  maintenanceFrequency: number; // Interval in KM or Hours
  maintenanceIntervalMonths: number; // Interval in Months
  lastInspectionDate?: string; // Data ultima revisione
  inspectionIntervalMonths?: number; // Cadenza revisione (es. 24 mesi)
  maintenanceHistory: MaintenanceRecord[];
}

export interface AppState {
  vehicles: Vehicle[];
}
