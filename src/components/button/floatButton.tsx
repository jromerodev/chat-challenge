import React from 'react';
import styled, {useTheme} from 'styled-components/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Animated} from 'react-native';
import {FloatButtonProps} from '../../@types';
import Gradient from '../gradient';
import Button from './index';

const FloatButton = ({
  addBottomSafeArea = false,
  contentAnimation,
  gradientColor,
  isLoading,
  label,
  onPress,
}: FloatButtonProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const slideButton = contentAnimation?.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });
  return (
    <StyledSubmitContainer
      style={{
        opacity: contentAnimation || 1,
        paddingBottom: addBottomSafeArea ? insets.bottom : 0,
        transform: [{translateY: slideButton || 0}],
      }}>
      <Button
        label={label}
        isLoading={isLoading}
        onPress={onPress}
        style={{margin: 16, zIndex: 2}}
        variant="primary"
      />
      <Gradient
        colors={gradientColor || theme.gradient800}
        fullHeight
        position="bottom"
        yStart={0.4}
        yEnd={0}
      />
    </StyledSubmitContainer>
  );
};

export default FloatButton;

const StyledSubmitContainer = styled(Animated.View)`
  bottom: 0;
  left: 0;
  padding-top: 24px;
  position: absolute;
  right: 0;
`;
