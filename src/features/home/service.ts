// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LastestListingCryptoCurrency } from './types';

export const DEFAULT_PAGE_SIZE = 50;

function getPaginationParams(
  page: number,
  pageSize = DEFAULT_PAGE_SIZE
): { start: number; limit: number } {
  const start = (page - 1) * pageSize + 1;
  const limit = pageSize;
  return { start, limit };
}

// Define a service using a base URL and expected endpoints
export const cmcApi = createApi({
  reducerPath: 'cmcApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_CMC_API,
    headers: {
      'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMC_API_KEY || '',
      Accept: 'application/json',
    },
  }),
  tagTypes: ['latestListings', 'latestQuotes'],
  endpoints: (builder) => ({
    cmcLatestListings: builder.query<
      { [id: string]: LastestListingCryptoCurrency },
      { page: number; pageSize?: number }
    >({
      providesTags: (_) => ['latestListings'],
      query: ({
        page,
        pageSize = DEFAULT_PAGE_SIZE,
      }: {
        page: number;
        pageSize?: number;
      }) => {
        const { start, limit } = getPaginationParams(page, pageSize);
        return `/v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}`;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page ||
        currentArg?.pageSize !== previousArg?.pageSize,
      transformResponse: (response: {
        data: LastestListingCryptoCurrency[];
      }) => {
        return response.data.reduce(
          (acc, data) => ({
            ...acc,
            [data.id]: data,
          }),
          {} as { [id: string]: LastestListingCryptoCurrency }
        );
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const newQueryArgs: { page?: number; pageSize?: number } = {
          ...queryArgs,
        };
        if (newQueryArgs.page) {
          delete newQueryArgs.page;
          delete newQueryArgs.pageSize;
        }
        return newQueryArgs;
      },
      merge: (currentCache = {}, newItems) => {
        return {
          ...currentCache,
          ...newItems,
        };
      },
    }),

    cmcLatestQuotes: builder.query<
      { data: { [id: string]: LastestListingCryptoCurrency } },
      { ids: number[] }
    >({
      providesTags: (_) => ['latestQuotes'],
      query: ({ ids }: { ids: number[] }) => {
        return `/v1/cryptocurrency/quotes/latest?id=${ids.join(',')}`;
      },
      // Read more about Pessimistic Updates
      // here: https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
      async onQueryStarted({ ids, ...patch }, { dispatch, queryFulfilled }) {
        try {
          const { data: latestQuotes } = await queryFulfilled;
          // Update cached price of latest listings
          dispatch(
            cmcApi.util.updateQueryData(
              'cmcLatestListings',
              { page: 1 },
              (draft) => {
                Object.keys(latestQuotes.data).map((id) => {
                  draft[id].quote.USD = {
                    ...draft[id].quote.USD,
                    ...latestQuotes.data[id].quote.USD,
                  };
                });
              }
            )
          );
          // Reflect changes to UI
          dispatch(cmcApi.util.invalidateTags(['latestListings']));
        } catch {}
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCmcLatestListingsQuery, useLazyCmcLatestQuotesQuery } =
  cmcApi;
