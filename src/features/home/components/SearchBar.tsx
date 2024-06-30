import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import colors from '@/theme/colors';

type SearchBarProps = {
  style?: ViewStyle;
} & TextInputProps;

export default function SearchBar({ style, ...restProps }: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      {/* This extra View is for the absolute icon not being changed regardless of the parent's paddings */}
      <View>
        <TextInput style={styles.searchInput} {...restProps} />
        <FontAwesome
          name="search"
          size={18}
          color="black"
          style={styles.searchIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    top: 10,
    left: 16,
  },
  searchInput: {
    backgroundColor: colors.background.contrast,
    borderRadius: 24,
    height: 40,
    paddingLeft: 42,
  },
});
