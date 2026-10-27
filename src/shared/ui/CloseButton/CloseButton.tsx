interface CloseButtonProps {
	label: string
	onClick: () => void
	className?: string
}

export const CloseButton = ({
	label,
	onClick,
	className = ''
}: CloseButtonProps) => (
	<button
		type="button"
		aria-label={label}
		title={label}
		onClick={onClick}
		className={`flex size-6 cursor-pointer items-center justify-center rounded text-ink transition-colors hover:opacity-70 focus-visible:outline-2 focus-visible:outline-primary ${className}`}
	>
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="size-5"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
		>
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	</button>
)
