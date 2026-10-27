import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterModal } from '@/features/filter'
import { usePrefetchFilters } from '@/shared/api/filters'
import { useFilterStore } from '@/shared/store/filterStore'
import { Button } from '@/shared/ui/Button'

export const App = () => {
	const { t } = useTranslation('home')
	const resultTitleId = useId()
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const selectedFilters = useFilterStore(state => state.selectedFilters)

	usePrefetchFilters()

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center gap-10 px-4 py-16">
			<h1 className="text-center text-4xl text-gray-600 md:text-6xl">
				{t('title')}
			</h1>

			<Button onClick={() => setIsFilterOpen(true)}>{t('openFilters')}</Button>

			<section
				aria-labelledby={resultTitleId}
				className="w-full"
			>
				<h2
					id={resultTitleId}
					className="mb-3 text-xl font-medium text-gray-700"
				>
					{t('selectedFilters')}
				</h2>
				<pre className="overflow-x-auto rounded-xl bg-gray-100 p-4 text-sm">
					<code>{JSON.stringify(selectedFilters, null, 2)}</code>
				</pre>
			</section>

			<FilterModal
				open={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
			/>
		</main>
	)
}
