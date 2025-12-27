import { useState } from 'react';
import Grid from '@mui/system/Grid';
import PageHeader from '@components/PageHeader';
import { CardContent, useTheme } from '@mui/material';
import MUHTypography from '@components/MUHTypography';
import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';

import FormAction from '@components/ProjectCommon/FormAction';
import { commonTextInputProps } from '@components/CommonStyles';
import BillTable from '@components/BillTable';

const CreatePayroll = () => {
  const theme = useTheme();
  const handleCancel = () => {};
  const handleCreate = () => {};
  const [selectedBranch, setSelectedBranch] = useState({
    label: 'Chennai Branch',
    value: 1,
  });
  const earningsData = [
    { payType: 'Basic Salary', amount: 20000 },
    { payType: 'HRA Allowance', amount: 0 },
    { payType: 'DA Allowance', amount: 0 },
    { payType: 'Bonus', amount: 0 },
    { payType: 'Incentives', amount: 1000 },
  ];

  return (
    <Grid container flexDirection={'column'} sx={{ flex: 1, minHeight: 0 }}>
      <PageHeader
        title="CREATE PAYROLL"
        navigateUrl="/admin/hr/payroll"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
        showBackButton={false}
      />
      <Grid container sx={{ width: '100%' }}>
        <Grid
          flexDirection={'row'}
          sx={{
            width: '100%',
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
            mb: 3,
            mt: 2,
          }}
        >
          <CardContent
            sx={{ p: 3, borderBottom: `1px solid ${theme.Colors.grayLight}` }}
          >
            <MUHTypography
              size={'16px'}
              weight={600}
              sx={{
                fontFamily: 'Roboto-regular',
                backgroundColor: theme.Colors.whitePrimary,
              }}
            >
              BASIC DETAILS
            </MUHTypography>
          </CardContent>
          <Grid container spacing={2} sx={{ padding: '20px' }}>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput inputLabel="Date" placeholderText="date" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="Branch"
                options={[
                  { label: 'Chennai Branch', value: 1 },
                  { label: 'Bangalore Branch', value: 2 },
                  { label: 'Coimbatore Branch', value: 3 },
                  { label: 'Madurai Branch', value: 4 },
                ]}
                value={selectedBranch}
                onChange={(e, value) => setSelectedBranch(value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Employee Name"
                options={[
                  { label: 'Chennai Branch', value: 1 },
                  { label: 'Bangalore Branch', value: 2 },
                  { label: 'Coimbatore Branch', value: 3 },
                  { label: 'Madurai Branch', value: 4 },
                ]}
                value={selectedBranch}
                onChange={(e, value) => setSelectedBranch(value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                required
                inputLabel="Employee ID"
                placeholderText="Employee ID"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                required
                inputLabel="PF Number"
                placeholderText="Employee ID"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          flexDirection={'row'}
          sx={{
            width: '100%',
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
            mb: 3,
            mt: 2,
          }}
        >
          <CardContent
            sx={{ p: 3, borderBottom: `1px solid ${theme.Colors.grayLight}` }}
          >
            <MUHTypography
              size={'16px'}
              weight={600}
              sx={{
                fontFamily: 'Roboto-regular',
                backgroundColor: theme.Colors.whitePrimary,
              }}
            >
              WORKING DETAILS
            </MUHTypography>
          </CardContent>
          <Grid container spacing={2} sx={{ padding: '20px' }}>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput required inputLabel="Total Days Worked" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput required inputLabel="Total Leave" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput required inputLabel="OverTime" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                required
                inputLabel="Total Sales Amount"
                placeholderText="Employee ID"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* ITEM Details */}

      <Grid
        flexDirection={'row'}
        sx={{
          width: '100%',
          //   border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
        }}
      >
        <Grid container spacing={2} size={12}>
          <Grid size={6}>
            <BillTable
              data={earningsData}
              title="EARNINGS"
              labelColumnName="Pay Type"
              amountColumnName="Amount"
              showTotal={true}
              currencySymbol="₹"
            />
          </Grid>
          <Grid size={6}>
            <BillTable
              data={earningsData}
              title="DEDUCTIONS"
              labelColumnName="Pay Type"
              amountColumnName="Amount"
              showTotal={true}
              currencySymbol="₹"
            />
          </Grid>
        </Grid>
      </Grid>
      <FormAction
        firstBtntxt="Create"
        secondBtntx="Cancel"
        handleCancel={handleCancel}
        handleCreate={handleCreate}
        {...commonTextInputProps}
      />
    </Grid>
  );
};

export default CreatePayroll;
