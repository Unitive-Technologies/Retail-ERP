import { CartActiveIcon, CartIcon } from '@assets/Images';
import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { MUHTable } from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import MUHListItemCell from '@components/MUHListItemCell';
import StatusCard from '@components/StatusCard';
import { attendanceData } from '@constants/DummyData';
import { useEdit } from '@hooks/useEdit';
import Grid from '@mui/material/Grid2';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const HrEmployeeAttendance = () => {
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [attendaceData, setAttendaceData] = useState<object[]>([]);

  const initialValues = {
    search: '',
    joining_date: null,
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
      field: 'date',
      headerName: 'Date',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.status}
          titleStyle={{
            color: row.status === 'Present' ? '#6CB044' : '#FF0000',
            fontSize:14,
            fontWeight:400,
            fontFamily: 'Roboto-Regular',
            alignItems:'center'
          }}
        />
      ),
    },
    {
      field: 'clock_in',
      headerName: 'Clock In',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'clock_out',
      headerName: 'Clock Out',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'production',
      headerName: 'Production',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'break',
      headerName: 'Break',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'over_time',
      headerName: 'Overtime',
      flex: 1.15,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_hours',
      headerName: 'Total Hours',
      flex: 1.15,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const card = [
    {
      img: CartIcon,
      img2: CartActiveIcon,
      title: 'Total',
      value: 54,
      activeTab: activeTab,
    },
    {
      img: CartIcon,
      img2: CartActiveIcon,
      title: 'Present',
      value: 52,
      activeTab: activeTab,
    },
    {
      img: CartIcon,
      img2: CartActiveIcon,
      title: 'Absent',
      value: 2,
      activeTab: activeTab,
    },
  ];

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

  return (
    <>
      <StatusCard data={card} onClickCard={onclickActiveTab} />
      <Grid container sx={contentLayout}>
        <Grid container sx={tableFilterContainerStyle}>
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
          rows={attendaceData}
          loading={loading}
        />
      </Grid>
    </>
  );
};

export default HrEmployeeAttendance;
