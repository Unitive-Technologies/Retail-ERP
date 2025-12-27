import { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '@components/PageHeader';
import { useEdit } from '@hooks/useEdit';
import { contentLayout } from '@components/CommonStyles';
import RevenueListFilter from './RevenueList';
import MUHListItemCell from '@components/MUHListItemCell';
import { revenueBranchData } from '@constants/DummyData';

const RevenueBranchFilter = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const branchName = searchParams.get('branchName') || 'Revenue List';

  const initialValues = {
    status: 0,
    location: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.39,

      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'description',
      headerName: 'Description',
      flex: 0.8,

      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cash',
      headerName: 'Cash',
      flex: 0.8,

      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'upi',
      headerName: 'UPI',
      flex: 0.8,

      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'card',
      headerName: 'Card',
      flex: 0.8,

      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'opening_stock',
      headerName: 'Opening Stock',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'sold',
      headerName: 'Sold',
      flex: 0.7,

      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'old_silver',
      headerName: 'Old Silver',
      flex: 0.7,

      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'closing_stock',
      headerName: 'Closing Stock',
      flex: 1,

      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const CustomHeader = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid #E0E0E0',
        background: '#fff',
        mb: 2,
      }}
    >
      <Box
        sx={{
          flex: 4,
          textAlign: 'center',
          py: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '15px',
            color: '#000000',
          }}
        >
          Collections
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 5,
          textAlign: 'center',
          py: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '15px',
            color: '#000000',
          }}
        >
          Stock
        </Typography>
      </Box>
    </Box>
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setBranchData(revenueBranchData);
    } catch (err: any) {
      toast.error(err?.message);
      setBranchData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };

  const handleSelectValue = (item: { headerName: string }) => {
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

  return (
    <Grid container width={'100%'} mt={1.2}>
      <PageHeader
        title={` ${branchName}`}
        count={revenueBranchData.length}
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
      />

      <Grid container sx={contentLayout}>
        <RevenueListFilter
          selectItems={columns}
          handleSelectValue={handleSelectValue}
          selectedValue={hiddenColumns}
          handleFilterClear={handleFilterClear}
          edit={edit}
        />

        <CustomHeader />

        <MUHTable
          columns={columns.filter(
            (column) => !hiddenColumns.includes(column.headerName)
          )}
          rows={revenueBranchData}
          loading={loading}
          pagination
        />

        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </Grid>
  );
};

export default RevenueBranchFilter;
