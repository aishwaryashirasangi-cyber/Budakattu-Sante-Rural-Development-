/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  kannadaName?: string; // Localization hint for Kannada region tribal weavers/harvesters
  season: string;
  image: string;
  mspPrice: number; // Government Minimum Support Price (per unit)
  listingPrice: number; // Current cooperative price (per unit)
  unit: string;
  estimatedHarvest: number; // Total volume expected this season
  preorderedVolume: number; // Current buyer pre-orders
  activeTribalSuppliers: number;
}

export interface PreOrder {
  id: string;
  productId: string;
  buyerName: string;
  buyerPhone: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  isOfflineCreated?: boolean;
}

export interface SupplyLog {
  id: string;
  productId: string;
  productName: string;
  supplierFamily: string;
  headOfFamily: string;
  quantity: number;
  unit: string;
  recordedDate: string;
  directPaymentAmount: number; // Calculated as quantity * mspPrice or cooperative agreed price
  isPaid: boolean;
  isOfflineCreated?: boolean;
}

export interface MspInfo {
  cropName: string;
  kannadaName: string;
  mspPrice: number;
  unit: string;
  latestGovNotificationCode: string;
  lastRevisionDate: string;
}

export interface SimulatedSyncQueue {
  preOrders: PreOrder[];
  supplyLogs: SupplyLog[];
  products: Product[];
}
