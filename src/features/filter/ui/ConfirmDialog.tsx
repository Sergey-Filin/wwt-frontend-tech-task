import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/Button'
import { CloseButton } from '@/shared/ui/CloseButton'
import { Modal } from '@/shared/ui/Modal'

interface ConfirmDialogProps {
	open: boolean
	onConfirm: () => void
	onDecline: () => void
	onClose: () => void
}

export const ConfirmDialog = ({
	open,
	onConfirm,
	onDecline,
	onClose
}: ConfirmDialogProps) => {
	const { t } = useTranslation('filter')
	const titleId = useId()

	return (
		<Modal
			open={open}
			onClose={onClose}
			labelledBy={titleId}
			className="max-w-[1280px] shadow-[0_2px_12px_rgba(0,0,0,0.14)] md:mt-[200px]"
		>
			<div className="relative p-6 md:p-8">
				<CloseButton
					label={t('confirm.close')}
					onClick={onClose}
					className="absolute top-6 right-4 md:top-11 md:right-8"
				/>
				<h2
					id={titleId}
					className="px-8 text-center text-[28px] leading-[1.2] font-medium md:text-[40px]"
				>
					{t('confirm.title')}
				</h2>
				<div className="mt-12 flex flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:gap-8 md:mt-[120px]">
					<Button
						variant="outline"
						onClick={onDecline}
						className="w-full sm:w-[280px]"
					>
						{t('confirm.useOld')}
					</Button>
					<Button
						onClick={onConfirm}
						className="w-full sm:w-[280px]"
					>
						{t('confirm.applyNew')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
