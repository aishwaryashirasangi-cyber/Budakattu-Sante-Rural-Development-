/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { OFFICIAL_MSP_DIRECTORY } from '../data';
import { Search, Info, HelpCircle, FileText, Landmark } from 'lucide-react';

export function MspDirectory({ id = 'msp-directory' }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMsp = OFFICIAL_MSP_DIRECTORY.filter(item => 
    item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kannadaName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id={id + '-container'} className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-800" />
            <h3 className="font-bold text-base text-amber-950">Official Government Minimum Support Price (MSP)</h3>
          </div>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            The Government of Karnataka and TRIFED enforce a guaranteed floor price (Minimum Support Price) for Minor Forest Produce (MFP) to protect tribal families from merchant exploitation. 
            <strong> Budakattu-Sante</strong> enforces that no cooperative product list or purchase is settled below these prices.
          </p>
        </div>
        
        <div className="bg-white/90 border border-amber-300 p-3 rounded-xl flex items-center gap-2 text-stone-700 max-w-sm self-stretch md:self-auto shadow-sm">
          <Info className="w-4 h-4 text-emerald-800 shrink-0" />
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-600 block">
            Latest Council Update: Feb 2026 Code RE-42B
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
          <input
            id={id + '-search'}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Official Government MSP database (e.g. Honey, Tamarind...)"
            className="w-full text-xs pl-9.5 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-emerald-800 text-stone-800 placeholder:text-stone-400 font-medium"
          />
        </div>

        <div className="text-[10px] text-stone-400 uppercase font-mono text-right shrink-0">
          Showing {filteredMsp.length} Regulatory Entries
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMsp.map((item, idx) => (
          <div
            key={idx}
            className="bg-stone-50 hover:bg-stone-100/50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between transition-colors cursor-default"
          >
            <div>
              <div className="flex items-start justify-between gap-2.5">
                <span className="text-xs font-mono bg-stone-200 border border-stone-300 rounded px-1.5 py-0.5 text-stone-700">
                  {item.unit} Referencing
                </span>
                
                <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-800 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  Verified Floor
                </span>
              </div>

              <h4 className="font-bold text-stone-900 text-sm mt-3.5 leading-snug">{item.cropName}</h4>
              <p className="text-amber-800 text-xs font-semibold mt-0.5">{item.kannadaName}</p>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-stone-950 font-mono">₹{item.mspPrice}</span>
                <span className="text-xs text-stone-500 font-sans">guaranteed floor per {item.unit}</span>
              </div>
            </div>

            <div className="border-t border-stone-200/60 pt-3 mt-4 flex items-center justify-between text-[10px] text-stone-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-700" />
                <span>{item.latestGovNotificationCode}</span>
              </span>
              <span>Revised: {item.lastRevisionDate}</span>
            </div>
          </div>
        ))}
        
        {filteredMsp.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-500 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-stone-300" />
            <p className="text-xs font-semibold">No official MSP matching entry found.</p>
            <p className="text-[10px] text-stone-400">Please refine your queries name such as &quot;Honey&quot; or &quot;Amla&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
