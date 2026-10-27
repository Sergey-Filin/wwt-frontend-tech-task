import type { en } from '../en'
import filter from './filter.json'
import home from './home.json'
import notFound from './not-found.json'

// `satisfies` keeps the keys in sync with the default (en) locale
export const uk = {
	filter: filter,
	home: home,
	'not-found': notFound
} as const satisfies typeof en
