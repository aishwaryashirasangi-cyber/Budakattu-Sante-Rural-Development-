/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface AudioPlayerButtonProps {
  id?: string;
  name: string;
  kannadaName?: string;
  description: string;
  msp: number;
  unit: string;
  customText?: string;
  compact?: boolean;
}

export function AudioPlayerButton({
  id = 'audio-btn',
  name,
  kannadaName = '',
  description,
  msp,
  unit,
  customText,
  compact = false
}: AudioPlayerButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);

  const stopAudio = () => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const playAudio = () => {
    if (!supported) return;

    // Concurrently handle active voice speak
    window.speechSynthesis.cancel();

    const narrative = customText || `
      Product name: ${name}. 
      Kannada translation: ${kannadaName.split('(')[0]}. 
      Official government minimum support price is ${msp} rupees per ${unit}. 
      Product description: ${description}
    `;

    const utterance = new SpeechSynthesisUtterance(narrative);
    utterance.rate = 0.95; // Slightly slower, easy to digest for rural folks and customers
    utterance.pitch = 1.05;

    // Try to find a local, warm, clear voice if available
    const voices = window.speechSynthesis.getVoices();
    const optimalVoice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en')) || voices[0];
    if (optimalVoice) {
      utterance.voice = optimalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  // Stop reading if component unmounts
  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  if (!supported) return null;

  return (
    <button
      id={id + '-ctrl'}
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center transition-all duration-300 rounded-full select-none ${
        compact 
          ? 'p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800' 
          : 'px-4 py-2 text-sm bg-gradient-to-r from-emerald-700 to-amber-800 text-white shadow-sm hover:shadow hover:brightness-110 active:scale-95'
      }`}
      aria-label={isSpeaking ? "Stop listening narration" : "Listen to product translation narration"}
    >
      <div className="flex items-center gap-1.5 font-medium">
        {isSpeaking ? (
          <>
            <VolumeX className="w-4 h-4 animate-pulse" />
            {!compact && <span className="text-xs">Stop Guide</span>}
            
            {/* Custom Soundwave Visualizer Bars */}
            <div className="flex items-center gap-0.5 h-3 ml-1.5">
              <span className="w-0.5 bg-white rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></span>
              <span className="w-0.5 bg-white rounded-full animate-bounce h-3" style={{ animationDelay: '0.2s', animationDuration: '0.4s' }}></span>
              <span className="w-0.5 bg-white rounded-full animate-bounce h-1.5" style={{ animationDelay: '0.3s', animationDuration: '0.5s' }}></span>
            </div>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            {!compact && (
              <span className="flex items-center gap-1 text-xs">
                Listen (ಕೇಳಿ) <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              </span>
            )}
          </>
        )}
      </div>
    </button>
  );
}
