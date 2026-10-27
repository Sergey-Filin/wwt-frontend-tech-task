import type { FilterItem } from '@/shared/api/types/Filter'

interface FilterGroupProps {
	filter: FilterItem
	selectedIds: string[]
	onToggle: (optionId: string) => void
}

export const FilterGroup = ({
	filter,
	selectedIds,
	onToggle
}: FilterGroupProps) => (
	<fieldset className="min-w-0 border-b-2 border-line py-8 last:border-b-0">
		{/* float makes the legend a regular block, so it can be styled as a title */}
		<legend className="float-left mb-6 w-full text-xl leading-[1.2] font-medium md:text-2xl">
			{filter.name}
		</legend>
		<ul className="clear-both grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
			{filter.options.map(option => (
				<li key={option.id}>
					<label
						title={option.description}
						className="flex cursor-pointer items-center gap-4 text-base leading-5"
					>
						<input
							type="checkbox"
							name={filter.id}
							value={option.id}
							checked={selectedIds.includes(option.id)}
							onChange={() => onToggle(option.id)}
							className="checkbox"
						/>
						<span>{option.name}</span>
					</label>
				</li>
			))}
		</ul>
	</fieldset>
)
