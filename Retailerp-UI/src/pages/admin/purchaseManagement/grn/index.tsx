import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import {
  ChipComponent,
  ConfirmModal,
  DialogComp,
  MUHTable,
} from '@components/index';
import { useNavigate } from 'react-router-dom';
import {
  CompletedIcon,
  PendingIcon,
  RowViewIcon,
  TotalGrn,
  GoldenPlanImages,
  RowEditIcon,
} from '@assets/Images';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useTheme, Avatar, Box, Typography } from '@mui/material';
import { GrnService } from '@services/GrnService';
import { isValidResponse } from '@utils/apiRequest';
import dayjs from 'dayjs';

import GrnListTable from './GrnListTable';
import ViewGrn from './ViewGrn';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

const GrnList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    rowId: number | null;
  }>({
    open: false,
    rowId: null,
  });
  const [grnStats, setGrnStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [vendorData, setVendorData] = useState<{
    vendors: {
      label: string;
      value: number;
      state_id: number;
      vendor_code: string;
    }[];
  }>({
    vendors: [],
  });

  const initialValues = {
    Vendor: '',
    Status: '',
    joining_date: null as any,
    search: '',
  };
  const handleViewGrn = (rowData: any) => {
    if (!rowData?.id) return;
    setViewDialog({ open: true, rowId: rowData.id });
  };

  const handleCloseViewDialog = () => {
    setViewDialog({ open: false, rowId: null });
  };
  const edit = useEdit(initialValues);

  const fetchDropdowns = async () => {
    try {
      const vendorsRes = await DropDownServiceAll.getVendors();

      const vendors = isValidResponse(vendorsRes, 200)
        ? vendorsRes.data.data.vendors?.map((item: any) => ({
            label: item.vendor_name,
            value: item.id,
            state_id: item.state_id,
            vendor_code: item.vendor_code,
          })) || []
        : [];
      setVendorData({ vendors });
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
      toast.error('Failed to load dropdown data');
    } finally {
      setLoading(false);
    }
  };

  const card = [
    {
      img: TotalGrn,
      img2: TotalGrn,
      title: 'Total GRN',
      value: grnStats.total,
      activeTab: activeTab,
    },
    {
      img: PendingIcon,
      img2: PendingIcon,
      title: 'Yet To Update',
      value: grnStats.pending,
      activeTab: activeTab,
    },
    {
      img: CompletedIcon,
      img2: CompletedIcon,
      title: 'Updated',
      value: grnStats.completed,
      activeTab: activeTab,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'grn_no',
      headerName: 'GRN No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            sx={{
              color: theme.Colors.primary,
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',

              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => handleViewGrn(row)}
          >
            {row.grn_no}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'vendor_name',
      headerName: 'Vendor',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 1.5,
            height: '100%',
          }}
        >
          <Avatar
            src={row.vendor_logo || GoldenPlanImages}
            alt={row.vendor_name}
            sx={{ width: 32, height: 32 }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
              {row.vendor_name}
            </Typography>

            <Typography
              sx={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}
            >
              {row.vendor_code}
            </Typography>
          </Box>
        </Box>
      ),
    },

    {
      field: 'order',
      headerName: 'Order',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography sx={{ fontSize: '11px', mb: 0.2 }}>
            <span style={{ color: '#000000' }}>Order</span> -{' '}
            <span style={{ color: '#74788D', fontWeight: 500 }}>
              {parseFloat(row.ordered_weight || 0).toFixed(2)} g
            </span>
          </Typography>
          <Typography sx={{ fontSize: '11px', mb: 0.2 }}>
            <span style={{ color: '#000000' }}>Updated</span> -{' '}
            <span style={{ color: '#74788D', fontWeight: 500 }}>
              {parseFloat(row.received_weight || 0).toFixed(2)} g
            </span>
          </Typography>
          <Typography sx={{ fontSize: '11px' }}>
            <span style={{ color: '#000000' }}>Yet to Update</span> -{' '}
            <span style={{ color: '#74788D', fontWeight: 500 }}>
              {(
                parseFloat(row.ordered_weight || 0) -
                parseFloat(row.received_weight || 0)
              ).toFixed(2)}{' '}
              g
            </span>
          </Typography>
        </Box>
      ),
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography sx={{ color: theme.Colors.black }}>
            {row.created_by || 'Super Admin'}
          </Typography>
          <Typography sx={{ color: theme.Colors.blueLightSecondary, mb: 0.2 }}>
            {row.created_location || ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }: any) => (
        <ChipComponent
          label={row.status}
          style={{
            backgroundColor:
              row.status === 'Pending'
                ? theme.Colors.primary
                : theme.Colors.primaryLight,
            color:
              row.status === 'Pending'
                ? theme.Colors.whitePrimary
                : theme.Colors.primary,
            border: 'none',
            fontSize: '14px',
            fontWeight: 400,
            width: 100,
            height: '24px',
          }}
        />
      ),
    },
  ];

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

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };
  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigate(`/admin/purchases/grn/createGrn?${params}`);
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
        onClick: () => handleViewGrn(rowData),
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const params: any = {};

      const response: any = await GrnService.getAll(params);

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const grns = response?.data?.data?.data ?? [];

        const mappedData = grns.map((grn: any, index: number) => {
          const formattedDate = grn.date
            ? dayjs(grn.date).format('DD/MM/YYYY')
            : '';

          const orderedWeight = parseFloat(grn.ordered_weight || 0);
          const receivedWeight = parseFloat(grn.received_weight || 0);
          const isCompleted =
            grn.status_id === 2 ||
            (orderedWeight > 0 && receivedWeight >= orderedWeight);
          const status = isCompleted ? 'Completed' : 'Pending';

          const matchedVendor = vendorData.vendors.find(
            (vendor) => vendor.value === grn.vendor_id
          );

          return {
            id: grn.id,
            s_no: index + 1,
            date: formattedDate,
            raw_date: grn.date,
            grn_no: grn.grn_no,
            vendor_id: grn.vendor_id,
            vendor_name: grn.vendor_name || '',
            vendor_code: matchedVendor?.vendor_code || '',
            vendor_logo: grn.vendor_image_url || null,
            ordered_weight: grn.order || '0.000',
            received_weight: grn.updated_weight || '0.000',
            yet_to_update: (orderedWeight - receivedWeight).toFixed(2),
            created_by: grn.created_by || 'Super Admin',
            created_location: grn.location || 'Chennai',
            status: status,
            status_id: grn.status_id,
          };
        });

        // Apply client-side filters
        const vendorFilter = edit.getValue('Vendor');
        const statusFilter = edit.getValue('Status');
        const dateFilter = edit.getValue('joining_date');

        let filteredData = mappedData;

        if (vendorFilter) {
          filteredData = filteredData.filter(
            (g: any) => String(g.vendor_id) === String(vendorFilter)
          );
        }

        if (statusFilter) {
          filteredData = filteredData.filter(
            (g: any) => g.status === statusFilter
          );
        }

        if (dateFilter) {
          const selectedDate = dayjs(dateFilter).format('YYYY-MM-DD');
          filteredData = filteredData.filter((g: any) => {
            if (!g.raw_date) return false;
            return dayjs(g.raw_date).format('YYYY-MM-DD') === selectedDate;
          });
        }

        setOfferData(filteredData);

        const stats = {
          total: filteredData.length,
          pending: filteredData.filter((g: any) => g.status === 'Pending')
            .length,
          completed: filteredData.filter((g: any) => g.status === 'Completed')
            .length,
        };
        setGrnStats(stats);
      }
    } catch (err: any) {
      setLoading(false);
      setOfferData([]);
      toast.error(err?.message || 'Failed to fetch GRN data');
      console.error('Error fetching GRN data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    vendorData.vendors,
    edit.getValue('Vendor'),
    edit.getValue('Status'),
    edit.getValue('joining_date'),
    edit.getValue('search'),
  ]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
  ];

  const vendorOptions = [...vendorData.vendors];

  return (
    <>
      <Grid container spacing={1}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <PageHeader
          title="GRN LIST"
          titleStyle={{ color: theme.Colors.black }}
          btnName="Create GRN"
          navigateUrl="/admin/purchases/grn/createGrn?type=create"
        />
        <Grid container sx={contentLayout}>
          <GrnListTable
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
            isOfferPlan={true}
            vendorOptions={vendorOptions}
            statusOptions={statusOptions}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={offerData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
        {viewDialog.open && (
          <DialogComp
            open={viewDialog.open}
            dialogTitle="VIEW GRN"
            onClose={handleCloseViewDialog}
            dialogWidth="100%"
            dialogHeight="100vh"
            maxWidth={'lg'}
            contentPadding={0}
            borderRadius={2}
            dialogPadding={'20px'}
            dialogTitleStyle={{ fontSize: '22px' }}
          >
            <Box
              sx={{
                height: '100%',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 120px)',
              }}
            >
              <ViewGrn
                rowId={viewDialog.rowId ?? undefined}
                showPageHeader={false}
              />
            </Box>
          </DialogComp>
        )}
      </Grid>
    </>
  );
};

export default GrnList;
