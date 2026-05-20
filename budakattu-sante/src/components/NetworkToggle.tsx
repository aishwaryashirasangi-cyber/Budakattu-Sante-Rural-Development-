/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wifi, WifiOff, CloudLightning, RefreshCw } from 'lucide-react';

interface NetworkToggleProps {
  id?: string;
  isOnline: boolean;
  onToggle: (nextState: boolean) => void;
  pendingSyncCount: number;
}

export function NetworkToggle({
  id = 'network-toggle',
  isOnline,
  onToggle,
  pendingSyncCount
}: NetworkToggleProps) {
  return (
    <div
      id={id + '-container'}
      className={`border rounded-xl p-4 transition-all duration-500 shadow-sm ${
        isOnline 
          ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900' 
          : 'bg-amber-50/70 border-amber-100 text-amber-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </div>
            <h3 className="font-semibold text-sm sm:text-base">
              {isOnline ? 'Cooperative Cloud Network Connected' : 'Simulated Deep Forest Range (Offline)'}
            </h3>
          </div>
          <p className="text-xs mt-1 text-gray-600">
            {isOnline 
              ? 'Local transactions automatically synchronize instantly to the urban home marketplace catalog.' 
              : 'Zero network connection simulation. All logs, new items, and bookings are logged securely local.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {pendingSyncCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-200/80 border border-amber-300 rounded-lg text-amber-800 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{pendingSyncCount} Logs Enqueued</span>
            </div>
          )}

          <button
            id={id + '-btn'}
            onClick={() => onToggle(!isOnline)}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors select-none ${
              isOnline 
                ? 'bg-amber-100 border-amber-200 hover:bg-amber-200 text-amber-900' 
                : 'bg-emerald-700 border-emerald-800 hover:bg-emerald-800 text-white'
            }`}
          >
            {isOnline ? 'Disconnect (Test Offline Force)' : 'Re-establish Online Connection'}
          </button>
        </div>
      </div>
    </div>
  );
}
