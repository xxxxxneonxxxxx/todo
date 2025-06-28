import { create } from 'zustand';


export interface Errors{
    ErrorCreate?: string;
}

interface GlobalFilter {
    filter: string;
    setFilter: (value: string) => void;
}

export const useGlobalFilter = create<GlobalFilter>((set) => ({
    filter: "all",
    setFilter: (value) => set({ filter: value }),
}));