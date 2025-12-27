import { contentLayout } from '@components/CommonStyles';
import Grid from '@mui/material/Grid2';
import BranchTableFilter from './BranchTableFilter';
import { ConfirmModal, MUHTable } from '@components/index';
import { DistrictListBranch } from '@constants/DummyData';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme } from '@mui/material';
import { API_SERVICES } from '@services/index';

const BranchList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    status: 0,
    location: '',
    search: '',
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
      align: 'center',
      renderCell: (params: any) => {
        const index = params.api.getSortedRowIds().indexOf(params.id); // Get visible index
        const serialNumber = index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'branch_no',
      headerName: 'Branch No',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        const params = new URLSearchParams({
          type: 'view',
          rowId: String(row?.id ?? ''),
        }).toString();
        return (
          <MUHListItemCell
            title={row.branch_name}
            titleStyle={{ color: theme.Colors.primary }}
            isLink={`/admin/master/branch/form?type=view&rowId=${row.id}&heading=${row.branch_name}`}
          />
        );
      },
    },
    {
      field: 'city',
      headerName: 'Location',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        const raw = row?.district_name;
        const match = DistrictListBranch.find(
          (d: any) => String(d.value) === String(raw)
        );
        const label = match?.label || String(raw || '');
        return <span>{label}</span>;
      },
    },
    {
      field: 'contact_person',
      headerName: 'Contact Person',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'mobile',
      headerName: 'Contact Number',
      flex: 1.2,
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
    navigateTo(`/admin/master/branch/form?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const renderRowAction = (rowData: never) => {
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

  const fetchData = async (params?: any) => {
    try {
      setLoading(true);
      setBranchData([]);
      const response: any = await API_SERVICES.BranchService.getAll(params);
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        setBranchData(response.data.data.branches || []);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const statusOpt = edit.getValue('status');
    const statusParam = statusOpt?.label || statusOpt?.value || undefined;
    const search = edit.getValue('search') || undefined;
    const locationOpt = edit.getValue('location');
    const districtParam = locationOpt?.value || undefined;
    const params: any = {};
    if (statusParam) params.status = statusParam;
    if (search) params.search = search;
    if (districtParam) params.district_id = districtParam;
    fetchData(Object.keys(params).length ? params : undefined);
  }, [
    edit.getValue('status'),
    edit.getValue('search'),
    edit.getValue('location'),
  ]);

  return (
    <>
      <PageHeader
        title="Branch List"
        count={branchData.length}
        btnName="Create Branch"
        navigateUrl="/admin/master/branch/form?type=create"
      />
      <Grid container sx={contentLayout}>
        <BranchTableFilter
          selectItems={columns}
          selectedValue={hiddenColumns}
          handleSelectValue={handleSelectValue}
          handleFilterClear={handleFilterClear}
          edit={edit}
          onStatusChange={(opt) => {
            const statusParam = opt?.label || opt?.value || undefined;
            const search = edit.getValue('search') || undefined;
            const locationOpt = edit.getValue('location');
            const districtParam = locationOpt?.value || undefined;
            const params: any = {};
            if (statusParam) params.status = statusParam;
            if (search) params.search = search;
            if (districtParam) params.district_id = districtParam;
            fetchData(Object.keys(params).length ? params : undefined);
          }}
          onSearchChange={(text) => {
            const statusOpt = edit.getValue('status');
            const statusParam =
              statusOpt?.label || statusOpt?.value || undefined;
            const search = text || undefined;
            const locationOpt = edit.getValue('location');
            const districtParam = locationOpt?.value || undefined;
            const params: any = {};
            if (statusParam) params.status = statusParam;
            if (search) params.search = search;
            if (districtParam) params.district_id = districtParam;
            fetchData(Object.keys(params).length ? params : undefined);
          }}
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
    </>
  );
};

export default BranchList;
