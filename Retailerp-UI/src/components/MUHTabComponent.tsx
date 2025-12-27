import { Grid, Tab, Tabs, Typography, useTheme } from '@mui/material';
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Breakpoints } from '../theme/schemes/PurelightTheme';

export const ORIENTATION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

interface MuiTabComponentProps {
  tabContent: any[];
  onTabChange?: (val: number | string) => void;
  currentTabVal: number | string;
  renderTabContent?: (val: number | string) => React.ReactNode;
  tabIndicatorColor?: string;
  orientation?: any;
  tabClasses?: any;
  isDivider?: boolean;
  tabContainerClassName?: any;
  tabContentClassName?: any;
  fontSize?: number;
  renderHeader?: () => React.ReactNode;
  selectedColor?: string;
  tabContentStyle?: any;
  indicatorHeight?: string | number;
  tabLabelStyle?: any;
  tabParentStyle?: any;
  unSelectedFontColor?: string;
  selectedTabBackgroundColor?: string;
  showBorder?:boolean
}

// eslint-disable-next-line react/display-name
const MuiTabComponent = forwardRef<MuiTabComponentHandle, MuiTabComponentProps>(
  (
    {
      tabContent = [],
      onTabChange,
      currentTabVal,
      renderTabContent,
      tabIndicatorColor,
      orientation = ORIENTATION.HORIZONTAL,
      tabClasses,
      isDivider = false,
      tabContainerClassName,
      tabContentClassName,
      // fontSize,
      renderHeader,
      selectedColor,
      tabContentStyle,
      indicatorHeight,
      tabLabelStyle,
      tabParentStyle,
      selectedTabBackgroundColor,
      unSelectedFontColor = '#FF7B00',
      showBorder=true,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();

    const [currentTabValue, setCurrentTabValue] = useState<number | string>(
      tabContent[0]?.value || 0
    );

    const [disabledTabs, setDisabledTabs] = useState<(number | string)[]>([]);

    const handleChange = (_: React.SyntheticEvent, val: number | string) => {
      if (onTabChange) {
        onTabChange(val);
      } else {
        setCurrentTabValue(val);
      }
    };

    const disableTab = (val: number | string) => {
      setDisabledTabs((prev) => [...new Set([...prev, val])]);
    };

    const enableTab = (val: number | string) => {
      setDisabledTabs((prev) => prev.filter((t) => t !== val));
    };

    useEffect(() => {
      setCurrentTabValue(currentTabVal);
    }, [currentTabVal]);

    // Expose disableTab and enableTab to parent
    useImperativeHandle(ref, () => ({
      disableTab,
      enableTab,
    }));

    return (
      <>
        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection:
              orientation === ORIENTATION.VERTICAL ? 'row' : 'column',
            width: '100%',
            height: '80px',
            padding: 2,
            backgroundColor: theme.Colors.whitePrimary,
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
          }}
        >
          <Grid
            sx={{
              boxShadow: `0px 0px 1.5px 0px ${theme.Colors.black}1A`,
              ...tabContainerClassName,
              overflow: 'hidden',
              width: '-webkit-fill-available',
            }}
          >
            {renderHeader ? renderHeader() : null}
            <Tabs
              onChange={handleChange}
              value={currentTabValue}
              orientation={orientation}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                width: '100%',
                display: 'flex',
                '& .MuiTabs-flexContainer': {
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center'
                },
                '& .MuiTabs-indicator': {
                  width: orientation === ORIENTATION.VERTICAL ? 5 : 'auto',
                  right: orientation === ORIENTATION.VERTICAL ? 0 : 'auto',
                  backgroundColor: tabIndicatorColor || '#FF7B00',
                  height: indicatorHeight || '6px',
                  borderRadius: 3,
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  width: '100%',
                  maxWidth: '100%',
                  opacity: 1,
                  '&.Mui-selected': {
                    color: theme.Colors.primary,
                  },
                  marginRight: isDivider ? 0 : 2,
                },
                '& .MuiTabs-scrollButtons.Mui-disabled': {
                  display: 'none',
                },
                ...tabParentStyle,
              }}
              {...rest}
            >
              {tabContent.map((item, index) => {
                const selectedItem = currentTabVal === item.id;
                const value = item?.value || item?.id || index;
                return (
                  <Tab
                    key={index}
                    label={
                      orientation === ORIENTATION.VERTICAL ? (
                        <Grid
                          container
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: theme.spacing(1),
                          }}
                        >
                          {item?.tabIcon || item?.activeIcon ? (
                            selectedItem ? (
                              <item.activeIcon />
                            ) : (
                              <item.tabIcon />
                            )
                          ) : null}
                          <Typography
                            sx={{
                              marginLeft: theme.spacing(1),
                              ...tabLabelStyle,
                            }}
                          >
                            {item?.label}
                          </Typography>
                        </Grid>
                      ) : (
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="center"
                          sx={{ width: '100%' }}
                        >
                          <Grid
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: theme.spacing(1),
                            }}
                          >
                            {item?.tabIcon || item?.activeIcon ? (
                              selectedItem ? (
                                <item.activeIcon />
                              ) : (
                                <item.tabIcon />
                              )
                            ) : null}
                            <Typography
                              sx={{
                                display: 'block',
                                fontSize: isDivider
                                  ? theme.MetricsSizes.small_xxx
                                  : 16,
                                color: selectedItem
                                  ? theme.Colors.whitePrimary
                                  : unSelectedFontColor,
                                fontWeight: theme.fontWeight.mediumBold,
                                [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]:
                                  {
                                    fontSize: isDivider
                                      ? theme.MetricsSizes.small_xxx
                                      : 16,
                                  },
                                [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]:
                                  {
                                    fontSize: isDivider
                                      ? theme.MetricsSizes.small_xxx
                                      : 16,
                                  },
                                [`@media screen and (max-width: ${Breakpoints.values.md}px)`]:
                                  {
                                    fontSize: theme.MetricsSizes.small_xx,
                                  },
                                [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]:
                                  {
                                    fontSize: theme.MetricsSizes.small,
                                  },
                                [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]:
                                  {
                                    fontSize: theme.MetricsSizes.small,
                                  },
                                ...tabLabelStyle,
                              }}
                            >
                              {item?.label}
                            </Typography>
                          </Grid>
                        </Grid>
                      )
                    }
                    value={value}
                    disabled={!!item?.disabled || disabledTabs.includes(value)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      flex: 1,
                      width: '100%',
                      maxWidth: '100%',
                      fontWeight: 600,
                      textTransform: 'none',
                      opacity: 1,
                      ...tabContentStyle,
                      '&.Mui-selected': {
                        color: selectedColor || theme.Colors.whitePrimary,
                        background: selectedTabBackgroundColor || '#FF7B00',
                        borderRadius: '4px',
                        position: 'relative',
                        marginRight: '1px',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          right: 0,
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '10px solid transparent',
                          borderBottom: '10px solid transparent',
                          borderRight: `10px solid ${theme.Colors.whitePrimary}`,
                          borderLeftRadius: 10,
                        },
                      },
                    }}
                    {...(tabClasses || {})}
                  />
                );
              })}
            </Tabs>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            border:showBorder? `1px solid ${theme.Colors.grayLight}`:'none',
            borderRadius: '8px',
            ...tabContentClassName,
          }}
        >
          {renderTabContent && renderTabContent(currentTabValue)}
        </Grid>
      </>
    );
  }
);

export default MuiTabComponent;

export interface MuiTabComponentHandle {
  disableTab: (val: number | string) => void;
  enableTab: (val: number | string) => void;
}
