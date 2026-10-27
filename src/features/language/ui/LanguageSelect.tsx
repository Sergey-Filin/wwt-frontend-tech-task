import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { I18N_LANGUAGES, type I18nLanguage } from '@/shared/i18n/i18nConstants'

// Language names are shown in their own language, so they are not translated
const LANGUAGE_NAMES: Record<I18nLanguage, string> = {
	en: 'English',
	uk: 'Українська'
}

export const LanguageSelect = () => {
	const { t, i18n } = useTranslation('home')
	const selectId = useId()

	return (
		<div className="flex items-center gap-2 text-sm">
			<label htmlFor={selectId}>{t('language')}</label>
			<select
				id={selectId}
				value={i18n.resolvedLanguage}
				onChange={event => i18n.changeLanguage(event.target.value)}
				className="cursor-pointer rounded-lg border-2 border-line bg-white px-2 py-1 focus-visible:outline-2 focus-visible:outline-primary"
			>
				{I18N_LANGUAGES.map(language => (
					<option
						key={language}
						value={language}
						lang={language}
					>
						{LANGUAGE_NAMES[language]}
					</option>
				))}
			</select>
		</div>
	)
}
