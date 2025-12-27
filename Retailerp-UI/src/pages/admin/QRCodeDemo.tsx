import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { QRCodeGenerator } from '../../components';
import * as theme from '../../theme/schemes/PurelightTheme';

const QRCodeDemo: React.FC = () => {
  const [qrValue, setQrValue] = useState('https://example.com');
  const [qrSize, setQrSize] = useState(200);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const handleQRGenerated = (dataURL: string) => {
    console.log('QR Code generated:', dataURL);
  };

  const handleDownload = (dataURL: string, filename: string) => {
    console.log(
      'QR Code downloaded:',
      filename,
      'Data URL length:',
      dataURL.length
    );
  };

  const handlePrint = (dataURL: string) => {
    console.log('QR Code printed:', 'Data URL length:', dataURL.length);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          color: theme.Colors.primary,
          fontWeight: 700,
        }}
      >
        QR Code Generator Demo
      </Typography>

      <Grid container spacing={4}>
        {/* Configuration Panel */}
        <Grid size={{ xs: 2, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                marginBottom: 3,
                color: theme.Colors.black,
                fontWeight: 600,
              }}
            >
              Configuration
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="QR Code Content"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                helperText="Enter text, URL, or any data to encode"
              />

              <TextField
                label="Size (pixels)"
                type="number"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                inputProps={{ min: 100, max: 500 }}
                fullWidth
                variant="outlined"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Background Color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  sx={{ flex: 1 }}
                />

                <TextField
                  label="Foreground Color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  sx={{ flex: 1 }}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Error Correction Level</InputLabel>
                <Select
                  value={errorLevel}
                  label="Error Correction Level"
                  onChange={(e) =>
                    setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')
                  }
                >
                  <MenuItem value="L">Low (7%)</MenuItem>
                  <MenuItem value="M">Medium (15%)</MenuItem>
                  <MenuItem value="Q">Quartile (25%)</MenuItem>
                  <MenuItem value="H">High (30%)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        {/* QR Code Display */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <QRCodeGenerator
              value={qrValue}
              size={qrSize}
              bgColor={bgColor}
              fgColor={fgColor}
              errorCorrectionLevel={errorLevel}
              title="Generated QR Code"
              downloadFilename="my-qrcode"
              onGenerated={handleQRGenerated}
              onDownload={handleDownload}
              onPrint={handlePrint}
              showDownload={true}
              showPrint={true}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Usage Examples */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography
          variant="h6"
          sx={{ marginBottom: 2, color: theme.Colors.black, fontWeight: 600 }}
        >
          Usage Examples
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QRCodeGenerator
              value="https://www.google.com"
              size={150}
              title="Website URL"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QRCodeGenerator
              value="tel:+1234567890"
              size={150}
              title="Phone Number"
              fgColor="#1976d2"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QRCodeGenerator
              value="mailto:example@email.com"
              size={150}
              title="Email Address"
              fgColor="#d32f2f"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default QRCodeDemo;
