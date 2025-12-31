import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material';
import AddressCard, { Address } from './addressCard';
import { ButtonComponent } from '@components/index';
import AddHomeIcon from '@mui/icons-material/AddHome';
import AddressForm from './addressForm';

interface AddressListProps {
  title: string;
  addresses: Address[];
  selectedId: number;
  isRadio?: boolean;
  onSelect: (id: number) => void;
  isAddNewAddress?: boolean;
  isSameAsShipping?: boolean;
  onSameAsShippingChange?: (checked: boolean) => void;
  onSaveNewAddress?: (address: Address) => void;
}

const AddressListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  gap: theme.spacing(1),
}));

const Header = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const AddressList: React.FC<AddressListProps> = ({
  title,
  addresses,
  selectedId,
  onSelect,
  isRadio = true,
  isAddNewAddress,
  isSameAsShipping = true,
  onSameAsShippingChange,
  onSaveNewAddress,
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [localAddresses, setLocalAddresses] = useState(addresses);

  // Sync localAddresses with addresses prop when it changes
  useEffect(() => {
    setLocalAddresses(addresses);
  }, [addresses]);

  const handleSaveAddress = (newAddress: any) => {
    // The new address already has an ID from the form
    // Add it to the local addresses array
    setLocalAddresses(prev => [...prev, newAddress]);
    
    // Call the parent callback
    onSaveNewAddress?.(newAddress);
    
    // Hide the form
    setShowAddressForm(false);
  };

  const handleCancelAddress = () => {
    setShowAddressForm(false);
    // Re-select the checkbox when cancel is clicked
    onSameAsShippingChange?.(true);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    onSameAsShippingChange?.(checked);
    if (!checked) {
      setShowAddressForm(true);
    } else {
      setShowAddressForm(false);
    }
  };
  return (
    <AddressListContainer>
      <Header>
        <Typography sx={{ fontFamily: 'Roboto slab' }} variant="h6">
          {title}
        </Typography>
        {isAddNewAddress ? (
          <ButtonComponent
            buttonText="Add New"
            startIcon={<AddHomeIcon />}
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #7a1c2d',
              color: '#7a1c2d',
              borderRadius: '18px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Roboto Slab',
              padding: '4px 16px',
              minWidth: 'auto',
            }}
          />
        ) : null}
        {!isRadio && isSameAsShipping !== undefined && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isSameAsShipping}
                onChange={handleCheckboxChange}
              />
            }
            label="Same as Shipping"
            sx={{ fontSize: 14, fontFamily: 'Roboto Slab' }}
          />
        )}
      </Header>

      {/* Show address form when checkbox is unchecked */}
      {!isSameAsShipping && showAddressForm && (
        <AddressForm
          onSave={handleSaveAddress}
          onCancel={handleCancelAddress}
        />
      )}

      {/* Only show address list box when form is not displayed */}
      {!showAddressForm && (
        <Box
          sx={{
            border: '1px solid #CCCCCC',
            borderRadius: '8px',
            backgroundColor: '#FBFBFB',
          }}
        >
        {isRadio
          ? localAddresses.map((address, index) => (
              <Box
                key={address.id}
                sx={{
                  borderBottom:
                    index === localAddresses.length - 1
                      ? 'none'
                      : '1px solid #CCCCCC',
                  padding: '8px',
                }}
              >
                <AddressCard
                  isRadio={isRadio}
                  address={address}
                  selected={selectedId === address.id}
                  onSelect={() => onSelect(address.id)}
                />
              </Box>
            ))
          : (() => {
              const selectedAddress = localAddresses.find(
                (address) => address.id === selectedId
              );
              return !showAddressForm && selectedAddress ? (
                <Box sx={{ padding: '8px' }}>
                  <AddressCard
                    isRadio={isRadio}
                    address={selectedAddress}
                    selected={true}
                    onSelect={() => onSelect(selectedAddress.id)}
                  />
                </Box>
              ) : null;
            })()}
        </Box>
      )}
    </AddressListContainer>
  );
};

export default AddressList;
