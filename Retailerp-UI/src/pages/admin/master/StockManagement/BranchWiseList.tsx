import { tableFilterContainerStyle } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';

import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ConfirmModal, MUHTable } from '@components/index';
import { useNavigate, useLocation } from 'react-router-dom';

import { BranchWiseData } from '@constants/DummyData';
import { useTheme, Box, Typography } from '@mui/material';

import CommonTableFilter from '@components/CommonTableFilter';
import React from 'react';

const BranchWiseList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const navigateTo = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = React.useState<number | string>(
    location.pathname.includes('branchWise') ? 1 : 0
  );

  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });

  const initialValues = {
    status: 0,
    offer_plan: '',
    search: '',
  };
  const selectItems = [
    { headerName: 'S.No' },
    { headerName: 'Date of Scheme' },
    { headerName: 'Scheme ID' },
    { headerName: 'Customer Name' },
    { headerName: 'Mobile Number' },
    { headerName: 'Saving Scheme' },
    { headerName: 'Installment Amount' },
    { headerName: 'Mode' },
    { headerName: 'Dues' },
  ];

  const selectedValue: any[] = [];
  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'branch_id',
      headerName: 'Branch ID',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            sx={{
              color: theme.Colors.primary,
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',

              textDecoration: 'underline',
            }}
            onClick={() => navigate(`/admin/stock/branchWise/branchWiseStock`)}
          >
            {row.branch_name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'gold_quantity',
      headerName: 'Gold Quantity',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'gold_value',
      headerName: 'Gold Value',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'silver_quantity',
      headerName: 'Silver Quantity',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'silver_value',
      headerName: 'Silver Value',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'old_jewel_weight',
      headerName: 'Old Jewel Weight',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'total_stock_value',
      headerName: 'Total Stock Value',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
  ];

  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };

  const handleSelectValue = (item: { headerName: never }) => {
    let hiddenCols = [];
    if (hiddenColumns.includes(item.headerName)) {
      hiddenCols = hiddenColumns.filter(
        (field: any) => field !== item.headerName
      );
      setHiddenColumns([...hiddenCols]);
    } else {
      hiddenCols = [...hiddenColumns, item.headerName];
      setHiddenColumns([...hiddenCols]);
    }
    handleCustomizeColumn(hiddenCols);
  };

  const handleFilterClear = () => {
    edit.reset();
    setHiddenColumns([]);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setOfferData(BranchWiseData); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setOfferData([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update currentTab when location changes (e.g., browser back/forward)
  useEffect(() => {
    if (location.pathname.includes('branchWise')) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [location.pathname]);

  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="BRANCH WISE"
          titleStyle={{ color: theme.Colors.black }}
          useSwitchTabDesign={true}
          tabContent={[
            { label: 'Stock Overview', id: 0 },
            { label: 'Branch-Wise Stock', id: 1 },
          ]}
          showlistBtn={false}
          showDownloadBtn={true}
          showCreateBtn={false}
          showBackButton={false}
          currentTabVal={currentTab}
          onTabChange={(val) => {
            setCurrentTab(val);

            if (val === 0 && currentTab !== 0) {
              navigateTo('/admin/stock');
            } else if (val === 1 && currentTab !== 1) {
              navigateTo('/admin/stock/branchWise');
            }
          }}
          switchTabContainerWidth="262px"
        />

        <Grid
          container
          sx={{
            ...tableFilterContainerStyle,

            p: '15px',
            border: '1px solid #E4E4E4',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <CommonTableFilter
            selectItems={selectItems}
            selectedValue={selectedValue}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={offerData}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default BranchWiseList;
