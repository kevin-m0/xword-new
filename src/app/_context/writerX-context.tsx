'use client';
import { createContext, useContext, useState } from 'react';

interface WriterXContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const WriterXContext = createContext<WriterXContextType>({
    isOpen: false,
    setIsOpen: () => { },
});

export const WriterXProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <WriterXContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </WriterXContext.Provider>
    );
};

export const useWriterXContext = () => useContext(WriterXContext);