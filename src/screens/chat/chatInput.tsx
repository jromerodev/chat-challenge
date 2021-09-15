import React, {useEffect, useMemo, useState} from 'react';
import styled, {css, useTheme} from 'styled-components/native';
import {Animated, Easing, Keyboard, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {
  ChatInputForm,
  RootStateType,
  SetUserResponsePayload,
} from '../../@types';
import {Icon, Text} from '../../components';
import {UIIcon} from '../../constants';
import {useFontScale, useLocalization, useStateForm} from '../../hooks';
import {hasOnlyWhiteSpaces} from '../../utils';
import ChatReplyButton from './chatReplyButton';

interface ChatInputProps {
  setResetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  submitResponse(data: SetUserResponsePayload): void;
}

const ChatInput = ({setResetVisible, submitResponse}: ChatInputProps) => {
  const {t} = useLocalization();
  const {
    inputDefaultValue,
    nextKey: inputNextKey,
    inputPlaceholder,
    quickReplies,
    userResponseFailed,
    yanaMessagesDelivered,
  } = useSelector((s: RootStateType) => s.chat);
  const form = useStateForm<ChatInputForm>(
    {input: ''},
    {
      validation: {
        input: {
          required: true,
          validate: value => !hasOnlyWhiteSpaces(value) || 'Error',
        },
      },
    },
  );
  const [replyDisabled, setReplyDisabled] = useState(false);
  const [replySelected, setReplySelected] = useState(NaN);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [isQuickreplyVisible, setQuickreplyVisible] = useState(
    Boolean(quickReplies.length),
  );
  const fontSize = useFontScale('body1');
  const theme = useTheme();
  const repliesAnimation = useMemo(
    () => [
      ...quickReplies.map(() => new Animated.Value(0)),
      new Animated.Value(0),
    ],
    [],
  );
  const inputValue = form.watch().input;
  const inputAnimation = repliesAnimation[repliesAnimation.length - 1];
  const slideInput = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  const handleReplyPress = (replyIndex: number) => {
    setReplySelected(() => {
      setReplyDisabled(true);
      return replyIndex;
    });
    const {eventName, nextKey, label: userResponse} = quickReplies[replyIndex];
    submitResponse({eventName: eventName || '', nextKey, userResponse});
  };

  const onSubmit = ({input: userResponse}: ChatInputForm) => {
    setSubmitLoading(true);
    Keyboard.dismiss();
    submitResponse({nextKey: inputNextKey, userResponse});
  };

  const quickReplyAnimation = () => {
    const animationStack = repliesAnimation.map(value =>
      Animated.timing(value, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    Animated.stagger(100, animationStack).start();
  };

  useEffect(() => {
    if (yanaMessagesDelivered) quickReplyAnimation();
  }, [yanaMessagesDelivered]);

  useEffect(() => {
    if (form.errors.input) {
      setResetVisible(true);
      setSubmitDisabled(true);
      setQuickreplyVisible(true);
      quickReplyAnimation();
    } else if (inputValue.length >= 1 && submitDisabled && !replyDisabled) {
      setResetVisible(false);
      setSubmitDisabled(false);
      setQuickreplyVisible(false);
    }
  }, [form.errors.input, inputValue]);

  useEffect(() => {
    if (userResponseFailed) {
      setReplyDisabled(false);
      setReplySelected(NaN);
      setSubmitLoading(false);
      if (inputValue.length >= 1) setSubmitDisabled(false);
    }
  }, [userResponseFailed]);

  return (
    <StyledResponseContainer>
      {Boolean(quickReplies.length) && isQuickreplyVisible && (
        <StyledButtonsContainer>
          {quickReplies.map((item, index) => (
            <ChatReplyButton
              animatedButton={repliesAnimation[index]}
              disabled={replyDisabled}
              index={index}
              isSelected={replySelected === index}
              key={index}
              onReplyPress={handleReplyPress}
              outline
              {...item}
            />
          ))}
        </StyledButtonsContainer>
      )}
      <StyledInputContainer
        style={{
          opacity: inputAnimation,
          transform: [{translateY: slideInput}],
        }}>
        {Boolean(inputDefaultValue.length) && (
          <StyledDefaultValue bold>{inputDefaultValue}</StyledDefaultValue>
        )}
        <StyledInput
          allowFontScaling={false}
          autoCapitalize="sentences"
          defaultValue={form.getValues().input}
          fontSize={fontSize}
          multiline
          onChangeText={text =>
            form.setValue('input', text, {shouldValidate: true})
          }
          placeholder={
            inputPlaceholder.length
              ? inputPlaceholder
              : t('placeholder.message')
          }
          placeholderTextColor={theme.placeholder}
        />
        {isSubmitLoading && (
          <StyledLoading color={theme.actionMain} size="small" />
        )}
        {!isSubmitLoading && (
          <StyledSubmitButton
            disabled={submitDisabled}
            onPress={form.handleSubmit(onSubmit)}>
            <StyledIcon
              disabled={submitDisabled}
              fontSize={18}
              name={UIIcon.send}
            />
          </StyledSubmitButton>
        )}
      </StyledInputContainer>
    </StyledResponseContainer>
  );
};

export default ChatInput;

const StyledResponseContainer = styled(Animated.View)`
  flex: 1;
  margin: 16px;
`;

const StyledButtonsContainer = styled(Animated.View)``;

const StyledInputContainer = styled(Animated.View)`
  align-items: center;
  background: ${props => props.theme.background700};
  border-radius: 20px;
  elevation: 1;
  flex-direction: row;
  max-height: 104px;
  padding-left: 16px;
  padding-right: 40px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

const StyledDefaultValue = styled(Text)`
  margin-right: 2px;
`;

const StyledInput = styled.TextInput<{fontSize: number}>`
  color: ${props => props.theme.defaultText};
  flex: 1;
  font-family: ${props => props.theme.fontRegular};
  font-size: ${props => props.fontSize}px;
  letter-spacing: -${props => props.fontSize * 0.03}px;
  line-height: ${props => props.fontSize * 1.25}px;

  ${Platform.OS === 'android' &&
  css`
    padding-left: 0;
    padding-bottom: 6px;
    padding-top: 6px;
  `};

  ${Platform.OS === 'ios' &&
  css`
    padding-bottom: 10px;
    padding-top: 10px;
  `};
`;

const StyledSubmitButton = styled.TouchableOpacity`
  align-items: center;
  align-self: flex-end;
  height: 40px;
  justify-content: center;
  position: absolute;
  right: 4px;
  width: 40px;
`;

const StyledLoading = styled.ActivityIndicator`
  align-items: center;
  align-self: flex-end;
  height: 40px;
  justify-content: center;
  position: absolute;
  right: 4px;
  width: 40px;
`;

const StyledIcon = styled(Icon)<{disabled: boolean}>`
  color: ${props =>
    props.disabled ? props.theme.placeholder : props.theme.actionMain};
`;
