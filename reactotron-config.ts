import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure({ name: 'Crypto Trading Platform' })
  .use(reactotronRedux())
  .connect();

declare global {
  interface Console {
    tron: Required<typeof Reactotron>['logImportant'];
  }
}

// Ref: https://github.com/infinitered/reactotron/blob/master/docs/tips.md
// eslint-disable-next-line no-console
console.tron = Reactotron.logImportant;

export default reactotron;
