import ProfileCard from '@components/ProjectCommon/ProfileCard';
import React from 'react';
import Grid from '@mui/system/Grid';
import { useLocation } from 'react-router-dom';
import PageHeader from '@components/PageHeader';
import { useTheme } from '@mui/material';
import MUHTypography from '@components/MUHTypography';
import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';
import {
  columnCellStyle,
  commonTextInputProps,
  tableColumnStyle,
  tableRowStyle,
} from '@components/CommonStyles';
import {
  identityProofOptions,
  nomineeRelationOptions,
  planOptions,
} from '@constants/DummyData';

const ViewSavingScheme = () => {
  const location = useLocation();
  const theme = useTheme();
  const { rowData } = location.state || {};

  const customerProfileData = {
    name: rowData?.customer_name || 'Kishor Kumar',
    code: rowData?.customer_id || 'CID 01/24-25',
    phone: rowData?.phone || '9658785695',
    address: rowData?.address || '31/A, 1st Cross Street, Anna Nagar',
    city: rowData?.city || 'Coimbatore',
    pinCode: rowData?.pinCode || '625986',
  };
  const paidInstallments = [
    {
      id: 1,
      date: '05/07/2025',
      receipt_no: 'REC 12/24-25',
      cash: '₹1,000',
      upi: '₹2,000',
      upi_txn_no: '#ODU5748574854451',
      card: '-',
      card_txn_no: '-',
    },
    {
      id: 2,
      date: '05/06/2025',
      receipt_no: 'REC 11/24-25',
      cash: '₹3,000',
      upi: '-',
      upi_txn_no: '-',
      card: '-',
      card_txn_no: '-',
    },
  ];

  // FETCH TABLE ROWS SAFELY
  const rows = rowData?.invoice_settings || [];

  // DEFAULT EMPTY ROW WHEN NO DATA
  const defaultRow = [
    {
      id: 1,
      material_type: '',
      category: '',
      sub_category: '',
      description: '',
      purity: '',
      ordered_weight: '',
      received_weight: '',
      rate: '',
      amount: '',
    },
  ];

  return (
    <>
      <ProfileCard
        profileData={customerProfileData}
        type="customer"
        mode="view"
      />

      <Grid
        container
        flexDirection="column"
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title="SCHEME DETAILS"
          titleStyle={{ color: theme.Colors.black }}
          navigateUrl="/admin/savingScheme"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={true}
          showBackButton={false}
        />

        {/* PLAN DETAILS */}
        <Grid
          container
          flexDirection="column"
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <MUHTypography
            size={theme.MetricsSizes.small_xxx}
            padding="20px"
            weight={theme.fontWeight.mediumBold}
            color={theme.Colors.black}
            fontFamily={theme.fontFamily.roboto}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              height: '50px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            PLAN DETAILS
          </MUHTypography>

          <Grid container padding="20px">
            {/* PLAN */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                label="Select plan"
                options={planOptions}
                value={
                  planOptions.find(
                    (i) => i.value === rowData?.material_type_id
                  ) || null
                }
                disabled
              />
            </Grid>

            {/* INSTALLMENT */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Installment Amount"
                value={rowData?.installment_amount || ''}
                disabled
                {...commonTextInputProps}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* ADDITIONAL DETAILS */}
        <Grid
          container
          flexDirection="column"
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <MUHTypography
            size={theme.MetricsSizes.small_xxx}
            padding="20px"
            weight={theme.fontWeight.mediumBold}
            color={theme.Colors.black}
            fontFamily={theme.fontFamily.roboto}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              height: '50px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ADDITIONAL DETAILS
          </MUHTypography>

          <Grid container padding="20px">
            {/* ID PROOF */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                label="Identity Proof"
                options={identityProofOptions}
                value={
                  identityProofOptions.find(
                    (i) => i.value === rowData?.identity_proof
                  ) || null
                }
                disabled
              />
            </Grid>

            {/* ID PROOF NO */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Identity Proof No"
                value={rowData?.identity_proof_no || ''}
                disabled
                {...commonTextInputProps}
              />
            </Grid>

            {/* NOMINEE */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Nominee"
                value={rowData?.nominee || ''}
                disabled
                {...commonTextInputProps}
              />
            </Grid>

            {/* NOMINEE RELATION */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                label="Nominee Relation"
                options={nomineeRelationOptions}
                value={
                  nomineeRelationOptions.find(
                    (i) => i.value === rowData?.nominee_relation
                  ) || null
                }
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* PAID INSTALLMENT DETAILS TABLE */}
      <Grid
        container
        flexDirection="column"
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
          marginTop: 2,
        }}
      >
        <MUHTypography
          size={theme.MetricsSizes.small_xxx}
          padding="20px"
          weight={theme.fontWeight.mediumBold}
          color={theme.Colors.black}
          fontFamily={theme.fontFamily.roboto}
          sx={{
            borderBottom: `1px solid ${theme.Colors.grayLight}`,
            height: '50px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          PAID INSTALLMENT DETAILS
        </MUHTypography>

        <Grid width="100%" padding={2}>
          {/* TABLE HEADER */}
          <Grid
            container
            sx={{
              //   ...tableColumnStyle,
              borderRadius: '8px 8px 0px 0px',
              backgroundColor: '#F8F9FA',
              fontFamily: theme.fontFamily.roboto,
              fontSize: '14px',
              fontWeight: '600',
              color: '#000000',
            }}
          >
            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
              S.No
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
              Date
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
              Receipt No
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
              Cash
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
              UPI
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
              Transaction No
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
              Card
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
              Transaction No
            </Grid>
          </Grid>

          {/* TABLE ROWS */}
          {/* TABLE ROWS */}
          {paidInstallments.map((row, index) => (
            <Grid container sx={tableRowStyle} key={row.id}>
              {/* S.No */}
              <Grid
                size={1}
                sx={{ ...columnCellStyle, fontWeight: 500, border: 'none' }}
              >
                {index + 1}
              </Grid>

              {/* Date */}
              <Grid size={1.5} sx={{ ...columnCellStyle, border: 'none' }}>
                {row.date}
              </Grid>

              {/* Receipt No (Make it Blue Like Screenshot) */}
              <Grid
                size={1.5}
                sx={{
                  ...columnCellStyle,
                  color: theme.Colors.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  border: 'none',
                }}
              >
                {row.receipt_no}
              </Grid>

              {/* Cash */}
              <Grid size={1.5} sx={{ ...columnCellStyle, border: 'none' }}>
                {row.cash}
              </Grid>

              {/* UPI */}
              <Grid size={1.5} sx={{ ...columnCellStyle, border: 'none' }}>
                {row.upi}
              </Grid>

              {/* UPI Transaction No */}
              <Grid size={1.5} sx={{ ...columnCellStyle, border: 'none' }}>
                {row.upi_txn_no}
              </Grid>

              {/* Card */}
              <Grid size={1.5} sx={{ ...columnCellStyle, border: 'none' }}>
                {row.card}
              </Grid>

              {/* Card Transaction No */}
              <Grid size={1.5} sx={{ ...columnCellStyle, border: 'none' }}>
                {row.card_txn_no}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default ViewSavingScheme;
