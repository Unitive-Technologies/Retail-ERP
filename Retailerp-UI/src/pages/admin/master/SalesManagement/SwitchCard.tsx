import PageHeader from '@components/PageHeader';
import Grid from '@mui/system/Grid';
import { useEdit } from '@hooks/useEdit';
import { useNavigate } from 'react-router-dom';
import {
  NewCardIcon,
  PartiallyDeliveredCardIcon,
  ShippedCardIcon,
} from '@assets/Images';
import { useTheme } from '@mui/material';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';

const SalesManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const initialValues = {
    status: 0,
    offer_plan: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const card = [
    {
      img: NewCardIcon,
      img2: NewCardIcon,
      title: 'Today Sales',
      value: '₹5,25,255',
    },
    {
      img: ShippedCardIcon,
      img2: ShippedCardIcon,
      title: 'This Month Sales',
      value: '₹13,45,256',
    },
    {
      img: PartiallyDeliveredCardIcon,
      img2: PartiallyDeliveredCardIcon,
      title: 'This Year',
      value: '₹1,40,45,256',
    },
  ];

  const handleCardClick = (index: number) => {
    console.log('Card clicked:', index);
  };

  return (
    <>
      <Grid container spacing={1}>
        <PageHeader
          title="ORDER LIST"
          titleStyle={{ color: theme.Colors.black }}
          btnName="Create Order"
        />
        <StatusInactiveCard
          data={card}
          onClickCard={handleCardClick}
          showActiveState={false}
        />
      </Grid>
    </>
  );
};

export default SalesManagement;
