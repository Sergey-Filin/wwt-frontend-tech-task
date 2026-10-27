import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		'h-16 rounded-2xl bg-primary px-[70px] text-base leading-none font-semibold text-white hover:bg-primary-hover',
	outline:
		'h-16 rounded-2xl border-2 border-line bg-white px-12 text-base leading-none font-semibold text-muted hover:bg-gray-50',
	link: 'text-base leading-none font-medium text-link underline underline-offset-2 hover:opacity-80'
}

export const Button = ({
	variant = 'primary',
	type = 'button',
	className = '',
	...props
}: ButtonProps) => (
	<button
		type={type}
		className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
		{...props}
	/>
)
