import type { FilterItem } from '../types/Filter'

interface FiltersResponse {
	filterItems: FilterItem[]
}

/**
 * Emulates a request to the API. The JSON is loaded lazily,
 * so it can be swapped for a real `fetch` without touching consumers.
 */
export const getFilters = async (): Promise<FilterItem[]> => {
	const { default: data } = await import('@/shared/temp/filterData.json')

	return (data as unknown as FiltersResponse).filterItems
}
