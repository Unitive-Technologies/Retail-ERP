import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { MUHTable } from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import { receiptsData } from '@constants/DummyData';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HrEmployeePayroll = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState<object[]>([]);

  const initialValues = {
    search: '',
    joining_date: null
  };
  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'month',
      headerName: 'Month',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            sx={{
              color: theme.Colors.primary,
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',

              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => navigate(`/admin/hr/employee/details/viewpayroll`)}
          >
            {row.month}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'receipt_no',
      headerName: 'Receipt No',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'credited_amount',
      headerName: 'Amount Credited',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
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
      setRowData(receiptsData); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setRowData([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container sx={contentLayout}>
        <Grid container sx={tableFilterContainerStyle}>
          <Grid size={2.3}>
            <MUHDatePickerComponent
              required
              height={28}
              placeholder="Date Range"
              value={edit.getValue('joining_date')}
              handleChange={(newDate: any) =>
                edit.update({ joining_date: newDate })
              }
              handleClear={() => edit.update({ joining_date: null })}
            />
          </Grid>
          <CommonTableFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
        </Grid>
        <MUHTable
          columns={columns.filter(
            (column) => !hiddenColumns.includes(column.headerName)
          )}
          rows={rowData}
          loading={loading}
        />
      </Grid>
    </>
  );
};

export default HrEmployeePayroll;