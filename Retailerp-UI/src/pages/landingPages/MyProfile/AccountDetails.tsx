import React from 'react';
import { AddressIcon, EditIcon, DeleteOutlinedIcon } from '@assets/Images';
import { Box, Typography, useTheme, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, useEffect } from 'react';
import { OrderService } from '@services/OrderService';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import MUHLoader from '@components/MUHLoader';

import BasicDetailEdit from './BasicDetailEdit';
import AddAddress from './AddAddress';

import { Button } from '@mui/material';

const AccountDetails = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleAddNewAddress = () => {
    setEditingAddressData(null);
    setIsEditingAddress(true);
  };

  const handleEditAddress = (addressData: any) => {
    setEditingAddressData(addressData);
    setIsEditingAddress(true);
  };

  const handleCancelAddress = () => {
    setEditingAddressData(null);
    setIsEditingAddress(false);
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await OrderService.deleteCustomerAddress(addressId);
      refreshAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  // Function to refresh addresses
  const refreshAddresses = async () => {
    try {
      setLoading(true);
      const response: any = await OrderService.getCustomerAddress();
      if (response?.data?.data?.addresses) {
        const addressesWithNames = await Promise.all(
          response.data.data.addresses.map(async (address: any) => {
            try {
              // Fetch state name
              const stateResponse: any =
                await DropDownServiceAll.getAllStates();
              const stateData = stateResponse?.data?.data?.states;
              const matchedState = stateData?.find(
                (state: any) => state.id === address.state_id
              );
              const stateName =
                matchedState?.state_name || `State ${address.state_id}`;

              // Fetch district name
              const districtResponse: any =
                await DropDownServiceAll.getAllDistricts();
              const districtData = districtResponse?.data?.data?.districts;
              let districtName = address.district_id;

              if (districtData && districtData.length > 0) {
                const matchedDistrict = districtData?.find(
                  (district: any) =>
                    district.id === address.district_id ||
                    district.id === Number(address.district_id) ||
                    String(district.id) === String(address.district_id)
                );
                districtName =
                  matchedDistrict?.district_name || address.district_id;
              }

              return {
                ...address,
                state_name: stateName,
                district_name: districtName,
              };
            } catch (error) {
              console.error('Error fetching state/district names:', error);
              return address;
            }
          })
        );
        setAddresses(addressesWithNames);
      }
    } catch (error) {
      console.error('Error fetching customer addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAddresses();
  }, []);

  return (
    <>
      {/* Main Content */}
      <Grid size={{ xs: 12, sm: 9, md: 12 }}>
        <>
          {isEditing ? (
            <BasicDetailEdit onCancel={handleCancel} />
          ) : isEditingAddress ? (
            <AddAddress
              onCancel={handleCancelAddress}
              editAddressData={editingAddressData}
              onAddressUpdated={refreshAddresses}
            />
          ) : loading ? (
            <MUHLoader />
          ) : (
            <>
              {/* Basic Details */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: '20px',
                    color: theme.Colors.black,
                    borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
                  }}
                >
                  Basic Details
                </Typography>
                <Button
                  onClick={handleEditClick}
                  size="small"
                  sx={{
                    borderRadius: '30px',
                    border: `1px solid ${theme.Colors.primary}`,
                    fontSize: '14px',
                    fontWeight: 400,
                    gap: 1,
                    pl: 1,
                    pr: 1,
                    color: theme.Colors.primary,
                    textTransform: 'none',
                  }}
                >
                  <EditIcon /> Edit
                </Button>
              </Box>

              <Box mt={3}>
                {/* Name */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  mb={2}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      width: { xs: '100%', sm: '150px' },
                      fontFamily: 'Roboto Slab',
                      mb: { xs: 0.5, sm: 0 },
                    }}
                  >
                    Name
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      fontFamily: 'Roboto Slab',
                      textAlign: { xs: 'left', sm: 'center' },
                      width: { xs: 'auto', sm: '100px' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#000',
                      fontFamily: 'Roboto Slab',
                      mt: { xs: 0, sm: 0 },
                    }}
                  >
                    Charan
                  </Typography>
                </Box>

                {/* Mobile */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  mb={2}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      width: { xs: '100%', sm: '150px' },
                      fontFamily: 'Roboto Slab',
                      mb: { xs: 0.5, sm: 0 },
                    }}
                  >
                    Mobile Number
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      fontFamily: 'Roboto Slab',
                      textAlign: { xs: 'left', sm: 'center' },
                      width: { xs: 'auto', sm: '100px' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#000',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    +91 9944089896
                  </Typography>
                </Box>

                {/* Email */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  mb={2}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      width: { xs: '100%', sm: '150px' },
                      fontFamily: 'Roboto Slab',
                      mb: { xs: 0.5, sm: 0 },
                    }}
                  >
                    Email ID
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      fontFamily: 'Roboto Slab',
                      textAlign: { xs: 'left', sm: 'center' },
                      width: { xs: 'auto', sm: '100px' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#000',
                      fontFamily: 'Roboto Slab',
                      wordBreak: 'break-word',
                    }}
                  >
                    charan142@gmail.com
                  </Typography>
                </Box>
              </Box>

              {/* <Box my={4} sx={{ borderBottom: '1px solid #632532' }} /> */}
              <Box display="flex" alignItems="center" my={4}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
              </Box>

              {/* Address */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: '20px',
                    color: theme.Colors.black,
                    borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  Address
                </Typography>
                <Button
                  size="small"
                  onClick={handleAddNewAddress}
                  sx={{
                    borderRadius: '30px',
                    border: `1px solid ${theme.Colors.primary}`,
                    fontSize: '14px',
                    fontWeight: 400,
                    gap: 1,
                    pl: 1,
                    pr: 1,
                    color: theme.Colors.primary,
                    fontFamily: 'Roboto Slab',
                    textTransform: 'none',
                  }}
                >
                  <AddressIcon />
                  Add New
                </Button>
              </Box>

              <Box mt={3}>
                {addresses
                  .filter((addr) => addr.is_default === true)
                  .map((addr, idx) => (
                    <Box key={idx}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: 600,
                            fontSize: '18px',
                            color: theme.Colors.primary,
                            fontFamily: 'Roboto Slab',
                          }}
                        >
                          Default Address
                        </Typography>
                        <Box
                          onClick={() => handleEditAddress(addr)}
                          sx={{
                            backgroundColor: '#FFEBEC',
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <EditIcon />
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 400,
                          fontSize: '16px',
                          color: theme.Colors.black,
                          fontFamily: 'Roboto Slab',
                          mt: 1,
                          lineHeight: 1.6,
                        }}
                      >
                        {addr.name} <br />
                        {addr.mobile_number} <br />
                        {addr.address_line} <br />
                        {addr.district_name} <br />
                        {addr.state_name} - {addr.pin_code}
                      </Typography>
                    </Box>
                  ))}
              </Box>
              {/* <Box my={4} sx={{ borderBottom: '1px solid #632532' }} /> */}
              <Box display="flex" alignItems="center" my={4}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
              </Box>

              <Box mt={3}>
                {addresses.filter((addr) => addr.is_default === false).length >
                  0 && (
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                          fontSize: '18px',
                          color: theme.Colors.primary,
                          fontFamily: 'Roboto Slab',
                        }}
                      >
                        Other Addresses
                      </Typography>
                    </Box>
                    {addresses
                      .filter((addr) => addr.is_default === false)
                      .map((addr, idx) => (
                        <React.Fragment key={idx}>
                          <Box
                            mb={3}
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 400,
                                fontSize: '16px',
                                color: theme.Colors.black,
                                fontFamily: 'Roboto Slab',
                                mt: 1,
                                lineHeight: 1.6,
                              }}
                            >
                              {addr.name} <br />
                              {addr.mobile_number} <br />
                              {addr.address_line} <br />
                              {addr.district_name} <br />
                              {addr.state_name} - {addr.pin_code}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: '4px',
                              }}
                            >
                              <Box
                                onClick={() => handleEditAddress(addr)}
                                sx={{
                                  backgroundColor: '#FFEBEC',
                                  width: 34,
                                  height: 34,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <EditIcon />
                              </Box>
                              <Box
                                onClick={() => handleDeleteAddress(addr.id)}
                                sx={{
                                  backgroundColor: '#FFEBEC',
                                  width: 34,
                                  height: 34,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <DeleteOutlinedIcon />
                              </Box>
                            </Box>
                          </Box>
                          {idx <
                            addresses.filter(
                              (addr) => addr.is_default === false
                            ).length -
                              1 && <Divider sx={{ my: 2 }} />}
                        </React.Fragment>
                      ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </>
      </Grid>
    </>
  );
};

export default AccountDetails;
