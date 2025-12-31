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
import { Box } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import { API_SERVICES } from '@services/index';
import { EmpDepartmentService } from '@services/EmpDepartmentService';
import { EmployeeRoleDropdownService } from '@services/EmployeeRoleDropdownService';
import RoleAccessTableFilter from './RoleAccessTableFilter';

type DropdownOption = {
  label: string;
  value: string | number;
};

const RoleAccess = () => {
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>([]);
  const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);

  const initialValues = {
    status: 0,
    location: '',
    search: '',
    department_id: '',
    role: '',
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'Roles',
      headerName: 'Roles',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'members',
      headerName: 'Members',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#F2F2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '0.9rem',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {params.value}
          </Box>
        </Box>
      ),
    },

    {
      field: 'access',
      headerName: 'Access Control',
      flex: 2.5,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
      department_id: rowData?.department_id ?? '',
      role_name: rowData?.role_name ?? rowData?.Roles ?? '',
    }).toString();
    navigateTo(`/admin/master/employee/role?${params}`);
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

  const handleSelectColumn = (item: any) => {
    const header = item?.headerName ?? item?.value ?? item;
    setHiddenColumns((prev: any[]) => {
      if (prev?.includes(header)) {
        return prev.filter((h) => h !== header);
      }
      return [...prev, header];
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const params: any = {};
      if (edit?.edits?.department_id) {
        params.department_id = edit.edits.department_id;
      }
      if (edit?.edits?.search && edit.edits.search.trim()) {
        params.search = edit.edits.search.trim();
      }
      if (edit?.edits?.role) {
        const roleValue = edit.edits.role;
        params.role = typeof roleValue === 'object' ? roleValue?.value : roleValue;
      }

      const res: any = await API_SERVICES.RoleService.getListDetails(params);

      const items =
        res?.data?.data?.items ||
        res?.data?.data?.roles ||
        res?.data?.data ||
        [];
      const rows = items.map((it: any, index: number) => ({
        id: it.id || index + 1,
        department: it.department_name ?? it.department ?? '-',
        Roles: it.role_name ?? it.role ?? '-',
        members: it.members_count ?? it.members ?? 0,
        access: it.access_control ?? it.access ?? '-',
        department_id: it.department_id,
        role_name: it.role_name ?? it.role,
      }));

      setBranchData(rows);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res: any = await EmpDepartmentService.getDepartmentsDropdown();
        const data = res?.data ?? res;
        const departmentsArr = Array.isArray(data?.data)
          ? data.data
          : data?.data?.departments || [];

        const options = departmentsArr.map((d: any) => ({
          label: d.name || d.department_name,
          value: d.id ?? d.department_id,
        }));

        setDepartmentOptions(options);
      } catch (err) {
        setDepartmentOptions([]);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    const departmentId = edit?.getValue('department_id');
    const deptId = departmentId ? Number(departmentId) : null;

    if (!deptId) {
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

    fetchRoles(deptId);
  }, [edit?.getValue('department_id')]);

  useEffect(() => {
    fetchData();
  }, [edit.edits]);

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="Role Access"
          count={branchData.length}
          btnName="Create Role"
          navigateUrl="/admin/master/employee/role"
        />
        <Grid container sx={contentLayout}>
          <RoleAccessTableFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectColumn}
            handleFilterClear={() => edit.update({ department_id: '', search: '', role: null })}
            edit={edit}
            departmentOptions={departmentOptions}
            roleOptions={roleOptions}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={branchData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default RoleAccess;
