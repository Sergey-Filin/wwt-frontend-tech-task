import { useId } from 'react'

import { Modal } from '@/shared/ui/Modal'

import { FilterModalContent } from './FilterModalContent'

interface FilterModalProps {
	open: boolean
	onClose: () => void
}

export const FilterModal = ({ open, onClose }: FilterModalProps) => {
	const titleId = useId()

	return (
		<Modal
			open={open}
			onClose={onClose}
			labelledBy={titleId}
			className="max-w-[1280px] md:mt-20 md:max-h-[calc(100dvh-6rem)]"
		>
			<FilterModalContent
				titleId={titleId}
				onClose={onClose}
			/>
		</Modal>
	)
}
