import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import PageHeader from '@components/PageHeader';
import { useTheme } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MUHListItemCell from '@components/MUHListItemCell';
import { branchRows } from '@constants/DummyData';

type BranchRow = {
  id: number;
  branch_name: string;
  total_sales: string;
  total_invoices: string;
  total_amount: string;
};

type BranchWiseSalesProps = {
  onBranchSelect?: (branch: BranchRow) => void;
};

const BranchWiseSales = ({
  onBranchSelect: _onBranchSelect,
}: BranchWiseSalesProps) => {
  const [currentTab, setCurrentTab] = React.useState<number | string>(1);
  const navigateTo = useNavigate();
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        return (
          <MUHListItemCell
            title={row.branch_name}
            titleStyle={{ color: theme.Colors.primary }}
            isLink={`/admin/salesManagement/branchView`}
            state={row}
          />
        );
      },
    },
    {
      field: 'total_sales',
      headerName: 'Total Sales',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_invoices',
      headerName: 'Total No. of Invoice',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  const handleTabChange = (val: number | string) => {
    setCurrentTab(val);
    if (val === 0) navigateTo('/admin/salesManagement');
    if (val === 1) navigateTo('/admin/salesManagement/branch');
  };
  return (
    <Grid container width="100%" mt={1.5}>
      <PageHeader
        title="SALES OVERVIEW"
        useSwitchTabDesign={true}
        tabContent={[
          { label: 'Sales Overview', id: 0 },
          { label: 'Branch-Wise Sales', id: 1 },
        ]}
        showlistBtn={false}
        showDownloadBtn={false}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
        onTabChange={handleTabChange}
        switchTabContainerWidth="262px"
      />
      <Grid container sx={contentLayout}>
        <MUHTable columns={columns} rows={branchRows} />
      </Grid>
    </Grid>
  );
};

export default BranchWiseSales;
