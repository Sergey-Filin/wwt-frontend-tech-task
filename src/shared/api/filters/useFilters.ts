import { queryOptions, usePrefetchQuery, useQuery } from '@tanstack/react-query'

import { getFilters } from './getFilters'

export const filtersQueryOptions = queryOptions({
	queryKey: ['filters'],
	queryFn: getFilters,
	staleTime: Infinity
})

export const useFilters = () => useQuery(filtersQueryOptions)

/** Starts loading filters in advance, so the modal opens without a loader */
export const usePrefetchFilters = () => usePrefetchQuery(filtersQueryOptions)
