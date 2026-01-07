import { GroupsIcon, HumanIcon, RowViewIcon } from '@assets/Images';
import {
  ActiveStatusIcon,
  InActiveStatusIcon,
} from '@assets/Images/AdminImages';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { contentLayout } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { MUHTable } from '@components/index';
import { HRManagementEmployeeRow } from '@constants/DummyData';
import toast from 'react-hot-toast';
import HrEmployeeTableFilter from './HrEmployeeTableFilter';
import { Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HrEmployeeList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    search: '',
    department: '',
    designation: '',
    branch: '',
  };

  const edit = useEdit(initialValues);

  const card = [
    {
      img: GroupsIcon,
      img2: GroupsIcon,
      title: 'Total Employee',
      value: 54,
      activeTab: activeTab,
    },
    {
      img: ActiveStatusIcon,
      img2: ActiveStatusIcon,
      title: 'Active',
      value: 52,
      activeTab: activeTab,
    },
    {
      img: InActiveStatusIcon,
      img2: InActiveStatusIcon,
      title: 'Inactive',
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
      field: 'department',
      headerName: 'Department',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'employee_type',
      headerName: 'Employment Type',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'joined_date',
      headerName: 'Joined Date',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setEmployeeData(HRManagementEmployeeRow); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setEmployeeData([]);
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

  const handleEditUser = (rowData: any) => {
    // const params = new URLSearchParams({
    //   type: type,
    //   rowId: rowData?.id,
    // }).toString();
    navigateTo(`/admin/hr/employee/details`, { state: { rowData } });
  };

  const renderRowAction = (rowData: never) => {
    console.log(rowData);
    return [
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditUser(rowData),
      },
    ];
  };

  return (
    <>
      <StatusCard data={card} onClickCard={onclickActiveTab} />
      <PageHeader
        title="EMPLOYEE"
        count={employeeData.length}
        titleStyle={{ color: theme.Colors.black }}
        showCreateBtn={false}
        navigateUrl="/admin/hr/employee"
      />
      <Grid container sx={contentLayout}>
        <HrEmployeeTableFilter
          selectItems={columns}
          selectedValue={hiddenColumns}
          handleSelectValue={handleSelectValue}
          handleFilterClear={handleFilterClear}
          edit={edit}
        />
        <MUHTable
          columns={columns.filter(
            (column) => !hiddenColumns.includes(column.headerName)
          )}
          rows={employeeData}
          loading={loading}
          getRowActions={renderRowAction}
        />
      </Grid>
    </>
  );
};

export default HrEmployeeList;
