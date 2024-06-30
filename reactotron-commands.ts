import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';

/**
 * Custom commands useful for debug and development
 */
export const commands = [
  {
    command: 'AsyncStorage - Clear',
    handler: () => {
      AsyncStorage.clear();
      NativeModules.DevSettings.reload();
    },
    title: 'AsyncStorage - Clear',
    description: 'Removes whole AsyncStorage data, then reload the app',
  },
];

commands.forEach((customCommand) => Reactotron.onCustomCommand(customCommand));
