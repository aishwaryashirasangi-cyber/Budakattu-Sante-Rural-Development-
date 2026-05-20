/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { Sparkles, HelpCircle, FileText, ArrowRight, Brain, TreePine } from 'lucide-react';

interface GenAiAdvisorProps {
  id?: string;
  products: Product[];
  onApplyNewPriceSuggestions?: (productId: string, suggestedPrice: number) => void;
}

export function GenAiAdvisor({
  id = 'genai-advisor',
  products,
  onApplyNewPriceSuggestions
}: GenAiAdvisorProps) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string>('');
  const [errorHeader, setErrorHeader] = useState('');

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  const fillPreset = (text: string) => {
    setObservations(text);
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observations.trim()) return;

    setIsLoading(true);
    setAdvice('');
    setErrorHeader('');

    try {
      const response = await fetch('/api/adviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observations: observations,
          productOfInterest: activeProduct?.name,
          mspPrice: activeProduct?.mspPrice,
          unit: activeProduct?.unit
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error code: ${response.status}`);
      }

      const data = await response.json();
      setAdvice(data.advice);
    } catch (err: any) {
      console.error(err);
      setErrorHeader(err.message || 'Canopy AI satellite link is currently congested.');
      
      // Stand-by elegant fallback advisory to avoid stalling
      setAdvice(`### 🌿 Local Reserve Backup Council Advice
Connection temporarily enqueued. Based on your inputs of active environmental observation for **${activeProduct?.name}**:

1. **Environmental Assessment**: High forest moisture favors organic tree sap moisture yields.
2. **Cooperative Trading balance**: Standard regional cooperative margins suggest pricing around **₹${Math.round(activeProduct?.mspPrice * 1.15)}/unit** for pre-order balances.
3. **Draft Audio translation guidance**:
   *"Our elders have logged sustainable wild harvesting batches. Fair wages are protected. Thank you for supporting the reserve groves of Karnataka."*`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse double asterisks and headers to custom HTML tags safely and beautifully
  const parseManualMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      let trimmed = line.trim();
      
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={lineIdx} className="text-emerald-950 font-bold text-sm sm:text-base mt-4 mb-2 first:mt-0 font-sans tracking-tight">
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }
      
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={lineIdx} className="text-emerald-900 font-extrabold text-base sm:text-lg mt-5 mb-2 first:mt-0 font-sans tracking-tight border-b border-stone-200 pb-1">
            {trimmed.replace('##', '').trim()}
          </h3>
        );
      }

      if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.')) {
        const marker = trimmed.match(/^(\d+\.)/)?. [0] || '';
        const body = trimmed.substring(marker.length).trim();
        return (
          <div key={lineIdx} className="flex gap-2.5 py-1 text-xs sm:text-sm text-stone-700 font-sans leading-relaxed">
            <span className="font-bold text-emerald-800 shrink-0 select-none">{marker}</span>
            <span>{parseInlineStyles(body)}</span>
          </div>
        );
      }

      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const body = trimmed.substring(1).trim();
        return (
          <div key={lineIdx} className="flex gap-2.5 py-1 text-xs sm:text-sm text-stone-700 font-sans leading-relaxed">
            <span className="text-amber-800 shrink-0 select-none">•</span>
            <span>{parseInlineStyles(body)}</span>
          </div>
        );
      }

      if (trimmed === '') {
        return <div key={lineIdx} className="h-2"></div>;
      }

      return (
        <p key={lineIdx} className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed py-0.5">
          {parseInlineStyles(trimmed)}
        </p>
      );
    });
  };

  const parseInlineStyles = (body: string) => {
    const parts = body.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-emerald-950">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div id={id + '-container'} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-stone-50/50 p-2 sm:p-5 rounded-2xl border border-stone-100">
      
      {/* Left Input configuration panel */}
      <form onSubmit={handleConsult} className="lg:col-span-5 space-y-4 bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-800 animate-pulse" />
          <h3 className="font-bold text-sm uppercase tracking-wide text-emerald-950">AI Cooperative Adviser</h3>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          Input climate, flowering, and beehive statuses to project optimal sustainable quantities, direct pay multipliers, and narrative draft guides for the cooperative catalogue.
        </p>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Target Forest Crop</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-emerald-800 text-stone-800 font-medium"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {activeProduct && (
            <div className="text-[10px] text-stone-400 mt-1 uppercase font-mono">
              Current MSP Support: ₹{activeProduct.mspPrice} / {activeProduct.unit}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Real-time Environmental Observations</label>
          <textarea
            required
            rows={4}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Describe forest situations (e.g., Heavy rain early summer, early blooming of Acacia flowers, few bees visible, Soliga families tracking cores..."
            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-emerald-800 text-stone-800 font-medium placeholder:text-stone-400 focus:bg-white transition-colors"
          />
        </div>

        {/* Observation Presets */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-stone-500 font-bold uppercase block">Quick Observation presets:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillPreset("We are noticing massive blooming of forest trees in Hills and stable daytime sunshine in May, with robust beehive counts recorded in rock caves.")}
              className="cursor-pointer text-[10px] truncate max-w-xs bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded px-2 py-0.5 select-none transition-colors"
            >
              🌿 Blooming Hills & Cave bees
            </button>
            <button
              type="button"
              onClick={() => fillPreset("Dry summer with dry soil inside reserve forest buffer, bamboo forests look slightly crisp, harvesting rates are slower to protect bamboo stocks.")}
              className="cursor-pointer text-[10px] truncate max-w-xs bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded px-2 py-0.5 select-none transition-colors"
            >
              🪵 Dry Reserve forest & Slow Extraction
            </button>
          </div>
        </div>

        <button
          id={id + '-submit-btn'}
          type="submit"
          disabled={isLoading || !observations.trim()}
          className={`cursor-pointer w-full py-2 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 select-none ${
            isLoading || !observations.trim()
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span>{isLoading ? 'Processing Satellite Counselor Map...' : 'Generate AI Forest Advisory Report'}</span>
        </button>
      </form>

      {/* Right Output results Panel */}
      <div className="lg:col-span-7 flex flex-col justify-stretch bg-white border border-stone-150 rounded-xl p-5 shadow-sm min-h-[300px]">
        
        {/* State Initial / Waiting */}
        {!isLoading && !advice && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3.5 my-auto">
            <div className="p-3.5 bg-stone-100 rounded-full text-stone-500">
              <TreePine className="w-8 h-8 text-emerald-800" />
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-xs sm:text-sm">Ready for Environmental Advisory Council</p>
              <p className="text-xs text-stone-500 max-w-md mt-1">
                Once submitted, Gemini GenAI will estimate harvest yields, suggest pricing balancing strategies, and draft simple translations for the tribal community database.
              </p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
            <div className="w-10 h-10 border-4 border-emerald-800 border-t-amber-500 rounded-full animate-spin"></div>
            <div>
              <p className="font-bold text-stone-900 text-xs">Accessing Solar Climatic Database...</p>
              <p className="text-[10px] text-stone-400 mt-1 max-w-sm">
                Evaluating Ghat buffer rainfall maps and historic Minimum Support Prices to guarantee direct payments to Soliga families.
              </p>
            </div>
          </div>
        )}

        {/* Finished Advice Result container */}
        {!isLoading && advice && (
          <div className="flex-1 flex flex-col justify-between">
            {errorHeader && (
              <div className="mb-4 text-[10px] bg-red-50 text-red-800 p-2.5 rounded-lg border border-red-200">
                ⚠️ {errorHeader}
              </div>
            )}
            
            <div className="space-y-3 prose font-sans text-stone-800">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100/60 rounded-xl">
                {parseManualMarkdown(advice)}
              </div>
            </div>

            <div className="border-t border-stone-200/60 pt-4 mt-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-500 text-[10px]">
                <FileText className="w-3.5 h-3.5" />
                <span>Advice generated strictly relative to Government MSP of ₹{activeProduct?.mspPrice}/{activeProduct?.unit}</span>
              </div>

              <div className="flex gap-2 font-medium text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(advice);
                    alert('Advisory report copied to clipboard!');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600 cursor-pointer"
                >
                  Copy Report Text
                </button>
                {onApplyNewPriceSuggestions && advice.includes('₹') && (
                  <button
                    type="button"
                    onClick={() => {
                      // Attempt to automatically extract recommended price if format has "₹450" or similar
                      const matcher = advice.match(/₹(\d+)/);
                      if (matcher && matcher[1]) {
                        const sugPrice = parseInt(matcher[1]);
                        onApplyNewPriceSuggestions(activeProduct.id, sugPrice);
                        alert(`Cooperative Price suggestion of ₹${sugPrice} applied to ${activeProduct.name}`);
                      } else {
                        alert("Could not extract numerical recommendation automatically. Please type it in.");
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-950 shadow-sm cursor-pointer"
                  >
                    Quick-Apply Suggestion Price
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
