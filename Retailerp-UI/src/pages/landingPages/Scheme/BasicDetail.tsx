import { AddressIcon } from '@assets/Images';
import { TextInput } from '@components/index';
import { defaultAddresses } from '@constants/DummyData';
import { Box, Button, Checkbox, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

const BasicDetail = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: 'Charan',
    mobile: '9944085895',
    email: 'Charan142@gmail.com',
  });

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            border: `1px solid #E1E1E1`,
            borderBottom: '0px',
            p: 2,

            borderRadius: '12px 12px 0px 0px',
          }}
        >
          <Typography
            style={{
              fontWeight: 600,
              color: theme.Colors.black,
              fontFamily: 'Roboto Slab',
              fontSize: '16px',
            }}
          >
            BASIC DETAILS
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{
            padding: 2,
            border: `1px solid #E1E1E1`,
            borderRadius: '0px 0px 12px 12px',
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              style={{
                marginBottom: '16px',
                fontWeight: 400,
                fontSize: '16px',
                color: theme.Colors.black,
                fontFamily: 'Roboto Slab',
              }}
            >
              Name
            </Typography>

            <TextInput
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
            />
          </Grid>

          {/* Mobile Number */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              style={{
                marginBottom: '16px',
                fontWeight: 400,
                fontSize: '16px',
                color: theme.Colors.black,
                fontFamily: 'Roboto Slab',
              }}
            >
              Mobile Number
            </Typography>

            <TextInput
              value={formData.mobile}
              onChange={(e) => {
                setFormData({ ...formData, mobile: e.target.value });
              }}
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12 }}>
            <Typography
              style={{
                marginBottom: '16px',
                fontWeight: 400,
                fontSize: '16px',
                color: theme.Colors.black,
                fontFamily: 'Roboto Slab',
              }}
            >
              Email ID
            </Typography>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            border: `1px solid #E1E1E1`,
            borderBottom: '0px',
            p: 1,
            borderRadius: '12px 12px 0px 0px',
          }}
          mt={4}
        >
          <Typography
            style={{
              fontWeight: 600,
              fontSize: '16px',
              color: theme.Colors.black,

              fontFamily: 'Roboto Slab',
              paddingLeft: '8px',
            }}
          >
            ADDRESS
          </Typography>
          <Button
            size="small"
            sx={{
              borderRadius: '30px',
              border: `1px solid ${theme.Colors.primary}`,
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Roboto Slab',
              gap: 1,
              pl: 1,
              pr: 1,
              color: theme.Colors.primary,
            }}
          >
            <AddressIcon />
            Add New
          </Button>
        </Box>
        <Box
          sx={{
            padding: 2,
            border: `1px solid #E1E1E1`,
            borderRadius: '0px 0px 12px 12px',
          }}
        >
          {defaultAddresses.map((addr, idx) => (
            <Box key={idx} mt={2}>
              <Box display="flex" alignItems="self-start">
                <Checkbox />

                <Box sx={{ marginTop: 1 }}>
                  <Typography>{addr.name}</Typography>
                  <Typography lineHeight={1.6}>{addr.mobile}</Typography>
                  <Typography lineHeight={1.6}>{addr.addressLine1}</Typography>
                  <Typography lineHeight={1.6}>{addr.addressLine2}</Typography>
                  <Typography lineHeight={1.6}>
                    {addr.state} {addr.pin}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default BasicDetail;
