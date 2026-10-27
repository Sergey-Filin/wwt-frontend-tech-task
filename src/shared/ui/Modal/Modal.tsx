import { type ReactNode, useEffect, useRef } from 'react'

interface ModalProps {
	open: boolean
	onClose: () => void
	children: ReactNode
	labelledBy?: string
	className?: string
}

/**
 * Thin wrapper over the native <dialog>:
 * focus trap, Esc handling and top-layer stacking come from the browser.
 */
export const Modal = ({
	open,
	onClose,
	children,
	labelledBy,
	className = ''
}: ModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const pressStartedOnBackdrop = useRef(false)
	const previouslyFocused = useRef<HTMLElement | null>(null)

	useEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) {
			return
		}

		if (open && !dialog.open) {
			previouslyFocused.current = document.activeElement as HTMLElement | null
			dialog.showModal()
		} else if (!open && dialog.open) {
			dialog.close()
		}

		if (!open && previouslyFocused.current) {
			// Return focus to the element that opened the modal
			previouslyFocused.current.focus()
			previouslyFocused.current = null
		}
	}, [open])

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={labelledBy}
			className={`mx-auto my-4 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl bg-white p-0 text-ink backdrop:bg-overlay/30 backdrop:backdrop-blur-[25px] ${className}`}
			onClose={event => {
				// Native close (Esc or dialog.close()) is the single source of truth,
				// so React state never stays "open" when the browser closed the dialog.
				// stopPropagation: a nested dialog must not close its parent.
				event.stopPropagation()

				if (open) {
					onClose()
				}
			}}
			onMouseDown={event => {
				pressStartedOnBackdrop.current = event.target === event.currentTarget
			}}
			onClick={event => {
				// Close only if both press and release happened on the backdrop,
				// so selecting text and releasing outside does not close the modal
				if (
					pressStartedOnBackdrop.current &&
					event.target === event.currentTarget
				) {
					onClose()
				}

				pressStartedOnBackdrop.current = false
			}}
		>
			{open && children}
		</dialog>
	)
}
