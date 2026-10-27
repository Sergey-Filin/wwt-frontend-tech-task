import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	within
} from '@testing-library/react'
import i18n from 'i18next'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { FilterType } from '@/shared/api/types/Filter'
import '@/shared/i18n'
import { useFilterStore } from '@/shared/store/filterStore'

import { App } from './App'

const CONFIRM_TITLE = 'Do you want to apply new filter'

const renderApp = () =>
	render(
		<QueryClientProvider client={new QueryClient()}>
			<App />
		</QueryClientProvider>
	)

const appliedFilters = () =>
	JSON.parse(
		screen
			.getByRole('region', { name: 'Selected filters' })
			.querySelector('code')?.textContent ?? ''
	)

const openModal = async () => {
	fireEvent.click(screen.getByRole('button', { name: 'Open filters' }))
	const modal = screen.getByRole('dialog', { name: 'Filter' })

	await within(modal).findByRole('group', { name: 'Meal options' })

	return modal
}

beforeAll(() => {
	// jsdom does not implement <dialog> methods — emulate browser behaviour
	HTMLDialogElement.prototype.showModal = function showModal() {
		this.setAttribute('open', '')
		this.querySelector<HTMLElement>('button, input')?.focus()
	}
	HTMLDialogElement.prototype.close = function close() {
		if (!this.open) {
			return
		}
		this.removeAttribute('open')
		this.dispatchEvent(new Event('close'))
	}
})

beforeEach(() => useFilterStore.setState({ selectedFilters: [] }))
afterEach(async () => {
	cleanup()
	await i18n.changeLanguage('en')
})

describe('filter modal flow', () => {
	it('applies selection only after confirmation and pre-fills on reopen', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.click(
			within(modal).getByRole('checkbox', { name: 'Breakfast included' })
		)
		fireEvent.click(within(modal).getByRole('button', { name: 'Apply' }))

		expect(screen.getByRole('dialog', { name: CONFIRM_TITLE })).toBeVisible()
		expect(appliedFilters()).toEqual([])

		fireEvent.click(screen.getByRole('button', { name: 'Apply new filter' }))

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(appliedFilters()).toEqual([
			{ id: 'MEAL_OPTIONS', type: 'OPTION', optionsIds: ['breakfast'] }
		])

		const reopened = await openModal()

		expect(
			within(reopened).getByRole('checkbox', { name: 'Breakfast included' })
		).toBeChecked()
	})

	it('keeps previous filters on "Use old filter"', async () => {
		useFilterStore.setState({
			selectedFilters: [
				{ id: 'BED_TYPE', type: FilterType.OPTION, optionsIds: ['twin-beds'] }
			]
		})
		renderApp()
		const modal = await openModal()

		expect(
			within(modal).getByRole('checkbox', { name: 'Twin beds' })
		).toBeChecked()

		fireEvent.click(within(modal).getByRole('checkbox', { name: 'Gym' }))
		fireEvent.click(within(modal).getByRole('button', { name: 'Apply' }))
		fireEvent.click(screen.getByRole('button', { name: 'Use old filter' }))

		expect(appliedFilters()).toEqual([
			{ id: 'BED_TYPE', type: 'OPTION', optionsIds: ['twin-beds'] }
		])

		const reopened = await openModal()

		expect(
			within(reopened).getByRole('checkbox', { name: 'Gym' })
		).not.toBeChecked()
	})

	it('discards the draft when closed with the close button', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.click(within(modal).getByRole('checkbox', { name: 'Pool' }))
		fireEvent.click(within(modal).getByRole('button', { name: 'Close filter' }))

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(appliedFilters()).toEqual([])

		const reopened = await openModal()

		expect(
			within(reopened).getByRole('checkbox', { name: 'Pool' })
		).not.toBeChecked()
	})

	it('Esc on the confirmation closes only the confirmation', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.click(within(modal).getByRole('button', { name: 'Apply' }))
		const confirm = screen.getByRole('dialog', {
			name: CONFIRM_TITLE
		}) as HTMLDialogElement

		// Esc in a browser closes the <dialog> natively
		act(() => confirm.close())

		expect(
			screen.queryByRole('dialog', { name: CONFIRM_TITLE })
		).not.toBeInTheDocument()
		expect(screen.getByRole('dialog', { name: 'Filter' })).toBeInTheDocument()
	})

	it('syncs state after native close, so the modal can be reopened', async () => {
		renderApp()
		const modal = (await openModal()) as HTMLDialogElement

		act(() => modal.close())
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

		expect(await openModal()).toBeVisible()
	})

	it('closes on backdrop click, but not when the press started inside', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.mouseDown(within(modal).getByRole('checkbox', { name: 'Gym' }))
		fireEvent.click(modal)
		expect(screen.getByRole('dialog', { name: 'Filter' })).toBeInTheDocument()

		fireEvent.mouseDown(modal)
		fireEvent.click(modal)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it('returns focus to the trigger button after closing', async () => {
		renderApp()
		const trigger = screen.getByRole('button', { name: 'Open filters' })

		trigger.focus()
		const modal = await openModal()

		expect(trigger).not.toHaveFocus()

		fireEvent.click(within(modal).getByRole('button', { name: 'Close filter' }))

		expect(trigger).toHaveFocus()
	})

	it('"Clear all parameters" empties the draft', async () => {
		renderApp()
		const modal = await openModal()
		const checkbox = within(modal).getByRole('checkbox', { name: 'Spa' })

		fireEvent.click(checkbox)
		fireEvent.click(
			within(modal).getByRole('button', { name: 'Clear all parameters' })
		)

		expect(checkbox).not.toBeChecked()
	})
})

describe('language switch', () => {
	it('translates the page and the modal', async () => {
		renderApp()

		await act(() =>
			fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
				target: { value: 'uk' }
			})
		)

		expect(document.documentElement).toHaveAttribute('lang', 'uk')
		fireEvent.click(screen.getByRole('button', { name: 'Відкрити фільтри' }))

		const modal = screen.getByRole('dialog', { name: 'Фільтр' })

		expect(
			within(modal).getByRole('button', { name: 'Застосувати' })
		).toBeInTheDocument()
	})
})
