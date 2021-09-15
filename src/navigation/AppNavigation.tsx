import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import RooStack from './RootStack';
import useTheme from '../hooks/useTheme';
import startup from '../hooks/startup';

const AppNavigation = () => {
  startup();

  const {theme} = useTheme();
  return (
    <View style={{flex: 1, backgroundColor: theme.$background}}>
      <NavigationContainer>
        <RooStack />
      </NavigationContainer>
    </View>
  );
};

export default AppNavigation;
