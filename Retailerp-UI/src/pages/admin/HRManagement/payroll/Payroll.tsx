import PageHeader from '@components/PageHeader';
import { Box, Grid } from '@mui/system';
import { useEffect, useState } from 'react';
import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import CommonTableFilter from '@components/CommonTableFilter';
import { useEdit } from '@hooks/useEdit';
import toast from 'react-hot-toast';
import { payrollDummyData } from '@constants/DummyData';
import { HumanIcon, EyeActionIcon } from '@assets/Images';
import { IconButton, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';

const Payroll = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [categoryData, setCategoryData] = useState<any>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });

  const initialValues = {
    status: 0,
    search: '',
  };
  const edit = useEdit(initialValues);

  const handleOnClick = (e: React.MouseEvent, row: any) => {
    e.stopPropagation();
    navigateTo('/admin/hr/payroll/view', { state: { rowData: row } });
  };

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
      field: 'employee_name',
      headerName: 'Employee Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const row = params?.row || {};
        return (
          <Grid
            sx={{
              display: 'flex',
              gap: 1,
              height: '100%',
              alignItems: 'center',
            }}
          >
            {row.image ? (
              <img
                src={row.image}
                alt="employee"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <HumanIcon
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            )}

            <Grid>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.Colors.black,
                }}
              >
                {row.employee_name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: theme.Colors.graniteGray,
                }}
              >
                {row.employee_id}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'month',
      headerName: 'Month',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'receipt_no',
      headerName: 'Receipt No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'amount_credited',
      headerName: 'Amount Credited',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <IconButton
            sx={{ color: theme.Colors.primary }}
            onClick={(e) => handleOnClick(e, row)}
          >
            <EyeActionIcon />
          </IconButton>
        </Box>
      ),
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
      setCategoryData(payrollDummyData); // TODO: Replace with API call later
    } catch (err: any) {
      setLoading(false);
      setCategoryData([]);
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
    <Grid container width={'100%'} mt={1.2}>
      <PageHeader
        title="PAYROLL LIST"
        showCreateBtn={true}
        btnName={'Create Payroll'}
        navigateUrl="/admin/hr/payroll/create"
      />
      <Grid container sx={contentLayout} mt={0}>
        <Grid container sx={tableFilterContainerStyle}>
          <Grid size={1.6}>
            <MUHDatePickerComponent
              required
              widthPlus={160}
              height={28}
              placeholder="Date"
              value={edit.getValue('date')}
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
          rows={categoryData}
          loading={loading}
        />
        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </Grid>
  );
};

export default Payroll;
