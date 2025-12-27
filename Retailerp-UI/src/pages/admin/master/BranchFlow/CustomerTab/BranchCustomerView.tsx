import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import PageHeader from '@components/PageHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import MUHListItemCell from '@components/MUHListItemCell';
import { useEdit } from '@hooks/useEdit';
import { contentLayout } from '@components/CommonStyles';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import BranchCustomerList from './BranchCustomerList';
import { customerOrdersData } from '@constants/DummyData';

export const OrderTypeList = [
  {
    value: 1,
    label: 'Online',
  },
  {
    value: 2,
    label: 'Offline',
  },
];

const BranchCustomerView = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<number | string>(1);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any | null>(null);

  const initialValues = {
    orderType: null,
    date: null,
    search: '',
  };

  const edit = useEdit(initialValues);

  const branchData = {
    name: 'Gokul',
    cid: 'CID 01/24-25',
    phone: '+91 9658785695',
    address: {
      street: '31/A, 1st Cross Street',
      area: 'Anna Nagar',
      city: 'Coimbatore',
      pincode: '625986',
    },
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.3,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        return (
          <MUHListItemCell
            title={row.invoice_no}
            titleStyle={{ color: theme.Colors.primary }}
            // isLink={`/admin/branch/invoice/${row.id}`}
          />
        );
      },
    },
    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'order_type',
      headerName: 'Order Type',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        const isOnline = row.order_type === 'Online';
        return (
          <MUHListItemCell
            title={row.order_type}
            titleStyle={{
              color: isOnline ? theme.Colors.primary : theme.Colors.black,
            }}
            isLink={isOnline ? `/admin/branch/order/${row.id}` : undefined}
          />
        );
      },
    },
  ];

  useEffect(() => {
    // Get customer data from location state
    if (location.state?.customer) {
      setCustomerData(location.state.customer);
      sessionStorage.setItem(
        'selectedCustomer',
        JSON.stringify(location.state.customer)
      );
      return;
    }

    // Try to get from session storage if not in location state
    const saved = sessionStorage.getItem('selectedCustomer');
    if (saved) {
      setCustomerData(JSON.parse(saved));
    }
  }, [location.state]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (val: number | string) => {
    setCurrentTab(val);
    if (val === 0) navigateTo('/admin/branch/overview');
    if (val === 1) navigateTo('/admin/branch/customerView');
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
  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        {/* Page Header with Tabs */}
        <PageHeader
          title="BRANCH OVERVIEW"
          useSwitchTabDesign={true}
          tabContent={[
            { label: 'Branch Overview', id: 0 },
            { label: 'Branch-Wise', id: 1 },
          ]}
          showlistBtn={false}
          showDownloadBtn={false}
          showCreateBtn={false}
          showBackButton={false}
          currentTabVal={currentTab}
          onTabChange={handleTabChange}
          switchTabContainerWidth="262px"
        />

        {/* Customer Profile Card */}
        {customerData && (
          <Grid size={{ xs: 12, md: 12 }} mt={2}>
            <ProfileCard
              type="customer"
              mode="view"
              profileData={{
                name: customerData.customer_name || 'N/A',
                code: customerData.customer_no || 'N/A',
                phone: customerData.mobile_no || '',
                address:
                  customerData.address ||
                  customerData.address_street ||
                  branchData.address.street ||
                  '',
                city:
                  customerData.city ||
                  customerData.address_city ||
                  branchData.address.city ||
                  '',
                pinCode:
                  customerData.pinCode ||
                  customerData.pincode ||
                  customerData.address_pincode ||
                  branchData.address.pincode ||
                  '',
              }}
              showAvatar
            />
          </Grid>
        )}
        {/* Customer List Header */}

        <PageHeader
          title="Customer List"
          showDownloadBtn={true}
          showCreateBtn={false}
          showlistBtn={true}
        />

        {/* Customer Orders Table */}
        <Grid container sx={contentLayout}>
          <BranchCustomerList
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns}
            rows={customerOrdersData}
            loading={loading}
            isCheckboxSelection={true}
            isPagination={true}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default BranchCustomerView;
