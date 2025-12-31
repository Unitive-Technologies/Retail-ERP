import { ConfirmModal, MUHTable } from '@components/index';
import PageHeader from '@components/PageHeader';
import MenuDropDown from '@components/MUHMenuDropDown';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { GoldenPlanImages, RowEditIcon, RowViewIcon } from '@assets/Images';
import { useNavigate } from 'react-router-dom';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import VendorTableFilter from './VendorTableFilter';
import { API_SERVICES } from '@services/index';
import {
  PDF_TITLE,
  VENDOR_LIST_COLUMN_MAPPING,
  VENDOR_LIST_PDF_HEADERS,
} from '@constants/PdfConstants';

const VendorList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [confirmModalOpen, setconfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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
        // Find the row's index in the full vendorList array to get correct serial number across pages
        const fullIndex = vendorList.findIndex(
          (row: any) => row.id === params.row.id
        );
        const serialNumber =
          fullIndex >= 0
            ? fullIndex + 1
            : params.api.getSortedRowIds().indexOf(params.id) + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'vendor',
      headerName: 'Vendor',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: any) => params?.row?.vendor_name || '',
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
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params: any) => {
        const data = params?.row?.material_types_detailed;

        const names = Array.isArray(data)
          ? data
              .map((itm: any) => itm?.name)
              .filter(Boolean)
              .join(', ')
          : data?.name || '';

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Tooltip title={names} arrow placement="bottom">
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.Colors.black,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  cursor: 'pointer',
                }}
              >
                {names || '-'}
              </Typography>
            </Tooltip>
          </Box>
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
      renderCell: () => {
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

  // Use constants from PdfConstants
  const columnMapping = VENDOR_LIST_COLUMN_MAPPING;
  const pdfHeaders = VENDOR_LIST_PDF_HEADERS;
  const fileName = PDF_TITLE.vendorList;

  // Transform data for PDF export
  const pdfData: any = vendorList?.length
    ? vendorList.map((rowData: any, index: number) => {
        const materialTypes = rowData?.material_types_detailed;
        const materialTypeString = Array.isArray(materialTypes)
          ? materialTypes
              .map((itm: any) => itm?.name)
              .filter(Boolean)
              .join(', ')
          : materialTypes?.name || '-';

        return {
          s_no: index + 1,
          vendor_name: rowData?.vendor_name || '-',
          vendor_code: rowData?.vendor_code || '-',
          material_type: materialTypeString || '-',
          contact_person: rowData?.proprietor_name || '-',
          contact_number: rowData?.mobile || '-',
          created_by: rowData?.createdBy || 'Super Admin',
        };
      })
    : [];

  const handleOpenDownloadMenu = (e: any) => {
    setMenuAnchorEl(e.currentTarget as HTMLElement);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
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
          showDownloadBtn={true}
          onDownloadClick={handleOpenDownloadMenu}
          onPrintClick={() => window.print()}
        />

        <Grid container sx={contentLayout} className="print-area">
          {/* Print heading */}
          <div
            className="print-only"
            style={{ width: '100%', marginBottom: 12 }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#000',
                // borderBottom: '1px solid #ddd',
                paddingBottom: 8,
                marginBottom: 8,
              }}
            >
              Vendor List ({vendorList.length})
            </div>
          </div>

          {/* Filters and download controls - hide in print */}
          <div className="print-hide" style={{ width: '100%' }}>
            <MenuDropDown
              anchorEl={menuAnchorEl}
              handleCloseMenu={handleCloseMenu}
              hiddenCols={hiddenColumns}
              columnMapping={columnMapping}
              pdfData={pdfData}
              pdfHeaders={pdfHeaders}
              fileName={fileName}
              address={''}
            />
            <VendorTableFilter
              selectItems={columns}
              selectedValue={hiddenColumns}
              handleSelectValue={handleSelectValue}
              handleFilterClear={handleFilterClear}
              edit={edit}
            />
          </div>

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
