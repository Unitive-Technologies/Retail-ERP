import MUHTypography from '@components/MUHTypography';
import { Box, Paper, Typography, Link, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';

const HrEmployeeDetailsInfo = () => {
  const location = useLocation();
  const { rowData } = location.state || {};
  const labelTextStyle = {
    color: '#6D2E3D',
    fontFamily: 'Roboto-Regular',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '100%',
    letterSpacing: '0px',
  };

  const valueTextStyle = {
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    fontSize: '15px',
    fontWeight: 500,
    lineHeight: '100%',
    letterSpacing: '0px',
  };

  const linkStyle = {
    color: '#000000',
    textDecoration: 'underline',
    textDecorationColor: '#000000',
  };

  // Section Wrapper
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <MUHTypography
        text={title}
        size={16}
        weight={600}
        family={'Roboto-Regular'}
        sx={{ textTransform: 'uppercase', mb: 1 }}
        color="#000000"
        gutterBottom
      >
        {title}
      </MUHTypography>
      {children}
    </Paper>
  );

  // Reusable InfoRow
  const InfoRow = ({
    label,
    value,
    size = { xs: 12, sm: 6, md: 4 },
  }: {
    label: string;
    value?: string | JSX.Element;
    size?: { xs: number; sm: number; md: number };
  }) => (
    <Grid
      size={size}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Typography style={labelTextStyle}>{label}</Typography>
      <Typography style={valueTextStyle}>{value || '-'}</Typography>
    </Grid>
  );

  // KYC Field
  const KycField = ({
    label,
    values,
  }: {
    label: string;
    values: (string | JSX.Element)[];
  }) => (
    <Grid
      size={{ xs: 12, md: 4 }}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.3 }}
    >
      <Typography style={labelTextStyle}>{label}</Typography>
      {values.map((val, idx) => (
        <Typography style={valueTextStyle} key={idx}>
          {val || '-'}{' '}
        </Typography>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ pt: 2 }}>
      {/* Basic Details */}
      <Section title="Basic Details">
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <InfoRow label="Date of Birth" value={rowData.dob} />
          <InfoRow label="Blood Group" value={rowData.bloodGroup} />
          <InfoRow label="Gender" value={rowData.gender} />
          <InfoRow label="Employment Type" value={rowData.employmentType} />
          <InfoRow label="Status" value={rowData.status} />
        </Grid>
      </Section>

      {/* Contact Details */}
      <Section title="Contact Details">
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <InfoRow label="Mobile Number" value={rowData.mobile} />
          <InfoRow label="Email Address" value={rowData.email} />
          <InfoRow
            label="Alternative Contact Name"
            value={rowData.altContact}
          />
          <InfoRow
            label="Alternative Mobile Number"
            value={rowData.altMobile}
          />
          <InfoRow label="Address" value={rowData.address} />
          <InfoRow label="Country" value={rowData.country} />
          <InfoRow label="State" value={rowData.state} />
          <InfoRow label="District" value={rowData.district} />
          <InfoRow label="PIN Code" value={rowData.pin} />
        </Grid>
      </Section>

      {/* Bank Details*/}
      <Section title="Bank Details">
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <InfoRow
            label="Bank Name"
            value={rowData.bankName}
            size={{ xs: 12, sm: 6, md: 3 }}
          />
          <InfoRow
            label="Account Number"
            value={rowData.account}
            size={{ xs: 12, sm: 6, md: 3 }}
          />
          <InfoRow
            label="IFSC Code"
            value={rowData.ifsc}
            size={{ xs: 12, sm: 6, md: 3 }}
          />
          <InfoRow
            label="Branch Name"
            value={rowData.branch}
            size={{ xs: 12, sm: 6, md: 3 }}
          />
        </Grid>
      </Section>

      <Section title="KYC Details">
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <KycField
            label="Document Name"
            values={['Aadhar Card', 'PAN Card']}
          />
          <KycField
            label="Document Number"
            values={[rowData.aadhaar_number, rowData.pan_number]}
          />
          <KycField
            label="Document File"
            values={[
              rowData.aadhaar_file ? (
                <Link href={rowData.aadhaar_file} sx={linkStyle}>
                  {rowData.aadhaar_file}
                </Link>
              ) : (
                '-'
              ),
              rowData.pan_file ? (
                <Link href={rowData.pan_file} sx={linkStyle}>
                  {rowData.pan_file}
                </Link>
              ) : (
                '-'
              ),
            ]}
          />
        </Grid>
      </Section>
    </Box>
  );
};

export default HrEmployeeDetailsInfo;
