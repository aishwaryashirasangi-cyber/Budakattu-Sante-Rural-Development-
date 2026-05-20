/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, SupplyLog } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import { ShoppingBag, Users, AlertCircle, CheckCircle, Tag } from 'lucide-react';

interface CatalogCardProps {
  key?: string | number;
  id?: string;
  product: Product;
  supplyLogs: SupplyLog[];
  isOnline: boolean;
  onPlacePreOrder: (productId: string, buyerName: string, buyerPhone: string, quantity: number) => void;
}

export function CatalogCard({
  id = 'catalog-card',
  product,
  supplyLogs,
  isOnline,
  onPlacePreOrder
}: CatalogCardProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const remainingStock = Math.max(0, product.estimatedHarvest - product.preorderedVolume);

  // Filter supply logs that correspond to this product to list the sourcing families
  const sourceFamilies = Array.from(
    new Set(
      supplyLogs
        .filter((log) => log.productId === product.id)
        .map((log) => `${log.supplierFamily} (${log.headOfFamily})`)
    )
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!buyerName.trim()) {
      setErrorMsg('Buyer name is required.');
      return;
    }
    if (!buyerPhone.trim()) {
      setErrorMsg('Contact phone number is required.');
      return;
    }
    if (quantity <= 0) {
      setErrorMsg('Pre-order quantity must be at least 1.');
      return;
    }
    if (quantity > remainingStock) {
      setErrorMsg(`Pre-order exceeding stock! Only ${remainingStock} ${product.unit} of estimated harvests available for Booking.`);
      return;
    }

    onPlacePreOrder(product.id, buyerName, buyerPhone, quantity);
    
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setBuyerName('');
      setBuyerPhone('');
      setQuantity(1);
      setShowOrderForm(false);
    }, 3000);
  };

  return (
    <div
      id={`${id}-${product.id}`}
      className="bg-stone-50 border border-stone-200/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full"
    >
      {/* Banner & Graphic */}
      <div className="bg-gradient-to-br from-emerald-800/90 to-amber-900/90 p-6 flex items-center justify-between text-white select-none">
        <span className="text-4xl filter drop-shadow" role="img" aria-label={product.name}>
          {product.image}
        </span>
        <div className="text-right">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wide">
            {product.season.split('(')[0]}
          </span>
          <p className="text-[10px] text-stone-200 mt-1">Sustainability Monitored</p>
        </div>
      </div>

      {/* Product Content info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg text-emerald-950 font-sans tracking-tight">{product.name}</h3>
              {product.kannadaName && (
                <p className="text-amber-800 text-xs font-medium font-sans mt-0.5">{product.kannadaName}</p>
              )}
            </div>
            
            <AudioPlayerButton
              id={`audio-${product.id}`}
              name={product.name}
              kannadaName={product.kannadaName}
              description={product.description}
              msp={product.mspPrice}
              unit={product.unit}
              compact={true}
            />
          </div>
          <p className="text-stone-700 text-xs mt-2.5 leading-relaxed">{product.description}</p>
        </div>

        {/* Pricing structure */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-stone-100 rounded-xl my-3">
          <div>
            <span className="text-[11px] text-stone-500 block uppercase font-mono">Government MSP</span>
            <span className="font-semibold text-emerald-800 text-sm">
              ₹{product.mspPrice} <span className="text-xs font-normal">/ {product.unit}</span>
            </span>
          </div>
          <div>
            <span className="text-[11px] text-stone-500 block uppercase font-mono">Cooperative Price</span>
            <span className="font-bold text-stone-900 text-sm flex items-center gap-1">
              ₹{product.listingPrice} <span className="text-xs font-normal">/ {product.unit}</span>
              <Tag className="w-3 h-3 text-amber-700 inline" />
            </span>
          </div>
        </div>

        {/* Stock & Pre-order details (Stock Limit Check) */}
        <div className="space-y-2 mb-4 mt-auto">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Estimated Harvest:</span>
            <span className="font-semibold text-stone-800">{product.estimatedHarvest} {product.unit}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Pre-ordered Volume:</span>
            <span className="font-semibold text-stone-800">{product.preorderedVolume} {product.unit}</span>
          </div>

          <div className="relative pt-1.5">
            <div className="flex mb-1 items-center justify-between text-[11px]">
              <span className={`font-semibold inline-block ${remainingStock === 0 ? 'text-red-700' : 'text-emerald-800'}`}>
                {remainingStock === 0 ? 'No remaining pre-order capacity' : `${remainingStock} ${product.unit} remaining`}
              </span>
              <span className="text-stone-500 font-mono">
                {Math.round((product.preorderedVolume / product.estimatedHarvest) * 100)}% Booked
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-stone-200">
              <div
                style={{ width: `${Math.min(100, (product.preorderedVolume / product.estimatedHarvest) * 100)}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-300 ${
                  remainingStock === 0 ? 'bg-red-500' : 'bg-emerald-700'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Sourcing Family Traceability Info */}
        {sourceFamilies.length > 0 && (
          <div className="border-t border-stone-200 pt-3 my-2 text-xs">
            <div className="flex items-center gap-1.5 text-stone-600 font-medium mb-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct Payment Forest Sourcing:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {sourceFamilies.map((family, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-200/60 text-stone-700 text-[10px]"
                >
                  {family}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Pre-order workflow */}
        <div className="border-t border-stone-150 pt-3.5 mt-2">
          {!showOrderForm ? (
            <button
              id={`book-trigger-${product.id}`}
              onClick={() => setShowOrderForm(true)}
              disabled={remainingStock <= 0}
              className={`cursor-pointer w-full py-2 px-4 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2 select-none ${
                remainingStock <= 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{remainingStock <= 0 ? 'Pre-Order Fully Booked' : 'Pre-Order / Book Bounty'}</span>
            </button>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-3 bg-stone-100/50 p-3.5 rounded-xl border border-stone-200">
              <h4 className="font-semibold text-xs text-stone-800 uppercase tracking-wider">Book Wild Pre-Order</h4>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Enter buyer's name"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="e.g. +91 9481234567"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Book Amount ({product.unit})</label>
                    <input
                      type="number"
                      min={1}
                      max={remainingStock}
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-emerald-800 text-stone-800"
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Est. Price</span>
                    <span className="font-bold text-xs text-stone-900 block">₹{quantity * product.listingPrice}</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-1 p-2 bg-red-50 border border-red-200 text-red-800 text-[10px] rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {orderSuccess && (
                <div className="flex items-center gap-1 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Booking Saved! {!isOnline && '(Queued Offline)'}</span>
                </div>
              )}

              <div className="flex gap-2 font-medium text-[10px] pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="cursor-pointer flex-1 py-1.5 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-sm"
                >
                  Submit Pre-Order
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
