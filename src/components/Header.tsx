import colors from '@/theme/colors';
import fonts from '@/theme/fonts';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header({
  text,
  variant = 'primary',
  shouldShowBackButton,
}: {
  text: string;
  variant?: 'primary' | 'secondary';
  shouldShowBackButton?: boolean;
}) {
  const router = useRouter();
  const textColor =
    variant === 'primary'
      ? colors.foreground.primary
      : colors.foreground.contrast;

  return (
    <View style={styles.container}>
      {shouldShowBackButton && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Entypo name="chevron-left" size={24} color={textColor} />
        </TouchableOpacity>
      )}
      <Text
        style={[
          styles.text,
          {
            color: textColor,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    ...fonts.h2,
  },
  backButton: {
    marginRight: 8,
  },
});
