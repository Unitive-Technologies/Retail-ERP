import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  DeactiveIcon,
  RowEditIcon,
  RowViewIcon,
  UpdatePermission,
} from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import MUHListItemCell from '@components/MUHListItemCell';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import EmployeeTableFilter from './EmployeeTableFilter';
import { EmployeeService } from '@services/EmployeeService';
import { API_SERVICES } from '@services/index';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { EmpDepartmentService } from '@services/EmpDepartmentService';
import { EmpDesignationDropdownService } from '@services/EmpDesignationDropdownService';

const EmployeeList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<object[]>([]);
  const [branchOptions, setBranchOptions] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [designationOptions, setDesignationOptions] = useState<
    { label: string; value: string | number }[]
  >([]);

  const initialValues = {
    status: 0,
    location: '',
    search: '',
    branch: undefined as any,
    department: undefined as any,
    designation: undefined as any,
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
      field: 'employee_name',
      headerName: 'Employee',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 1,
              gap: 1.5,
            }}
          >
            <Avatar
              src={row.profile_image_url || row.image}
              alt={row.employee_name}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: theme.Colors.grayLight,
              }}
            >
              {!row.profile_image_url &&
                !row.image &&
                row.employee_name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box
              sx={{ lineHeight: 1, display: 'flex', flexDirection: 'column' }}
            >
              <Typography>{row.employee_name}</Typography>
              <Typography sx={{ color: '#676767', p: 0.5 }}>
                {row.employee_no}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'branch_name',
      headerName: 'Branch ',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'department_name',
      headerName: 'Department',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'designation_name',
      headerName: 'Designation',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'mobile_number',
      headerName: 'Mobile Number',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'joining_date',
      headerName: 'Joining Date',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const date = params.row.joining_date;
        if (!date) return '-';
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.status}
          titleStyle={{
            color:
              row.status === 'Active'
                ? theme.Colors.greenPrimary
                : theme.Colors.redPrimarySecondary,
          }}
        />
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

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/employee/form?${params}`);
  };

  // const handleTransferEmployee = (rowData: any) => {
  //   navigateTo(
  //     `/admin/master/employee/transfer?rowId=${rowData.id}&heading=TRANSFER EMPLOYEE`
  //   );
  // };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {};

      const branchVal = edit.getValue('branch');
      if (branchVal?.value) {
        params.branch_id = branchVal.value;
      }

      const deptVal = edit.getValue('department');
      if (deptVal?.value) {
        params.department_id = deptVal.value;
      }

      const desigVal = edit.getValue('designation');
      if (desigVal?.value) {
        params.designation_id = desigVal.value;
      }

      if (edit?.getValue('search')) {
        params.search = edit.getValue('search');
      }

      const response: any = await API_SERVICES.EmployeeService.getAll(params);

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const sortedEmployees = (response?.data?.data?.employees || []).sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const employees = sortedEmployees.map((item: any, index: number) => ({
          ...item,
          s_no: index + 1,
        }));
        setEmployeeData(employees);
      } else {
        setEmployeeData([]);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch employee data');
      setEmployeeData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateEmployee = async (employee: any) => {
    try {
      setLoading(true);

      await EmployeeService.updateStatus(employee.id, {
        data: { status: 'inactive' },
        successMessage: `${employee.employee_name} deactivated successfully!`,
        failureMessage: `Failed to deactivate ${employee.employee_name}`,
      });

      await fetchData();
    } catch (error: any) {
      toast.error('Failed to deactivate employee');
    } finally {
      setLoading(false);
    }
  };

  const renderRowAction = (rowData: any) => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => {
          const props = {
            title: 'Edit Employee',
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
        onClick: () => {
          handleEditUser(rowData, 'view');
        },
      },
      {
        text: 'Deactivate',
        renderIcon: () => <DeactiveIcon />,
        onClick: () => {
          const props = {
            title: 'Deactivate Employee',
            description: `Do you want to deactivate ${rowData.employee_name}?`,
            onCancelClick: () => handleCancelModal(),
            color: '#d32f2f',
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: async () => {
              await handleDeactivateEmployee(rowData);
              handleCancelModal();
            },
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      // {
      //   text: 'Transfer',
      //   renderIcon: () => <Transfer />,
      //   onClick: () => {
      //     const props = {
      //       title: 'Transfer Employee',
      //       description: `Do you want to transfer ${rowData.employee_name}?`,
      //       onCancelClick: () => handleCancelModal(),
      //       color: '#2196F3',
      //       iconType: CONFIRM_MODAL.edit,
      //       onConfirmClick: () => {
      //         handleTransferEmployee(rowData);
      //         handleCancelModal();
      //       },
      //     };
      //     setConfirmModalOpen({ open: true, ...props });
      //   },
      // },
      {
        text: 'Update Permission',
        renderIcon: () => <UpdatePermission />,
        onClick: () => {
          navigateTo('/admin/master/employee/role', {
            state: {
              employeeData: rowData,
              employeeId: rowData.id,
              type: 'update-permission',
            },
          });
        },
      },
    ];
  };

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [branchRes, deptRes, desigRes]: any = await Promise.all([
          DropDownServiceAll.getBranches(),
          EmpDepartmentService.getDepartmentsDropdown(),
          EmpDesignationDropdownService.getDesignations(),
        ]);

        if (
          branchRes?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(branchRes?.data?.data?.branches)
        ) {
          setBranchOptions(
            branchRes.data.data.branches.map((branch: any) => ({
              label: branch.branch_name,
              value: branch.id?.toString() ?? '',
            }))
          );
        } else {
          setBranchOptions([]);
        }

        const deptData = deptRes?.data ?? deptRes;
        const departments = Array.isArray(deptData?.data)
          ? deptData.data
          : deptData?.data?.departments || [];
        setDepartmentOptions(
          departments.map((d: any) => ({
            label: d.name || d.department_name,
            value: d.id ?? d.department_id,
          }))
        );

        const desigData = desigRes?.data ?? desigRes;
        const designations = Array.isArray(desigData?.data?.designations)
          ? desigData.data.designations
          : desigData?.data || [];
        setDesignationOptions(
          designations.map((d: any) => ({
            label: d.name || d.designation_name,
            value: d.id ?? d.designation_id,
          }))
        );
      } catch {
        setBranchOptions([]);
        setDepartmentOptions([]);
        setDesignationOptions([]);
      }
    };

    loadDropdowns();
  }, []);

  useEffect(() => {
    fetchData();
  }, [edit.edits]);

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="Employee List"
          count={employeeData.length}
          btnName="Create Employee"
          navigateUrl="/admin/master/employee/form"
        />
        <Grid container sx={contentLayout}>
          <EmployeeTableFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
            branchOptions={branchOptions}
            departmentOptions={departmentOptions}
            designationOptions={designationOptions}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={employeeData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeList;
