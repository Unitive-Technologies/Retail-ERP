import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import QRCodeLib from 'qrcode';
import { Download, ContentCopy, Print } from '@mui/icons-material';
import * as theme from '../theme/schemes/PurelightTheme';

interface SimpleQRCodeProps {
  value: string;
  size?: number;
  showActions?: boolean;
  downloadFilename?: string;
  onGenerated?: (dataURL: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

const SimpleQRCode: React.FC<SimpleQRCodeProps> = ({
  value,
  size = 150,
  showActions = false,
  downloadFilename = 'qrcode',
  onGenerated,
  style,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataURL, setDataURL] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = useCallback(async () => {
    if (!value || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
      }

      // Generate high-resolution QR code
      await QRCodeLib.toCanvas(canvas, value, {
        width: size, // 4× pixel density for clarity
        scale: 8, // higher internal scale
        margin: 2, // small margin improves scan reliability
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H', // maximum error tolerance
      });

      const generatedDataURL = canvas.toDataURL('image/png');
      setDataURL(generatedDataURL);
      onGenerated?.(generatedDataURL);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate QR code'
      );
    }
  }, [value, size, onGenerated]);

  const handleDownload = () => {
    if (!dataURL) return;
    const link = document.createElement('a');
    link.download = `${downloadFilename}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = async () => {
    if (!dataURL) return;
    try {
      const response = await fetch(dataURL);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      try {
        await navigator.clipboard.writeText(dataURL);
      } catch (fallbackErr) {
        console.error('Failed to copy data URL to clipboard:', fallbackErr);
      }
    }
  };

  const handlePrint = () => {
    if (!dataURL) return;
    const confirmed = window.confirm(
      `Print QR Code?\n\nContent: ${
        value.length > 100 ? value.substring(0, 100) + '...' : value
      }\n\nClick OK to print or Cancel to abort.`
    );
    if (!confirmed) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code</title>
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
            <img src="${dataURL}" alt="QR Code" class="qr-image" />
            <div class="print-info">
              Generated on: ${new Date().toLocaleDateString()}<br>
              Content: ${
                value.length > 50 ? value.substring(0, 50) + '...' : value
              }
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  useEffect(() => {
    if (value) {
      generateQRCode();
    }
  }, [generateQRCode, value]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: '#f5f5f5',
          ...style,
        }}
        className={className}
      >
        <Typography
          variant="caption"
          color="error"
          sx={{ textAlign: 'center', padding: 1 }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  if (!value) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          border: '1px dashed #ccc',
          borderRadius: 1,
          backgroundColor: '#f9f9f9',
          ...style,
        }}
        className={className}
      >
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ textAlign: 'center', padding: 1 }}
        >
          No data provided
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'inline-block',
        position: 'relative',
        ...style,
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: 4,
          display: 'block',
          width: size,
          height: size,
        }}
      />

      {showActions && dataURL && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Tooltip title="Download QR Code">
            <IconButton
              size="small"
              onClick={handleDownload}
              sx={{
                backgroundColor: theme.Colors.primary,
                color: 'white',
                '&:hover': { backgroundColor: theme.Colors.primaryDarkStart },
                width: 28,
                height: 28,
              }}
            >
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Copy to Clipboard">
            <IconButton
              size="small"
              onClick={handleCopyToClipboard}
              sx={{
                backgroundColor: theme.Colors.graySecondary,
                color: 'white',
                '&:hover': { backgroundColor: theme.Colors.blackSecondary },
                width: 28,
                height: 28,
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Print QR Code">
            <IconButton
              size="small"
              onClick={handlePrint}
              sx={{
                backgroundColor: theme.Colors.dustyGray,
                color: 'white',
                '&:hover': { backgroundColor: theme.Colors.grayBorderFrame },
                width: 28,
                height: 28,
              }}
            >
              <Print fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default SimpleQRCode;
