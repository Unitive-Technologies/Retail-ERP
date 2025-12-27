import {
  CompareIcon,
  ReceiveQuotationIcon,
  SendQuotationIcon,
} from '@assets/Images/AdminImages';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import QuotationFilter from './QuotationFilter';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ChipComponent, ConfirmModal, MUHTable } from '@components/index';
import toast from 'react-hot-toast';
import { QuotationListData, ReceiveQuotationList } from '@constants/DummyData';
import { Box, Typography, useTheme } from '@mui/material';
import { GoldenPlanImages, RowEditIcon, RowViewIcon } from '@assets/Images';

import { CONFIRM_MODAL } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';

const QuotationList = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setconfirmModalOpen] = useState({ open: false });
  const [quotationList, setQuotationList] = useState<object[]>([]);
  const [receiveQuotationList, setReceiveQuotationList] = useState<object[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();
  const theme = useTheme();
  const initialValues = {
    vendor: '',
    search: '',
  };

  const edit = useEdit(initialValues);
  const card = [
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Send Quotation',
      value: 1,
      activeTab: activeTab,
    },
    {
      img: ReceiveQuotationIcon,
      img2: ReceiveQuotationIcon,
      title: 'Received',
      value: 2,
      activeTab: activeTab,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'request_date',
      headerName: 'Request Date',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'qr_id',
      headerName: 'QR ID',
      flex: 0.9,
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

              textDecoration: 'underline',
            }}
            onClick={() => navigateTo(`/admin/purchases/viewQuotation/form`)}
          >
            {row.qr_id}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.image || GoldenPlanImages;
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
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 2, // number of lines
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {row.vendor_name}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'expiry_date',
      headerName: 'Expiry Date',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'item_details',
      headerName: 'Item Details',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        const items = params.row?.item_details ?? [];
        const text = items.length
          ? items.map((x: { label: string }) => x.label).join(', ')
          : '';
        return <span title={text}>{text}</span>;
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Grid container alignItems="center" style={{ height: '100%' }}>
          {(() => {
            const label = String(row?.status ?? '');
            const status = label.toLowerCase().trim();
            let bg = theme.Colors.orangeDark;
            const fg = theme.Colors.whitePrimary;
            if (
              status === 'received partially' ||
              status === 'partially received'
            ) {
              bg = theme.Colors.blueDarkPrimary;
            } else if (status === 'received') {
              bg = theme.Colors.greenPrimary;
            } else if (status === 'pending') {
              bg = theme.Colors.orangeSecondary;
            }
            return (
              <ChipComponent
                label={label}
                style={{
                  backgroundColor: bg,
                  color: fg,
                  fontSize: 12,
                  fontWeight: 700,
                  width: '100%',
                  height: '24px',
                }}
              />
            );
          })()}
        </Grid>
      ),
    },
  ];

  const receivedColumn: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Qut_id',
      headerName: 'QUT ID',
      flex: 0.9,
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

              textDecoration: 'underline',
            }}
            onClick={() => navigateTo(`/admin/purchases/viewQuotation/form`)}
          >
            {row.Qut_id}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'expiry_date',
      headerName: 'Expiry Date',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'qr_id',
      headerName: 'QR ID',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.image || GoldenPlanImages;
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
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 2, // number of lines
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {row.vendor_name}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'items',
      headerName: 'Item Details',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        const items = params.row?.items ?? [];
        const text = items.length
          ? items.map((x: { label: string }) => x.label).join(', ')
          : '';
        return <span title={text}>{text}</span>;
      },
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

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    card[activeTab]?.value === 1
      ? navigateTo(`/admin/purchases/requestQuotation/form?${params}`)
      : navigateTo(`/admin/purchases/viewQuotation/form?${params}`);
  };

  const handleCancelModal = () => {
    setconfirmModalOpen({ open: false });
  };

  const handleCompareQuotaion = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/purchase/compareQuotation/form?${params}`);
  };

  // const renderRowAction = (rowData: never) => {
  //   return [
  //     card[activeTab]?.value === 1
  //       ? {
  //           text: 'Edit',
  //           renderIcon: () => <RowEditIcon />,
  //           onClick: () => {
  //             const props = {
  //               title: 'Edit',
  //               description: 'Do you want to modify data?',
  //               onCancelClick: () => handleCancelModal(),
  //               color: '#FF742F',
  //               iconType: CONFIRM_MODAL.edit,
  //               onConfirmClick: () =>
  //                 handleEditUser(rowData, CONFIRM_MODAL.edit),
  //             };
  //             setconfirmModalOpen({ open: true, ...props });
  //           },
  //         }
  //       : {
  //           text: 'Compare',
  //           renderIcon: () => <CompareIcon />,
  //           onClick: () =>
  //             handleCompareQuotaion(rowData, CONFIRM_MODAL.compare),
  //         },
  //     {
  //       text: 'View',
  //       renderIcon: () => <RowViewIcon />,
  //       onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
  //     },
  //   ];
  // };
  const renderRowAction = (rowData: never) => {
    if (card[activeTab]?.value === 1) {
      return [
        {
          text: 'View',
          renderIcon: () => <RowViewIcon />,
          onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
        },
      ];
    }

    return [
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Compare',
        renderIcon: () => <CompareIcon />,
        onClick: () => handleCompareQuotaion(rowData, CONFIRM_MODAL.compare),
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setQuotationList(QuotationListData); //TODO: need to call backend api
      setReceiveQuotationList(ReceiveQuotationList);
    } catch (err: any) {
      setLoading(false);
      setQuotationList([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container>
      <Grid container size={12} sx={{ display: 'flex', gap: '20px' }}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
      </Grid>
      <PageHeader
        title="QUOTATION LIST"
        count={
          card[activeTab]?.value === 1
            ? quotationList.length
            : receiveQuotationList.length
        }
        btnName="Request Quotation"
        navigateUrl="/admin/purchases/requestQuotation/form?type=requestQuotation"
      />

      <Grid
        container
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          width: '100%',
          backgroundColor: theme.Colors.whitePrimary,
          borderRadius: '4px',
        }}
        mt={2}
        mb={2}
        size="auto"
      >
        <Grid container>
          <QuotationFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          {card[activeTab]?.value === 1 ? (
            <MUHTable
              columns={columns.filter(
                (column) => !hiddenColumns.includes(column.headerName)
              )}
              rows={quotationList}
              getRowActions={renderRowAction}
              loading={loading}
            />
          ) : (
            <MUHTable
              columns={receivedColumn.filter(
                (column) => !hiddenColumns.includes(column.headerName)
              )}
              rows={receiveQuotationList}
              getRowActions={renderRowAction}
              loading={loading}
            />
          )}
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QuotationList;
