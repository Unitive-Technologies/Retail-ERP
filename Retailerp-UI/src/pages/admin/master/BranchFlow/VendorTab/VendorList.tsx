import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';
import VendorListFilter from './VendorListFilter';
import { Avatar, Box, Chip } from '@mui/material';
import { vendorsData } from '@constants/DummyData';

const VendorList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    branch: '',
    status: '',
    search: '',
    dateRange: [],
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S.No',
      flex: 0.3,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.Colors.primary,
                fontSize: '14px',
              }}
            >
              {row.vendor_name?.charAt(0) || 'V'}
            </Avatar>
            <MUHListItemCell
              title={row.vendor_name}
              titleStyle={{ color: theme.Colors.primary, cursor: 'pointer' }}
              isLink="/admin/branch/vendorList"
              state={{
                vendor: {
                  id: row.id,
                  vendor_name: row.vendor_name,
                  vendor_code: row.vendor_code,
                  contact_person: row.contact_person,
                  contact_number: row.contact_number,
                  material_type: row.material_type,
                  branch: row.branch,
                  created_by: row.created_by,
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'contact_person',
      headerName: 'Contact Person',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'contact_number',
      headerName: 'Contact Number',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'material_type',
      headerName: 'Material Type',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        const materials = Array.isArray(row.material_type)
          ? row.material_type
          : [row.material_type];

        return (
          <Typography
            sx={{
              fontSize: '13px',
              color: theme.Colors.black,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {materials.join(', ')}
          </Typography>
        );
      },
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/vendor/form?${params}`);
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
        onClick: () => {
          navigateTo('/admin/branch/vendorView', {
            state: {
              vendor: {
                id: rowData.id,
                vendor_name: rowData.vendor_name,
                vendor_code: rowData.vendor_code,
                contact_person: rowData.contact_person,
                contact_number: rowData.contact_number,
                material_type: rowData.material_type,
                branch: rowData.branch,
                created_by: rowData.created_by,
              },
            },
          });
        },
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch vendor data here
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="Vendor List"
          showDownloadBtn={false}
          showCreateBtn={false}
          showlistBtn={false}
        />
        <Grid container sx={contentLayout}>
          <VendorListFilter
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
            rows={vendorsData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default VendorList;
