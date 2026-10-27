import 'i18next'

import { I18N_DEFAULT_NS } from './shared/i18n/i18nConstants'
import { resources } from './shared/i18n/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: typeof I18N_DEFAULT_NS
		resources: typeof resources.en
	}
}
