import React from 'react';
import {
	createStackNavigator,
	TransitionPresets,
} from '@react-navigation/stack';
import { AuthScreenNames } from '../@types';
import OnboardingScreen from '../screens/onboarding';
import AuthScreen from '../screens/auth';
import RecoverPasswordScreen from '../screens/recoverPassword';

const AuthStack = createStackNavigator<AuthScreenNames>();

const AuthRoute = () => {
	return (
		<AuthStack.Navigator
			screenOptions={{
				headerShown: false,
				...TransitionPresets.SlideFromRightIOS,
			}}
		>
			<AuthStack.Screen name="onboarding" component={OnboardingScreen} />
			<AuthStack.Screen name="auth" component={AuthScreen} />
			<AuthStack.Screen name="recovery" component={RecoverPasswordScreen} />
		</AuthStack.Navigator>
	);
};

export default AuthRoute;
