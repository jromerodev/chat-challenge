import React from 'react';
import {SafeAreaView, Text} from 'react-native';
// import { AppearanceProvider } from 'react-native-appearance';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { enableScreens } from 'react-native-screens';
// import { Provider } from 'react-redux';
// import { ThemeProvider } from './components';
// //import { AuthProvider } from './hooks';
// import { store } from './store';
// import RootRoute from './routes';
const App = () => {
  return (
    <SafeAreaView>
      <Text>What's up!!!!</Text>
      Whats up!!!
    </SafeAreaView>
    // <Provider store={store}>
    // 	<SafeAreaProvider>
    // 						<RootRoute />
    // 			</LocalizationProvider>
    // 		</AppearanceProvider>
    // 	</SafeAreaProvider>
    // </Provider>
  );
};

export default App;

// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/lib/integration/react';
// // store
// import store, { persistor } from './src/store';
// // libs
// import { AppearanceProvider } from 'react-native-appearance';
// // main App navigation / entry
// import AppNavigation from './src/navigation/AppNavigation';


// const App = () => {
//   return (
//     <Provider {...{ store }}>
//       <PersistGate loading={null} {...{ persistor }}>
//         <AppearanceProvider>
//           <AppNavigation />
//         </AppearanceProvider>
//       </PersistGate>
//     </Provider>
//   );
// };

// export default App;