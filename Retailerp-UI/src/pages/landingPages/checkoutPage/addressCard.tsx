import React from 'react';
import { Box, Typography, Radio } from '@mui/material';
import { styled } from '@mui/material';

export interface Address {
  id: number;
  name: string;
  customer_id: number;
  mobile_number: string ;
  address_line: string  ;
  country_id: number;
  state_id: 2;
  district_id: string  ;
  pin_code: string  ;
  is_default: true;
  created_at: string ;
  updated_at: string  ;
  deleted_at: string;
  state_name?: string;
  district_name?: string;
}

interface AddressCardProps {
  address: Address;
  selected: boolean;
  isRadio?: boolean;
  onSelect: () => void;
}

const Card = styled(Box)<{ selected: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
}));

const AddressInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
}));

const TextStyle = styled(Typography)(() => ({
  fontFamily: 'Roboto slab',
  fontSize: 16,
}));

const AddressCard: React.FC<AddressCardProps> = ({
  isRadio = true,
  address,
  selected,
  onSelect,
}) => {
  return (
    <Card selected={selected} onClick={onSelect}>
      {isRadio ? <Radio checked={selected} readOnly /> : null}

      <AddressInfo>
        <TextStyle>{address.name}</TextStyle>
        <TextStyle>{address.mobile_number}</TextStyle>
        <TextStyle>{address.address_line}</TextStyle>
        <TextStyle>
          {address.district_name || address.district_id}
        </TextStyle>
        <TextStyle>
          {address.state_name || `State ${address.state_id}`} {address.pin_code}
        </TextStyle>
      </AddressInfo>
    </Card>
  );
};

export default AddressCard;
