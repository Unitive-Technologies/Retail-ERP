import { SchemeLandingImages, SchemeListImages } from '@assets/Images';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import GoldenPlanImages from '@assets/Images/GoldenPlanImages.svg';
import MUHTypography from '@components/MUHTypography';
import { useState } from 'react';
import SchemeDetail from '../Scheme/SchemeDetail';
import { CONFIRM_MODAL } from '@constants/Constance';

const plans = [
  {
    title: 'Golden Promise Plan',
    image: GoldenPlanImages, // replace with your image path
    benefits: [
      'Easy Flexible Instalments',
      'Total 12 months of instalments',
      'Get Bonus of 5% with successfully completion of the plan',
      'Get your favourite jewellery at Store/Online',
    ],
  },
  {
    title: 'Mangalyam Bridal Plan',
    image: GoldenPlanImages, // replace with your image path
    benefits: [
      'Instalment Options: ₹2,500',
      'Total 12 months of instalments',
      'Bonus of 5% with successfully completion of the plan',
      'Bonus of 5% with successfully completion of the plan',
    ],
  },
];

const termsAndConditions = [
  {
    title: '1. Enrollment & Payments',
    items: [
      'The customer must complete the enrollment form and provide valid ID proof.',
      'Monthly installment should be paid on or before the due date.',
      'Payments can be made via cash, card, UPI, net banking, or cheque (subject to clearance).',
    ],
  },
  {
    title: '2. Installment Amount & Tenure',
    items: [
      'The customer agrees to pay the fixed monthly installment chosen at the time of enrollment.',
      'Scheme tenure will be as per the selected plan (e.g., 11 months / 12 months).',
    ],
  },
  {
    title: '3. Redemption',
    items: [
      'On successful completion of all installments, the customer is eligible to purchase jewellery equivalent to the total amount paid plus applicable scheme benefits.',
      'Redemption is allowed only against jewellery purchases (gold, diamond, silver) and not against coins, bullion, or gift articles.',
    ],
  },
  {
    title: '4. Default / Missed Payments',
    items: [
      'If an installment is missed, the scheme benefits may be reduced or forfeited.',
      'Company reserves the right to adjust delayed payments without extending maturity.',
    ],
  },
  {
    title: '5. Premature Withdrawal',
    items: [
      'In case of early closure, the customer will be eligible only for the amount paid (without any scheme benefits/bonus).',
    ],
  },
  {
    title: '6. Bonus / Benefit',
    items: [
      'Additional benefits/discounts offered under the scheme will be applied only on successful completion of the scheme.',
      'Benefits are subject to company policy and may vary from time to time.',
    ],
  },
];

const SchemeLandingPage = () => {
  const theme = useTheme();

  const [openCreateModel, setOpenCreateModel] = useState<any>({ open: false });
  const handleClickButton = (rowData: any, type: string) => {
    setOpenCreateModel({
      open: true,
      rowData: rowData,
      type: type,
    });
  };
  return (
    <Grid container flexDirection={'column'} spacing={2}>
      <Box
        component="img"
        src={SchemeLandingImages}
        alt="banner"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <Grid container justifyContent="center" sx={{ margin: 4 }}>
        <Grid
          size={{ xs: 6 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: 3,
          }}
        >
          <Box
            sx={{
              flex: 1,
              height: '3px',
              borderRadius: '4px',
              background:
                'linear-gradient(to right, transparent, #8b0000, transparent)',
              width: '100%',
            }}
          />
          <MUHTypography
            size={28}
            weight={600}
            color={theme.Colors.primaryDarkStart}
            sx={{ textAlign: 'center' }}
          >
            Join now and make every celebration shine brighter.
          </MUHTypography>
          <Box
            sx={{
              flex: 1,
              height: '2px',
              background:
                'linear-gradient(to right, transparent, #8b0000, transparent)',
              width: '100%',
            }}
          />
        </Grid>
        <Grid>
          <MUHTypography size={20} weight={400}>
            At Chaneira Jewels, we believe that every special moment deserves to
            shine with timeless elegance. To make your jewellery{' '}
          </MUHTypography>
          <MUHTypography size={20} weight={400}>
            dreams more affordable and accessible, we bring you our exclusive
            Jewellery Savings Scheme.
          </MUHTypography>
        </Grid>
      </Grid>

      <Grid container sx={{ mx: 3, mt: 3 }}>
        {plans.map((plan, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 12, md: 6 }}
            sx={{
              border: '1px solid #ccc',
              borderRadius: '12px',
              padding: 3,
              position: 'relative',
            }}
          >
            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={plan.image}
                alt={plan.title}
                style={{
                  width: '100%',
                  maxWidth: '250px',
                  marginBottom: '16px',
                }}
              />
            </Grid>
            <MUHTypography
              variant="h6"
              sx={{ fontWeight: 'bold', marginBottom: 2 }}
            >
              {plan.title}
            </MUHTypography>
            <Grid
              container
              direction="column"
              spacing={1}
              sx={{ marginBottom: 2 }}
            >
              {plan.benefits.map((benefit, i) => (
                <Grid key={i}>
                  <MUHTypography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8.93px',
                    }}
                  >
                    <img src={SchemeListImages} /> {benefit}
                  </MUHTypography>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              onClick={() => handleClickButton({}, CONFIRM_MODAL.create)}
              sx={{
                backgroundColor: '#5e1b2e',
                color: '#fff',
                borderRadius: '8px',
                width: '100%',
              }}
            >
              Enroll Now
            </Button>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: '2px',
            background:
              'linear-gradient(to right, transparent, #8b0000, transparent)',
            width: '100%',
          }}
        />
        <MUHTypography
          size={28}
          weight={600}
          color={theme.Colors.primaryDarkStart}
          sx={{ textAlign: 'center' }}
        >
          Terms & Conditions
        </MUHTypography>
        <Box
          sx={{
            flex: 1,
            height: '2px',
            background:
              'linear-gradient(to right, transparent, #8b0000, transparent)',
            width: '100%',
          }}
        />
      </Grid>

      <Grid
        container
        sx={{
          flexDirection: 'column',
          border: '1px solid #CDCDCD',
          borderRadius: '16px',
          mx: 4,
          px: '32px',
          py: '25px',
          gap: 0,
        }}
      >
        {termsAndConditions.map((section, index) => (
          <Grid key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Section Title */}
            <MUHTypography
              size={20}
              weight={600}
              sx={{ mb: 1, color: theme.Colors.primary }}
            >
              {section.title}
            </MUHTypography>

            <List sx={{ pl: 6, listStyleType: 'disc' }}>
              {section.items.map((item, i) => (
                <ListItem
                  key={i}
                  sx={{ display: 'list-item', py: 0, color: '#2D2D2D' }}
                >
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
        ))}
      </Grid>
      {openCreateModel.open ? (
        <SchemeDetail
          {...openCreateModel}
          onClose={() => setOpenCreateModel({ open: false })}
        />
      ) : null}
    </Grid>
  );
};
export default SchemeLandingPage;
