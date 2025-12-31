import Grid from '@mui/material/Grid2';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import MUHDialogComp from '@components/MUHDialogComp';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { sectionContainerStyle } from '@components/CommonStyles';
import MUHRadioGroupComponent from '@components/ProjectCommon/MUHRadioGroupComponent';
import MUHTypography from '@components/MUHTypography';
import WithVariationSection from './WithVariationSection';
import VariationFormSection from './VariationFormSection';
import { ExpandMore } from '@mui/icons-material';
import { VARIATION_TYPE } from '@constants/Constance';
import { ButtonComponent, SimpleQRCode } from '@components/index';
import { PrintTagIcon } from '@assets/Images/AdminImages';
import { ProjectNameLogo, Logo } from '@assets/Images';
import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const commonExpandStyle = {
  height: '-webkit-fill-available',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F4F4F4',
};

const titlesyle = {
  whiteSpace: 'nowrap',
  overflow: 'scroll',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
};

type Props = {
  edit: any;
  fieldErrors?: any;
  handleErrorUpdate?: (fieldKey: any) => void;
  purchaseRecord?: Record<string, any> | null;
};

const options = [
  { label: 'Without Variations', value: 'Without Variations' },
  { label: 'With Variations', value: 'With Variations' },
];

const toNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const formatCurrency = (value: number, fractionDigits = 2) =>
  value.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

const getRatePerGram = (purchaseRecord?: Record<string, any> | null) => {
  if (!purchaseRecord) return null;
  const rawValue =
    purchaseRecord.rate_per_g ??
    purchaseRecord.material_price_per_g ??
    purchaseRecord.material_price ??
    purchaseRecord.rate_per_gram ??
    null;
  return toNumber(rawValue);
};

const ItemDetailsSection: React.FC<Props> = ({
  edit,
  fieldErrors,
  handleErrorUpdate,
  purchaseRecord,
}) => {
  const theme = useTheme();
  const itemDetails = edit.getValue('item_details');
  const productType = edit.getValue('product_type');
  const variationType = edit.getValue('variation_type');
  const productName = edit.getValue('product_name');
  const refNoId = edit.getValue('ref_no_id')?.value;
  const materialType = edit.getValue('material_type_id')?.value;
  const firstItemNetWeight = toNumber(itemDetails?.[0]?.net_weight);
  const ratePerGramValue = getRatePerGram(purchaseRecord);
  const purchaseRatePerGramText =
    ratePerGramValue === null
      ? null
      : `Purchase Rate : ₹${formatCurrency(
          ratePerGramValue * (firstItemNetWeight ?? 0)
        )}`;
  const getPurchaseRateText = (netWeight: any) => {
    if (ratePerGramValue === null) return '-';
    const netWeightValue = toNumber(netWeight);
    if (netWeightValue === null) return '-';
    const amount = ratePerGramValue * netWeightValue;
    return `₹${formatCurrency(amount)}`;
  };
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const generateQRData = useCallback((item: any) => {
    // Generate QR data containing item details (without timestamp to keep it stable)
    console.log('Generating QR data for item:', item);
    const data = {
      sku_id: item.sku_id,
    };

    return JSON.stringify(data);
  }, []);

  const handlePrintTag = (item: any) => {
    setSelectedItem(item);
    setShowQRModal(true);
  };

  // const handlePrintQR = async () => {
  //   if (!selectedItem) return;

  //   const printWindow = window.open('', '_blank');
  //   if (!printWindow) return;

  //   // Try to get QR from existing canvas
  //   const qrCanvas = document.querySelector('canvas') as HTMLCanvasElement;
  //   let qrImageSrc = '';

  //   if (qrCanvas) {
  //     qrImageSrc = qrCanvas.toDataURL();
  //   } else {
  //     // Fallback: generate QR programmatically
  //     try {
  //       const QRCodeLib = await import('qrcode');
  //       const qrData = generateQRData(selectedItem);
  //       qrImageSrc = await QRCodeLib.default.toDataURL(qrData, {
  //         width: 200,
  //         margin: 2,
  //         color: {
  //           dark: '#000000',
  //           light: '#ffffff',
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Failed to generate QR code for printing:', error);
  //       return;
  //     }
  //   }

  //   // Convert logo to base64 for printing
  //   fetch(Logo)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const logoBase64 = reader.result as string;
  //         generatePrintContent(logoBase64);
  //       };
  //       reader.onerror = () => {
  //         generatePrintContent('');
  //       };
  //       reader.readAsDataURL(blob);
  //     })
  //     .catch(() => {
  //       generatePrintContent('');
  //     });

  //   function generatePrintContent(logoDataUrl = '') {
  //     if (!printWindow) return;
  //     printWindow.document.write(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Product Tag - ${selectedItem.sku_id}</title>
  //         <style>
  //           * {
  //             margin: 0;
  //             padding: 0;
  //             box-sizing: border-box;
  //           }

  //           @media print {
  //             @page {
  //               size: 92mm 15mm;
  //               margin: 0;
  //             }
  //             html, body {
  //               width: 92mm;
  //               height: 15mm;
  //               overflow: hidden;
  //               -webkit-print-color-adjust: exact;
  //               print-color-adjust: exact;
  //             }
  //           }

  //           html, body {
  //             width: 92mm;
  //             height: 15mm;
  //             background: white;
  //             font-family: 'Roboto', Arial, sans-serif;
  //             display: flex;
  //             align-items: center;
  //             justify-content: center;
  //           }

  //           .tag-container {
  //             display: flex;
  //             align-items: center;
  //             justify-content: flex-start;
  //             width: 90mm;
  //             height: 13mm;
  //             padding: 1mm 1.5mm;
  //           }

  //           /* QR Section */
  //           .qr-section {
  //             width: 25mm;
  //             height: 25mm;
  //             display: flex;
  //             align-items: center;
  //             justify-content: center;
  //           }
  //    .qr-code {
  //             width: 13mm;
  //             height: 13mm;
  //             object-fit: contain;
  //             image-rendering: pixelated;
  //           }

  //           /* Info Section */
  //           .info-section {
  //             flex: 1;
  //             display: flex;
  //             flex-direction: column;
  //             justify-content: flex-start;

  //           }

  //           .product-name {
  //             font-size: 6pt;
  //             font-weight: 600;
  //             color: #000;
  //             white-space: nowrap;
  //             overflow: hidden;
  //             text-overflow: ellipsis;
  //           }

  //           .sku-id {
  //             font-size: 5pt;
  //             font-weight: 500;
  //             color: #000;
  //             margin-top: 0.4mm;
  //           }

  //           /* CHANEIRA JEWELS section */
  //           .logo-section {
  //             margin-top: 1mm;
  //             display: flex;
  //             align-items: center;
  //             justify-content: flex-start;
  //             gap: 1mm;
  //           }

  //           .logo-section img {
  //             width: 8mm;
  //             height: auto;
  //             object-fit: contain;
  //             image-rendering: crisp-edges;
  //             -webkit-print-color-adjust: exact;
  //             print-color-adjust: exact;
  //             filter: brightness(55%) contrast(280%) saturate(0%) drop-shadow(0.15mm 0.15mm 0.1mm black);
  //           }

  //           .logo-text {
  //             display: flex;
  //             flex-direction: column;
  //             line-height: 1.1;
  //           }

  //           .brand-name {
  //             font-size: 6.5pt;
  //             font-weight: 700;
  //             letter-spacing: 0.3px;
  //             color: #000;
  //           }

  //           .brand-subname {
  //             font-size: 5.5pt;
  //             font-weight: 500;
  //             color: #000;
  //             letter-spacing: 0.3px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="tag-container">
  //           <!-- QR Code -->
  //           <div class="qr-section">
  //             <img src="${qrImageSrc}" alt="QR Code" class="qr-code" />
  //           </div>

  //           <!-- Product Info + Logo -->
  //           <div class="info-section">
  //             <div class="product-name">${productName} - ${selectedItem.combination}</div>
  //             <div class="sku-id">SKU : ${selectedItem.sku_id}</div>

  //             <div class="logo-section">
  //               <img src="${logoDataUrl}" alt="Logo" />
  //               <div class="logo-text">
  //                 <div class="brand-name">CHANEIRA</div>
  //                 <div class="brand-subname">JEWELS</div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `);

  //     printWindow?.document.close();
  //     printWindow?.focus();

  //     setTimeout(() => {
  //       printWindow?.print();
  //       printWindow?.close();
  //     }, 500);
  //   }
  // };
  // const handlePrintQR = async () => {
  //   if (!selectedItem) return;

  //   const printWindow = window.open('', '_blank');
  //   if (!printWindow) return;

  //   // Try to get QR from existing canvas
  //   const qrCanvas = document.querySelector('canvas') as HTMLCanvasElement;
  //   let qrImageSrc = '';

  //   if (qrCanvas) {
  //     qrImageSrc = qrCanvas.toDataURL();
  //   } else {
  //     // Fallback: generate QR programmatically
  //     try {
  //       const QRCodeLib = await import('qrcode');
  //       const qrData = generateQRData(selectedItem);
  //       qrImageSrc = await QRCodeLib.default.toDataURL(qrData, {
  //         width: 200,
  //         margin: 2,
  //         color: {
  //           dark: '#000000',
  //           light: '#ffffff',
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Failed to generate QR code for printing:', error);
  //       return;
  //     }
  //   }

  //   // Convert logo to base64 for printing
  //   fetch(Logo)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const logoBase64 = reader.result as string;
  //         generatePrintContent(logoBase64);
  //       };
  //       reader.onerror = () => {
  //         generatePrintContent('');
  //       };
  //       reader.readAsDataURL(blob);
  //     })
  //     .catch(() => {
  //       generatePrintContent('');
  //     });

  //   function generatePrintContent(logoDataUrl = '') {
  //     if (!printWindow) return;
  //     printWindow.document.write(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Product Tag - ${selectedItem.sku_id}</title>
  //         <style>
  //           * {
  //             margin: 0;
  //             padding: 0;
  //             box-sizing: border-box;
  //           }

  //           @media print {
  //             @page {
  //               size: 92mm 15mm;
  //               margin: 0;
  //             }
  //             html, body {
  //               width: 92mm;
  //               height: 15mm;
  //               overflow: hidden;
  //               -webkit-print-color-adjust: exact;
  //               print-color-adjust: exact;
  //             }
  //           }

  //           html, body {
  //             width: 92mm;
  //             height: 15mm;
  //             background: white;
  //             font-family: 'Roboto', Arial, sans-serif;
  //             display: flex;
  //             align-items: center;
  //             justify-content: center;
  //           }

  //           .tag-container {
  //             display: flex;
  //             align-items: center;
  //             justify-content: flex-start;
  //             width: 90mm;
  //             height: 13mm;
  //             padding: 1mm 1.5mm;
  //           }

  //           /* QR Section */
  //           .qr-section {
  //             width: 25mm;
  //             display: flex;
  //             flex-direction: column;
  //             align-items: center;
  //             justify-content: center;
  //           }

  //           .qr-code {
  //             width: 13mm;
  //             height: 13mm;
  //             object-fit: contain;
  //             image-rendering: pixelated;
  //           }

  //           .size-text {
  //             font-size: 5pt;
  //             font-weight: 600;
  //             color: #000;
  //             margin-top: 0.5mm;
  //             text-align: center;
  //             letter-spacing: 0.3px;
  //           }

  //           /* Info Section */
  //           .info-section {
  //             flex: 1;
  //             display: flex;
  //             flex-direction: column;
  //             justify-content: flex-start;
  //           }

  //           .product-name {
  //             font-size: 6pt;
  //             font-weight: 600;
  //             color: #000;
  //             white-space: nowrap;
  //             overflow: hidden;
  //             text-overflow: ellipsis;
  //           }

  //           .sku-id {
  //             font-size: 5pt;
  //             font-weight: 500;
  //             color: #000;
  //             margin-top: 0.4mm;
  //           }

  //           /* CHANEIRA JEWELS section */
  //           .logo-section {
  //             margin-top: 1mm;
  //             display: flex;
  //             align-items: center;
  //             justify-content: flex-start;
  //             gap: 1mm;
  //           }

  //           .logo-section img {
  //             width: 8mm;
  //             height: auto;
  //             object-fit: contain;
  //             image-rendering: crisp-edges;
  //             -webkit-print-color-adjust: exact;
  //             print-color-adjust: exact;
  //             filter: brightness(55%) contrast(280%) saturate(0%) drop-shadow(0.15mm 0.15mm 0.1mm black);
  //           }

  //           .logo-text {
  //             display: flex;
  //             flex-direction: column;
  //             line-height: 1.1;
  //           }

  //           .brand-name {
  //             font-size: 6.5pt;
  //             font-weight: 700;
  //             letter-spacing: 0.3px;
  //             color: #000;
  //           }

  //           .brand-subname {
  //             font-size: 5.5pt;
  //             font-weight: 500;
  //             color: #000;
  //             letter-spacing: 0.3px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="tag-container">
  //           <!-- QR Code -->
  //           <div class="qr-section">
  //             <img src="${qrImageSrc}" alt="QR Code" class="qr-code" />
  //             <div class="size-text">SIZE: ${selectedItem.size || '2'}</div>
  //           </div>

  //           <!-- Product Info + Logo -->
  //           <div class="info-section">
  //             <div class="product-name">${productName} - ${selectedItem.combination}</div>
  //             <div class="sku-id">SKU : ${selectedItem.sku_id}</div>

  //             <div class="logo-section">
  //               <img src="${logoDataUrl}" alt="Logo" />
  //               <div class="logo-text">
  //                 <div class="brand-name">CHANEIRA</div>
  //                 <div class="brand-subname">JEWELS</div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `);

  //     printWindow?.document.close();
  //     printWindow?.focus();

  //     setTimeout(() => {
  //       printWindow?.print();
  //       printWindow?.close();
  //     }, 500);
  //   }
  // };
  const handlePrintQR = async () => {
    if (!selectedItem) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Always generate a fresh QR code with the correct selectedItem data
    let qrImageSrc = '';

    try {
      const QRCodeLib = await import('qrcode');
      const qrData = generateQRData(selectedItem);
      qrImageSrc = await QRCodeLib.default.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
    } catch (error) {
      console.error('Failed to generate QR code for printing:', error);
      return;
    }

    fetch(Logo)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => generatePrintContent(reader.result as string);
        reader.onerror = () => generatePrintContent('');
        reader.readAsDataURL(blob);
      })
      .catch(() => generatePrintContent(''));

    function generatePrintContent(logoDataUrl = '') {
      if (!printWindow) return;

      let measurementText = '';
      if (
        selectedItem.measurement_details &&
        selectedItem.measurement_details.length > 0
      ) {
        const firstMeasurement = selectedItem.measurement_details[0];
        const labelName = firstMeasurement.label_name || '';
        const value = firstMeasurement.value || '';
        const measurementType = firstMeasurement.measurement_type;

        if (labelName && value) {
          const shortLabel = labelName.substring(0, 4);
          const measurementTypeLabel =
            measurementType?.label || measurementType || '';
          const shortMeasurementType = measurementTypeLabel
            ? measurementTypeLabel.substring(0, 2)
            : '';
          measurementText = `${shortLabel}: ${value}${shortMeasurementType ? ` ${shortMeasurementType}` : ''}`;
        }
      }

      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Product Tag - ${selectedItem.sku_id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            @media print {
              @page {
                size: 92mm 15mm;
                margin: 0;
              }
              html, body {
                width: 92mm;
                height: 15mm;
                overflow: hidden;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }

            html, body {
              width: 92mm;
              height: 15mm;
              background: white;
              font-family: 'Roboto', Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .tag-container {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              width: 90mm;
              height: 13mm;
              padding: 1mm 1.5mm;
            }

            /* QR Section */
            .qr-section {
              width: 25mm;
              height: 14mm;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .qr-code {
              width: 13mm;
              height: 13mm;
              object-fit: contain;
              image-rendering: pixelated;
            }

            /* Rotated SIZE text on left side */
            .size-text {
              position: absolute;
              left: -1mm;
              top: 50%;
              transform: translateY(-50%) rotate(-90deg);
              transform-origin: center;
              font-size: 5pt;
              font-weight: 700;
              color: #000;
              letter-spacing: 0.3px;
              text-align: center;
              white-space: nowrap;
            }

            /* Info Section */
            .info-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              padding-left: 1mm;
            }

            .product-name {
              font-size: 6pt;
              font-weight: 600;
              color: #000;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .sku-id {
              font-size: 5pt;
              font-weight: 500;
              color: #000;
              margin-top: 0.4mm;
            }

            /* CHANEIRA JEWELS section */
            .logo-section {
              margin-top: 1mm;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              gap: 1mm;
            }

            .logo-section img {
              width: 8mm;
              height: auto;
              object-fit: contain;
              image-rendering: crisp-edges;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              filter: brightness(55%) contrast(280%) saturate(0%) drop-shadow(0.15mm 0.15mm 0.1mm black);
            }

            .logo-text {
              display: flex;
              flex-direction: column;
              line-height: 1.1;
            }

            .brand-name {
              font-size: 6.5pt;
              font-weight: 700;
              letter-spacing: 0.3px;
              color: #000;
            }

            .brand-subname {
              font-size: 5.5pt;
              font-weight: 500;
              color: #000;
              letter-spacing: 0.3px;
            }
          </style>
        </head>
        <body>
          <div class="tag-container">
            <!-- QR Code -->
            <div class="qr-section">
              ${measurementText ? `<div class="size-text">${measurementText}</div>` : ''}
              <img src="${qrImageSrc}" alt="QR Code" class="qr-code" />
            </div>

            <!-- Product Info + Logo -->
            <div class="info-section">
              <div class="product-name">${productName}</div>
              <div class="sku-id">${selectedItem.sku_id}</div>

              <div class="logo-section">
                <img src="${logoDataUrl}" alt="Logo" />
                <div class="logo-text">
                  <div class="brand-name">CHANEIRA</div>
                  <div class="brand-subname">JEWELS</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

      printWindow?.document.close();
      printWindow?.focus();

      setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
      }, 500);
    }
  };

  const handleCloseModal = () => {
    setShowQRModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Grid>
        <FormSectionHeader
          title="Item Details"
          rightContent={
            purchaseRatePerGramText &&
            variationType === VARIATION_TYPE.WITHOUT ? (
              <MUHTypography
                text={purchaseRatePerGramText}
                family={theme.fontFamily.roboto}
                weight={600}
                color={theme.Colors.primary}
              />
            ) : null
          }
        />
        <Grid
          container
          alignItems={'center'}
          gap={1}
          sx={sectionContainerStyle}
          position={'relative'}
        >
          <Grid size={4}>
            <MUHTypography
              text={productType == 1 ? 'Variations Type' : 'Product Type'}
              family={theme.fontFamily.roboto}
            />
          </Grid>
          <Grid size={'grow'}>
            <MUHRadioGroupComponent
              value={edit.getValue('variation_type')}
              options={options}
              onChange={(val) => edit.update({ variation_type: val })}
            />
          </Grid>
          {variationType == VARIATION_TYPE.WITHOUT ? (
            <VariationFormSection
              edit={edit}
              index={0}
              fieldErrors={fieldErrors}
              handleErrorUpdate={handleErrorUpdate}
              purchaseRecord={purchaseRecord}
            />
          ) : (
            <WithVariationSection edit={edit} />
          )}
          {refNoId && materialType ? null : (
            <Box
              onClick={() => {
                toast.error(
                  'Please select Ref No & Material Type before fill item details.'
                );
              }}
              sx={{
                background: 'transparent',
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
          )}
        </Grid>
      </Grid>

      {itemDetails.length > 0 && variationType == VARIATION_TYPE.WITH ? (
        <Box width={'100%'}>
          <FormSectionHeader title="Variation Products" />
          <Grid container gap={0} width={'100%'} sx={sectionContainerStyle}>
            {itemDetails.map((item: any, idx: number) => {
              const purchaseRateText = getPurchaseRateText(item?.net_weight);
              return (
                <Accordion
                  key={idx}
                  defaultExpanded
                  sx={{
                    width: '100%',
                    mb: 1.5,
                    borderRadius: '8px !important',
                    boxShadow: 'none',
                    border: '1px solid #E4E4E4',
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary
                    sx={{
                      padding: '0px !important',
                      height: '60px !important',
                      borderBottom: 'none',
                      '&.Mui-expanded': {
                        borderBottom: '1px solid #E4E4E4',
                      },
                      pl: '10px !important',
                      borderRadius: '8px',
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': { display: 'none' },
                      '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        ...commonExpandStyle,
                        borderRadius: '8px 0px 0px 8px',
                      },
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        ...commonExpandStyle,
                        borderRadius: '0px 8px 8px 0px',
                      },
                    }}
                    expandIcon={<ExpandMore />}
                  >
                    <Grid size={2.7} pr={0.8}>
                      <MUHTypography text="SKU ID :" size={13} />
                      <MUHTypography
                        text={item.sku_id}
                        color={theme.Colors.primary}
                        sx={titlesyle}
                      />
                    </Grid>

                    <Grid size={3} pr={0.8}>
                      <MUHTypography text="Variation :" size={13} />
                      <MUHTypography
                        text={item.combination}
                        color={theme.Colors.primary}
                        sx={{
                          overflow: 'scroll',
                          scrollbarWidth: 'none',
                          '&::-webkit-scrollbar': { display: 'none' },
                        }}
                      />
                    </Grid>

                    <Grid size={1.7} pr={0.8}>
                      <MUHTypography text="Total Wt." size={13} />
                      <MUHTypography
                        text={
                          item.net_weight && item.quantity
                            ? `${(Number(item.net_weight) * Number(item.quantity)).toFixed(2)} g`
                            : '-'
                        }
                        color={theme.Colors.primary}
                        sx={titlesyle}
                      />
                    </Grid>

                    <Grid size={1.5} pr={0.8}>
                      <MUHTypography text="Total Qty" size={13} />
                      <MUHTypography
                        text={item.quantity ? `${item.quantity}` : '-'}
                        color={theme.Colors.primary}
                        sx={titlesyle}
                      />
                    </Grid>

                    <Grid size={2} pr={0.8}>
                      <MUHTypography text="Purchase Rate" size={13} />
                      <MUHTypography
                        text={purchaseRateText}
                        color={theme.Colors.primary}
                        sx={titlesyle}
                      />
                    </Grid>
                    <Grid
                      container
                      size={'grow'}
                      justifyContent={'flex-end'}
                      pr={1}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintTag(item);
                        }}
                        sx={{
                          backgroundColor: theme.Colors.primary,
                          color: theme.Colors.whitePrimary,
                          borderRadius: '8px',
                          width: 36,
                          height: 38,
                          '&:hover': {
                            backgroundColor: theme.Colors.primary,
                            opacity: 0.85,
                          },
                          zIndex: 1,
                        }}
                        aria-label="Print Tag"
                      >
                        <PrintTagIcon />
                      </IconButton>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <VariationFormSection
                      edit={edit}
                      fieldErrors={fieldErrors}
                      index={idx}
                      handleErrorUpdate={handleErrorUpdate}
                      purchaseRecord={purchaseRecord}
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Grid>
        </Box>
      ) : null}

      {/* QR Code Print Modal */}
      <MUHDialogComp
        open={showQRModal}
        onClose={handleCloseModal}
        dialogTitle="Print Product Tag"
        maxWidth="sm"
        renderDialogContent={() => (
          <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
            {selectedItem && (
              <>
                {/* Header */}
                <MUHTypography
                  text="QR Code"
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: theme.Colors.black,
                    mb: 2,
                  }}
                />

                {/* Main QR + Info Card */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    p: 2,
                    backgroundColor: '#fafafa',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    gap: 2,
                  }}
                >
                  {/* Left - QR Code */}
                  <Box sx={{ flex: '0 0 auto' }}>
                    <SimpleQRCode
                      value={generateQRData(selectedItem)}
                      size={110}
                      showActions={false}
                    />
                  </Box>

                  {/* Right - Product Info + Logo Below */}
                  <Box sx={{ flex: 1 }}>
                    {/* Product Name */}
                    <MUHTypography
                      text={`${productName}${selectedItem.combination ? ` - ${selectedItem.combination}` : ''}`}
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: theme.Colors.black,
                        mb: 0.5,
                      }}
                    />

                    {/* SKU ID */}
                    <MUHTypography
                      text={`SKU ID : ${selectedItem.sku_id}`}
                      sx={{
                        fontSize: '14px',
                        color: theme.Colors.blackLightLow,
                        mb: 1.5,
                      }}
                    />

                    {/* Company Logo BELOW SKU */}
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.Colors.primary,
                        borderRadius: '6px',
                        px: 1.5,
                        py: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <img
                        src={ProjectNameLogo}
                        alt="Company Logo"
                        style={{
                          height: '18px',
                          filter: 'brightness(0) invert(1)',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Print Button */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <ButtonComponent
                    buttonText="Print Tag"
                    bgColor={theme.Colors.primary}
                    buttonTextColor={theme.Colors.whitePrimary}
                    buttonFontSize={16}
                    buttonFontWeight={500}
                    btnBorderRadius={8}
                    btnHeight={45}
                    btnWidth="100%"
                    onClick={handlePrintQR}
                    buttonStyle={{
                      fontFamily: 'Roboto-Medium',
                      textTransform: 'none',
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      />
    </>
  );
};

export default ItemDetailsSection;
