import { create } from 'zustand'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterState {
	selectedFilters: SearchRequestFilter
	setSelectedFilters: (selectedFilters: SearchRequestFilter) => void
}

export const useFilterStore = create<FilterState>()(set => ({
	selectedFilters: [],
	setSelectedFilters: selectedFilters => set({ selectedFilters })
}))
