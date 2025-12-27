import { TabComponent } from '@components/index';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import {
  MaterialTypeIcon,
  SelectedMaterialTypeIcon,
  SelectedSubCategoryIcon,
  SubCategoryIcon,
  SelectedCategoryIcon,
  CategoryIcon,
  VariantIcon,
  SelectedVariantIcon,
} from '@assets/Images';
import { useTheme } from '@mui/material/styles';
import MaterialTypeList from './materialTypeList';
import CategoryList from './categoryList';
import SubCategoryList from './subCategoryList';
import VariantList from './variantList';

const Collections = () => {
  const [selectedTab, setSelectedTab] = useState(() => {
    const savedTab = localStorage.getItem('selected-tab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });
  const theme = useTheme();

  const tabsData = [
    {
      label: 'Material Type',
      tabIcon: MaterialTypeIcon,
      activeIcon: SelectedMaterialTypeIcon,
      content: () => <MaterialTypeList />,
      id: 0,
    },
    {
      label: 'Category',
      tabIcon: CategoryIcon,
      activeIcon: SelectedCategoryIcon,
      content: () => <CategoryList />,
      id: 1,
    },
    {
      label: 'Sub Category',
      tabIcon: SubCategoryIcon,
      activeIcon: SelectedSubCategoryIcon,
      content: () => <SubCategoryList />,
      id: 2,
    },
    {
      label: 'Variants',
      tabIcon: VariantIcon,
      activeIcon: SelectedVariantIcon,
      content: () => <VariantList />,
      id: 3,
    },
  ];

  const onTabChange = (value: any) => {
    setSelectedTab(value);
    localStorage.setItem('selected-tab', value.toString());
  };

  const renderTabContent = (tabVal: any) => {
    const findactiveTab = tabsData.find(({ id }) => id === tabVal);
    return (
      <Grid sx={{ minHeight: '200px' }}>
        {findactiveTab ? findactiveTab.content() : null}
      </Grid>
    );
  };

  return (
    <>
      <TabComponent
        tabContent={tabsData}
        currentTabVal={selectedTab}
        selectedTabBackgroundColor={`linear-gradient(to right, ${theme.Colors.primaryDarkStart}, ${theme.Colors.primaryDarkEnd})`}
        unSelectedFontColor={theme.Colors.primary}
        showBorder={false}
        tabParentStyle={{
          '& .MuiTab-root': {
            marginRight: 0,
            minWidth: 'max-content',
            width: 'auto',
            flexShrink: 0,
          },
        }}
        tabLabelStyle={{ fontSize: 28 }}
        onTabChange={onTabChange}
        renderTabContent={renderTabContent}
        tabIndicatorColor="transparent"
        isDivider={true}
      />
    </>
  );
};

export default Collections;
