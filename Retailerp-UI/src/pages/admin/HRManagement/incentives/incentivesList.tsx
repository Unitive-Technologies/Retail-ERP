import { HumanIcon } from '@assets/Images';
import {
  CommonFilterSelectBoxProps,
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { MUHTable } from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import PageHeader from '@components/PageHeader';
import { dummyIncentivesData } from '@constants/DummyData';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const IncentivesList = () => {
  const theme = useTheme();
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [incentivesData, setIncentivesData] = useState<object[]>([]);

  const initialValues = {
    search: '',
    joining_date: null,
    month: '',
  };
  const edit = useEdit(initialValues);
  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'employee_name',
      headerName: 'Employee Name',
      flex: 1.2,
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
      field: 'designation',
      headerName: 'Designation',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'sales_target',
      headerName: 'Sales Target',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 14,
              color: theme.Colors.black,
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: theme.Colors.primary,
                fontWeight: 700,
                marginRight: 4,
              }}
            >
              &gt;
            </span>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: 'incentives',
      headerName: 'Incentives',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const MonthList = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
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
      setIncentivesData(dummyIncentivesData); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setIncentivesData([]);
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
      <PageHeader title="INCENTIVES LIST" showCreateBtn={false} />
      <Grid container sx={contentLayout}>
        <Grid container sx={tableFilterContainerStyle}>
          <Grid size={1.5}>
            <MUHSelectBoxComponent
              value={edit?.getValue('month')}
              onChange={(e: any) => edit?.update({ month: e.target.value })}
              placeholderText="This Month"
              selectItems={MonthList}
              {...CommonFilterSelectBoxProps}
            />
          </Grid>
          <Grid size={1.9}>
            <MUHDatePickerComponent
              required
              height={28}
              placeholder="Date range"
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
          rows={incentivesData}
          loading={loading}
        />
      </Grid>
    </>
  );
};

export default IncentivesList;