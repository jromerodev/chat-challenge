import React, { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import NativeSplashScreen from 'react-native-splash-screen';
import {
	NavigationContainer,
	NavigationContainerRef,
} from '@react-navigation/native';
import {
	createStackNavigator,
	TransitionPresets,
} from '@react-navigation/stack';
import { AppState, AppStateStatus } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';
import {
	NotificationType,
	RootScreenNames,
	RootStateType,
	SessionState,
} from '../@types';
import { Banner } from '../components';
import { AppStorage } from '../constants';
import { useLocalization, useMixpanel, useNotification } from '../hooks';
import {
	chatRestored,
	resetConversationUpdated,
	sessionRestored,
	settingsRestored,
	uiRestored,
} from '../store';
import LegalScreen from '../screens/legal';
import WebViewScreen from '../screens/webview';
import AppRoute from './appRoute';
import AuthRoute from './authRoute';

const RootStack = createStackNavigator<RootScreenNames>();

let deviceToken = '';
let backgroundNotify: NotificationType;
PushNotification.configure({
	onNotification: (notify) => {
		backgroundNotify = notify;
		notify.finish(PushNotificationIOS.FetchResult.NoData);
	},
	onRegistrationError: (err) => {
		console.error(err.message, err);
	},
	requestPermissions: false,
});

const RootRoute = () => {
	const { setLocale } = useLocalization();
	const { token } = useSelector((s: RootStateType) => s.session);
	const { bannerContent, isDarkModeActive } = useSelector(
		(s: RootStateType) => s.ui
	);
	const { mixpanel } = useMixpanel();
	const dispatch = useDispatch();
	const appStateRef = useRef(AppState.currentState);
	const navigationRef = useRef<NavigationContainerRef>(null);
	const tokenRef = useRef(token);
	const theme = useTheme();
	const navigationTheme = {
		dark: isDarkModeActive,
		colors: {
			primary: theme.actionMain,
			background: theme.background900,
			card: theme.background800,
			text: theme.primaryText,
			border: theme.borderColor,
			notification: theme.background700,
		},
	};
	let timer: NodeJS.Timeout;

	const handleAppStateChange = (nextAppState: AppStateStatus) => {
		if (
			appStateRef.current.match(/background/) &&
			nextAppState === 'active' &&
			tokenRef.current !== ''
		) {
			dispatch(resetConversationUpdated(true));
		}
		appStateRef.current = nextAppState;
	};

	const restoreAppStorage = async () => {
		try {
			// AsyncStorage.clear();
			const data = await AsyncStorage.multiGet([
				AppStorage.CHAT,
				AppStorage.SESSION,
				AppStorage.SETTINGS,
				AppStorage.UI,
			]);
			const chat = data[0][1];
			const session = data[1][1];
			const settings = data[2][1];
			const ui = data[3][1];
			if (session) {
				const sessionState = JSON.parse(session) as SessionState;
				if (!sessionState.appVersionName || sessionState.appVersionCode < 50) {
					AsyncStorage.clear();
				} else {
					if (chat) dispatch(chatRestored(JSON.parse(chat)));
					if (settings) dispatch(settingsRestored(JSON.parse(settings)));
					if (ui) dispatch(uiRestored(JSON.parse(ui)));
					dispatch(resetConversationUpdated(true));
					dispatch(sessionRestored(sessionState));
				}
			}
			timer = setTimeout(() => NativeSplashScreen.hide(), 100);
		} catch (e) {
			console.error(e);
		}
	};

	useNotification(deviceToken, backgroundNotify);

	useEffect(() => {
		setLocale();
		restoreAppStorage();
		AppState.addEventListener('change', handleAppStateChange);
		return () => {
			clearTimeout(timer);
			AppState.removeEventListener('change', handleAppStateChange);
		};
	}, []);

	useEffect(() => {
		if (mixpanel) {
			check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
				.then((checkResult) => {
					switch (checkResult) {
						case RESULTS.DENIED:
							request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(
								(requestResult) => {
									if (requestResult === RESULTS.BLOCKED)
										mixpanel.optOutTracking();
								}
							);
							break;
						case RESULTS.BLOCKED:
							mixpanel.optOutTracking();
							break;
					}
				})
				.catch((error) => console.log(error));
		}
	}, [mixpanel]);

	useEffect(() => {
		tokenRef.current = token;
	}, [token]);

	return (
		<NavigationContainer ref={navigationRef} theme={navigationTheme}>
			{bannerContent !== null && (
				<Banner
					bannerType={bannerContent.type}
					message={bannerContent.message}
				/>
			)}
			<RootStack.Navigator screenOptions={{ headerShown: false }}>
				{token === '' ? (
					<RootStack.Screen
						name="auth"
						component={AuthRoute}
						options={{ ...TransitionPresets.ScaleFromCenterAndroid }}
					/>
				) : (
					<RootStack.Screen
						name="app"
						component={AppRoute}
						options={{ ...TransitionPresets.ScaleFromCenterAndroid }}
					/>
				)}
				<RootStack.Screen
					name="privacy"
					component={LegalScreen}
					options={{ ...TransitionPresets.SlideFromRightIOS }}
				/>
				<RootStack.Screen
					name="terms"
					component={LegalScreen}
					options={{ ...TransitionPresets.SlideFromRightIOS }}
				/>
				<RootStack.Screen
					name="webView"
					component={WebViewScreen}
					options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
				/>
			</RootStack.Navigator>
		</NavigationContainer>
	);
};

export default RootRoute;
