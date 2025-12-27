import { Box, IconButton, useTheme } from '@mui/material';
import Grid from '@mui/system/Grid';
import {
  AutoSearchSelectWithLabel,
  ButtonComponent,
  MUHTable,
} from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import { ArrowBack, ClearRounded } from '@mui/icons-material';
import { DownloadIconPdf, PrintOutIcon } from '@assets/Images';
import { useState } from 'react';

const TransactionHistory = () => {
  const theme = useTheme();
  const location = useLocation();
  const today = new Date();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(
    [today, today]
  );
  const navigateTo = useNavigate();
  type TransactionRow = {
    id: number;
    s_no: number;
    date: string;
    grn_no: string;
    total_purchase: number;
    total_paid: number;
    outstanding: number;
  };
  const { rowData } = location.state || {};
  const vendorProfileData = {
    name: rowData?.branch_name || 'Golden Hub Pvt.,Ltd.,',
    code: rowData?.branch_id || 'VEN1023',
    phone: rowData?.phone || '+91 9635895968',
    address: rowData?.address || 'Address Not Provided',
    city: rowData?.location || 'Bangalore',
    pinCode: rowData?.pinCode || '000000',
  };
  const iconBox = {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };
  const transactionData: TransactionRow[] = [
    {
      id: 1,
      s_no: 1,
      date: '12/02/2025',
      grn_no: 'GRN 01/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 2,
      s_no: 2,
      date: '15/02/2025',
      grn_no: 'GRN 02/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 3,
      s_no: 3,
      date: '20/02/2025',
      grn_no: 'GRN 03/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 4,
      s_no: 4,
      date: '25/02/2025',
      grn_no: 'GRN 04/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 5,
      s_no: 5,
      date: '03/03/2025',
      grn_no: 'GRN 05/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 6,
      s_no: 6,
      date: '05/03/2025',
      grn_no: 'GRN 06/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 7,
      s_no: 7,
      date: '08/03/2025',
      grn_no: 'GRN 07/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 8,
      s_no: 8,
      date: '10/03/2025',
      grn_no: 'GRN 08/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
    {
      id: 9,
      s_no: 9,
      date: '12/03/2025',
      grn_no: 'GRN 09/24-25',
      total_purchase: 15000000,
      total_paid: 12000000,
      outstanding: 3000000,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      width: 70,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
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
    },
    {
      field: 'total_purchase',
      headerName: 'Total Purchase',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
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
      headerAlign: 'left',
      align: 'left',
    },
  ];
  return (
    <>
      <Grid size={12}>
        <ProfileCard
          profileData={vendorProfileData}
          type="customer"
          mode="view"
        />
      </Grid>
      <Grid size={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #E0E2E7',
            padding: '10px 12px',
            // mt: 1,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* LEFT FILTER SECTION */}
          <Grid container spacing={1} sx={{ alignItems: 'center', flex: 1 }}>
            {/* Today Dropdown */}
            <Grid size={1.5}>
              <AutoSearchSelectWithLabel
                options={[]} // empty options
                placeholder="Branch"
                value={null}
                onChange={() => {}}
                {...CommonFilterAutoSearchProps}
              />
            </Grid>

            {/* Date Range Picker */}
            <Grid sx={{ padding: 0, display: 'flex', alignItems: 'center' }}>
              <MUHDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="DD/MM/YYYY - DD/MM/YYYY"
                isError={false}
                disabled={false}
              />
            </Grid>

            {/* Clear Button */}
            <Grid>
              <IconButton
                // onClick={handleClear}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  width: 36,
                  height: 36,
                }}
              >
                <ClearRounded
                  sx={{ fontSize: 18, color: theme.Colors.blackLightLow }}
                />
              </IconButton>
            </Grid>
          </Grid>

          {/* RIGHT ACTION BUTTONS */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
              <img
                src={DownloadIconPdf}
                width={24}
                height={24}
                alt="Download PDF"
              />
            </Box>

            <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
              <img src={PrintOutIcon} width={23} height={23} alt="Print" />
            </Box>
            <ButtonComponent
              startIcon={
                <ArrowBack sx={{ mb: 0.2, fontSize: '18px !important' }} />
              }
              buttonText={'List Page'}
              buttonFontSize={14}
              bgColor={theme.Colors.whitePrimary}
              buttonTextColor={theme.Colors.primary}
              buttonFontWeight={500}
              btnBorderRadius={2}
              btnHeight={35}
              padding={1.4}
              buttonStyle={{
                fontFamily: 'Roboto-Regular',
                border: `1px solid ${theme.Colors.primary}`,
              }}
              // onClick={() => navigateTo(navigateUrl)}
              onClick={() => navigateTo('/admin/vendorOverview')}
            />
          </Box>
        </Box>
      </Grid>
      <MUHTable
        columns={columns}
        rows={transactionData}
        hideFooter
        isPagination={false}
        isCheckboxSelection
      />
    </>
  );
};

export default TransactionHistory;
