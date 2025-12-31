import { Box, useTheme, Tabs, Tab, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MUHTypography from './MUHTypography';
import { ButtonComponent } from '.';
import { Add, ArrowBack } from '@mui/icons-material';
import { DownloadIconPdf, PrintOutIcon } from '@assets/Images';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { EditBtnIcon } from '@assets/Images/AdminImages';

type Props = {
  titleStyle?: any;
  count?: number;
  btnName?: string;
  showDownloadBtn?: boolean;
  showCreateBtn?: boolean;
  showlistBtn?: boolean;
  navigateUrl?: string;
  icon?: ReactNode;
  showBackButton?: boolean;
  isEditBtn?: boolean;
  onEditSelectedCategories?: () => void;
  navigateState?: any;
  tabContent?: Array<{
    label: string;
    id: number | string;
  }>;
  currentTabVal?: number | string;
  onTabChange?: (val: number | string) => void;
  useSwitchTabDesign?: boolean;
  switchTabContainerWidth?: string;
  handleCloseClick?: () => void;
  listBtnName?: string | null;
  onDownloadClick?: (e: any) => void;
  onPrintClick?: (e: any) => void;
};

export type PageHeaderProps =
  | ({
      showTabNavigation?: true;
      title?: never;
    } & Props)
  | ({
      showTabNavigation?: false;
      title: string;
    } & Props);

// Common icon styling
const commonIconStyle = {
  mr: -0.2,
  mb: 0.2,
};

const iconBox = {
  width: '35px',
  height: '35px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};
const PageHeader = ({
  title,
  titleStyle,
  count,
  btnName,
  showDownloadBtn = true,
  showCreateBtn = true,
  showlistBtn = false,
  navigateUrl = '',
  icon,
  isEditBtn = false,
  showBackButton = false,
  navigateState = {},
  onEditSelectedCategories,
  showTabNavigation = false,
  tabContent,
  currentTabVal,
  onTabChange,
  useSwitchTabDesign = false,
  switchTabContainerWidth = '262px',
  handleCloseClick,
  listBtnName = null,
  onDownloadClick,
  onPrintClick,
}: PageHeaderProps) => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const defaultIcon = <Add sx={commonIconStyle} />;

  // Handle tab change for switch tab design
  const handleSwitchTabChange = (_event: any, newValue: number) => {
    if (tabContent && onTabChange) {
      const tab = tabContent[newValue];
      const value = tab?.id ?? newValue;
      onTabChange(value);
    }
  };

  // Get current tab index for switch tab design
  const getCurrentTabIndex = (): number => {
    if (!tabContent || currentTabVal === undefined) return 0;
    const index = tabContent.findIndex(
      (tab) => (tab.id ?? tabContent.indexOf(tab)) === currentTabVal
    );
    return index >= 0 ? index : 0;
  };

  const handleListClick = () => {
    if (navigateUrl) {
      navigateTo(navigateUrl, { state: navigateState });
    } else {
      handleCloseClick?.();
    }
  };

  return (
    <Grid
      container
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '35px',
        width: '100%',
      }}
    >
      {useSwitchTabDesign ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {/* Heading */}
          {title && (
            <Typography
              variant="inherit"
              sx={{
                fontWeight: 500,
                fontFamily: 'Roboto-Medium',
                fontSize: 16,
                ...titleStyle,
              }}
            >
              {title}
            </Typography>
          )}

          {/* Switch Tab Container */}
          {tabContent && tabContent.length > 0 && (
            <Box
              sx={{
                width: switchTabContainerWidth,
                height: '35px',
                border: '1px solid #D0D0D0',
                borderRadius: '8px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tabs
                value={getCurrentTabIndex()}
                onChange={handleSwitchTabChange}
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                  minHeight: '27px',
                  '& .MuiTabs-flexContainer': {
                    gap: '8px',
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: '27px',
                    height: '27px',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0px',
                    fontFamily: 'Roboto',
                    color: '#000',
                    opacity: 1,
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#7A1B2F',
                    color: '#fff !important',
                  },
                }}
              >
                {tabContent.map((tab, index) => (
                  <Tab key={tab.id ?? index} label={tab.label} />
                ))}
              </Tabs>
            </Box>
          )}
        </Box>
      ) : (
        <>
          {showTabNavigation && (
            <Box sx={{ display: 'flex', gap: 5 }}>
              {(tabContent || []).map((tab, index) => {
                const value = tab.id ?? index;
                const isActive = currentTabVal === value;
                return (
                  <Box
                    key={tab.label}
                    onClick={() => onTabChange && onTabChange(value)}
                    sx={{
                      px: 2,
                      py: 0.8,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: 14,
                      backgroundColor: isActive
                        ? theme.Colors.primaryLight
                        : 'transparent',
                      color: theme.Colors.black,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: theme.Colors.primaryLight,
                      },
                    }}
                  >
                    {tab.label}
                  </Box>
                );
              })}
            </Box>
          )}
          {title && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <MUHTypography
                text={title}
                size={16}
                weight={600}
                color={
                  count != null || showBackButton
                    ? theme.Colors.black
                    : theme.Colors.primary
                }
                family={'Roboto-Regular'}
                sx={{ textTransform: 'uppercase', ...titleStyle }}
              />
              {count != null ? (
                <MUHTypography
                  text={`(${count})`}
                  size={16}
                  weight={600}
                  color={theme.Colors.primary}
                  family={'Roboto-Regular'}
                  sx={{ textTransform: 'uppercase' }}
                />
              ) : null}
            </Box>
          )}
        </>
      )}

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {showDownloadBtn ? (
          <>
            <Box
              sx={{ ...iconBox, background: theme.Colors.primaryLight }}
              onClick={(e) => onDownloadClick?.(e)}
            >
              <img src={DownloadIconPdf} width={24} height={24} />
            </Box>
            <Box
              sx={{ ...iconBox, background: theme.Colors.primaryLight }}
              onClick={(e) => onPrintClick?.(e)}
            >
              <img src={PrintOutIcon} width={22.5} height={23} />
            </Box>
          </>
        ) : null}
        <Box sx={{ ml: 0.8 }}>
          {showCreateBtn ? (
            <ButtonComponent
              // startIcon={<Add sx={{ mr: -0.2, mb: 0.2 }} />}
              startIcon={icon || defaultIcon}
              buttonText={btnName}
              buttonFontSize={14}
              bgColor={theme.Colors.primary}
              buttonTextColor={theme.Colors.whitePrimary}
              buttonFontWeight={500}
              btnBorderRadius={2}
              btnHeight={35}
              padding={1.4}
              buttonStyle={{ fontFamily: 'Roboto-Regular' }}
              onClick={() => navigateTo(navigateUrl, { state: navigateState })}
            />
          ) : null}
          {showlistBtn ? (
            <ButtonComponent
              startIcon={
                <ArrowBack sx={{ mb: 0.2, fontSize: '18px !important' }} />
              }
              buttonText={listBtnName || 'List Page'}
              buttonFontSize={14}
              bgColor={theme.Colors.whitePrimary}
              buttonTextColor={theme.Colors.primary}
              buttonFontWeight={500}
              btnBorderRadius={2}
              btnHeight={35}
              padding={1.4}
              buttonStyle={{
                fontFamily: 'Roboto-Regular',
                border: `1px solid ${theme.Colors.primary}`,
              }}
              onClick={() => handleListClick()}
            />
          ) : null}
          {showBackButton ? (
            <ButtonComponent
              startIcon={
                <ArrowBack sx={{ mb: 0.2, fontSize: '18px !important' }} />
              }
              buttonText={'Back'}
              buttonFontSize={14}
              bgColor={theme.Colors.whitePrimary}
              buttonTextColor={theme.Colors.primary}
              buttonFontWeight={500}
              btnBorderRadius={2}
              btnHeight={35}
              padding={1.4}
              buttonStyle={{
                fontFamily: 'Roboto-Regular',
                border: `1px solid ${theme.Colors.primary}`,
              }}
              onClick={() => navigateTo(navigateUrl)}
            />
          ) : null}
          {isEditBtn ? (
            <EditBtnIcon
              style={{ width: 35, height: 35, cursor: 'pointer' }}
              onClick={onEditSelectedCategories}
            />
          ) : null}
        </Box>
      </Box>
    </Grid>
  );
};

export default PageHeader;
