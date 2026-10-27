import { type Page, expect, test } from '@playwright/test'

const appliedFilters = async (page: Page) =>
	JSON.parse(
		(await page
			.getByRole('region', { name: 'Selected filters' })
			.locator('code')
			.textContent()) ?? ''
	)

const openModal = async (page: Page) => {
	await page.getByRole('button', { name: 'Open filters' }).click()
	const modal = page.getByRole('dialog', { name: 'Filter' })

	await expect(
		modal.getByRole('checkbox', { name: 'Breakfast included' })
	).toBeVisible()

	return modal
}

test.beforeEach(async ({ page }) => {
	await page.goto('/')
})

test('applies filters after confirmation and pre-fills them on reopen', async ({
	page
}) => {
	const modal = await openModal(page)

	await modal.getByRole('checkbox', { name: 'Breakfast included' }).check()
	await modal.getByRole('checkbox', { name: 'Gym' }).check()
	await modal.getByRole('button', { name: 'Apply' }).click()
	await page.getByRole('button', { name: 'Apply new filter' }).click()

	await expect(page.getByRole('dialog')).toHaveCount(0)
	expect(await appliedFilters(page)).toEqual([
		{ id: 'MEAL_OPTIONS', type: 'OPTION', optionsIds: ['breakfast'] },
		{
			id: 'HEALTH_ENTERTAINMENT_SPORTS',
			type: 'OPTION',
			optionsIds: ['gym']
		}
	])

	const reopened = await openModal(page)

	await expect(
		reopened.getByRole('checkbox', { name: 'Breakfast included' })
	).toBeChecked()
	await expect(reopened.getByRole('checkbox', { name: 'Gym' })).toBeChecked()
})

test('Esc closes the confirmation first, then the modal without applying', async ({
	page
}) => {
	const modal = await openModal(page)

	await modal.getByRole('checkbox', { name: 'Pool' }).check()
	await modal.getByRole('button', { name: 'Apply' }).click()
	await expect(
		page.getByRole('dialog', { name: 'Do you want to apply new filter' })
	).toBeVisible()

	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog')).toHaveCount(1)
	await expect(modal).toBeVisible()

	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog')).toHaveCount(0)
	expect(await appliedFilters(page)).toEqual([])
	await expect(page.getByRole('button', { name: 'Open filters' })).toBeFocused()
})

test('backdrop click closes the modal and discards the draft', async ({
	page
}) => {
	const modal = await openModal(page)

	await modal.getByRole('checkbox', { name: 'Spa' }).check()
	// Top-left corner is outside the dialog box, i.e. on the backdrop
	await page.mouse.click(5, 5)

	await expect(page.getByRole('dialog')).toHaveCount(0)

	const reopened = await openModal(page)

	await expect(
		reopened.getByRole('checkbox', { name: 'Spa' })
	).not.toBeChecked()
})

test('never moves focus to the page behind the modal', async ({ page }) => {
	await openModal(page)

	// The page behind a modal <dialog> is inert. Chrome may move focus
	// to its own UI after the last control, but never to the page.
	const isFocusOnPageBehind = () =>
		page.evaluate(() => {
			const active = document.activeElement
			const dialog = document.querySelector('dialog[open]')

			return Boolean(
				active && active !== document.body && !dialog?.contains(active)
			)
		})

	let visitedInside = 0

	// Each Tab must be checked before the next one, so the loop is sequential
	for (let step = 0; step < 30; step++) {
		// eslint-disable-next-line no-await-in-loop
		await page.keyboard.press('Tab')
		// eslint-disable-next-line no-await-in-loop
		expect(await isFocusOnPageBehind()).toBe(false)
		// eslint-disable-next-line no-await-in-loop
		visitedInside += await page
			.getByRole('dialog', { name: 'Filter' })
			.locator(':focus')
			.count()
	}

	expect(visitedInside).toBeGreaterThan(20)
})
