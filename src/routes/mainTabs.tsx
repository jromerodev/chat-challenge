import React from 'react';
import styled from 'styled-components/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { MainTabScreenNames, RootStateType } from '../@types';
import { MainTabBar, ScreenView } from '../components';
import { useLocalization } from '../hooks';
import ChatScreen from '../screens/chat';
import JournalScreen from '../screens/journal';
import ProfileScreen from '../screens/profile';
import RoutineScreen from '../screens/routine';

const MainTab = createMaterialTopTabNavigator<MainTabScreenNames>();

const MainTabRoute = () => {
	const { t } = useLocalization();
	const { isOnboardingDone, username } = useSelector(
		(s: RootStateType) => s.session
	);
	const hasUsername = Boolean(username.length && username !== 'humano');
	return (
		<StyledScreenView hideAppBar>
			<MainTab.Navigator
				tabBar={(props) => <MainTabBar {...props} />}
				swipeEnabled={isOnboardingDone}
			>
				<MainTab.Screen
					name="chat"
					component={ChatScreen}
					options={{ title: t('title.chat') }}
				/>
				<MainTab.Screen
					name="routine"
					component={RoutineScreen}
					options={{ title: t('title.routine0') }}
				/>
				<MainTab.Screen
					name="journal"
					component={JournalScreen}
					options={{ title: t('title.journalShort') }}
				/>
				<MainTab.Screen
					name="profile"
					component={ProfileScreen}
					options={{ title: hasUsername ? username : t('title.profile') }}
				/>
			</MainTab.Navigator>
		</StyledScreenView>
	);
};

export default MainTabRoute;

const StyledScreenView = styled(ScreenView)`
	background-color: ${(props) => props.theme.background800};
`;
