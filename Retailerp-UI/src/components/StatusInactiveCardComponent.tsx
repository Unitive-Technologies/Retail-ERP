import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/system/Grid';
import React from 'react';

type CardDataProps = {
  img: React.ElementType;
  title: string;
  value: number | string;
  quantity?: number | string;
  quantityLabel?: string;
  valueUnit?: string;
};

type LayoutType = 'horizontal' | 'vertical';
type ContainerDirection = 'row' | 'column';

type Props = {
  data: CardDataProps[];
  layout?: LayoutType;
  containerDirection?: ContainerDirection;
};

const CardWrapper = styled(Grid)<{ layout?: LayoutType }>(
  ({ theme, layout }) => ({
    background: theme.Colors.whitePrimary,
    boxShadow: theme.shadows[1],
    borderRadius: 10,
    padding: theme.spacing(2),
    border: `1px solid ${theme.Colors.grayWhite}`,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    height: layout === 'horizontal' ? 'auto' : '120px',
    alignItems: layout === 'horizontal' ? 'center' : 'stretch',
  })
);

const IconWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  backgroundColor: '#FFE5E5',
  border: '1px solid #FFB3B3',
  '& svg': {
    width: '20px',
    height: '20px',
    objectFit: 'cover',
  },
}));

const Label = styled(Typography)(({ theme }) => ({
  fontWeight: theme.fontWeight.bold,
  color: theme.Colors.blueGray,
  marginTop: 6,
  textAlign: 'left',
  fontSize: theme.MetricsSizes.regular,
}));

const Value = styled(Typography)(({ theme }) => ({
  fontSize: `${theme.MetricsSizes.regular_xxx}px !important`,
  fontWeight: theme.fontWeight.bold,
  color: '#333843',
  paddingRight: '15px',
}));

const QuantityBadge = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 12px',
  borderRadius: '20px',
  border: '1px solid #6D2E3D',
  backgroundColor: '#F3D8D9',
  marginTop: 'auto',
}));

const QuantityText = styled(Typography)(({ theme }) => ({
  fontSize: theme.MetricsSizes.small_xx,
  fontWeight: theme.fontWeight.mediumBold,
  color: '#6D2E3D',
  fontFamily: theme.fontFamily.roboto,
}));

const StatusInactiveCard = ({
  data,
  layout = 'vertical',
  containerDirection = 'row',
}: Props) => {
  const columns = data?.length;
  const colWidth = Math.floor(12 / columns);
  const itemSize =
    containerDirection === 'column'
      ? { xs: 12, sm: 12, md: 12, lg: 12 }
      : data?.length === 2
        ? { xs: 12, sm: 6, md: 6, lg: 6 }
        : { xs: 6, sm: 6, md: colWidth, lg: colWidth };

  return (
    <Grid
      container
      spacing={1}
      mb={2}
      sx={{
        width: '100%',
        flexDirection: containerDirection === 'column' ? 'column' : 'row',
      }}
    >
      {data.map((item, index) => {
        const displayValue = item.valueUnit
          ? `${item.value} ${item.valueUnit}`
          : item.value;
        const quantityLabel = item.quantityLabel || 'Qty';
        const quantityText = item.quantity
          ? `${item.quantity} ${quantityLabel}`
          : null;

        if (layout === 'horizontal') {
          return (
            <Grid size={itemSize} key={index}>
              <CardWrapper layout={layout}>
                <IconWrapper>
                  <item.img />
                </IconWrapper>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    marginLeft: 2,
                  }}
                >
                  <Label sx={{ marginBottom: 1 }}>{item.title}</Label>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Value>{displayValue}</Value>
                    {quantityText && (
                      <QuantityBadge sx={{ marginTop: 0 }}>
                        <QuantityText>{quantityText}</QuantityText>
                      </QuantityBadge>
                    )}
                  </Box>
                </Box>
              </CardWrapper>
            </Grid>
          );
        }

        // Vertical layout (default)
        return (
          <Grid size={itemSize} key={index}>
            <CardWrapper layout={layout}>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Label>{item.title}</Label>

                <item.img />
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: 'auto',
                }}
              >
                <Value>{displayValue}</Value>
                {quantityText && (
                  <QuantityBadge>
                    <QuantityText>{quantityText}</QuantityText>
                  </QuantityBadge>
                )}
              </Box>
            </CardWrapper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatusInactiveCard;
