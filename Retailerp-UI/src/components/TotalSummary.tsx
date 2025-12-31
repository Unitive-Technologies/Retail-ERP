import { Box, Typography, TextareaAutosize } from '@mui/material';
import Grid from '@mui/system/Grid';
import { TextInput } from '@components/index';
import { useState, useEffect } from 'react';

interface TotalSummaryProps {
  totals: {
    subTotal: number;
    sgstAmount: number;
    cgstAmount: number;
    discountAmount: number;
    totalAmount: number;
  };
  numberToWords: (num: number) => string;
  remarks: string;
  onRemarksChange: (value: string) => void;
  sgstPercent: string;
  cgstPercent: string;
  discountPercent: string;
  onSgstPercentChange: (value: string) => void;
  onCgstPercentChange: (value: string) => void;
  onDiscountPercentChange: (value: string) => void;
  vendorStateId?: number | null;
}

const TotalSummary = ({
  totals,
  numberToWords,
  remarks,
  onRemarksChange,
  sgstPercent,
  cgstPercent,
  discountPercent,
  onSgstPercentChange,
  onCgstPercentChange,
  onDiscountPercentChange,
  vendorStateId,
}: TotalSummaryProps) => {
  // Helper function to remove "%" from value
  const removePercent = (value: string) => {
    return value.replace(/%/g, '').trim();
  };

  // Helper function to add "%" to value if it doesn't have it
  const addPercent = (value: string) => {
    const cleaned = removePercent(value);
    return cleaned ? `${cleaned}%` : '0%';
  };

  // Local state for display values with "%" symbol
  const [sgstDisplay, setSgstDisplay] = useState(sgstPercent || '');
  const [cgstDisplay, setCgstDisplay] = useState(cgstPercent || '');
  const [discountDisplay, setDiscountDisplay] = useState(discountPercent || '');

  // Update display values when props change from external source
  useEffect(() => {
    const currentSgst = removePercent(sgstDisplay);
    const currentCgst = removePercent(cgstDisplay);
    const currentDiscount = discountDisplay;
    // Only update if the prop value is different from current display (without %)
    // This prevents overwriting user input while typing
    if (sgstPercent && sgstPercent !== currentSgst) {
      setSgstDisplay(sgstPercent);
    }
    if (cgstPercent && cgstPercent !== currentCgst) {
      setCgstDisplay(cgstPercent);
    }
    if (discountPercent && discountPercent !== currentDiscount) {
      setDiscountDisplay(discountPercent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sgstPercent, cgstPercent, discountPercent]);

  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <Grid
        container
        spacing={3}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {/* Left Side - In Words and Remarks */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* In Words */}
          <Box
            sx={{
              border: '1px solid #E4E4E4',
              borderRadius: '4px',
              p: 2,
              height: '90px',
            }}
          >
            <Typography
              style={{ fontSize: '16px', fontWeight: 400, color: '#333',marginBottom: '10px' }}
            >
              In Words
            </Typography>
            <Typography
              style={{ fontSize: '18px', color: '#333', fontWeight: 600 }}
            >
              {numberToWords(Math.round(totals.totalAmount))}
            </Typography>
          </Box>
          {/* Remarks */}
          <Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#000000',
                mt: 3,
                borderBottom: '2px solid #471923 ',
                width: 'fit-content',
              }}
            >
              REMARKS
            </Typography>
            <Box
              sx={{
                border: '1px solid #E4E4E4',
                borderRadius: '4px',
                height: '160px',
                marginTop: '20px',
              }}
            >
              <TextareaAutosize
                // placeholder="Lorem ipsum dolor sit amet. Ut adipisci corrupti vel repudiandae culpa id enim ipsum vel expedita sint. Aut odio recusandae et aliquam dolor eum eligendi doloribus cum perspiciatis quia est quae asperiores. Et ullam officiis et doloribus dolorem aut laborum cupiditate eos inventore."
                style={{
                  width: '100%',
                  height: '118px',
                  border: 'none',
                  outline: 'none',
                  padding: '12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  borderRadius: '4px',
                }}
                value={remarks}
                onChange={(e) => onRemarksChange(e.target.value)}
              />
            </Box>
          </Box>
        </Grid>
        {/* Right Side - Amount Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ backgroundColor: '#F8EBF0', p: 3, borderRadius: '8px' }}>
            {/* Sub Total */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
              >
                Sub Totals
              </Typography>
              <Box
                sx={{
                  width: '150px',
                  height: '40px',
                  border: '1px solid #AEAFB0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  // justifyContent: 'center',
                  fontSize: '14px',
                  pl: 1.5,
                  fontWeight: 400,
                }}
              >
                ₹{totals.subTotal.toFixed(2)}
              </Box>
            </Box>
            {/* SGST */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
              >
                {`${vendorStateId == 2 ? 'SGST' : 'IGST'}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: '68px',
                    height: '40px',
                    border: '1px solid #AEAFB0',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <TextInput
                    value={sgstDisplay}
                    placeholderText="0"
                    onChange={(e: any) => {
                      const value = removePercent(e.target.value);
                      // Allow numbers and decimal point
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setSgstDisplay(value);
                        onSgstPercentChange(value);
                      }
                    }}
                    onFocus={(e: any) => {
                      const value = removePercent(e.target.value);
                      setSgstDisplay(value);
                    }}
                    onBlur={(e: any) => {
                      const value = removePercent(e.target.value);
                      const displayValue = value ? addPercent(value) : '';
                      setSgstDisplay(displayValue);
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        fontSize: '12px',
                        padding: '0 8px',
                        textAlign: 'center',
                        border: 'none',
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    width: '150px',
                    height: '40px',
                    border: '1px solid #AEAFB0',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 400,
                    pl: 1.5,
                  }}
                >
                  ₹{totals.sgstAmount.toFixed(2)}
                </Box>
              </Box>
            </Box>
            {/* CGST */}
            {vendorStateId == 2 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                >
                  CGST
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: '68px',
                      height: '40px',
                      border: '1px solid #AEAFB0',
                      borderRadius: '4px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    <TextInput
                      value={cgstDisplay}
                      placeholderText="0"
                      onChange={(e: any) => {
                        const value = removePercent(e.target.value);
                        // Allow numbers and decimal point
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setCgstDisplay(value);
                          onCgstPercentChange(value);
                        }
                      }}
                      onFocus={(e: any) => {
                        const value = removePercent(e.target.value);
                        setCgstDisplay(value);
                      }}
                      onBlur={(e: any) => {
                        const value = removePercent(e.target.value);
                        const displayValue = value ? addPercent(value) : '';
                        setCgstDisplay(displayValue);
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '40px',
                          fontSize: '12px',
                          padding: '0 8px',
                          textAlign: 'center',
                          border: 'none',
                          '& fieldset': {
                            border: 'none',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '150px',
                      height: '40px',
                      border: '1px solid #AEAFB0',
                      borderRadius: '4px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      // justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 400,
                      pl: 1.5,
                    }}
                  >
                    ₹{totals.cgstAmount.toFixed(2)}
                  </Box>
                </Box>
              </Box>
            ) : null}
            {/* Round Off */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
              >
                Round Off
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: '150px',
                    height: '40px',
                    border: '1px solid #AEAFB0',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <TextInput
                    value={discountDisplay}
                    placeholderText="0"
                    onChange={(e: any) => {
                      const value = e.target.value;
                      // Allow negative sign, numbers and decimal point
                      if (
                        value === '' ||
                        value === '-' ||
                        /^-?\d*\.?\d*$/.test(value)
                      ) {
                        setDiscountDisplay(value);
                        onDiscountPercentChange(value);
                      }
                    }}
                    onFocus={(e: any) => {
                      const value = e.target.value;
                      setDiscountDisplay(value);
                    }}
                    onBlur={(e: any) => {
                      const value = e.target.value;
                      // Keep the value as is (no percentage formatting)
                      setDiscountDisplay(value);
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        fontSize: '12px',
                        // padding: '0 0px',
                        textAlign: 'center',
                        border: 'none',
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                </Box>
                {/* <Box
                  sx={{
                    width: '150px',
                    height: '40px',
                    border: '1px solid #AEAFB0',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                >
                  ₹{totals.discountAmount.toFixed(2)}
                </Box> */}
              </Box>
            </Box>
            {/* Total Amount */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{ fontSize: '16px', fontWeight: 600, color: '#000000' }}
              >
                Total Amount
              </Typography>
              <Box
                sx={{
                  width: '150px',
                  height: '40px',
                  border: '1px solid #AEAFB0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  // justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 500,
                                    pl: 1.5,

                }}
              >
                ₹{totals.totalAmount.toFixed(2)}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalSummary;
