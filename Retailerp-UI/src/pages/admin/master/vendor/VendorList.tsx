import { ConfirmModal, MUHTable } from '@components/index';
import PageHeader from '@components/PageHeader';
import { vendorListData } from '@constants/DummyData';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { GoldenPlanImages, RowEditIcon, RowViewIcon } from '@assets/Images';
import { useNavigate } from 'react-router-dom';
import { Typography, useTheme } from '@mui/material';
import VendorTableFilter from './VendorTableFilter';
import { API_SERVICES } from '@services/index';

const VendorList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [confirmModalOpen, setconfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const initialValues = {
    status: 0,
    offer_plan: '',
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
      field: 'vendor',
      headerName: 'Vendor',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.vendor_image_url || GoldenPlanImages;
        return (
          <Grid
            sx={{
              display: 'flex',
              gap: 1,
              height: '100%',
              alignItems: 'center',
            }}
          >
            <img
              src={src}
              alt={row.material_type || 'material'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Grid>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.Colors.black,
                }}
              >
                {row.vendor_name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: theme.Colors.graniteGray,
                }}
              >
                {row.vendor_code}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'material_types_detailed',
      headerName: 'Material Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params: any) => {
        const data = params?.row?.material_types_detailed;
        const names = Array.isArray(data)
          ? data
              .map((itm: any) => itm?.name)
              .filter(Boolean)
              .join(', ')
          : data?.name || '';
        return (
          <>
            <Grid
              sx={{
                display: 'flex',
                gap: 1,
                height: '100%',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.Colors.black,
                }}
              >
                {names}
              </Typography>
            </Grid>
          </>
        );
      },
    },
    {
      field: 'proprietor_name',
      headerName: 'Contact Person',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'mobile',
      headerName: 'Contact Number',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'createdBy',
      headerName: 'created By',
      flex: 0.8,
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
            <Grid>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.Colors.black,
                }}
              >
                {/* {row.createdBy} */}
                Super Admin
              </Typography>
              {/* <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: theme.Colors.graniteGray,
                }}
              >
                {row.created_location}
              </Typography> */}
            </Grid>
          </Grid>
        );
      },
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
    navigateTo(`/admin/master/vendorCreate/form?${params}`);
  };

  const handleCancelModal = () => {
    setconfirmModalOpen({ open: false });
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
          setconfirmModalOpen({ open: true, ...props });
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
      const response: any =
        await API_SERVICES.VendorService.getAllVendor(params);
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const vendors = response?.data.data.vendors || [];
        const sortedVendors = [...vendors].sort((a: any, b: any) => {
          if (a?.created_at && b?.created_at) {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          }
          return (b?.id || 0) - (a?.id || 0);
        });
        setVendorList(sortedVendors);
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mtOpt = edit.getValue('materialType');
    const materialType = mtOpt?.label || undefined; // always send label, e.g., "copper"
    const search = edit.getValue('search') || undefined;
    const params: any = {};
    if (materialType) params.materialType = materialType;
    if (search) params.search = search;
    fetchData(Object.keys(params).length ? params : undefined);
  }, [edit.getValue('materialType'), edit.getValue('search')]);
  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="VENDOR LIST"
          count={vendorList.length}
          btnName="Create Vendor"
          navigateUrl="/admin/master/vendorCreate/form?type=create"
        />

        <Grid container sx={contentLayout}>
          <VendorTableFilter
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
            rows={vendorList}
            getRowActions={renderRowAction}
            isLoading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default VendorList;
