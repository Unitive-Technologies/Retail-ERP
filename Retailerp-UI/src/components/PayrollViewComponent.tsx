import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  TableHead,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LandingAppbarLogo, LargeProjectName } from '@assets/Images';

// types.ts
export interface CompanyData {
  address: string;
  area: string;
  city: string;
  state: string;
  mobile: string;
  gstin: string;
}

export interface EmployeeData {
  name: string;
  id: string;
  pfNumber: string;
}

export interface PayRow {
  type: string;
  amount: string;
}

export interface PayrollData {
  company: CompanyData;
  employee: EmployeeData;
  branch: string;
  dateCredited: string;
  totalDays: number;
  totalLeave: number;
  overtime: string;
  month: string;
  earnings: PayRow[];
  deductions: PayRow[];
  inWords: string;
  paymentMode: string;
  transactionNo: string;
}

export interface PayrollViewProps {
  payrollData: PayrollData;
  title?: string;
}

const PayrollViewComponent: React.FC<PayrollViewProps> = ({
  payrollData,
  title = 'Payslip',
}) => {
  const theme = useTheme();

  // Helper to parse amounts like "₹20,000.00" to number
  const parseAmount = (amount: string) =>
    parseFloat(amount.replace(/[₹,]/g, '')) || 0;

  // Calculate totals
  const totalEarnings = payrollData.earnings
    .reduce((sum, row) => sum + parseAmount(row.amount), 0)
    .toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const totalDeductions = payrollData.deductions
    .reduce((sum, row) => sum + parseAmount(row.amount), 0)
    .toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const netSalary = (
    payrollData.earnings.reduce(
      (sum, row) => sum + parseAmount(row.amount),
      0
    ) -
    payrollData.deductions.reduce(
      (sum, row) => sum + parseAmount(row.amount),
      0
    )
  ).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const labelTextStyle = {
    color: theme.Colors.primary,
    fontFamily: theme.fontFamily.roboto,
    fontWeight: theme.fontWeight.mediumBold,
    fontSize: theme.MetricsSizes.small_xxx,
  };

  const valueTextStyle = {
    color: '#000000',
    fontWeight: 600,
    fontSize: '16px',
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: 2.5,
        backgroundColor: '#fff',
        borderRadius: 1,
        boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid #C3C3C3',
          pb: 1.4,
          position: 'relative',
        }}
      >
        {/* Left Logo */}
        <Box>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
              height: '150px',
              width: '324px',
              borderRadius: '8px',
              background:
                'linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)',
              px: 2,
            }}
          >
            <img
              src={LandingAppbarLogo}
              alt="Logo"
              style={{ width: '91px', height: '95px' }}
            />
            <img src={LargeProjectName} alt="Project Name" />
          </Grid>
        </Box>

        {/* Center Title */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '8px',
            textAlign: 'center',
          }}
        >
          <Typography
            style={{
              fontSize: theme.MetricsSizes.medium_x,
              fontWeight: theme.fontWeight.mediumBold,
              color: theme.Colors.black,
              fontFamily: theme.fontFamily.roboto,
            }}
          >
            {title} - {payrollData.month}
          </Typography>
        </Box>

        {/* Right Address */}
        <Box
          sx={{ textAlign: 'right', fontSize: '16px', lineHeight: 1.6, mb: 3 }}
        >
          <Typography
            sx={{
              fontSize: theme.MetricsSizes.small_xxx,
              fontFamily: theme.fontFamily.roboto,
              color: theme.Colors.black,
              fontWeight: theme.fontWeight.medium,
            }}
          >
            {payrollData.company.address}
            <br />
            {payrollData.company.area}
            <br />
            {payrollData.company.city}
            <br />
            {payrollData.company.state}
            <br />
            Mobile No - {payrollData.company.mobile}
            <br />
            GSTIN - {payrollData.company.gstin}
          </Typography>
        </Box>
      </Box>

      {/* Employee Info */}
      <Grid
        container
        sx={{
          mt: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E0E0E0',
          pb: 1.5,
        }}
      >
        <Grid size={{ xs: 6 }}>
          <Typography sx={{ mb: 0.5 }} style={labelTextStyle}>
            Date of Credited :{' '}
            <Typography
              component="span"
              sx={{ ml: 0.5 }}
              style={valueTextStyle}
            >
              {payrollData.dateCredited}
            </Typography>
          </Typography>
          <Typography style={labelTextStyle}>
            Branch :{' '}
            <Typography
              component="span"
              sx={{ ml: 0.5 }}
              style={valueTextStyle}
            >
              {payrollData.branch}
            </Typography>
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ mb: 0.5 }} style={labelTextStyle}>
              Employee Name :{' '}
              <Typography
                component="span"
                sx={{ ml: 0.5 }}
                style={valueTextStyle}
              >
                {payrollData.employee.name}
              </Typography>
            </Typography>
            <Typography sx={{ mb: 0.5 }} style={labelTextStyle}>
              Employee ID :{' '}
              <Typography
                component="span"
                sx={{ ml: 0.5 }}
                style={valueTextStyle}
              >
                {payrollData.employee.id}
              </Typography>
            </Typography>
            <Typography style={labelTextStyle}>
              PF Number :{' '}
              <Typography
                component="span"
                sx={{ ml: 0.5 }}
                style={valueTextStyle}
              >
                {payrollData.employee.pfNumber}
              </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Attendance Summary */}
      <Grid
        container
        sx={{
          borderRadius: 1,
          border: '1px solid #C3C3C3',
          p: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {['Total Days Worked', 'Total Leave', 'Over Time'].map((label, idx) => (
          <Grid key={idx} size={{ xs: 4 }}>
            <Typography sx={{ mb: 0.5 }} style={labelTextStyle}>
              {label} :
            </Typography>
            <Typography sx={{ lineHeight: 1.2 }} style={valueTextStyle}>
              {label === 'Total Days Worked'
                ? payrollData.totalDays
                : label === 'Total Leave'
                  ? payrollData.totalLeave
                  : payrollData.overtime}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Earnings & Deductions Tables */}
      <Grid container spacing={2} alignItems="flex-start">
        {['earnings', 'deductions'].map((type, idx) => {
          const rows =
            type === 'earnings' ? payrollData.earnings : payrollData.deductions;
          const total = type === 'earnings' ? totalEarnings : totalDeductions;

          return (
            <React.Fragment key={type}>
              {idx === 1 && (
                <Grid
                  size={{ xs: 0.2 }}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ height: '100%' }}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 5.9 }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {type.toUpperCase()}
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    height: '0px',
                    width: '86px',
                    borderWidth: '1.9px',
                    borderColor: '#471923',
                    mb: 1,
                    borderRadius: '0 50px 50px 0',
                  }}
                />

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: '1px solid #ccc',
                            fontSize: '14px',
                          }}
                        >
                          Pay Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.type}>
                          <TableCell
                            sx={{
                              fontSize: 14,
                              borderRight: '1px solid #ccc',
                              fontWeight: 500,
                            }}
                          >
                            {row.type}
                          </TableCell>
                          <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                            {row.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: '1px solid #ccc',
                            fontSize: '14px',
                          }}
                        >
                          Total
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>
                          {total}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>

      {/* Net Salary */}
      <Box sx={{ backgroundColor: '#f4f4f4', borderRadius: 1, p: 2, mt: 3 }}>
        <Typography sx={{ fontWeight: 600 }}>
          Net Salary : {netSalary}
        </Typography>
      </Box>

      {/* Footer */}
      {/* <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 14, mb: 0.8 }}>
          <strong>In Words :</strong>{' '}
          <span style={{ marginLeft: '15px' }}>{payrollData.inWords}</span>
        </Typography>
        <Typography sx={{ fontSize: 14, mb: 0.8 }}>
          <strong>Payment Mode :</strong>{' '}
          <span style={{ marginLeft: '15px' }}>{payrollData.paymentMode}</span>
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          <strong>Transaction No :</strong>{' '}
          <span style={{ marginLeft: '15px' }}>
            {payrollData.transactionNo}
          </span>
        </Typography>
      </Box> */}

      <Grid
        container
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Grid size={{ xs: 6 }}>
          <Typography sx={{ fontSize: 14, mb: 0.8 }}>
            <strong>In Words :</strong>{' '}
            <span style={{ marginLeft: '15px' }}>{payrollData.inWords}</span>
          </Typography>
          <Typography sx={{ fontSize: 14, mb: 0.8 }}>
            <strong>Payment Mode :</strong>{' '}
            <span style={{ marginLeft: '15px' }}>
              {payrollData.paymentMode}
            </span>
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            <strong>Transaction No :</strong>{' '}
            <span style={{ marginLeft: '15px' }}>
              {payrollData.transactionNo}
            </span>
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                width: '280px',
                height: '120px',
                border: '1px solid #E0E0E0',
                borderRadius: '6px',
                backgroundColor: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '10px',
                alignItems: 'center',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                position: 'relative',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#000000',
                  fontFamily: theme.fontFamily.roboto,
                  letterSpacing: '0.5px',
                  mt: 1,
                }}
              >
                Authorized Signature
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PayrollViewComponent;
