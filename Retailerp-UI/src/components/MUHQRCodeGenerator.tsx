import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import QRCodeLib from 'qrcode';
import { Download, Print } from '@mui/icons-material';
import * as theme from '../theme/schemes/PurelightTheme';

interface QRCodeGeneratorProps {
  /**
   * Text or data to encode in the QR code
   */
  value: string;
  /**
   * Size of the QR code in pixels
   * @default 200
   */
  size?: number;
  /**
   * Background color of the QR code
   * @default '#ffffff'
   */
  bgColor?: string;
  /**
   * Foreground color of the QR code
   * @default '#000000'
   */
  fgColor?: string;
  /**
   * Error correction level
   * @default 'M'
   */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  /**
   * Whether to show download button
   * @default true
   */
  showDownload?: boolean;

  /**
   * Whether to show print button
   * @default true
   */
  showPrint?: boolean;
  /**
   * Custom filename for download
   * @default 'qrcode'
   */
  downloadFilename?: string;
  /**
   * Custom title for the component
   */
  title?: string;
  /**
   * Custom styles for the container
   */
  containerStyle?: React.CSSProperties;
  /**
   * Custom styles for the canvas
   */
  canvasStyle?: React.CSSProperties;
  /**
   * Callback when QR code is generated
   */
  onGenerated?: (dataURL: string) => void;
  /**
   * Callback when download is clicked
   */
  onDownload?: (dataURL: string, filename: string) => void;
  /**
   * Callback when print is clicked
   */
  onPrint?: (dataURL: string) => void;
}

const MUHQRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  bgColor = '#ffffff',
  fgColor = '#000000',
  errorCorrectionLevel = 'M',
  showDownload = true,
  showPrint = true,
  downloadFilename = 'qrcode',
  title,
  containerStyle,
  canvasStyle,
  onGenerated,
  onDownload,
  onPrint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataURL, setDataURL] = useState<string>('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const generateQRCode = useCallback(async () => {
    if (!value || !canvasRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      await QRCodeLib.toCanvas(canvas, value, {
        width: size,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel,
        margin: 2,
      });

      const generatedDataURL = canvas.toDataURL('image/png');
      setDataURL(generatedDataURL);
      onGenerated?.(generatedDataURL);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate QR code'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [value, size, bgColor, fgColor, errorCorrectionLevel, onGenerated]);

  const handleDownload = () => {
    if (!dataURL) return;

    const link = document.createElement('a');
    link.download = `${downloadFilename}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onDownload?.(dataURL, `${downloadFilename}.png`);
  };

  const handlePrint = () => {
    if (!dataURL) return;
    // Show print preview first
    setShowPrintPreview(true);
  };

  const handleConfirmPrint = () => {
    if (!dataURL) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Create HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${downloadFilename}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: Arial, sans-serif;
            }
            .print-container {
              text-align: center;
            }
            .print-title {
              margin-bottom: 20px;
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .qr-image {
              border: 1px solid #ddd;
              border-radius: 4px;
              max-width: 100%;
              height: auto;
            }
            .print-info {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; }
              .print-container { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${title ? `<div class="print-title">${title}</div>` : ''}
            <img src="${dataURL}" alt="QR Code" class="qr-image" />
            <div class="print-info">
              Generated on: ${new Date().toLocaleDateString()}<br>
              Content: ${value.length > 50 ? value.substring(0, 50) + '...' : value}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };

    onPrint?.(dataURL);
    setShowPrintPreview(false);
  };

  const handleClosePrintPreview = () => {
    setShowPrintPreview(false);
  };

  useEffect(() => {
    if (value) {
      generateQRCode();
    }
  }, [generateQRCode, value]);

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: 'auto',
        ...containerStyle,
      }}
    >
      <CardContent>
        {title && (
          <Typography
            variant="h6"
            component="h2"
            sx={{
              textAlign: 'center',
              marginBottom: 2,
              color: theme.Colors.black,
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: size + 40,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
          }}
        >
          {error ? (
            <Typography
              color="error"
              sx={{
                textAlign: 'center',
                fontSize: 14,
              }}
            >
              {error}
            </Typography>
          ) : (
            <canvas
              ref={canvasRef}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 4,
                backgroundColor: bgColor,
                ...canvasStyle,
              }}
            />
          )}
        </Box>

        {!error && value && (
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            {showPrint && dataURL && (
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handlePrint}
                disabled={isGenerating}
                sx={{
                  borderColor: theme.Colors.graySecondary,
                  color: theme.Colors.graySecondary,
                  '&:hover': {
                    borderColor: theme.Colors.blackSecondary,
                    backgroundColor: theme.Colors.grayLightLow,
                  },
                }}
              >
                Print
              </Button>
            )}

            {showDownload && dataURL && (
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                disabled={isGenerating}
                sx={{
                  backgroundColor: theme.Colors.primary,
                  '&:hover': {
                    backgroundColor: theme.Colors.primaryDarkStart,
                  },
                }}
              >
                Download
              </Button>
            )}
          </Stack>
        )}

        {!value && (
          <Typography
            sx={{
              textAlign: 'center',
              color: theme.Colors.graySecondary,
              fontSize: 14,
              fontStyle: 'italic',
            }}
          >
            Enter text or data to generate QR code
          </Typography>
        )}
      </CardContent>

      {/* Print Preview Dialog */}
      <Dialog
        open={showPrintPreview}
        onClose={handleClosePrintPreview}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: theme.Colors.primary,
            color: 'white',
          }}
        >
          Print Preview
          <IconButton onClick={handleClosePrintPreview} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 2,
            }}
          >
            {title && (
              <Typography
                variant="h6"
                sx={{
                  color: theme.Colors.black,
                  fontWeight: 600,
                  marginBottom: 1,
                }}
              >
                {title}
              </Typography>
            )}

            <Box
              sx={{
                padding: 2,
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <img
                src={dataURL}
                alt="QR Code Preview"
                style={{
                  maxWidth: '200px',
                  height: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                }}
              />
            </Box>

            <Box
              sx={{ textAlign: 'center', color: theme.Colors.graySecondary }}
            >
              <Typography variant="body2">
                <strong>Content:</strong>{' '}
                {value.length > 60 ? value.substring(0, 60) + '...' : value}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Generated on: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <Button
            onClick={handleClosePrintPreview}
            variant="outlined"
            sx={{
              borderColor: theme.Colors.graySecondary,
              color: theme.Colors.graySecondary,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPrint}
            variant="contained"
            startIcon={<Print />}
            sx={{
              backgroundColor: theme.Colors.primary,
              '&:hover': {
                backgroundColor: theme.Colors.primaryDarkStart,
              },
            }}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MUHQRCodeGenerator;
