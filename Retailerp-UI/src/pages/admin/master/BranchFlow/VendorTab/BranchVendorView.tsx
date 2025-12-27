import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme, Box } from '@mui/material';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import PageHeader from '@components/PageHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEdit } from '@hooks/useEdit';
import { contentLayout } from '@components/CommonStyles';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import BranchVendorList from './BranchVendorList';
import { paymentData } from '@constants/DummyData';

const BranchVendorView = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<number | string>(1);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [vendorData, setVendorData] = useState<any | null>(null);

  const initialValues = {
    branch: null,
    dateRange: null,
    search: '',
  };

  const edit = useEdit(initialValues);

  const branchData = {
    name: 'ShineCraft Silver',
    code: 'CJ_SLM_001',
    phone: '+91 96358 95968',
    address: {
      street: '71, 1st Cross Street',
      area: 'Anna Nagar',
      city: 'Chennai',
      pincode: '600001',
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
      field: 'grn_no',
      headerName: 'GRN No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_purchase',
      headerName: 'Total Purchase',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_paid',
      headerName: 'Total Paid',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'outstanding',
      headerName: 'Outstanding',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  useEffect(() => {
    // Get vendor data from location state
    if (location.state?.vendor) {
      setVendorData(location.state.vendor);
      sessionStorage.setItem(
        'selectedVendor',
        JSON.stringify(location.state.vendor)
      );
      return;
    }

    // Try to get from session storage if not in location state
    const saved = sessionStorage.getItem('selectedVendor');
    if (saved) {
      setVendorData(JSON.parse(saved));
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
    if (val === 1) navigateTo('/admin/branch/vendorView');
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

  const handleListPage = () => {
    navigateTo('/admin/branch/vendorList');
  };

  const handleDownload = () => {
    // Handle download logic
    console.log('Download clicked');
  };

  const handlePrint = () => {
    // Handle print logic
    console.log('Print clicked');
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

        {/* Vendor Profile Card */}
        {vendorData && (
          <Grid size={{ xs: 12, md: 12 }} mt={2}>
            <ProfileCard
              type="customer"
              mode="view"
              profileData={{
                name: vendorData.vendor_name || 'N/A',
                code: vendorData.vendor_code || 'N/A',
                phone: vendorData.contact_number || '',
                address:
                  vendorData.contact_person ||
                  vendorData.address ||
                  vendorData.address_street ||
                  '',
                city:
                  vendorData.city ||
                  vendorData.address_city ||
                  branchData.address.city ||
                  '',
                pinCode:
                  vendorData.pinCode ||
                  vendorData.pincode ||
                  vendorData.address_pincode ||
                  branchData.address.pincode ||
                  '',
              }}
              showAvatar
            />
          </Grid>
        )}

        {/* Payment List Header */}

        <PageHeader
          title="Payment List"
          showDownloadBtn={true}
          showCreateBtn={false}
          showlistBtn={true}
        />

        {/* Payment List Table */}
        <Grid container sx={contentLayout}>
          <BranchVendorList
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns}
            rows={paymentData}
            loading={loading}
            isCheckboxSelection={true}
            isPagination={true}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default BranchVendorView;
