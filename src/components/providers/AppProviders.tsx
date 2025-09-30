"use client"

import React from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryProvider } from './QueryProvider'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
