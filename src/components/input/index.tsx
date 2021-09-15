import React, {useEffect, useRef, useState} from 'react';
import styled, {css, useTheme} from 'styled-components/native';
import {Animated, TextInput, TouchableOpacity, View} from 'react-native';
import {Transitioning, TransitioningView} from 'react-native-reanimated';
// import {InputProps, StyledInputUnderlineProps} from '../../@types';
// import {UIFontFamily, UIIcon} from '../../constants';
// import Icon from '../icon';
// import Text from '../text';
// import Transitions from '../transitions';
// import {useFontScale} from '../../hooks';

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      autoCorrect = false,
      editable = true,
      error,
      label,
      multiline = false,
      onBlur: onInputBlur,
      onFocus: onInputFocus,
      secureTextEntry,
      style,
      ...props
    },
    ref,
  ) => {
    const [isFocus, setFocus] = useState(false);
    const [isSecureEntry, setSecureEntry] = useState(Boolean(secureTextEntry));
    const [showError, setShowError] = useState(false);
    const fontSize = '12';
    const springValue = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<TransitioningView>(null);
    const theme = useTheme();

    const animateInput = () => {
      springValue.setValue(0);
      Animated.spring(springValue, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }).start();
    };

    useEffect(() => {
      if (error) animateInput();
      if (animationRef.current) {
        animationRef.current.animateNextTransition();
      }
      setShowError(Boolean(error));
    }, [error]);

    const translateX = springValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 10, 0],
    });

    return (
      <View style={style}>
        {Boolean(label) && <StyledLabel>{label}</StyledLabel>}

        <Animated.View style={{transform: [{translateX}]}}>
          <StyledInputContainer isTextArea={multiline}>
            <StyledInput
              allowFontScaling={false}
              autoCorrect={autoCorrect}
              editable={editable}
              fontSize={fontSize}
              multiline={multiline}
              onBlur={e => {
                if (onInputBlur) onInputBlur(e);
                setFocus(false);
              }}
              onFocus={e => {
                if (onInputFocus) onInputFocus(e);
                setFocus(true);
              }}
              placeholderTextColor={theme.placeholder}
              secureTextEntry={isSecureEntry}
              ref={ref}
              {...props}
            />

            {secureTextEntry && (
              <TouchableOpacity
                disabled={!editable}
                onPress={() => setSecureEntry(prevState => !prevState)}>
                <StyledEyeIcon
                  disabled={!editable}
                  name={isSecureEntry ? UIIcon.eyeOpen : UIIcon.eyeClosed}
                />
              </TouchableOpacity>
            )}

            {!multiline && (
              <StyledInputUnderline disabled={!editable} isFocus={isFocus} />
            )}
          </StyledInputContainer>
        </Animated.View>

        <Transitioning.View
          ref={animationRef}
          transition={Transitions.FadeErrorText}>
          {showError && (
            <StyledErrorContainer>
              <Icon
                color={theme.redBright}
                name={UIIcon.error}
                fontSize={14}
                style={{lineHeight: 24, height: 24}}
              />
              <StyledErrorText bold textType="body2">
                {error}
              </StyledErrorText>
            </StyledErrorContainer>
          )}
        </Transitioning.View>
      </View>
    );
  },
);

export default Input;

const StyledInputContainer = styled.View<{isTextArea: boolean}>`
  background-color: ${props => props.theme.background700};
  elevation: 1;
  position: relative;
  shadow-color: ${props => props.theme.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;

  ${props =>
    !props.isTextArea &&
    css`
      align-items: center;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      flex-direction: row;
      padding-horizontal: 16px;
    `};

  ${props =>
    props.isTextArea &&
    css`
      border-radius: 24px;
    `};
`;

const StyledLabel = styled(Text)`
  color: ${props => props.theme.primaryText};
  margin-bottom: 12px;
`;

const StyledInput = styled.TextInput<{fontSize: number}>`
  color: ${props => props.theme.defaultText};
  font-family: ${UIFontFamily.regular};
  font-size: ${props => props.fontSize}px;
  letter-spacing: -${props => props.fontSize * 0.03}px;
  line-height: ${props => props.fontSize * 1.25}px;
  opacity: ${props => (props.editable ? 1 : 0.5)};

  ${props =>
    !props.multiline &&
    css`
      flex: 1;
      height: 64px;
    `};

  ${props =>
    props.multiline &&
    css`
      max-height: 300px;
      min-height: 180px;
      padding-horizontal: 24px;
      padding-top: 24px;
      text-align-vertical: top;
    `};
`;

const StyledInputUnderline = styled.View<StyledInputUnderlineProps>`
  background-color: ${props => props.theme.background600};
  height: 2px;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  ${props =>
    props.isFocus &&
    css`
      background: ${props.theme.actionMain};
    `}

  ${props =>
    props.disabled &&
    css`
      background: ${props.theme.borderColor};
    `}
`;

const StyledEyeIcon = styled(Icon)<{disabled: boolean}>`
  color: ${props => props.theme.actionText};
  margin-right: 8px;

  ${props =>
    props.disabled &&
    css`
      color: ${props.theme.borderColor};
    `}
`;

const StyledErrorContainer = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

const StyledErrorText = styled(Text)`
  color: ${props => props.theme.redBright};
  margin-left: 8px;
`;
