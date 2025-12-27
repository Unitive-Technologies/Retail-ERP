import Grid from '@mui/material/Grid2';
import { Box, useTheme, Typography, Avatar } from '@mui/material';
import { MUHTable, StatusCard } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { TotalStockValueIcon, TotalStockWeightIcon } from '@assets/Images';
import MenuActionComp from '@components/MenuActionComp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DeleteOutlinedIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import { useNavigate } from 'react-router-dom';
import { employeeListData } from '@constants/DummyData';

const EmployeeList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(
    null
  );
  const [employeeData, setEmployeeData] = useState<object[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedActionRow, setSelectedActionRow] = useState<any | null>(null);
  const open = Boolean(anchorEl);
  const [activeTab, setActiveTab] = useState<number>(0);

  // KPI Cards
  const card = [
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,
      title: 'Total Employee',
      value: '54',
      activeTab: activeTab,
    },
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,

      title: 'Active',
      value: '52',
      activeTab: activeTab,
    },
    {
      img: TotalStockWeightIcon,
      img2: TotalStockValueIcon,

      title: 'Inactive',
      value: '02',
      activeTab: activeTab,
    },
  ];

  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };
  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'employee_name',
      headerName: 'Employee Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            gap: 1.5,
            py: 1,
          }}
        >
          <Avatar
            src={row.profile_image_url}
            alt={row.employee_name}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: theme.Colors.grayLight,
            }}
          >
            {!row.profile_image_url &&
              row.employee_name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.Colors.black,
              }}
            >
              {row.employee_name}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                color: theme.Colors.graniteGray,
                mt: 0.5,
              }}
            >
              {row.employee_no}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'department',
      headerName: 'Dep',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'employment_type',
      headerName: 'Employment Type',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'module_access',
      headerName: 'Module Access',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'joined_date',
      headerName: 'Joined Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: { row: any }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <MoreVertIcon
            sx={{
              cursor: 'pointer',
              color: theme.Colors.blackLightLow,
              fontSize: '20px',
            }}
            onClick={(e) => handleActionsIconSelect(e, row)}
          />
        </Box>
      ),
    },
  ];

  const handleActionsIconSelect = (e: any, row: any) => {
    if (row?.id === selectedActionRow?.id) {
      setSelectedActionRow(null);
      setAnchorEl(null);
    } else {
      setSelectedActionRow(row);
      setAnchorEl(e.currentTarget);
    }
    e.stopPropagation();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderRowAction = (rowData: any) => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => {
          navigateTo(
            `/admin/master/employee/form?type=edit&rowId=${rowData.id}`
          );
          handleClose();
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => {
          navigateTo(
            `/admin/master/employee/form?type=view&rowId=${rowData.id}`
          );
          handleClose();
        },
      },
      {
        text: 'Delete',
        renderIcon: () => <DeleteOutlinedIcon />,
        onClick: () => {
          handleClose();
        },
      },
    ];
  };

  const handleFilterClear = () => {
    setSelectedBranch(null);
    setDateRange(null);
  };

  const iconBox = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  useEffect(() => {
    setEmployeeData(employeeListData);
  }, []);

  return (
    <>
      {/* Filter and Action Bar */}

      {/* KPI Cards */}
      <StatusCard data={card} onClickCard={onclickActiveTab} />

      {/* Employee List Table */}
      <Grid container sx={contentLayout} mt={2}>
        <Typography
          variant="h6"
          sx={{
            fontSize: theme.MetricsSizes.regular_x,
            fontFamily: theme.fontFamily.inter,
            color: theme.Colors.blackPrimary,
            fontWeight: theme.fontWeight.mediumBold,
            mb: 2,
          }}
        >
          Employee List
        </Typography>
        <MUHTable
          columns={columns}
          rows={employeeData}
          loading={loading}
          rowHeight={65}
          isPagination={true}
          isCheckboxSelection={true}
        />

        {/* Action Menu */}
        {selectedActionRow && (
          <MenuActionComp
            open={open}
            selectedActionRow={selectedActionRow}
            rowActions={renderRowAction(selectedActionRow)}
            handleClose={handleClose}
            anchorEl={anchorEl}
          />
        )}
      </Grid>
    </>
  );
};

export default EmployeeList;
