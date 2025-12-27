import { contentLayout } from '@components/CommonStyles';
import Grid from '@mui/material/Grid2';
import {
  AutoSearchSelectWithLabel,
  ConfirmModal,
  MUHTable,
  TextInput,
} from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme, Box, Typography, Card, CardContent } from '@mui/material';
import ProfileCard from '@components/ProjectCommon/ProfileCard';

const SavingSchemeView = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  // const [searchParams] = useSearchParams();
  // const schemeId = searchParams.get('schemeId');
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [schemeData, setSchemeData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);

  const initialValues = {
    branch: 0,
    mode: 0,
    search: '',
  };

  const edit = useEdit(initialValues);

  const [formData, setFormData] = useState({
    selectPlan: { label: 'Golden Promise Plan', value: 'golden_promise' },
    installmentAmount: '₹3000',
    identityProof: { label: 'Aadhar Card', value: 'aadhar' },
    identityProofNo: '654198546258',
    nominee: 'Kannan',
    nomineeRelation: { label: 'Father', value: 'father' },
  });

  const planOptions = [
    { label: 'Golden Promise Plan', value: 'golden_promise' },
    { label: 'Silver Savings Plan', value: 'silver_savings' },
  ];

  const identityProofOptions = [
    { label: 'Aadhar Card', value: 'aadhar' },
    { label: 'PAN Card', value: 'pan' },
  ];

  const relationOptions = [
    { label: 'Father', value: 'father' },
    { label: 'Mother', value: 'mother' },
    { label: 'Spouse', value: 'spouse' },
    { label: 'Son', value: 'son' },
    { label: 'Daughter', value: 'daughter' },
  ];

  const customerProfileData = {
    name:
      customerData?.customer_name ||
      location.state?.customerName ||
      'Kishor Kumar',
    code:
      customerData?.customer_id || location.state?.customerId || 'CID 01/24-25',
    phone: customerData?.phone || location.state?.phone || '9658785695',
    address:
      customerData?.address ||
      location.state?.address ||
      '31/A, 1st Cross Street, Anna Nagar',
    city: customerData?.city || location.state?.city || 'Coimbatore',
    pinCode: customerData?.pinCode || location.state?.pinCode || '625986',
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'receipt_no',
      headerName: 'Receipt No',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.receipt_no}
          titleStyle={{ color: theme.Colors.primary }}
          // isLink="/admin/receipt/details"
        />
      ),
    },
    {
      field: 'cash',
      headerName: 'Cash',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={`₹${row.cash?.toLocaleString()}`}
          titleStyle={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'upi',
      headerName: 'UPI',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={`₹${row.upi?.toLocaleString()}`}
          titleStyle={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'transaction_no',
      headerName: 'Transaction No',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'card',
      headerName: 'Card',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell title={row.card || '-'} />
      ),
    },
    {
      field: 'transaction_no_2',
      headerName: 'Transaction No',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell title={row.transaction_no_2 || '-'} />
      ),
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/customer/installment/form?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const renderRowAction = (rowData: never) => {
    console.log(rowData, 'rowwwwww');
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
        onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
    ];
  };

  const sampleInstallmentData = [
    {
      id: 1,
      date: '05/07/2025',
      receipt_no: 'REC 12/24-25',
      cash: 1000,
      upi: 2000,
      transaction_no: '#D0J574857485466451',
      card: '-',
      transaction_no_2: '-',
    },
  ];

  const fetchCustomerData = async () => {
    try {
      const customerId = location.state?.customerId || '1';

      // For now, using sample data
      setCustomerData({
        customer_name: 'Kishor Kumar',
        customer_id: 'CID 01/24-25',
        phone: '9658785695',
        address: '31/A, 1st Cross Street, Anna Nagar',
        city: 'Coimbatore',
        pinCode: '625986',
      });
    } catch (err: any) {
      console.error('Error fetching customer data:', err);
      toast.error('Failed to fetch customer data');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setSchemeData([]);
      // Replace with your actual API call
      // const response: any = await API_SERVICES.InstallmentService.getAll();
      // if (response.data.statusCode === HTTP_STATUSES.OK) {
      //   setSchemeData(response.data.data.installments);
      // }

      setSchemeData(sampleInstallmentData);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchData();
  }, []);

  return (
    <>
      {/* Form Sections */}
      <ProfileCard
        profileData={customerProfileData}
        type="customer"
        mode="view"
      />
      <Box sx={{ backgroundColor: '#fafafa', pb: 2 }}>
        <Box sx={{ px: 3, pt: 3 }}>
          {/* Plan Details Section */}
          <Card
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.Colors.black,
                  fontFamily: 'Roboto, sans-serif',
                  mb: 3,
                  borderBottom: `1px solid ${theme.Colors.grayLight}`,
                  pb: 1,
                }}
              >
                PLAN DETAILS
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutoSearchSelectWithLabel
                    label="Select Plan"
                    options={planOptions}
                    value={formData.selectPlan}
                    onChange={(e, value) =>
                      handleInputChange('selectPlan', value)
                    }
                    isError={false}
                    disabled={true}
                    required={true}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    inputLabel="Installment Amount"
                    required
                    value={formData.installmentAmount}
                    onChange={(e) =>
                      handleInputChange('installmentAmount', e.target.value)
                    }
                    placeholderText="Enter amount"
                    isReadOnly
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Additional Details Section */}
          <Card
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.Colors.black,
                  fontFamily: 'Roboto, sans-serif',
                  mb: 3,
                  borderBottom: `1px solid ${theme.Colors.grayLight}`,
                  pb: 1,
                }}
              >
                ADDITIONAL DETAILS
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutoSearchSelectWithLabel
                    label="Identity Proof"
                    options={identityProofOptions}
                    value={formData.identityProof}
                    onChange={(e, value) =>
                      handleInputChange('identityProof', value)
                    }
                    isError={false}
                    disabled={true}
                    required={true}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    inputLabel="Identity Proof No"
                    required
                    value={formData.identityProofNo}
                    onChange={(e) =>
                      handleInputChange('identityProofNo', e.target.value)
                    }
                    placeholderText="Enter Identity Proof Number"
                    isReadOnly
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    inputLabel="Nominee"
                    value={formData.nominee}
                    onChange={(e) =>
                      handleInputChange('nominee', e.target.value)
                    }
                    placeholderText="Enter Nominee Name"
                    isReadOnly
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutoSearchSelectWithLabel
                    label="Nominee Relation"
                    options={relationOptions}
                    value={formData.nomineeRelation}
                    onChange={(e, value) =>
                      handleInputChange('nomineeRelation', value)
                    }
                    isError={false}
                    disabled={true}
                    required={false}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: theme.Colors.black,
            fontFamily: 'Roboto, sans-serif',
            mb: 3,
            borderBottom: `1px solid ${theme.Colors.grayLight}`,
            pb: 1,
          }}
        >
          Paid Installment Details
        </Typography>

        <Grid container sx={contentLayout}>
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={schemeData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </CardContent>
    </>
  );
};

export default SavingSchemeView;
