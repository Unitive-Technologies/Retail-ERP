import {
  ApproveIcon,
  EyeActionIcon,
  GreenTickIcon,
  HumanIcon,
  PendingActiveIcon,
  PendingIcon,
  RedCloseIcon,
  RejectIcon2,
} from '@assets/Images';
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
import { LeaveListDatas } from '@constants/DummyData';
import toast from 'react-hot-toast';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
const LeaveList = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [leaveListData, setLeaveListData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    search: '',
    joining_date: null,
  };

  const edit = useEdit(initialValues);

  const card = [
    {
      img: PendingIcon,
      img2: PendingActiveIcon,
      title: 'Pending',
      value: 12,
      activeTab: activeTab,
    },
    {
      img: RejectIcon2,
      img2: RejectIcon2,
      title: 'Rejected',
      value: 11,
      activeTab: activeTab,
    },
    {
      img: ApproveIcon,
      img2: ApproveIcon,
      title: 'Approved',
      value: 34,
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
      field: 'designation',
      headerName: 'Designation',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'leave_date',
      headerName: 'Leave Date',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'leave_type',
      headerName: 'Leave Type',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
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
            // onClick={(e) => handleOnClick(e, row)}
          >
            <GreenTickIcon />
            <RedCloseIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setLeaveListData(LeaveListDatas); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setLeaveListData([]);
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

  // const renderRowAction = (rowData: never) => {
  //   console.log(rowData);
  // };
  return (
    <>
      <StatusCard data={card} onClickCard={onclickActiveTab} />
      <PageHeader title="LEAVE LIST" showCreateBtn={false} />
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
          rows={leaveListData}
          loading={loading}
          // getRowActions={renderRowAction}
        />
      </Grid>
    </>
  );
};

export default LeaveList;
