import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi
} from 'vitest'

import { type FilterItem, FilterType } from '@/shared/api/types/Filter'
import '@/shared/i18n'

import { FilterModal } from './FilterModal'

const getFiltersMock = vi.hoisted(() => vi.fn<[], Promise<FilterItem[]>>())

vi.mock('@/shared/api/filters/getFilters', () => ({
	getFilters: getFiltersMock
}))

const filterItems: FilterItem[] = [
	{
		id: 'BED_TYPE',
		name: 'Bed type',
		type: FilterType.OPTION,
		options: [{ id: 'twin-beds', name: 'Twin beds' }]
	}
]

const renderModal = () =>
	render(
		<QueryClientProvider
			client={
				new QueryClient({ defaultOptions: { queries: { retry: false } } })
			}
		>
			<FilterModal
				open
				onClose={vi.fn()}
			/>
		</QueryClientProvider>
	)

beforeAll(() => {
	// jsdom does not implement <dialog> methods
	HTMLDialogElement.prototype.showModal = function showModal() {
		this.setAttribute('open', '')
	}
})

beforeEach(() => getFiltersMock.mockReset())
afterEach(cleanup)

describe('filter modal data states', () => {
	it('shows a loader and disables Apply while filters are loading', async () => {
		let resolveFilters: (items: FilterItem[]) => void = () => {}

		getFiltersMock.mockReturnValue(
			new Promise(resolve => {
				resolveFilters = resolve
			})
		)
		renderModal()

		expect(screen.getByRole('status')).toHaveTextContent('Loading filters...')
		expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()

		resolveFilters(filterItems)

		expect(
			await screen.findByRole('checkbox', { name: 'Twin beds' })
		).toBeInTheDocument()
		expect(screen.queryByRole('status')).not.toBeInTheDocument()
	})

	it('shows an error and loads filters again on retry', async () => {
		getFiltersMock.mockRejectedValueOnce(new Error('Network error'))
		getFiltersMock.mockResolvedValueOnce(filterItems)
		renderModal()

		expect(await screen.findByRole('alert')).toHaveTextContent(
			'Failed to load filters'
		)
		expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()

		fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

		expect(
			await screen.findByRole('checkbox', { name: 'Twin beds' })
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled()
		expect(getFiltersMock).toHaveBeenCalledTimes(2)
	})
})
