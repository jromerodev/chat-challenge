import React from 'react';
import styled, {css} from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StyleProp, ViewStyle} from 'react-native';
import {AppNavProps, MessageData, MessageType} from '../../@types';
import {Avatar, Icon, Image, Text} from '../../components';
import {UIIcon} from '../../constants';
import TypingAnimation from './typingAnimation';

interface BubbleMessageProps extends MessageData {
  isTyping?: boolean;
  onEditPress?(): void;
  showEditButton?: boolean;
  showImages?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BubbleMessage = React.memo(
  ({
    id,
    images,
    isTyping = false,
    messageType,
    onEditPress,
    showEditButton,
    showImages = true,
    style,
    userMood,
    value,
    yanaMood,
  }: BubbleMessageProps) => {
    const screenNav = useNavigation<AppNavProps<'mainTabs'>>();

    const handleImagePress = (url: string) => {
      screenNav.navigate('imagePreview', {url});
    };

    return (
      <StyledMessage messageType={messageType} style={style}>
        {messageType === 'yana' && (
          <StyledAvatar
            avatarType="yana"
            messageType={messageType}
            yanaMood={yanaMood}
          />
        )}
        <StyledBubbleWrapper>
          {value.map((text, index) => (
            <StyledBubbleContainer
              key={id + text + index}
              messageType={messageType}>
              {messageType === 'user' && showEditButton && (
                <StyledEditButton onPress={onEditPress}>
                  <StyledEditIcon name={UIIcon.edit} fontSize={16} />
                </StyledEditButton>
              )}
              <StyledBubble key={id + text + index} messageType={messageType}>
                <StyledText messageType={messageType} textType="body2">
                  {text}
                </StyledText>
              </StyledBubble>
            </StyledBubbleContainer>
          ))}
          {Boolean(images?.length) &&
            showImages &&
            images?.map((image, index) => {
              return (
                <StyledBubble key={index} messageType="image">
                  <StyledImageButton onPress={() => handleImagePress(image)}>
                    <StyledImage source={{uri: image}} />
                  </StyledImageButton>
                </StyledBubble>
              );
            })}
          {isTyping && (
            <StyledBubble messageType="yana">
              <TypingAnimation />
            </StyledBubble>
          )}
        </StyledBubbleWrapper>
        {messageType === 'user' && (
          <StyledAvatar
            avatarType="user"
            messageType={messageType}
            userMood={userMood}
          />
        )}
      </StyledMessage>
    );
  },
);

export default BubbleMessage;

interface StyledProps {
  messageType: MessageType | 'image';
}

const StyledMessage = styled.View<StyledProps>`
  align-items: flex-end;
  flex-direction: row;
  padding-horizontal: 16px;

  ${props =>
    props.messageType === 'date' &&
    css`
      margin-vertical: 4px;
    `}

  ${props =>
    props.messageType !== 'date' &&
    css`
      margin-top: 6px;
    `}

	${props =>
    props.messageType === 'user' &&
    css`
      padding-left: 56px;
    `}

	${props =>
    props.messageType === 'yana' &&
    css`
      padding-right: 56px;
    `}
`;

const StyledAvatar = styled(Avatar)<StyledProps>`
  height: 40px;
  width: 40px;

  ${props =>
    props.messageType === 'user' &&
    css`
      margin-left: 6px;
    `}

  ${props =>
    props.messageType === 'yana' &&
    css`
      margin-right: 6px;
    `}
`;

const StyledBubbleWrapper = styled.View`
  flex: 1;
`;

const StyledBubbleContainer = styled.View<StyledProps>`
  ${props =>
    props.messageType === 'user' &&
    css`
      align-items: flex-end;
      flex-direction: row;
      justify-content: flex-end;
    `}
`;

const StyledBubble = styled.View<StyledProps>`
  border-radius: 20px;
  justify-content: center;
  margin-top: 4px;
  min-height: 40px;
  padding: 8px 16px;

  ${({messageType}) =>
    messageType === 'date' &&
    css`
      align-items: center;
    `}

  ${({messageType}) =>
    messageType === 'image' &&
    css`
      padding: 8px;
    `}

	${({messageType, theme}) =>
    messageType === 'user' &&
    css`
      align-self: flex-end;
      background-color: ${theme.actionMain};
    `}

	${({messageType, theme}) =>
    (messageType === 'yana' || messageType === 'image') &&
    css`
      align-self: flex-start;
      background-color: ${theme.background800};
    `}
`;

const StyledEditButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${props => props.theme.actionLight};
  border-radius: 16px;
  elevation: 1;
  height: 32px;
  justify-content: center;
  margin-bottom: 4px;
  margin-right: 8px;
  shadow-color: ${props => props.theme.secondaryText};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
  width: 32px;
`;

const StyledEditIcon = styled(Icon)`
  color: ${props => props.theme.actionMain};
`;

const StyledText = styled(Text)<StyledProps>`
  ${({messageType, theme}) =>
    messageType === 'user' &&
    css`
      color: ${theme.white};
      font-family: ${theme.fontBold};
    `}
`;

//TODO: Add the image aspect ratio.

const StyledImageButton = styled.TouchableOpacity`
  border-radius: 20px;
  height: 350px;
  width: 200px;
`;

const StyledImage = styled(Image)`
  border-radius: 16px;
`;
