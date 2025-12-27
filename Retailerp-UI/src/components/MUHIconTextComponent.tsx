import React from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

type Props = {
  icon?: string;
  value?: string;
  valueStyle?: React.CSSProperties;
  imageTextStyles?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
};

const MUHIconTextComponent = (props: Props) => {
  const { icon, value, valueStyle, imageTextStyles, iconStyle } = props;

  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', ...imageTextStyles }}>
      <Grid >
        {icon && (
          <img
            src={icon}
            alt="icon"
            style={{ marginRight: '8px', ...iconStyle }}
          />
        )}
      </Grid>
      <Grid >
        {value && (
          <Typography
            sx={{
              fontSize: '24px',
              marginLeft: '4px',
              color: '#34C38F',
              fontWeight: 400,
              paddingBottom: 1,
              ...valueStyle,
            }}
          >
            {value}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default MUHIconTextComponent;
