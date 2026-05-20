/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, SupplyLog, PreOrder, SimulatedSyncQueue } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SUPPLY_LOGS, 
  INITIAL_PRE_ORDERS, 
  TRIBAL_FAMILIES 
} from './data';
import { NetworkToggle } from './components/NetworkToggle';
import { CatalogCard } from './components/CatalogCard';
import { SupplyLogSection } from './components/SupplyLogSection';
import { MspDirectory } from './components/MspDirectory';
import { GenAiAdvisor } from './components/GenAiAdvisor';
import { 
  ShoppingBag, 
  NotebookPen, 
  Landmark, 
  Sparkles, 
  Plus, 
  Grid, 
  Users, 
  CheckCircle2, 
  Compass,
  Database,
  RefreshCw,
  FolderLock
} from 'lucide-react';

export default function App() {
  // Tab Management
  const [activeTab, setActiveTab] = useState<'catalog' | 'ledger' | 'msp' | 'advisor'>('catalog');
  
  // Real State management
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplyLogs, setSupplyLogs] = useState<SupplyLog[]>([]);
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  
  // Sync Status Queues
  const [pendingSyncPreOrders, setPendingSyncPreOrders] = useState<PreOrder[]>([]);
  const [pendingSyncSupplyLogs, setPendingSyncSupplyLogs] = useState<SupplyLog[]>([]);
  
  // Custom Sync Loader
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Leader Product Adding Form Drawer
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdKannada, setNewProdKannada] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSeason, setNewProdSeason] = useState('Summer (March - June)');
  const [newProdMsp, setNewProdMsp] = useState(250);
  const [newProdPrice, setNewProdPrice] = useState(280);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdHarvest, setNewProdHarvest] = useState(200);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const cachedProds = localStorage.getItem('budakattu_products');
      const cachedLogs = localStorage.getItem('budakattu_logs');
      const cachedOrders = localStorage.getItem('budakattu_orders');
      const cachedQueuePre = localStorage.getItem('budakattu_queue_pre');
      const cachedQueueLogs = localStorage.getItem('budakattu_queue_logs');

      if (cachedProds) setProducts(JSON.parse(cachedProds));
      else setProducts(INITIAL_PRODUCTS);

      if (cachedLogs) setSupplyLogs(JSON.parse(cachedLogs));
      else setSupplyLogs(INITIAL_SUPPLY_LOGS);

      if (cachedOrders) setPreOrders(JSON.parse(cachedOrders));
      else setPreOrders(INITIAL_PRE_ORDERS);

      if (cachedQueuePre) setPendingSyncPreOrders(JSON.parse(cachedQueuePre));
      if (cachedQueueLogs) setPendingSyncSupplyLogs(JSON.parse(cachedQueueLogs));

    } catch (error) {
      console.warn('Trouble recovering cached states, falling back to initial data models.', error);
      setProducts(INITIAL_PRODUCTS);
      setSupplyLogs(INITIAL_SUPPLY_LOGS);
      setPreOrders(INITIAL_PRE_ORDERS);
    }
  }, []);

  // Sync back to localstorage whenever state modifies
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('budakattu_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (supplyLogs.length > 0) {
      localStorage.setItem('budakattu_logs', JSON.stringify(supplyLogs));
    }
  }, [supplyLogs]);

  useEffect(() => {
    if (preOrders.length > 0) {
      localStorage.setItem('budakattu_orders', JSON.stringify(preOrders));
    }
  }, [preOrders]);

  useEffect(() => {
    localStorage.setItem('budakattu_queue_pre', JSON.stringify(pendingSyncPreOrders));
  }, [pendingSyncPreOrders]);

  useEffect(() => {
    localStorage.setItem('budakattu_queue_logs', JSON.stringify(pendingSyncSupplyLogs));
  }, [pendingSyncSupplyLogs]);

  // Handle Online Synchronization Simulation
  const handleNetworkToggle = (nextOnline: boolean) => {
    if (nextOnline && (pendingSyncPreOrders.length > 0 || pendingSyncSupplyLogs.length > 0)) {
      setIsSyncing(true);
      setTimeout(() => {
        // Merge enqueued items to central records
        setPreOrders(prev => {
          const merged = [...pendingSyncPreOrders, ...prev];
          localStorage.setItem('budakattu_orders', JSON.stringify(merged));
          return merged;
        });

        setSupplyLogs(prev => {
          const merged = [...pendingSyncSupplyLogs, ...prev];
          localStorage.setItem('budakattu_logs', JSON.stringify(merged));
          return merged;
        });

        // Resolve product preorder sizes
        setProducts(prevProducts => {
          const updated = prevProducts.map(p => {
            const correspondingPreorders = pendingSyncPreOrders.filter(o => o.productId === p.id);
            if (correspondingPreorders.length > 0) {
              const addedQty = correspondingPreorders.reduce((sum, o) => sum + o.quantity, 0);
              return {
                ...p,
                preorderedVolume: p.preorderedVolume + addedQty
              };
            }
            return p;
          });
          localStorage.setItem('budakattu_products', JSON.stringify(updated));
          return updated;
        });

        // Empty Queues
        setPendingSyncPreOrders([]);
        setPendingSyncSupplyLogs([]);
        setIsSyncing(false);
        setIsOnline(true);
      }, 1500);
    } else {
      setIsOnline(nextOnline);
    }
  };

  // Add Supply Log Sourcing Entry (Ensuring direct payment and offline tracking)
  const handleAddSupplyLog = (
    productId: string,
    productName: string,
    supplierFamily: string,
    headOfFamily: string,
    quantity: number,
    directPaymentAmount: number
  ) => {
    const newLog: SupplyLog = {
      id: `log-${Date.now()}`,
      productId,
      productName,
      supplierFamily,
      headOfFamily,
      quantity,
      unit: products.find(p => p.id === productId)?.unit || 'units',
      recordedDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      directPaymentAmount,
      isPaid: false,
      isOfflineCreated: !isOnline
    };

    if (isOnline) {
      setSupplyLogs(prev => [newLog, ...prev]);
      // Update target product's active family suppliers count
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return { ...p, activeTribalSuppliers: p.activeTribalSuppliers + 1 };
        }
        return p;
      }));
    } else {
      setPendingSyncSupplyLogs(prev => [newLog, ...prev]);
    }
  };

  // Toggle Family payment State directly in the spreadsheet
  const handleTogglePayment = (logId: string) => {
    // If enqueued in offline queue, edit there
    const isInQueue = pendingSyncSupplyLogs.some(l => l.id === logId);
    if (isInQueue) {
      setPendingSyncSupplyLogs(prev => prev.map(l => l.id === logId ? { ...l, isPaid: !l.isPaid } : l));
    } else {
      setSupplyLogs(prev => prev.map(l => l.id === logId ? { ...l, isPaid: !l.isPaid } : l));
    }
  };

  // Pre-ordering Form action (Stock Limits checks are validated inside CatalogCard)
  const handlePlacePreOrder = (
    productId: string,
    buyerName: string,
    buyerPhone: string,
    quantity: number
  ) => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return;

    const newOrder: PreOrder = {
      id: `ord-${Date.now()}`,
      productId,
      buyerName,
      buyerPhone,
      quantity,
      totalPrice: quantity * targetProd.listingPrice,
      orderDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Confirmed',
      isOfflineCreated: !isOnline
    };

    if (isOnline) {
      setPreOrders(prev => [newOrder, ...prev]);
      // Instantly deduct estimated capacity via preorderedVolume increase
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return { ...p, preorderedVolume: p.preorderedVolume + quantity };
        }
        return p;
      }));
    } else {
      setPendingSyncPreOrders(prev => [newOrder, ...prev]);
    }
  };

  // Leader: Add New Product directly to listing catalogs
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    // Check pre-existing icons
    const listEmoticons = ['🍯', '🟢', '🧺', '✨', '☕', '🍂', '🍌', '🥛', '🧶', '🥥'];
    const randomEmoji = listEmoticons[Math.floor(Math.random() * listEmoticons.length)];

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      kannadaName: newProdKannada ? `${newProdKannada} (${newProdName})` : undefined,
      description: newProdDesc,
      season: newProdSeason,
      image: randomEmoji,
      mspPrice: newProdMsp,
      listingPrice: newProdPrice,
      unit: newProdUnit,
      estimatedHarvest: newProdHarvest,
      preorderedVolume: 0,
      activeTribalSuppliers: 0
    };

    setProducts(prev => [...prev, newProd]);
    setShowAddProduct(false);

    // Reset Form values
    setNewProdName('');
    setNewProdKannada('');
    setNewProdDesc('');
    setNewProdMsp(250);
    setNewProdPrice(280);
    setNewProdUnit('kg');
    setNewProdHarvest(200);

    alert(`Successfully added "${newProdName}" to cooperative market catalog!`);
  };

  // AI-Advisor integration price setter
  const handleApplyPriceSuggestion = (productId: string, sugPrice: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, listingPrice: sugPrice } : p));
  };

  // Compute stats counters
  const totalPendingSyncItemsCount = pendingSyncPreOrders.length + pendingSyncSupplyLogs.length;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      
      {/* Synchronization Transition Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 bg-stone-900/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm select-none">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-stone-100">
            <RefreshCw className="w-12 h-12 text-emerald-800 animate-spin mx-auto" />
            <h3 className="font-bold text-lg text-emerald-950">Canopy Database Synchronizing</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Uploading harvest supply logs, direct family credits, and urban pre-orders to live cooperative registers. Direct payments allocated safely.
            </p>
            <div className="h-1.5 w-full bg-stone-150 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-800 animate-pulse" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 flex-1">
        
        {/* Banner header with earth shades */}
        <header className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="market icon">🪵</span>
              <h1 className="text-2xl font-black text-emerald-950 font-sans tracking-tight">Budakattu-Sante</h1>
            </div>
            <p className="text-xs text-amber-800 font-medium font-sans uppercase tracking-widest">
              Forest-to-Home Cooperative Marketplace & Sourcing Ledger
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
              <Compass className="w-4 h-4 shrink-0 text-amber-800 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Western Ghats Co-Op Region</span>
            </div>
            <div className="text-stone-500 font-mono text-[10px]">Active Node Identifier: ae6-MM2026</div>
          </div>
        </header>

        {/* Offline status and action controls bar */}
        <NetworkToggle
          isOnline={isOnline}
          onToggle={handleNetworkToggle}
          pendingSyncCount={totalPendingSyncItemsCount}
        />

        {/* Navigation tabs themed in earthy tones */}
        <div className="border-b border-stone-250 flex flex-wrap gap-1.5">
          <button
            id="tab-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`cursor-pointer font-sans text-xs px-4.5 py-2.5 rounded-t-xl transition-all duration-300 flex items-center gap-2 select-none border-t border-x ${
              activeTab === 'catalog'
                ? 'bg-stone-50 border-stone-200 text-emerald-950 font-bold shadow-sm'
                : 'bg-stone-200/40 border-transparent hover:bg-stone-200/80 text-stone-600'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>Forest Catalog / Pre-Orders</span>
          </button>

          <button
            id="tab-ledger"
            onClick={() => setActiveTab('ledger')}
            className={`cursor-pointer font-sans text-xs px-4.5 py-2.5 rounded-t-xl transition-all duration-300 flex items-center gap-2 select-none border-t border-x ${
              activeTab === 'ledger'
                ? 'bg-stone-50 border-stone-200 text-emerald-950 font-bold shadow-sm'
                : 'bg-stone-200/40 border-transparent hover:bg-stone-200/80 text-stone-600'
            }`}
          >
            <NotebookPen className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>Sourcing logs & Payments</span>
            {pendingSyncSupplyLogs.length > 0 && (
              <span className="bg-amber-100 border border-amber-300 text-amber-800 font-bold text-[9px] px-1.5 py-0.5 rounded-full">
                {pendingSyncSupplyLogs.length}
              </span>
            )}
          </button>

          <button
            id="tab-msp"
            onClick={() => setActiveTab('msp')}
            className={`cursor-pointer font-sans text-xs px-4.5 py-2.5 rounded-t-xl transition-all duration-300 flex items-center gap-2 select-none border-t border-x ${
              activeTab === 'msp'
                ? 'bg-stone-50 border-stone-200 text-emerald-950 font-bold shadow-sm'
                : 'bg-stone-200/40 border-transparent hover:bg-stone-200/80 text-stone-600'
            }`}
          >
            <Landmark className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>Govt MSP Directory</span>
          </button>

          <button
            id="tab-advisor"
            onClick={() => setActiveTab('advisor')}
            className={`cursor-pointer font-sans text-xs px-4.5 py-2.5 rounded-t-xl transition-all duration-300 flex items-center gap-2 select-none border-t border-x ${
              activeTab === 'advisor'
                ? 'bg-stone-50 border-stone-200 text-emerald-950 font-bold shadow-sm'
                : 'bg-stone-200/40 border-transparent hover:bg-stone-200/80 text-stone-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>AI Cooperative Counselor</span>
          </button>
        </div>

        {/* Dynamic active screen displays */}
        <main className="bg-stone-50 border border-t-0 border-stone-200 rounded-b-2xl p-5 md:p-6 shadow-sm">
          
          {/* TAB: FOREST CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              
              {/* Leader add tools header strip */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-emerald-950 font-sans tracking-tight">Active Forest Marketplace</h2>
                  <p className="text-xs text-stone-500">Traditional and seasonal products sustainably harvested by native reserve families.</p>
                </div>

                <button
                  id="leader-catalog-add-btn"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="cursor-pointer border border-stone-300 hover:bg-stone-150 text-stone-700 text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 self-start select-none shadow-xs"
                >
                  <Plus className="w-4 h-4 text-emerald-800" />
                  <span>List New Forest Crop</span>
                </button>
              </div>

              {/* Leader Add Product Drawer */}
              {showAddProduct && (
                <form onSubmit={handleAddProductSubmit} className="bg-stone-100 border border-stone-200 p-5 rounded-xl space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-1">
                    <FolderLock className="w-4 h-4 text-amber-800" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-950">Cooperative Admin: Catalog Listing Panel</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Product Name (English)</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Pure Wild Tamarind"
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Product Local Name (Kannada, optional)</label>
                      <input
                        type="text"
                        value={newProdKannada}
                        onChange={(e) => setNewProdKannada(e.target.value)}
                        placeholder="e.g. ಹುಣಸೆಹಣ್ಣು"
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Government MSP (₹ Price)</label>
                      <input
                        type="number"
                        min={10}
                        required
                        value={newProdMsp}
                        onChange={(e) => setNewProdMsp(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Buyer Listing Price (₹ Price)</label>
                      <input
                        type="number"
                        min={10}
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">Harvest details & description</label>
                      <input
                        type="text"
                        required
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        placeholder="Explain sustainability extraction zone and properties..."
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Measurement Unit</label>
                      <input
                        type="text"
                        required
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        placeholder="e.g. kg, piece, bottle"
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Harvest season estimation timeframe</label>
                      <select
                        value={newProdSeason}
                        onChange={(e) => setNewProdSeason(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      >
                        <option value="Summer (March - June)">Summer (March - June)</option>
                        <option value="Winter (October - February)">Winter (October - February)</option>
                        <option value="Autumn (August - November)">Autumn (August - November)</option>
                        <option value="Year-Round">Year-Round</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Total Estimated Stock Volume Capacity ({newProdUnit})</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={newProdHarvest}
                        onChange={(e) => setNewProdHarvest(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="cursor-pointer py-1.5 px-4 rounded-lg border border-stone-300 hover:bg-stone-200 text-stone-600 font-medium"
                    >
                      Cancel Listing
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer py-1.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-950 text-white font-medium"
                    >
                      Authorize Catalogue Addition
                    </button>
                  </div>
                </form>
              )}

              {/* Grid of Products (Forest Catalog) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(prod => (
                  <CatalogCard
                    key={prod.id}
                    product={prod}
                    supplyLogs={supplyLogs}
                    isOnline={isOnline}
                    onPlacePreOrder={handlePlacePreOrder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB: SOURCING LOGS / PAYMENT LEDGER */}
          {activeTab === 'ledger' && (
            <SupplyLogSection
              supplyLogs={[...pendingSyncSupplyLogs, ...supplyLogs]}
              products={products}
              isOnline={isOnline}
              onAddSupplyLog={handleAddSupplyLog}
              onTogglePayment={handleTogglePayment}
            />
          )}

          {/* TAB: GOVERNMENT MSP DIRECTORY CHECKER */}
          {activeTab === 'msp' && (
            <MspDirectory />
          )}

          {/* TAB: AI COOPERATIVE ADVISER */}
          {activeTab === 'advisor' && (
            <GenAiAdvisor
              products={products}
              onApplyNewPriceSuggestions={handleApplyPriceSuggestion}
            />
          )}

        </main>
      </div>

      {/* Sustainable footer design (Free of tech-larping metadata, centered and humble) */}
      <footer className="w-full bg-stone-900 text-stone-100 py-8 px-4 border-t border-stone-805 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-semibold text-stone-300">Budakattu-Sante (Forest-to-Home Initiative)</p>
            <p className="text-[10px] text-stone-500 leading-relaxed max-w-md">
              A fair trade bridge for forest cooperatives back to urban zones, guaranteeing government-enforced minimum floor pricing and true lineage logging.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-stone-400 border border-stone-800 bg-stone-950 p-2.5 rounded-lg select-none uppercase font-mono tracking-wider">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tribal Ledger Status: Secure local state storage encryption active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
