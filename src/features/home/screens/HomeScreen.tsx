import { RefreshControl, StyleSheet, View } from 'react-native';
import colors from '@/theme/colors';
import { FlashList, ViewToken } from '@shopify/flash-list';
import SearchBar from '../components/SearchBar';
import CryptoRow from '../components/CryptoRow';
import {
  cmcApi,
  useCmcLatestListingsQuery,
  useLazyCmcLatestQuotesQuery,
} from '../service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from 'src/store';
import Toast from 'react-native-toast-message';

const AUTO_UPDATE_QUOTES_INTERVAL = 30 * 1000; // 60 seconds

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const visibleIdsUpdateRef = useRef<NodeJS.Timeout>();
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: latestListingsData = {},
    isLoading,
    isError,
  } = useCmcLatestListingsQuery({ page });

  /**
   * Update latest prices of visible items every 60 seconds
   */
  const [fetchCmcLatestQuotes] = useLazyCmcLatestQuotesQuery();

  /**
   * Polling/prefetching CMC latest listings data every 60 seconds
   */
  useCmcLatestListingsQuery(
    { page: 1, pageSize: 5000 },
    { skip: isLoading, pollingInterval: 1000 * 60 }
  );

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
        data={data}
        renderItem={({ item }) => <CryptoRow {...item} />}
        estimatedItemSize={100}
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
