'use client'

import React, { createContext, useContext, useState } from 'react'

type SettingsTab = 'account' | 'billing' | 'notifications'

interface SettingsTabContextType {
    activeTab: SettingsTab
    setActiveTab: (tab: SettingsTab) => void
}

const SettingsTabContext = createContext<SettingsTabContextType | undefined>(undefined)

export const useSettingsTab = () => {
    const context = useContext(SettingsTabContext)
    if (!context) {
        throw new Error('useSettingsTab must be used within a SettingsTabProvider')
    }
    return context
}

interface SettingsTabProviderProps {
    children: React.ReactNode
}

const SettingsTabProvider = ({ children }: SettingsTabProviderProps) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('account')

    return (
        <SettingsTabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </SettingsTabContext.Provider>
    )
}

export default SettingsTabProvider
