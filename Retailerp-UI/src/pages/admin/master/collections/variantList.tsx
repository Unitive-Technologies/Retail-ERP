import PageHeader from '@components/PageHeader';
import { Grid } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import CommonTableFilter from '@components/CommonTableFilter';
import { useEdit } from '@hooks/useEdit';
import toast from 'react-hot-toast';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { API_SERVICES } from '@services/index';
import MenuDropDown from '@components/MUHMenuDropDown';
import {
  PDF_TITLE,
  VARIANT_LIST_COLUMN_MAPPING,
  VARIANT_LIST_PDF_HEADERS,
} from '@constants/PdfConstants';

const VariantList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [variantData, setVariantData] = useState<any>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
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
    },
    {
      field: 'variant_type',
      headerName: 'Variant Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'Values',
      headerName: 'Values',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await API_SERVICES.VariantService.getAll({
        search: edit.getValue('search') || '',
      });
      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        const transformedData = response.data.data?.variants
          ?.map((item: any, index: number) => ({
            id: item.id ?? index + 1,
            s_no: index + 1,
            variant_type: item.variant_type,
            Values: item.Values,
            ...item,
          }))
          ?.reverse()
          ?.map((item: any, index: number) => ({
            ...item,
            s_no: index + 1,
          }));
        setVariantData(transformedData);
      } else {
        setVariantData([]);
      }
    } catch (err: any) {
      setLoading(false);
      setVariantData([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  }, [edit.getValue('search')]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleEditVariant = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
    }).toString();
    navigateTo(`/admin/master/collections/variant/form?${params}`, {
      state: { rowData: rowData, type: type },
    });
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
            color: theme.Colors.orangePrimary,
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () =>
              handleEditVariant(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditVariant(rowData, CONFIRM_MODAL.view),
      },
    ];
  };

  // PDF / Print config
  const columnMapping = VARIANT_LIST_COLUMN_MAPPING;
  const pdfHeaders = VARIANT_LIST_PDF_HEADERS;
  const fileName = PDF_TITLE.variantList;

  const pdfData: any = variantData?.length
    ? variantData.map((row: any, index: number) => ({
        s_no: index + 1,
        variant_type: row?.variant_type || '-',
        values:
          Array.isArray(row?.Values) && row.Values.length
            ? row.Values.join(', ')
            : row?.Values ?? '-',
      }))
    : [];

  const handleOpenDownloadMenu = (e: any) => {
    setMenuAnchorEl(e.currentTarget as HTMLElement);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="VARIANT LIST"
          count={variantData.length}
          btnName="Variants"
          navigateUrl="/admin/master/collections/variant/form?type=create"
          navigateState={{ rowData: {}, type: CONFIRM_MODAL.create }}
          showDownloadBtn={true}
          onDownloadClick={handleOpenDownloadMenu}
          onPrintClick={() => window.print()}
        />
        <Grid container sx={contentLayout} className="print-area" mt={0}>
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
                paddingBottom: 8,
                marginBottom: 8,
              }}
            >
              Variant List ({variantData.length})
            </div>
          </div>

          {/* Filters & download - hide in print */}
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
            <Grid container sx={tableFilterContainerStyle}>
              <CommonTableFilter
                selectItems={columns}
                selectedValue={hiddenColumns}
                handleSelectValue={handleSelectValue}
                handleFilterClear={handleFilterClear}
                edit={edit}
              />
            </Grid>
          </div>

          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={variantData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default VariantList;
