/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SupplyLog, Product } from '../types';
import { TRIBAL_FAMILIES } from '../data';
import { Plus, Check, FileSpreadsheet, Trash2, ArrowUpRight, DollarSign, RefreshCw } from 'lucide-react';

interface SupplyLogSectionProps {
  id?: string;
  supplyLogs: SupplyLog[];
  products: Product[];
  isOnline: boolean;
  onAddSupplyLog: (productId: string, productName: string, supplierFamily: string, headOfFamily: string, quantity: number, directPaymentAmount: number) => void;
  onTogglePayment: (logId: string) => void;
  onClearOfflineLogs?: () => void;
}

export function SupplyLogSection({
  id = 'supply-log',
  supplyLogs,
  products,
  isOnline,
  onAddSupplyLog,
  onTogglePayment
}: SupplyLogSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedFamilyIdx, setSelectedFamilyIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [statusMsg, setStatusMsg] = useState('');

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleAddSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    const selectedFamily = TRIBAL_FAMILIES[selectedFamilyIdx];
    const directPay = quantity * activeProduct.mspPrice;

    onAddSupplyLog(
      activeProduct.id,
      activeProduct.name,
      selectedFamily.name,
      selectedFamily.head,
      quantity,
      directPay
    );

    setStatusMsg('Supply batch enqueued successfully to local storage cache!');
    setTimeout(() => {
      setStatusMsg('');
      setQuantity(1);
      setShowAddForm(false);
    }, 2500);
  };

  const totalCalculatedDisbursements = supplyLogs.reduce((sum, log) => sum + log.directPaymentAmount, 0);
  const paidDisbursements = supplyLogs.filter(l => l.isPaid).reduce((sum, log) => sum + log.directPaymentAmount, 0);
  const pendingDisbursements = totalCalculatedDisbursements - paidDisbursements;

  return (
    <div id={id + '-container'} className="space-y-6">
      {/* Visual Ledger Headers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 border border-emerald-800 text-white rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300">Total Direct Ledger payments</span>
          <span className="text-2xl font-bold mt-2 font-mono">₹{totalCalculatedDisbursements.toLocaleString()}</span>
          <p className="text-[10px] text-emerald-200 mt-1">Guaranteed Under Govt. MSP Rates</p>
        </div>
        
        <div className="bg-amber-950 border border-amber-900 text-amber-50 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">Successfully Paid to Families</span>
          <span className="text-2xl font-bold mt-2 text-amber-100 font-mono">₹{paidDisbursements.toLocaleString()}</span>
          <p className="text-[10px] text-amber-200/80 mt-1">Direct Bank / Cooperative Sync</p>
        </div>

        <div className="bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">Unpaid / Forest Processing</span>
          <span className="text-2xl font-bold mt-2 text-stone-900 font-mono">₹{pendingDisbursements.toLocaleString()}</span>
          <p className="text-[10px] text-stone-600 mt-1">Waiting for connectivity sync releases</p>
        </div>
      </div>

      {/* Control Action buttons */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-emerald-950 font-sans tracking-tight">Forest Sourcing & Payment Ledger</h3>
          <p className="text-xs text-stone-500">Trace forest extraction logs directly back to native families for accountability and full payment.</p>
        </div>

        <button
          id={id + '-add-log-btn'}
          onClick={() => setShowAddForm(!showAddForm)}
          className="cursor-pointer bg-emerald-800 hover:bg-emerald-950 text-white text-xs px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 font-medium select-none shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Supply Entry</span>
        </button>
      </div>

      {/* Add Supply Log Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddSupply} className="bg-stone-50 border border-stone-200 p-5 rounded-xl space-y-4 animate-fadeIn">
          <h4 className="font-semibold text-sm text-emerald-950 uppercase tracking-widest">Cooperative Forest Extraction Log</h4>
          <p className="text-xs text-stone-600">Leader Tool: Gathered logs automatically register locally. Family accounts are credited at official government MSP floor prices.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Select Forest Product</label>
              <select
                required
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (MSP: ₹{p.mspPrice})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Sourcing Tribal Family</label>
              <select
                required
                value={selectedFamilyIdx}
                onChange={(e) => setSelectedFamilyIdx(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
              >
                {TRIBAL_FAMILIES.map((fam, idx) => (
                  <option key={idx} value={idx}>{fam.name} (Zone: {fam.reserveZone})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Harvest Amount ({activeProduct?.unit || 'units'})
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-stone-100 rounded-xl">
            <div className="text-xs">
              <span className="text-stone-500 block uppercase font-mono text-[9px]">Direct Family Fair Disbursement calculation</span>
              <span className="text-sm font-semibold text-stone-800">
                {quantity} {activeProduct?.unit || 'unit'} × ₹{activeProduct?.mspPrice || 100} (Gov. MSP Floor) = 
                <span className="font-mono text-emerald-800 font-bold ml-1.5 text-base">₹{quantity * (activeProduct?.mspPrice || 100)}</span>
              </span>
            </div>

            <div className="flex gap-2 self-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="cursor-pointer text-xs py-1.5 px-4 rounded-lg border border-stone-300 hover:bg-stone-200 text-stone-700 font-medium"
              >
                Collapse
              </button>
              <button
                type="submit"
                className="cursor-pointer text-xs py-1.5 px-4 bg-emerald-800 text-white rounded-lg shadow-sm font-medium hover:bg-emerald-950"
              >
                Confirm Logging entry
              </button>
            </div>
          </div>

          {statusMsg && (
            <p className="text-emerald-800 text-xs font-semibold animate-pulse">{statusMsg}</p>
          )}
        </form>
      )}

      {/* Ledger Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-mono tracking-wider text-stone-500">
                <th className="py-3 px-4">Supply Batch ID</th>
                <th className="py-3 px-4">Sourcing forest Family</th>
                <th className="py-3 px-4">Product harvested</th>
                <th className="py-3 px-4 text-right">Harvest Quantity</th>
                <th className="py-3 px-4 text-right">direct MSP allocation</th>
                <th className="py-3 px-4 text-center">Cloud Sync</th>
                <th className="py-3 px-4 text-center">payment release</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150 text-xs text-stone-700">
              {supplyLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4 font-mono font-semibold text-stone-500">{log.id}</td>
                  <td className="py-3 px-4 font-sans font-medium">
                    <div className="font-semibold text-stone-950">{log.supplierFamily}</div>
                    <div className="text-[10px] text-stone-400">Head: {log.headOfFamily}</div>
                  </td>
                  <td className="py-3 px-4">{log.productName}</td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {log.quantity} <span className="text-[10px] text-stone-600 font-normal">{log.unit}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                    ₹{log.directPaymentAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {log.isOfflineCreated ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Queued</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        <span>Synced</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      id={`pay-toggle-${log.id}`}
                      onClick={() => onTogglePayment(log.id)}
                      className={`cursor-pointer px-3 py-1 text-[10px] font-semibold rounded-full border transition-all duration-300 select-none ${
                        log.isPaid
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-100 border-amber-200 text-amber-900 hover:bg-amber-200'
                      }`}
                    >
                      {log.isPaid ? '✓ Disbursed' : 'Pay Family Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
