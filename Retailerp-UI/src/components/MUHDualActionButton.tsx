import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { ButtonComponent } from '.';

type Props = {
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  leftButtonText?: string;
  rightButtonText?: string;
  leftButtonWidth?: string;
  rightButtonWidth?: string;
  disabledRightBtn?: boolean;
  disabledLeftBtn?: boolean;
  leftButtonColor?: string;
  rightButtonColor?: string;
  leftButtonTextColor?: string;
  rightButtonTextColor?: string;
  leftButtonStyle?: React.CSSProperties;
  rightButtonStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
};

const MUHDualActionButton = (props: Props) => {
  const {
    onLeftButtonClick,
    onRightButtonClick,
    leftButtonText,
    rightButtonText,
    leftButtonWidth,
    rightButtonWidth,
    disabledRightBtn,
    disabledLeftBtn,
    leftButtonColor,
    rightButtonColor,
    leftButtonTextColor,
    rightButtonTextColor,
    leftButtonStyle = {},
    rightButtonStyle = {},
    containerStyle = {},
  } = props;

  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Grid container justifyContent={'center'} style={containerStyle}>
      {onLeftButtonClick && (
        <div style={{ marginRight: theme.Spacing.small_xx, ...containerStyle }}>
          <ButtonComponent
            buttonText={leftButtonText || t('UserManagement.save')}
            buttonTextColor={leftButtonTextColor || theme.Colors.whitePrimary}
            bgColor={leftButtonColor || theme.Colors.primary}
            btnWidth={leftButtonWidth || '145px'}
            onClick={onLeftButtonClick}
            btnHeight={43}
            disabled={disabledLeftBtn}
            buttonStyle={{
              fontFamily: theme.fontFamily.interRegular,
              ...leftButtonStyle,
            }}
          />
        </div>
      )}
      {onRightButtonClick && (
        <div style={{ marginLeft: theme.Spacing.small_xx, ...containerStyle }}>
          <ButtonComponent
            bgColor={rightButtonColor || theme.Colors.whitePrimary}
            buttonText={rightButtonText || t('UserManagement.cancel')}
            buttonTextColor={rightButtonTextColor || theme.Colors.primary}
            btnWidth={rightButtonWidth || '145px'}
            disabled={disabledRightBtn}
            onClick={onRightButtonClick}
            btnHeight={43}
            buttonStyle={{
              fontFamily: theme.fontFamily.interRegular,
              ...rightButtonStyle,
            }}
          />
        </div>
      )}
    </Grid>
  );
};

export default MUHDualActionButton;
