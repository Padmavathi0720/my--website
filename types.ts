export type Language = 'en' | 'ta' | 'te' | 'ml' | 'hi';
export type UserRole = 'collector' | 'recycler';

export type PilotCity = 
  | 'Chennai'
  | 'Coimbatore'
  | 'Madurai'
  | 'Tiruchirappalli'
  | 'Salem'
  | 'Tiruppur'
  | 'Erode'
  | 'Vellore'
  | 'Thoothukudi'
  | 'Tirunelveli';

export const PILOT_CITY_CODES: Record<PilotCity, string> = {
  'Chennai': 'CHN',
  'Coimbatore': 'CBE',
  'Madurai': 'MDU',
  'Tiruchirappalli': 'TRY',
  'Salem': 'SLM',
  'Tiruppur': 'TPR',
  'Erode': 'ERD',
  'Vellore': 'VLR',
  'Thoothukudi': 'TUT',
  'Tirunelveli': 'TNV'
};

export type MaterialCategory = 
  | 'E-waste'
  | 'Plastic'
  | 'Metal'
  | 'Paper'
  | 'Other';

export type LotStatus = 
  | 'CREATED'
  | 'RECYCLER_ACCEPTED'
  | 'PICKUP_SCHEDULED'
  | 'COLLECTED'
  | 'HANDED_OVER'
  | 'PAYMENT_PENDING'
  | 'PAID';

export type PaymentMethod = 'UPI' | 'Cash' | 'Bank Transfer';

export interface Recycler {
  id: string;
  name: string;
  businessName: string;
  isVerified: boolean;
  isDemoRecycler: boolean;
  licenseNumber: string;
  rating: number;
  phone: string;
  location: string;
  city: PilotCity;
  state: 'Tamil Nadu';
  distanceKm: number;
  acceptedMaterials: MaterialCategory[];
  priceRangePerKg: { [key in MaterialCategory]?: [number, number] };
  pickupAvailable: boolean;
  pickupTimeline: string;
  paymentMethods: PaymentMethod[];
  capacityPerDayKg: number;
}

export type TraceabilityStageName = 
  | 'COLLECTED'
  | 'AI_IDENTIFIED'
  | 'PRICE_ESTIMATED'
  | 'RECYCLER_SELECTED'
  | 'PICKUP'
  | 'HANDOVER'
  | 'PAYMENT'
  | 'FORMAL_RECYCLING';

export interface TraceabilityStep {
  status: LotStatus;
  stageName?: TraceabilityStageName;
  timestamp: string;
  date?: string;
  note: string;
  actor: string;
  verified: boolean;
  locationStamp?: string;
  hashSignature?: string;
  syncStatus?: 'Synced' | 'Pending Sync';
}

export interface Lot {
  id: string;
  collectorId: string;
  collectorName: string;
  collectorPhone: string;
  collectorArea: string;
  city: PilotCity;
  state: 'Tamil Nadu';
  material: MaterialCategory;
  subCategory: string;
  weightKg: number;
  photoUrl: string;
  aiDetected: string;
  aiConfidence: number;
  alternativeOptions: string[];
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  finalPricePerKg?: number;
  totalAmount?: number;
  recyclerId?: string;
  recyclerName?: string;
  status: LotStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'PENDING' | 'PAID';
  isOfflineCreated?: boolean;
  createdAt: string;
  timeline: TraceabilityStep[];
  qrPayload: string;
  syncStatus: 'Synced' | 'Pending Sync';
}

export interface CollectorProfile {
  id: string;
  name: string;
  phone: string;
  area: string;
  city: PilotCity;
  state: 'Tamil Nadu';
  language: Language;
  simpleMode: boolean;
  voiceGuidedMode: boolean;
  voiceSpeed: number; // 0.75, 0.9, 1.0, 1.25
  largeText: boolean;
  highContrast: boolean;
  isLoggedIn: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'pickup' | 'payment' | 'accept' | 'sync' | 'alert';
  read: boolean;
  lotId?: string;
}

export interface AiVisionResult {
  detectedCategory: MaterialCategory;
  detectedName: string;
  confidence: number;
  alternativeOptions: string[];
  subCategories: string[];
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  safetyAlert?: string;
}
