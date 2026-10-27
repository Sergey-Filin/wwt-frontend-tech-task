export const I18N_DEFAULT_NS = 'filter'
export const I18N_DEFAULT_LANGUAGE = 'en'
export const I18N_LANGUAGES = ['en', 'uk'] as const

export type I18nLanguage = (typeof I18N_LANGUAGES)[number]
