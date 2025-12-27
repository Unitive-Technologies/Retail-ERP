import Grid from '@mui/material/Grid2';
import { ChipComponent, ConfirmModal, MUHTable } from '@components/index';
import {
  Avatar,
  Box,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useTheme,
} from '@mui/material';
import PageHeader from '@components/PageHeader';
import { useEffect, useState } from 'react';
import AbandonedList from './AbandonedList';
import { contentLayout } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { SendRequestIcon } from '@assets/Images';
import toast from 'react-hot-toast';
import { orderData } from '@constants/DummyData';

const AbandonedCheckout = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [onlineData, setOnlineData] = useState<object[]>([]);

  const initialValues = {
    status: 0,
    location: '',
    search: '',
  };
  const edit = useEdit(initialValues);

  const WhiteTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px',
      padding: theme.spacing(1.2),
      maxWidth: 240,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
  }));
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <span>{params.api.getSortedRowIds().indexOf(params.id) + 1}</span>
      ),
    },
    {
      field: 'date_time',
      headerName: 'Date & Time',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const [date, time, meridian] = (row.date_time || '').split(' ');
        const formattedTime = meridian ? `${time} ${meridian}` : time;

        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              lineHeight: 1.1,
            }}
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 500, color: '#212121' }}
            >
              {date}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#676767' }}>
              {formattedTime}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1.3,
      disableColumnMenu: true,
    },
    {
      field: 'mobile_number',
      headerName: 'Mobile Number',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const row = params.row;
        const totalExtra = row.total_products - 1;
        const productList = row.product_list || [
          row.product_name,
          'Silver Jhumkas',
        ];

        const tooltipContent =
          totalExtra > 0 ? (
            <Box>
              {productList.map((product: string, index: number) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center', mb: 0.6 }}
                >
                  <Avatar
                    src={row.avatar}
                    alt={product}
                    sx={{ width: 28, height: 28, mr: 1 }}
                  />
                  <Typography sx={{ fontSize: 14 }}>{product}</Typography>
                </Box>
              ))}
            </Box>
          ) : null;

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
              src={row.avatar}
              alt={row.product_name}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>
                {row.product_name}
              </Typography>
              {totalExtra > 0 && (
                <WhiteTooltip title={tooltipContent} placement="bottom" arrow>
                  <Typography
                    sx={{
                      color: '#676767',
                      fontSize: 13,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    +{totalExtra}
                  </Typography>
                </WhiteTooltip>
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'total_products',
      headerName: 'Total Products',
      flex: 0.8,
      disableColumnMenu: true,
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'order_status',
      headerName: 'Order Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        const isRemainderSent =
          String(row?.order_status ?? '').toLowerCase() === 'remainder sent';
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              gap: 1.5,
            }}
          >
            <ChipComponent
              label={isRemainderSent ? 'Remainder Sent' : 'Not Contacted'}
              style={{
                backgroundColor: isRemainderSent ? '#DAFFD7' : '#FFE7E7',
                color: isRemainderSent ? '#138B0B' : '#6D2E3D',
                fontSize: 13,
                fontWeight: 500,
                borderRadius: '12px',
                width: 130,
                height: 24,
              }}
            />
          </Box>
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

  const renderRowAction = (rowData: any) => {
    return [
      {
        text: 'Send Reminder',
        renderIcon: () => <SendRequestIcon />,
        onClick: () => {},
      },
    ];
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      setOnlineData(orderData);
    } catch (err: any) {
      setLoading(false);
      setOnlineData([]);
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
    <Grid>
      <PageHeader
        title="Order List"
        count={orderData.length}
        showCreateBtn={false}
      />
      <Grid container sx={contentLayout}>
        <AbandonedList
          selectItems={columns}
          selectedValue={hiddenColumns}
          handleSelectValue={handleSelectValue}
          handleFilterClear={handleFilterClear}
          edit={edit}
        />
        <MUHTable
          columns={columns.filter(
            (column) => !hiddenColumns.includes(column.headerName ?? '')
          )}
          rows={orderData}
          getRowActions={renderRowAction}
          loading={loading}
        />
        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </Grid>
  );
};

export default AbandonedCheckout;
