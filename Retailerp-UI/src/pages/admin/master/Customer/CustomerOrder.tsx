import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GridColDef } from '@mui/x-data-grid';
import { MUHTable } from '@components/index';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEdit } from '@hooks/useEdit';
import MUHListItemCell from '@components/MUHListItemCell';
import ChipComponent from '@components/ChipComponent';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import CustomerOrderFilter from './CustomerOrderFilter';
import PageHeader from '@components/PageHeader';
import SchemeDetails from './SchemeDetails';
import { sampleOrderData } from '@constants/DummyData';
import { contentLayout } from '@components/CommonStyles';

const CustomerOrderDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<number | string>(0);
  const [orderData, setOrderData] = useState<object[]>([]);
  const { rowData } = location.state || {};

  const initialValues = {
    branch: '',
    orderType: '',
    date: '',
    search: '',
  };
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const edit = useEdit(initialValues);

  const customerProfileData = {
    name: rowData?.customer_name || 'Kishor Kumar',
    code: rowData?.customer_id || 'CID 01/24-25',
    phone: rowData?.phone || '9658785695',
    address: rowData?.address || '31/A, 1st Cross Street, Anna Nagar',
    city: rowData?.city || 'Coimbatore',
    pinCode: rowData?.pinCode || '625986',
  };

  const tabsData = [
    {
      label: 'Order Details',
      id: 0,
      content: () => (
        <>
          <Grid container sx={contentLayout}>
            <CustomerOrderFilter
              selectItems={orderColumns}
              selectedValue={hiddenColumns}
              handleSelectValue={handleSelectValue}
              handleFilterClear={handleFilterClear}
              edit={edit}
            />
          </Grid>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              mt: 2,
            }}
          >
            <MUHTable
              columns={orderColumns}
              rows={orderData}
              loading={loading}
              checkboxSelection={false}
            />
          </Box>
        </>
      ),
    },
    {
      label: 'Scheme Details',
      id: 1,
      content: () => <SchemeDetails />,
    },
  ];

  const onTabChange = (val: number | string) => setSelectedTab(val);

  const renderTabContent = (val: number | string) => {
    const active = tabsData.find((item) => item.id === val);
    return active ? active.content() : null;
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

  const orderColumns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.invoice_no}
          titleStyle={{ color: theme.Colors.primary }}
          isLink={`/admin/customer/viewInvoice`}
        />
      ),
    },
    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <Box
          sx={{
            py: 0.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            minHeight: '52px',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#2C2C2C',
              lineHeight: 1.3,
              mb: row.sub_products ? 0.3 : 0,
            }}
          >
            {row.product_name}
          </Typography>
          {row.sub_products && (
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                color: '#8B8B8B',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              +{row.sub_products} Other Products
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: { row: any }) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography
            fontWeight={500}
            sx={{
              fontSize: '14px',
              color: '#2C2C2C',
            }}
          >
            ₹ {row.total_amount?.toLocaleString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'order_type',
      headerName: 'Order Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: { row: any }) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: row.order_type === 'Online' ? '#3400FF' : '#6D2E3D',
            }}
          >
            {row.order_type}
          </Typography>
        </Box>
      ),
    },
  ];

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setOrderData(sampleOrderData);
    } catch (err: any) {
      setLoading(false);
      setOrderData([]);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <>
      <ProfileCard
        profileData={customerProfileData}
        type="customer"
        mode="view"
      />

      <PageHeader
        showTabNavigation={true}
        showCreateBtn={false}
        showlistBtn={true}
        tabContent={tabsData}
        currentTabVal={selectedTab}
        onTabChange={onTabChange}
        navigateUrl="/admin/customer"
      />

      <Grid py={2}>{renderTabContent(selectedTab)}</Grid>
    </>
  );
};

export default CustomerOrderDetails;
