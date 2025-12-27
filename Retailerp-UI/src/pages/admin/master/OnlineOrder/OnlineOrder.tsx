import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ChipComponent, ConfirmModal, MUHTable } from '@components/index';
import { useNavigate } from 'react-router-dom';
import {
  AcceptIcon,
  CancelOrderCardIcon,
  CompletedIcon,
  Delivered,
  DeliveredIcon,
  NewCardIcon,
  NewOrder,
  NewOrderIcon,
  PartiallyDelivered,
  PartiallyDeliveredCardIcon,
  PartiallyDeliveredIcon,
  PendingIcon,
  RowEditIcon,
  RowViewIcon,
  ShippedCardIcon,
  ShippedIcon,
  ShippedIcon2,
  TotalGrn,
  TotalOrder,
  TotalOrderCardIcon,
} from '@assets/Images';
import { CONFIRM_MODAL } from '@constants/Constance';
import { useTheme, Box, Typography } from '@mui/material';
import OnlineOrderList from './OnlineOrderList';
import MUHListItemCell from '@components/MUHListItemCell';

const OnlineOrder = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });

  const initialValues = {
    status: 0,
    offer_plan: '',
    search: '',
  };

  const edit = useEdit(initialValues);
  const dummyOrderData = [
    {
      id: 1,
      order_no: 'ORD 180/24-25',
      order_date: '22/09/2025',
      customer_name: 'Kishore Kumar',
      mobile_number: '9658848598',
      items: 2,
      total_amount: '₹5,890',
      branch_name: 'KHM Silver',
      order_status: '1',
    },
    {
      id: 2,
      order_no: 'ORD 179/24-25',
      order_date: '22/09/2025',
      customer_name: 'Sunil Kumar',
      mobile_number: '9587859698',
      items: 1,
      total_amount: '₹3,780',
      branch_name: 'Velli Maligai',
      order_status: '2',
    },
    {
      id: 3,
      order_no: 'ORD 176/24-25',
      order_date: '22/09/2025',
      customer_name: 'Ajay Krishna',
      mobile_number: '9856987458',
      items: 1,
      total_amount: '₹1,230',
      branch_name: 'Sri Velli Alangaram',
      order_status: '3',
    },
    {
      id: 4,
      order_no: 'ORD 175/24-25',
      order_date: '22/09/2025',
      customer_name: 'Stanley',
      mobile_number: '9658748596',
      items: 1,
      total_amount: '₹1,230',
      branch_name: 'Chaneira Jewels',
      order_status: '4',
    },
  ];
  const card = [
    {
      img: TotalOrder,
      img2: TotalOrder,
      title: 'Total Orders',
      value: 10,
      activeTab: activeTab,
    },
    {
      img: NewOrder,
      img2: NewOrder,
      title: 'New Order',
      value: 95,
      activeTab: activeTab,
    },
    {
      img: ShippedIcon2,
      img2: ShippedIcon2,
      title: 'Shipped',
      value: 65,
      activeTab: activeTab,
    },
    {
      img: PartiallyDelivered,
      img2: PartiallyDelivered,
      title: 'Partially Delivered',
      value: 10,
      activeTab: activeTab,
    },
    {
      img: Delivered,
      img2: Delivered,
      title: 'Delivered',
      value: 180,
      activeTab: activeTab,
    },
    {
      img: CancelOrderCardIcon,
      img2: CancelOrderCardIcon,
      title: 'Cancelled Order',
      value: 180,
      activeTab: activeTab,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S.No',
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },

    {
      field: 'order_no',
      headerName: 'Order No',
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
            title={row.order_no}
            titleStyle={{ color: theme.Colors.primary }}
            isLink={`/admin/onlineOrder/view?id=${row.id}&heading=${row.order_no}`}
          />
        );
      },
    },
    {
      field: 'order_date',
      headerName: 'Order Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'mobile_number',
      headerName: 'Mobile Number',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'items',
      headerName: 'Items',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'order_status',
      headerName: 'Order Status',
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const statusCode = params.value;

        const getStatusStyle = (code) => {
          switch (code) {
            case '1':
              return {
                label: 'New Order',
                icon: <NewOrderIcon />,
                color: '#000',
                bg: '#E9E9E9',
              };
            case '2':
              return {
                label: 'Shipped',
                icon: <ShippedIcon />,
                bg: '#E7ECFF',
                color: '#1646FD',
              };
            case '3':
              return {
                label: 'Delivered',
                icon: <DeliveredIcon />,
                bg: '#E3FFD3',
                color: '#348C00',
              };
            case '4':
              return {
                label: 'Partially Delivered',
                icon: <PartiallyDeliveredIcon />,
                bg: '#FFD4C6',
                color: '#EC3900',
              };
            default:
              return {
                label: 'Unknown',
                icon: null,
                bg: '#f0f0f0',
                color: '#555',
              };
          }
        };

        const { label, icon, bg, color } = getStatusStyle(statusCode);

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                height: '24px',
                gap: '6px',
                borderRadius: '30px',
                bgcolor: bg,
                color: color,
                fontWeight: 500,
                fontSize: '13px',
                px: 1.5,
                boxSizing: 'border-box',
              }}
            >
              {icon}
              <Box
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </Box>
            </Box>
          </Box>
        );
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
            // onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        // onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Accept',
        renderIcon: () => <AcceptIcon />,
        // onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setOfferData(dummyOrderData);
    } catch (err: any) {
      setLoading(false);
      setOfferData([]);
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
    <>
      <Grid container spacing={1}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <PageHeader
          title="ORDER LIST"
          titleStyle={{ color: theme.Colors.black }}
          btnName="Create Order"
          // navigateUrl="/admin/purchases/grn/createGrn"
        />
        <Grid container sx={contentLayout}>
          <OnlineOrderList
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
            isOfferPlan={true}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={dummyOrderData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default OnlineOrder;
