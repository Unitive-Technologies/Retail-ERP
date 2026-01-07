import { SchemeCartIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { MUHTable } from '@components/index';
import { attendanceData } from '@constants/DummyData';
import toast from 'react-hot-toast';
import { useTheme } from '@mui/material';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import MUHListItemCell from '@components/MUHListItemCell';
const EmployeeAttendance = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [attendaceData, setAttendaceData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    search: '',
    joining_date: null,
  };

  const edit = useEdit(initialValues);

  const card = [
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Total',
      value: 102,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Present',
      value: 52,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Absent',
      value: 2,
      activeTab: activeTab,
    },
  ];
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
      field: 'date',
      headerName: 'Date',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.status}
          titleStyle={{
            color:
              row.status === 'Present'
                ? theme.Colors.greenPrimary
                : theme.Colors.redPrimarySecondary,
          }}
        />
      ),
    },

    {
      field: 'clock_in',
      headerName: 'Clock In',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'clock_out',
      headerName: 'Clock Out',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'production',
      headerName: 'Production',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'break',
      headerName: 'Break',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'over_time',
      headerName: 'Overtime',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_hours',
      headerName: 'Total Hours',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setAttendaceData(attendanceData); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setAttendaceData([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };

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

  return (
    <>
      <StatusCard data={card} onClickCard={onclickActiveTab} />
      <PageHeader title="HISTORY" showCreateBtn={false} />
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
          rows={attendaceData}
          loading={loading}
        />
      </Grid>
    </>
  );
};

export default EmployeeAttendance;
