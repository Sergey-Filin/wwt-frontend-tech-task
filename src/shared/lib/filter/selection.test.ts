import { describe, expect, it } from 'vitest'

import { type FilterItem, FilterType } from '@/shared/api/types/Filter'

import { toSearchRequestFilter, toSelection, toggleOption } from './selection'

const filterItems: FilterItem[] = [
	{
		id: 'MEAL',
		name: 'Meal',
		type: FilterType.OPTION,
		options: [
			{ id: 'breakfast', name: 'Breakfast' },
			{ id: 'dinner', name: 'Dinner' }
		]
	},
	{
		id: 'BED',
		name: 'Bed',
		type: FilterType.OPTION,
		options: [{ id: 'double', name: 'Double' }]
	}
]

describe('toggleOption', () => {
	it('adds an option that is not selected', () => {
		expect(toggleOption({}, 'MEAL', 'dinner')).toEqual({ MEAL: ['dinner'] })
	})

	it('removes an option that is already selected', () => {
		expect(toggleOption({ MEAL: ['dinner'] }, 'MEAL', 'dinner')).toEqual({
			MEAL: []
		})
	})

	it('does not mutate the original selection', () => {
		const selection = { MEAL: ['breakfast'] }

		toggleOption(selection, 'MEAL', 'dinner')

		expect(selection).toEqual({ MEAL: ['breakfast'] })
	})
})

describe('toSearchRequestFilter', () => {
	it('keeps API order and skips empty groups and unknown ids', () => {
		const result = toSearchRequestFilter(filterItems, {
			MEAL: ['dinner', 'unknown', 'breakfast'],
			BED: [],
			UNKNOWN: ['x']
		})

		expect(result).toEqual([
			{
				id: 'MEAL',
				type: FilterType.OPTION,
				optionsIds: ['breakfast', 'dinner']
			}
		])
	})

	it('returns an empty array when nothing is selected', () => {
		expect(toSearchRequestFilter(filterItems, {})).toEqual([])
	})
})

describe('toSelection', () => {
	it('round-trips with toSearchRequestFilter', () => {
		const filters = toSearchRequestFilter(filterItems, {
			MEAL: ['breakfast'],
			BED: ['double']
		})

		expect(toSearchRequestFilter(filterItems, toSelection(filters))).toEqual(
			filters
		)
	})
})
