'use strict';

import {Platform} from 'react-native';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const isAndroidVersion21AndAbove = Platform.Version >= 21;

export {isIOS, isAndroid, isAndroidVersion21AndAbove};
