import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilters } from '@/shared/api/filters'
import {
	type FilterSelection,
	toSearchRequestFilter,
	toSelection,
	toggleOption
} from '@/shared/lib/filter/selection'
import { useFilterStore } from '@/shared/store/filterStore'
import { Button } from '@/shared/ui/Button'
import { CloseButton } from '@/shared/ui/CloseButton'

import { ConfirmDialog } from './ConfirmDialog'
import { FilterGroup } from './FilterGroup'

interface FilterModalContentProps {
	titleId: string
	onClose: () => void
}

/**
 * Mounted only while the modal is open, so the draft is always
 * re-initialized from the saved global state on every opening.
 */
export const FilterModalContent = ({
	titleId,
	onClose
}: FilterModalContentProps) => {
	const { t } = useTranslation('filter')
	const formId = useId()

	const { data: filterItems = [], isPending, isError, refetch } = useFilters()
	const selectedFilters = useFilterStore(state => state.selectedFilters)
	const setSelectedFilters = useFilterStore(state => state.setSelectedFilters)

	const [draft, setDraft] = useState<FilterSelection>(() =>
		toSelection(selectedFilters)
	)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const hasSelection = Object.values(draft).some(ids => ids.length > 0)

	const handleToggle = (filterId: string, optionId: string) =>
		setDraft(current => toggleOption(current, filterId, optionId))

	const handleConfirm = () => {
		setSelectedFilters(toSearchRequestFilter(filterItems, draft))
		setIsConfirmOpen(false)
		onClose()
	}

	const handleDecline = () => {
		setIsConfirmOpen(false)
		onClose()
	}

	const renderBody = () => {
		if (isPending) {
			return (
				<p
					role="status"
					className="py-12 text-center text-gray-500"
				>
					{t('loading')}
				</p>
			)
		}

		if (isError) {
			return (
				<div
					role="alert"
					className="flex flex-col items-center gap-4 py-12"
				>
					<p className="text-red-600">{t('error')}</p>
					<Button
						variant="link"
						onClick={() => refetch()}
					>
						{t('retry')}
					</Button>
				</div>
			)
		}

		if (filterItems.length === 0) {
			return <p className="py-12 text-center text-gray-500">{t('empty')}</p>
		}

		return filterItems.map(filter => (
			<FilterGroup
				key={filter.id}
				filter={filter}
				selectedIds={draft[filter.id] ?? []}
				onToggle={optionId => handleToggle(filter.id, optionId)}
			/>
		))
	}

	return (
		<div className="flex max-h-[calc(100dvh-2rem)] flex-col px-4 sm:px-8 md:max-h-[calc(100dvh-6rem)]">
			<header className="relative flex items-center justify-center border-b-2 border-line pt-6 pb-4 md:pt-10 md:pb-6">
				<h2
					id={titleId}
					className="text-[28px] leading-[1.2] font-medium md:text-[40px]"
				>
					{t('title')}
				</h2>
				<CloseButton
					label={t('close')}
					onClick={onClose}
					className="absolute top-6 right-0 md:top-[52px]"
				/>
			</header>

			<form
				id={formId}
				className="min-h-0 flex-1 overflow-y-auto"
				onSubmit={event => {
					event.preventDefault()
					setIsConfirmOpen(true)
				}}
			>
				{renderBody()}
			</form>

			<footer className="grid items-center gap-4 border-t-2 border-line pt-8 pb-6 sm:grid-cols-[1fr_auto_1fr] md:pb-10">
				<Button
					type="submit"
					form={formId}
					disabled={isPending || isError}
					className="w-full justify-self-center sm:col-start-2 sm:w-[184px]"
				>
					{t('apply')}
				</Button>
				<Button
					variant="link"
					onClick={() => setDraft({})}
					disabled={!hasSelection}
					className="justify-self-center sm:justify-self-end"
				>
					{t('clearAll')}
				</Button>
			</footer>

			<ConfirmDialog
				open={isConfirmOpen}
				onConfirm={handleConfirm}
				onDecline={handleDecline}
				onClose={() => setIsConfirmOpen(false)}
			/>
		</div>
	)
}
