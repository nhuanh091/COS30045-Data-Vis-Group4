// src/store/useStore.js
import { create } from 'zustand'
import * as d3 from 'd3'
// import { mockData } from '../data/mockData'
import { applyFilters } from '../data/dataUtils'

const initialData = await d3.csv("/data/positive_drug_cleaned.csv")

const defaultFilters = {
  jurisdictions: [],   // string[] — e.g. ['NSW', 'VIC']
  year: null,          // number | null — e.g. 2023
  month: null,         // number | null — 1-indexed, e.g. 3 for March
  stage: null,         // string | null — e.g. 'Stage 1'
}

export const useStore = create((set, get) => ({
  // Legacy user slice — kept for backwards compatibility
  user: { name: 'User', email: 'user@example.com' },
  setUser: (user) => set({ user }),

  // Data slices
  rawData: initialData,
  filters: { ...defaultFilters },
  filteredData: initialData,

  // Called once mockData is loaded (see Dashboard.jsx Task 15)
  setRawData: (data) =>
    set({ rawData: data, filteredData: data, filters: { ...defaultFilters } }),

  setFilter: (key, value) => {
    const newFilters = { ...get().filters, [key]: value }
    const filtered = applyFilters(get().rawData, newFilters)
    set({ filters: newFilters, filteredData: filtered })
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters }, filteredData: get().rawData })
  },
}))
