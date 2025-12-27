import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import React from 'react';

type CardDataProps = {
  img: React.ElementType;
  img2: React.ElementType;
  title: string;
  value: number | string;
  qty?: number | string;
  activeTab?: number;
};

type Props = {
  data: CardDataProps[];
  onClickCard?: (index: number) => void;
};

const CardWrapper = styled(Grid)<{
  active?: boolean;
}>(({ theme, active }) => ({
  background: active
    ? `linear-gradient(135deg, ${theme.Colors.primaryDarkStart} 0%, ${theme.Colors.primaryDarkEnd} 100%)`
    : theme.Colors.whitePrimary,
  border: `1px solid #E0E2E7`,
  boxShadow: active
    ? '0px 1.5px 2px 0px rgba(16, 24, 40, 0.10)'
    : '0px 1.5px 2px 0px rgba(16, 24, 40, 0.10)',

  borderRadius: 10,
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: '0px 2px 4px rgba(16, 24, 40, 0.12)',
  },

  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
}));

const IconWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '38px',
  height: '38px',
  '& svg': {
    width: '38px',
    height: '38px',
    objectFit: 'cover',
  },
}));

const Label = styled(Typography)<{ active?: boolean }>(({ theme, active }) => ({
  fontWeight: theme.fontWeight.bold,
  color: `${active ? theme.Colors.whitePrimary : theme.Colors.blueGray}`,
  marginTop: 6,
  textAlign: 'left',
  [theme.breakpoints.down('md')]: {
    fontSize: theme.MetricsSizes.regular,
  },
  [theme.breakpoints.up('md')]: {
    fontSize: theme.MetricsSizes.regular,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: theme.MetricsSizes.regular,
  },
}));

const Value = styled(Typography)<{ active?: boolean }>(({ active, theme }) => ({
  fontSize: `${theme.MetricsSizes.regular_xxx}px !important`,
  fontWeight: theme.fontWeight.bold,
  color: `${active ? '#FFFFFF' : '#333843'}`,
  paddingRight: '15px',

  flex: '1 1 auto',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const QtyChip = styled('div')(({ theme }) => ({
  padding: '4px 10px',
  borderRadius: '16px',
  border: `1px solid ${theme.Colors.primary}`,
  fontSize: '12px',
  color: theme.Colors.primaryDarkStart,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  marginLeft: theme.spacing(1),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F3D8D9',
}));

const BottomRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  width: '100%',
});

const StatusCard = ({ data, onClickCard }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 2,
        width: '100%',
        flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
      }}
    >
      {data.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            minWidth: 0,
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 6px)',
              md: '1 1 0',
            },
          }}
        >
          <CardWrapper
            onClick={() => onClickCard?.(index)}
            active={index == item.activeTab}
            sx={{
              height: '120px',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Label active={index == item.activeTab}>{item.title}</Label>
              {(() => {
                const Icon = index == item.activeTab ? item.img2 : item.img;
                return (
                  <IconWrapper>
                    <Icon />
                  </IconWrapper>
                );
              })()}
            </Box>
            <BottomRow>
              <Value active={index == item.activeTab}>{item.value}</Value>

              {item.qty !== undefined && item.qty !== null && (
                <QtyChip>{item.qty} Qty</QtyChip>
              )}
            </BottomRow>
          </CardWrapper>
        </Box>
      ))}
    </Box>
  );
};

export default StatusCard;
