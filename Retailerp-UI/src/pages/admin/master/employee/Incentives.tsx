import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { Box, Typography } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import IncentiveTableFilter from './IncentiveTableFilter';
import { API_SERVICES } from '@services/index';
import { EmpDepartmentService } from '@services/EmpDepartmentService';
import { EmployeeRoleDropdownService } from '@services/EmployeeRoleDropdownService';

type DropdownOption = {
  label: string;
  value: string | number;
};

const Incentives = () => {
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [incentiveData, setIncentiveData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
    []
  );
  const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);

  const initialValues = {
    status: 0,
    location: '',
    search: '',
    department: null,
    role: null,
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params: any) => {
        const index = params.api.getSortedRowIds().indexOf(params.id);
        const serialNumber = index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'department_name',
      headerName: 'Department',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'role_name',
      headerName: 'Role',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'sales_target',
      headerName: 'Sales Target',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params) => {
        const target = params.value;

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 1,
            }}
          >
            {Array.isArray(target) && target.length === 2 ? (
              <Typography sx={{ fontWeight: 500 }}>
                ₹{target[0]?.toLocaleString('en-IN')} - ₹
                {target[1]?.toLocaleString('en-IN')}
              </Typography>
            ) : (
              <Typography sx={{ color: '#676767' }}>-</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'incentive_type',
      headerName: 'Incentive Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'incentive_value',
      headerName: 'Incentives',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params) => {
        const row = params.row;
        const type = row.incentive_type?.toLowerCase();
        const value = Number(row.incentive_value);

        if (!value) return <Typography>-</Typography>;

        let formattedValue = '';
        if (type === 'percentage') {
          formattedValue = `${parseFloat(value.toFixed(0))}%`;
        } else {
          formattedValue = `₹${value.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>{formattedValue}</Typography>
          </Box>
        );
      },
    },
  ];

  const handleEditUser = (rowData: any, modalType: string) => {
    const routeType =
      modalType === CONFIRM_MODAL.edit
        ? 'edit'
        : modalType === CONFIRM_MODAL.view
          ? 'view'
          : 'edit';

    navigateTo('/admin/master/employee/new', {
      state: { rowData, type: routeType },
    });
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const renderRowAction = (rowData: any) => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => {
          const props = {
            title: 'Edit',
            description: 'Do you want to modify data?',
            onCancelClick: () => handleCancelModal(),
            color: '#FF742F',
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
    ];
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
      setIncentiveData([]);

      // Build filter params
      const params: any = {};
      const departmentValue = edit.getValue('department');
      const roleValue = edit.getValue('role');
      const search = edit.getValue('search');

      if (departmentValue?.value) {
        params.department_id = Number(departmentValue.value);
      }
      if (roleValue?.value) {
        params.role_id = Number(roleValue.value);
      }
      if (search && search.trim()) {
        params.search = search.trim();
      }

      const response: any =
        await API_SERVICES.EmployeeIncentiveService.getAll(params);
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        setIncentiveData(response.data.data.incentives);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res: any = await EmpDepartmentService.getDepartmentsDropdown();
        const data = res?.data ?? res;
        const departmentsList = Array.isArray(data?.data)
          ? data.data
          : data?.data?.departments || [];

        const formattedDepartments = departmentsList.map((d: any) => ({
          label: d.name || d.department_name,
          value: d.id ?? d.department_id,
        }));

        setDepartmentOptions(formattedDepartments);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setDepartmentOptions([]);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const departmentValue = edit?.getValue('department');
    const departmentId = departmentValue
      ? Number(departmentValue?.value ?? departmentValue)
      : null;

    if (!departmentId) {
      setRoleOptions([]);
      if (edit?.getValue('role')) {
        edit.update({ role: null });
      }
      return;
    }

    const fetchRoles = async (deptId: number) => {
      try {
        const res: any = await EmployeeRoleDropdownService.getDropdown({
          department_id: deptId,
        });
        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res.data.data?.roles)
        ) {
          const options: DropdownOption[] = res.data.data.roles.map(
            (role: any) => ({
              label: role.name,
              value: Number(role.id),
            })
          );
          setRoleOptions(options);
        } else {
          setRoleOptions([]);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
        setRoleOptions([]);
      }
    };

    fetchRoles(departmentId);
  }, [edit?.getValue('department')]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    edit?.getValue('department'),
    edit?.getValue('role'),
    edit?.getValue('search'),
  ]);
  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="Incentives List"
          count={incentiveData.length}
          btnName="Create New"
          navigateUrl="/admin/master/employee/new"
        />
        <Grid container sx={contentLayout}>
          <IncentiveTableFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
            departmentOptions={departmentOptions}
            roleOptions={roleOptions}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={incentiveData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default Incentives;
