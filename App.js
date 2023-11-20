import {PaperProvider} from 'react-native-paper';
import Home from './src/pages/home';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Navigator from './src/Navigator';

export default function App() {
  return (
    <PaperProvider>
      <Provider store={store}>
        <Navigator />
      </Provider>
    </PaperProvider>
  );
}
