import { type FilterItem, FilterType } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

/** Draft state of the modal: filter id -> selected option ids */
export type FilterSelection = Record<string, string[]>

export const toSelection = (filters: SearchRequestFilter): FilterSelection =>
	Object.fromEntries(filters.map(filter => [filter.id, [...filter.optionsIds]]))

export const toggleOption = (
	selection: FilterSelection,
	filterId: string,
	optionId: string
): FilterSelection => {
	const current = selection[filterId] ?? []
	const next = current.includes(optionId)
		? current.filter(id => id !== optionId)
		: [...current, optionId]

	return { ...selection, [filterId]: next }
}

/**
 * Converts the draft into the API format.
 * Keeps the order from the API data, drops unknown ids and empty groups.
 */
export const toSearchRequestFilter = (
	filterItems: FilterItem[],
	selection: FilterSelection
): SearchRequestFilter =>
	filterItems.flatMap(filterItem => {
		const selected = selection[filterItem.id] ?? []
		const optionsIds = filterItem.options
			.map(option => option.id)
			.filter(id => selected.includes(id))

		if (optionsIds.length === 0) {
			return []
		}

		return [{ id: filterItem.id, type: FilterType.OPTION, optionsIds }]
	})
