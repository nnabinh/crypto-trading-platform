import { RefreshControl, StyleSheet, View } from 'react-native';
import colors from '@/theme/colors';
import { FlashList, ViewToken } from '@shopify/flash-list';
import SearchBar from '../components/SearchBar';
import CryptoRow from '../components/CryptoRow';
import {
  DEFAULT_PAGE_SIZE,
  cmcApi,
  useCmcLatestListingsQuery,
  useLazyCmcLatestQuotesQuery,
} from '../service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from 'src/store';
import Toast from 'react-native-toast-message';

const AUTO_UPDATE_QUOTES_INTERVAL = 60 * 1000; // 60 seconds
const LASTEST_LISTINGS_POLLING_SIZE = 5000; // Max CMC allowed records
const INITIAL_QUERY_SIZE = 100;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const visibleIdsUpdateRef = useRef<NodeJS.Timeout>();
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  /**
   * Quickly display 100 items at first before the 5000 item size polling has result
   */
  useCmcLatestListingsQuery({ page: 1, pageSize: INITIAL_QUERY_SIZE });

  /**
   * Polling/prefetching CMC latest listings data every 60 seconds
   */
  const {
    data: latestListingsData = {},
    isLoading,
    isError,
  } = useCmcLatestListingsQuery(
    { page: 1, pageSize: LASTEST_LISTINGS_POLLING_SIZE },
    { pollingInterval: 1000 * 60 }
  );

  /**
   * Update latest prices of visible items every 60 seconds
   */
  const [fetchCmcLatestQuotes] = useLazyCmcLatestQuotesQuery();

  const data = useMemo(
    () =>
      Object.values(latestListingsData)
        .filter(
          (data) =>
            data.name.toLowerCase().includes(searchText.toLowerCase()) ||
            data.symbol.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => b.quote.USD.market_cap - a.quote.USD.market_cap),
    [latestListingsData, searchText]
  );

  /**
   * A minimal performance improvement to avoid rendering thoundsands of rows at first
   * even though we're polling 5000 records every 60 seconds
   */
  const renderingData = useMemo(() => {
    return data.slice(0, page * DEFAULT_PAGE_SIZE);
  }, [data, page]);

  const onLoadMore = () => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onRefresh = () => {
    setPage(1);
    dispatch(cmcApi.util.resetApiState());
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    setVisibleIds(viewableItems.map((item) => item.item.id));
  };

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update data, please try again later!',
      });
    }
  }, [isError]);

  useEffect(() => {
    // Fetch latest quotes of visible items every 60 seconds
    clearInterval(visibleIdsUpdateRef.current);
    visibleIdsUpdateRef.current = setInterval(() => {
      fetchCmcLatestQuotes({ ids: visibleIds });
    }, AUTO_UPDATE_QUOTES_INTERVAL);
  }, [visibleIds]);

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchBar}
      />
      <FlashList
        data={renderingData}
        renderItem={({ item }) => <CryptoRow {...item} />}
        estimatedItemSize={64}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            tintColor={colors.foreground.primary}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          ...styles.list,
          paddingBottom: insets.bottom + 16,
        }}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  searchBar: {
    paddingHorizontal: 16,
  },
  list: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  separator: {
    marginTop: 24,
  },
});
