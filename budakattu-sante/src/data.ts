/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, MspInfo, SupplyLog, PreOrder } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Wild Rock Forest Honey',
    kannadaName: 'ಕಾಡು ಕಲ್ಲು ಜೇನುತುಪ್ಪ (Kaadu Jenu)',
    description: 'Purified honey harvested from tall forest rock cliffs in the Western Ghats under the guidance of Soliga cooperative experts. Deep amber with herbal undertones.',
    season: 'Summer (March - June)',
    image: '🍯',
    mspPrice: 420,
    listingPrice: 480,
    unit: 'kg',
    estimatedHarvest: 350,
    preorderedVolume: 120,
    activeTribalSuppliers: 14
  },
  {
    id: 'prod-2',
    name: 'Organic Wild Amla (Gooseberry)',
    kannadaName: 'ಕಾಡು ಬೆಟ್ಟದ ನೆಲ್ಲಿಕಾಯಿ (Bettada Nellikayi)',
    description: 'Rich, sun-dried mountain gooseberries gathered from wild trees inside the reserve buffer zones. Renowned for rich immune-boosting Ayurvedic properties.',
    season: 'Winter (October - February)',
    image: '🟢',
    mspPrice: 180,
    listingPrice: 200,
    unit: 'kg',
    estimatedHarvest: 500,
    preorderedVolume: 180,
    activeTribalSuppliers: 18
  },
  {
    id: 'prod-3',
    name: 'Handcrafted Bamboo Storage Baskets',
    kannadaName: 'ಬಿದಿರು ಬುಟ್ಟಿಗಳು (Bidiru Butti)',
    description: 'Finely hand-woven baskets crafted by the Jenu Kuruba artisans using natural local forest bamboo. Highly durable, natural, and biodegradable.',
    season: 'Year-Round (Best post-monsoon)',
    image: '🧺',
    mspPrice: 320,
    listingPrice: 380,
    unit: 'piece',
    estimatedHarvest: 150,
    preorderedVolume: 45,
    activeTribalSuppliers: 8
  },
  {
    id: 'prod-4',
    name: 'Herbal Forest Pain Relieving Oil',
    kannadaName: 'ಗಿಡಮೂಲಿಕೆ ಕಾಡಿನ ನೋವು ನಿವಾರಕ ತೈಲ (Kaadina Thaila)',
    description: 'Traditional joint and muscle relief oil prepared with wild extracted eucalyptus oil, camphor leaves, and secret mountain roots collected by cooperative elders.',
    season: 'Year-Round (Small batches)',
    image: '🧪',
    mspPrice: 280,
    listingPrice: 320,
    unit: 'bottle (200ml)',
    estimatedHarvest: 200,
    preorderedVolume: 90,
    activeTribalSuppliers: 5
  },
  {
    id: 'prod-5',
    name: 'True Forest Cinnamon Bark',
    kannadaName: 'ಕಾಡು ದಾಲ್ಚಿನ್ನಿ ಪಟ್ಟೆ (Kaadu Dalchinni)',
    description: 'Pure, thin-rolled Ceylon variety forest cinnamon harvested sustainably from wild evergreen valleys. Sweet aroma with highly volatile natural wood oils.',
    season: 'Autumn (August - November)',
    image: '🪵',
    mspPrice: 390,
    listingPrice: 450,
    unit: 'kg',
    estimatedHarvest: 120,
    preorderedVolume: 35,
    activeTribalSuppliers: 6
  }
];

export const OFFICIAL_MSP_DIRECTORY: MspInfo[] = [
  {
    cropName: 'Wild Rock Forest Honey',
    kannadaName: 'ಕಾಡು ಜೇನುತುಪ್ಪ',
    mspPrice: 420,
    unit: 'kg',
    latestGovNotificationCode: 'KA-FOR-2026-M4',
    lastRevisionDate: 'Jan 15, 2026'
  },
  {
    cropName: 'Organic Wild Amla (Gooseberry)',
    kannadaName: 'ಬೆಟ್ಟದ ನೆಲ್ಲಿಕಾಯಿ',
    mspPrice: 180,
    unit: 'kg',
    latestGovNotificationCode: 'KA-FOR-2026-M4',
    lastRevisionDate: 'Jan 15, 2026'
  },
  {
    cropName: 'Handcrafted Bamboo Storage Baskets',
    kannadaName: 'ಬಿದಿರು ಉತ್ಪನ್ನ',
    mspPrice: 320,
    unit: 'piece',
    latestGovNotificationCode: 'KA-FOR-2025-H9',
    lastRevisionDate: 'Sep 10, 2025'
  },
  {
    cropName: 'Herbal Forest Pain Relieving Oil',
    kannadaName: 'ಕಾಡಿನ ಗಿಡಮೂಲಿಕೆ ತೈಲ',
    mspPrice: 280,
    unit: 'bottle (200ml)',
    latestGovNotificationCode: 'KA-FOR-2026-M4',
    lastRevisionDate: 'Feb 02, 2026'
  },
  {
    cropName: 'True Forest Cinnamon Bark',
    kannadaName: 'ಕಾಡು ದಾಲ್ಚಿನ್ನಿ',
    mspPrice: 390,
    unit: 'kg',
    latestGovNotificationCode: 'KA-FOR-2026-M4',
    lastRevisionDate: 'Jan 15, 2026'
  },
  {
    cropName: 'Wild Tamarind Buds',
    kannadaName: 'ಕಾಡು ಹುಣಸೆಹಣ್ಣು',
    mspPrice: 130,
    unit: 'kg',
    latestGovNotificationCode: 'KA-FOR-2026-M4',
    lastRevisionDate: 'Feb 12, 2026'
  },
  {
    cropName: 'Dry Shikakai Pods',
    kannadaName: 'ನೆಲ ಶೀಗೆಕಾಯಿ',
    mspPrice: 110,
    unit: 'kg',
    latestGovNotificationCode: 'KA-FOR-2025-H9',
    lastRevisionDate: 'Aug 24, 2025'
  }
];

export const INITIAL_SUPPLY_LOGS: SupplyLog[] = [
  {
    id: 'log-1',
    productId: 'prod-1',
    productName: 'Wild Rock Forest Honey',
    supplierFamily: 'Soliga Family (Kencha & Mara)',
    headOfFamily: 'Kencha Soliga',
    quantity: 35,
    unit: 'kg',
    recordedDate: 'May 12, 2026',
    directPaymentAmount: 14700, // 35 * 420 (Gov MSP ensures floor pricing)
    isPaid: true
  },
  {
    id: 'log-2',
    productId: 'prod-1',
    productName: 'Wild Rock Forest Honey',
    supplierFamily: 'Kuruba Family (Devanna)',
    headOfFamily: 'Devanna Kuruba',
    quantity: 20,
    unit: 'kg',
    recordedDate: 'May 15, 2026',
    directPaymentAmount: 8400,
    isPaid: false
  },
  {
    id: 'log-3',
    productId: 'prod-2',
    productName: 'Organic Wild Amla',
    supplierFamily: 'Soliga Family (Bomma)',
    headOfFamily: 'Bommadamma Soliga',
    quantity: 120,
    unit: 'kg',
    recordedDate: 'May 10, 2026',
    directPaymentAmount: 21600,
    isPaid: true
  },
  {
    id: 'log-4',
    productId: 'prod-3',
    productName: 'Handcrafted Bamboo Storage Baskets',
    supplierFamily: 'Jenu Kuruba Clan (Shanthi)',
    headOfFamily: 'Shanthamma Kuruba',
    quantity: 15,
    unit: 'piece',
    recordedDate: 'May 18, 2026',
    directPaymentAmount: 4800,
    isPaid: true
  }
];

export const INITIAL_PRE_ORDERS: PreOrder[] = [
  {
    id: 'order-1',
    productId: 'prod-1',
    buyerName: 'Aishwarya S.',
    buyerPhone: '+91 9481234567',
    quantity: 15,
    totalPrice: 7200,
    orderDate: 'May 14, 2026',
    status: 'Confirmed'
  },
  {
    id: 'order-2',
    productId: 'prod-2',
    buyerName: 'Girish Kumar',
    buyerPhone: '+91 8050987654',
    quantity: 50,
    totalPrice: 10000,
    orderDate: 'May 16, 2026',
    status: 'Confirmed'
  },
  {
    id: 'order-3',
    productId: 'prod-4',
    buyerName: 'Dr. Shruti Verma (Ayurveda Care)',
    buyerPhone: '+91 9110234567',
    quantity: 30,
    totalPrice: 9600,
    orderDate: 'May 19, 2026',
    status: 'Pending'
  }
];

export const TRIBAL_FAMILIES = [
  { name: 'Soliga Family (Kencha & Mara)', head: 'Kencha Soliga', reserveZone: 'Biligirirangana Hills (BR Hills)' },
  { name: 'Soliga Family (Bomma)', head: 'Bommadamma Soliga', reserveZone: 'Biligirirangana Hills (BR Hills)' },
  { name: 'Kuruba Family (Devanna)', head: 'Devanna Kuruba', reserveZone: 'Kallada Forest Border' },
  { name: 'Jenu Kuruba Clan (Shanthi)', head: 'Shanthamma Kuruba', reserveZone: 'Nagarahole Forest Core' },
  { name: 'Yerava Tribe cooperative (Ravi)', head: 'Ravi Yerava', reserveZone: 'Kutta Reserved Range' }
];
