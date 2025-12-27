import React, { useState } from 'react';
import {
  Typography,
  Popover,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MUHTextInput from '@components/MUHTextInput';
import {
  PincodeArrowRightIcon,
  PincodeIcon,
  PincodeLoadingIcon,
} from '@assets/Images';
import { isValidPinCode } from '@utils/form-util';

const DeliveryPincode = () => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [pincode, setPincode] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Grid minWidth={'12%'}>
      <Typography
        sx={{
          display: 'block',
          color: theme.Colors.black,
          fontFamily: 'Roboto slab',
          fontWeight: 400,
          fontSize: 14,
        }}
      >
        Delivery
      </Typography>

      <Typography
        sx={{
          fontWeight: 500,
          fontFamily: 'Roboto slab',
          color: theme.Colors.primary,
          cursor: 'pointer',
          lineHeight: '14px',
        }}
        onClick={handleClick}
      >
        Enter Pincode
      </Typography>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        // elevation={1}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            // mt: 1.5,
            boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.1)',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Grid
          sx={{
            px: 1.5,
            py: 2,
            maxWidth: '270px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={PincodeIcon} />
          <Grid width={'100%'}>
            <Typography
              variant="h6"
              sx={{ mt: 2, fontWeight: '500', color: '#782F3E' }}
            >
              Deliver & Showrooms
            </Typography>
          </Grid>
          <MUHTextInput
            placeholderText="Enter your Pin Code"
            value={pincode}
            onChange={handleChange}
            fontSize={12}
            placeholderFontSize={12}
            placeholderColor="#2D2D2D"
            borderRadius={2}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    background: theme.Colors.primaryLight,
                    borderRadius: '0px 8px 8px 0px',
                    maxHeight: 'none',
                    height: '100%',
                    pl: '3px',
                    pr: '5px',
                  }}
                >
                  {/* {pincode ? (
                    <IconButton onClick={() => setPincode('')}>
                      <PincodeLoadingIcon />
                    </IconButton>
                  ) : (
                    <IconButton>
                      <PincodeArrowRightIcon />
                    </IconButton>
                  )} */}
                  {pincode.length === 6 && isValidPinCode(pincode) ? (
                    <IconButton>
                      <PincodeArrowRightIcon />
                    </IconButton>
                  ) : pincode ? (
                    <IconButton onClick={() => setPincode('')}>
                      <PincodeLoadingIcon />
                    </IconButton>
                  ) : (
                    <IconButton>
                      <PincodeArrowRightIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Popover>
    </Grid>
  );
};

export default DeliveryPincode;
