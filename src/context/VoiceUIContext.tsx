"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface VoiceUIContextType {
  isVoicePopupOpen: boolean;
  setIsVoicePopupOpen: (isOpen: boolean) => void;
}

const VoiceUIContext = createContext<VoiceUIContextType | undefined>(undefined);

export function VoiceUIProvider({ children }: { children: ReactNode }) {
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState(false);

  return (
    <VoiceUIContext.Provider value={{ isVoicePopupOpen, setIsVoicePopupOpen }}>
      {children}
    </VoiceUIContext.Provider>
  );
}

export function useVoiceUI() {
  const context = useContext(VoiceUIContext);
  if (context === undefined) {
    throw new Error('useVoiceUI must be used within a VoiceUIProvider');
  }
  return context;
}
