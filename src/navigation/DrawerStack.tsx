import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeNavigationStack from './HomeStack';
import useTheme from '../hooks/useTheme';

interface DrawerProps {}

const DrawerStackNavigator = createDrawerNavigator();

const DrawerStack = ({}: DrawerProps) => {
  const {theme} = useTheme();
  return (
    <DrawerStackNavigator.Navigator
      initialRouteName="Home"
      drawerStyle={{
        backgroundColor: theme.$background,
      }}>
      <DrawerStackNavigator.Screen
        name="Home"
        component={HomeNavigationStack}
      />
    </DrawerStackNavigator.Navigator>
  );
};

export default DrawerStack;
