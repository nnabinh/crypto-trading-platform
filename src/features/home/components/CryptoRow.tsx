import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { LastestListingCryptoCurrency } from '../types';
import fonts from '@/theme/fonts';
import colors from '@/theme/colors';
import { formatDollar, formatPercent } from '@/utils/format';

export default function CryptoRow({
  name,
  symbol,
  quote,
}: LastestListingCryptoCurrency) {
  const isPositiveChange = quote.USD.percent_change_24h > 0;
  const isNegativeChange = quote.USD.percent_change_24h < 0;

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.right}>
          <Text
            style={[
              styles.percent,
              isPositiveChange && styles.positiveRate,
              isNegativeChange && styles.negativeRate,
            ]}
          >
            {formatPercent(quote.USD.percent_change_24h)}
          </Text>
          <Text style={styles.price}>{formatDollar(quote.USD.price)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  symbol: {
    ...fonts.h5,
    color: colors.foreground.primary,
  },
  name: {
    ...fonts.body2,
    color: colors.foreground.secondary,
  },
  percent: {
    ...fonts.h6,
    color: colors.foreground.primary,
  },
  price: {
    ...fonts.h7,
    color: colors.foreground.primary,
  },
  positiveRate: {
    color: colors.foreground.success,
  },
  negativeRate: {
    color: colors.foreground.error,
  },
});
