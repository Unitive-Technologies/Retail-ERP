import Grid from '@mui/material/Grid2';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { sectionContainerStyle } from '@components/CommonStyles';
import { Box, useTheme } from '@mui/material';
import MUHTypography from '@components/MUHTypography';
import { LandingAppbarLogo, ProjectNameLogo, Logo } from '@assets/Images';
import { ButtonComponent, SimpleQRCode } from '@components/index';
import { useState, useMemo } from 'react';

type Props = {
  edit: any;
  product_id?: number;
};

const GRADIENT_BG = `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`;

const QRCodeSection = ({ edit, product_id }: Props) => {
  const theme = useTheme();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  const productName = edit?.getValue('product_name') || '';
  const skuId = edit?.getValue('sku_id') || '';
  const productId = edit?.getValue('id') || '';

  const hasProductData = productName.trim() !== '' || skuId.trim() !== '';

  const qrData = useMemo(() => {
    if (!hasProductData) {
      return '';
    }
    console.log(
      'Generating QR data for product:',
      product_id,
      'SKU ID:',
      skuId
    );
    // Build the URL for QR code
    const baseUrl = '';
    if (product_id && skuId) {
      return `${baseUrl}?product_id=${product_id}&skuId=${skuId}`;
    } else if (skuId) {
      return `${baseUrl}?skuId=${skuId}`;
    } else {
      return '';
    }
  }, [product_id, skuId, hasProductData]);

  // Convert image to base64
  const getImageDataURL = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  // Print functionality
  // const handlePrintTag = async () => {
  //   if (!hasProductData) {
  //     alert(
  //       'Please enter product name or SKU ID to generate QR code for printing'
  //     );
  //     return;
  //   }

  //   if (!qrCodeDataURL) {
  //     alert('Please wait for QR code to generate before printing');
  //     return;
  //   }

  //   const printWindow = window.open('', '_blank');
  //   if (!printWindow) {
  //     alert('Please allow pop-ups to enable printing');
  //     return;
  //   }

  //   try {
  //     const [landingLogoDataURL, projectLogoDataURL] = await Promise.all([
  //       getImageDataURL(LandingAppbarLogo),
  //       getImageDataURL(Logo), // Your vertical logo (preferably black logo PNG with transparent background)
  //     ]);

  //     const printContent = `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <title>Product Tag - ${productName}</title>
  //       <style>
  //         * {
  //           margin: 0;
  //           padding: 0;
  //           box-sizing: border-box;
  //         }

  //         @media print {
  //           @page {
  //             size: 92mm 15mm;
  //             margin: 0;
  //           }
  //           html, body {
  //             width: 92mm;
  //             height: 15mm;
  //             overflow: hidden;
  //             -webkit-print-color-adjust: exact;
  //             print-color-adjust: exact;
  //           }
  //         }

  //         html, body {
  //           width: 92mm;
  //           height: 15mm;
  //           background: white;
  //           font-family: 'Roboto', Arial, sans-serif;
  //           display: flex;
  //           align-items: center;
  //           justify-content: center;
  //         }

  //         .tag-container {
  //           display: flex;
  //           flex-direction: row;
  //           align-items: center;
  //           width: 90mm;
  //           height: 13mm;
  //           padding: 1mm;
  //         }

  //         .qr-wrapper {
  //           display: flex;
  //           flex-direction: row;
  //           align-items: center;
  //         }

  //         .qr-section {
  //           width: 13mm;
  //           height: 13mm;
  //           border-radius: 1mm 0 0 1mm;
  //           overflow: hidden;
  //           background: #fff;
  //         }

  //         .qr-code {
  //           width: 100%;
  //           height: 100%;
  //           object-fit: contain;
  //         }

  //         /* Black strip with inverted (white) logo for thermal printer */
  //         .logo-strip {
  //           width: 5mm;
  //           height: 13mm;
  //           background: #000000; /* solid black */
  //           display: flex;
  //           align-items: center;
  //           justify-content: center;
  //           border-radius: 0 1mm 1mm 0;
  //         }

  //         .logo-strip img {
  //           width: 2.5mm; /* smaller and centered */
  //           height: 2.5mm;
  //           object-fit: contain;
  //           filter: invert(1) brightness(1.3); /* makes dark logo white */
  //         }

  //         /* Product information text */
  //         .info-section {
  //           margin-left: 5mm; /* shifted 2mm left for better balance */
  //           display: flex;
  //           flex-direction: column;
  //           justify-content: center;
  //           line-height: 1.2;
  //         }

  //         .product-name {
  //           font-size: 7pt;
  //           font-weight: 600;
  //           color: #000;
  //           white-space: nowrap;
  //           overflow: hidden;
  //           text-overflow: ellipsis;
  //         }

  //         .sku-id {
  //           font-size: 6pt;
  //           font-weight: 500;
  //           color: #000;
  //           margin-top: 0.5mm;
  //         }

  //         .gross-weight {
  //           font-size: 6pt;
  //           font-weight: 500;
  //           color: #000;
  //           margin-top: 0.5mm;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="tag-container">
  //         <div class="qr-wrapper">
  //           <div class="qr-section">
  //             <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code" />
  //           </div>
  //           <div class="logo-strip">
  //             <img src="${projectLogoDataURL}" alt="Project Logo" />
  //           </div>
  //         </div>
  //         <div class="info-section">
  //           <div class="product-name">${productName}</div>
  //           <div class="sku-id">SKU : ${skuId}</div>
  //         </div>
  //       </div>
  //     </body>
  //   </html>
  //   `;

  //     printWindow.document.write(printContent);
  //     printWindow.document.close();

  //     printWindow.onload = () => {
  //       setTimeout(() => {
  //         printWindow.print();
  //         printWindow.close();
  //       }, 800);
  //     };
  //   } catch (error) {
  //     console.error('Error converting images for print:', error);
  //   }
  // };
  //   const handlePrintTag = async () => {
  //     if (!hasProductData) {
  //       alert(
  //         'Please enter product name or SKU ID to generate QR code for printing'
  //       );
  //       return;
  //     }

  //     if (!qrCodeDataURL) {
  //       alert('Please wait for QR code to generate before printing');
  //       return;
  //     }

  //     const printWindow = window.open('', '_blank');
  //     if (!printWindow) {
  //       alert('Please allow pop-ups to enable printing');
  //       return;
  //     }

  //     const getImageDataURL = (src: string): Promise<string> => {
  //       return new Promise((resolve, reject) => {
  //         const img = new Image();
  //         img.crossOrigin = 'anonymous';
  //         img.onload = () => {
  //           const canvas = document.createElement('canvas');
  //           canvas.width = img.width;
  //           canvas.height = img.height;
  //           const ctx = canvas.getContext('2d');
  //           if (!ctx) {
  //             reject('Canvas 2D context not available');
  //             return;
  //           }
  //           ctx.drawImage(img, 0, 0);
  //           resolve(canvas.toDataURL('image/png'));
  //         };
  //         img.onerror = reject;
  //         img.src = src;
  //       });
  //     };

  //     try {
  //       const projectLogoDataURL = await getImageDataURL(Logo);

  //       const printContent = `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <title>Product Tag - ${productName}</title>
  //       <style>
  //         * {
  //           margin: 0;
  //           padding: 0;
  //           box-sizing: border-box;
  //         }

  //         @media print {
  //           @page {
  //             size: 92mm 15mm;
  //             margin: 0;
  //           }
  //           html, body {
  //             width: 92mm;
  //             height: 15mm;
  //             overflow: hidden;
  //             -webkit-print-color-adjust: exact;
  //             print-color-adjust: exact;
  //           }
  //         }

  //         html, body {
  //           width: 92mm;
  //           height: 15mm;
  //           background: #fff;
  //           font-family: 'Roboto', Arial, sans-serif;
  //           display: flex;
  //           align-items: center;
  //           justify-content: center;
  //         }

  //         .tag-container {
  //           display: flex;
  //           align-items: center;
  //           justify-content: flex-start;
  //           width: 90mm;
  //           height: 13mm;
  //           padding: 1mm 1.5mm;
  //         }

  //         /* Enlarged QR section */
  //         .qr-section {
  //           display: flex;
  //           align-items: center;
  //           justify-content: center;
  //           width: 20mm;
  //           height: 20mm;
  //         }

  //         .qr-code {
  //           width: 16mm; /* enlarged for reliable scanning */
  //           height: 16mm;
  //           object-fit: contain;
  //           image-rendering: pixelated; /* crisper for QR */
  //         }

  //         /* Divider */
  //         .divider {
  //           border-left: 0.3mm dashed #000;
  //           height: 12mm;
  //           margin: 0 2mm;
  //         }

  //         /* Info section */
  //         .info-section {
  //           flex: 1;
  //           display: flex;
  //           flex-direction: column;
  //           justify-content: flex-start;
  //           height: 13mm;
  //         }

  //         .text-group {
  //           display: flex;
  //           flex-direction: column;
  //           justify-content: flex-start;
  //           line-height: 1.3;
  //           margin-bottom: 0.6mm;
  //         }

  //         .product-name {
  //           font-size: 8pt;
  //           font-weight: 600;
  //           color: #000;
  //           white-space: normal;
  //           line-height: 1.2;
  //           word-break: break-word;
  //           max-width: 60mm;
  //         }

  //         .sku-id {
  //           font-size: 7pt;
  //           font-weight: 500;
  //           color: #000;
  //           margin-top: 0.4mm;
  //         }

  //   .logo-section {
  //     margin-top: 0.4mm; /* moved up ~2px from 0.6mm */
  //     display: flex;
  //     justify-content: flex-start; /* aligned left under SKU */
  //     align-items: center;
  //   }

  // .logo-section img {
  //   width: 6mm; /* reduced from 20mm */
  //   height: auto;
  //   object-fit: contain;
  //   image-rendering: crisp-edges;
  //   -webkit-print-color-adjust: exact;
  //   print-color-adjust: exact;
  //   filter: brightness(55%) contrast(280%) saturate(0%) drop-shadow(0.15mm 0.15mm 0.1mm black);
  // }

  //       </style>
  //     </head>
  //     <body>
  //       <div class="tag-container">
  //         <div class="qr-section">
  //           <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code" />
  //         </div>

  //         <div class="divider"></div>

  //         <div class="info-section">
  //           <div class="text-group">
  //             <div class="product-name">${productName}</div>
  //             <div class="sku-id">SKU : ${skuId}</div>
  //           </div>

  //           <div class="logo-section">
  //             <img src="${projectLogoDataURL}" alt="Logo" />
  //           </div>
  //         </div>
  //       </div>
  //     </body>
  //   </html>
  //       `;

  //       printWindow.document.write(printContent);
  //       printWindow.document.close();

  //       printWindow.onload = () => {
  //         setTimeout(() => {
  //           printWindow.print();
  //           printWindow.close();
  //         }, 800);
  //       };
  //     } catch (error) {
  //       console.error('Error converting images for print:', error);
  //     }
  //   };
  //   const handlePrintTag = async () => {
  //     if (!hasProductData) {
  //       alert(
  //         'Please enter product name or SKU ID to generate QR code for printing'
  //       );
  //       return;
  //     }

  //     if (!qrCodeDataURL) {
  //       alert('Please wait for QR code to generate before printing');
  //       return;
  //     }

  //     const printWindow = window.open('', '_blank');
  //     if (!printWindow) {
  //       alert('Please allow pop-ups to enable printing');
  //       return;
  //     }

  //     // Convert image to Base64
  //     const getImageDataURL = (src: string): Promise<string> => {
  //       return new Promise((resolve, reject) => {
  //         const img = new Image();
  //         img.crossOrigin = 'anonymous';
  //         img.onload = () => {
  //           const canvas = document.createElement('canvas');
  //           canvas.width = img.width;
  //           canvas.height = img.height;
  //           const ctx = canvas.getContext('2d');
  //           if (!ctx) {
  //             reject('Canvas 2D context not available');
  //             return;
  //           }
  //           ctx.drawImage(img, 0, 0);
  //           resolve(canvas.toDataURL('image/png'));
  //         };
  //         img.onerror = reject;
  //         img.src = src;
  //       });
  //     };

  //     try {
  //       const projectLogoDataURL = await getImageDataURL(Logo); // same logo used, cropped visually by CSS

  //       const printContent = `
  // <!DOCTYPE html>
  // <html>
  //   <head>
  //     <title>Product Tag - ${productName}</title>
  //     <style>
  //       * {
  //         margin: 0;
  //         padding: 0;
  //         box-sizing: border-box;
  //       }

  //       @media print {
  //         @page {
  //           size: 92mm 15mm;
  //           margin: 0;
  //         }
  //         html, body {
  //           width: 92mm;
  //           height: 15mm;
  //           overflow: hidden;
  //           -webkit-print-color-adjust: exact;
  //           print-color-adjust: exact;
  //         }
  //       }

  //       html, body {
  //         width: 92mm;
  //         height: 15mm;
  //         background: #fff;
  //         font-family: 'Roboto', Arial, sans-serif;
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //       }

  //       .tag-container {
  //         display: flex;
  //         align-items: center;
  //         justify-content: flex-start;
  //         width: 90mm;
  //         height: 13mm;
  //         padding: 1mm 1.5mm;
  //       }

  //       /* Left: QR code */
  //       .qr-section {
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         width: 20mm;
  //         height: 20mm;
  //       }

  //       .qr-code {
  //         width: 16mm;
  //         height: 16mm;
  //         object-fit: contain;
  //         image-rendering: pixelated;
  //       }

  //       /* Divider */
  //       .divider {
  //         border-left: 0.3mm dashed #000;
  //         height: 12mm;
  //         margin: 0 2mm;
  //       }

  //       /* Right: Product info + logo text */
  //       .info-section {
  //         flex: 1;
  //         display: flex;
  //         flex-direction: column;
  //         justify-content: flex-start;
  //         height: 13mm;
  //       }

  //       .text-group {
  //         display: flex;
  //         flex-direction: column;
  //         justify-content: flex-start;
  //         line-height: 1.3;
  //         margin-bottom: 0.6mm;
  //       }

  //       .product-name {
  //         font-size: 8pt;
  //         font-weight: 600;
  //         color: #000;
  //         white-space: normal;
  //         line-height: 1.2;
  //         word-break: break-word;
  //         max-width: 60mm;
  //       }

  //       .sku-id {
  //         font-size: 7pt;
  //         font-weight: 500;
  //         color: #000;
  //         margin-top: 0.4mm;
  //       }

  //       /* Logo section - show only text (hide icon via CSS crop) */
  //       .logo-section {
  //         margin-top: 0.4mm;
  //         display: flex;
  //         justify-content: flex-start;
  //         align-items: center;
  //       }

  //       .logo-section img {
  //         width: 22mm;
  //         height: auto;
  //         object-fit: cover;
  //         object-position: 60% center; /* Focus on text part (right side of logo) */
  //         clip-path: inset(0 0 0 38%); /* Crop about 38% from left to remove icon */
  //         image-rendering: crisp-edges;
  //         -webkit-print-color-adjust: exact;
  //         print-color-adjust: exact;

  //         /* Darken + sharpen for thermal printing */
  //         filter: brightness(55%) contrast(280%) saturate(0%) drop-shadow(0.15mm 0.15mm 0.1mm black);
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div class="tag-container">
  //       <!-- Left: QR -->
  //       <div class="qr-section">
  //         <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code" />
  //       </div>

  //       <!-- Divider -->
  //       <div class="divider"></div>

  //       <!-- Right: Text and Logo -->
  //       <div class="info-section">
  //         <div class="text-group">
  //           <div class="product-name">${productName}</div>
  //           <div class="sku-id">SKU : ${skuId}</div>
  //         </div>

  //         <!-- Logo Text Only (icon hidden by CSS crop) -->
  //         <div class="logo-section">
  //           <img src="${projectLogoDataURL}" alt="Logo Text Only" />
  //         </div>
  //       </div>
  //     </div>
  //   </body>
  // </html>
  //     `;

  //       printWindow.document.write(printContent);
  //       printWindow.document.close();

  //       printWindow.onload = () => {
  //         setTimeout(() => {
  //           printWindow.print();
  //           printWindow.close();
  //         }, 800);
  //       };
  //     } catch (error) {
  //       console.error('Error converting images for print:', error);
  //     }
  //   };
  const handlePrintTag = async () => {
    if (!hasProductData) {
      alert(
        'Please enter product name or SKU ID to generate QR code for printing'
      );
      return;
    }

    if (!qrCodeDataURL) {
      alert('Please wait for QR code to generate before printing');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to enable printing');
      return;
    }

    const getImageDataURL = (src: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('Canvas 2D context not available');
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      const projectLogoDataURL = await getImageDataURL(Logo);

      const itemDetails = edit?.getValue('item_details') || [];
      const firstItem = itemDetails.length > 0 ? itemDetails[0] : null;

      let measurementText = '';
      if (
        firstItem?.measurement_details &&
        firstItem.measurement_details?.length > 0
      ) {
        const firstMeasurement = firstItem?.measurement_details[0];
        const labelName = firstMeasurement?.label_name || '';
        const value = firstMeasurement?.value || '';
        const measurementType = firstMeasurement?.measurement_type;

        if (labelName && value) {
          const shortLabel = labelName?.substring(0, 4);
          const measurementTypeLabel =
            measurementType?.label || measurementType || '';
          const shortMeasurementType =
            typeof measurementTypeLabel === 'string' &&
            measurementTypeLabel.trim() !== ''
              ? measurementTypeLabel?.substring(0, 2)
              : '';
          measurementText = `${shortLabel}: ${value}${shortMeasurementType ? ` ${shortMeasurementType}` : ''}`;
        }
      }

      const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Product Tag - ${productName}</title>
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
            background: #fff;
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

          .divider {
            // border-left: 0.3mm dashed #000;
            height: 12mm;
            margin: 0 2mm;
          }

          .info-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            height: 13mm;
          }

          .text-group {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            line-height: 1.3;
            margin-bottom: 0.6mm;
          }

          .product-name {
            font-size: 6pt;
            font-weight: 600;
            color: #000;
            white-space: normal;
            line-height: 1.2;
            word-break: break-word;
            max-width: 60mm;
          }

          .sku-id {
            font-size: 6pt;
            font-weight: 500;
            color: #000;
            margin-top: 0.4mm;
          }

          /* CHANEIRA JEWELS section */
          .logo-section {
            // margin-top: 0.1mm;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 1mm;
          }

          .logo-section img {
            width: 7mm;
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
            font-size: 6pt;
            font-weight: 700;
            letter-spacing: 0.3px;
            color: #000;
          }

          .brand-subname {
            font-size: 5pt;
            font-weight: 500;
            color: #000;
            letter-spacing: 0.3px;
          }
        </style>
      </head>
      <body>
        <div class="tag-container">
          <div class="qr-section">
            ${measurementText ? `<div class="size-text">${measurementText}</div>` : ''}
            <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code" />
          </div>

          <div class="divider"></div>

          <div class="info-section">
            <div class="text-group">
              <div class="product-name">${productName}</div>
              <div class="sku-id">${skuId}</div>
            </div>

            <div class="logo-section">
              <img src="${projectLogoDataURL}" alt="Logo" />
              <div class="logo-text">
                <div class="brand-name">CHANEIRA</div>
                <div class="brand-subname">JEWELS</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 800);
      };
    } catch (error) {
      console.error('Error converting images for print:', error);
    }
  };

  return (
    <Grid>
      <FormSectionHeader title="QR Code" />
      <Grid container gap={2} sx={sectionContainerStyle}>
        <Grid
          container
          sx={{
            border: `1px solid ${theme.Colors.grayBorder}`,
            p: 1.5,
            gap: 1.5,
            width: '100%',
            borderRadius: '8px',
            alignItems: 'center',
            minHeight: '110px',
          }}
        >
          <Grid
            sx={{
              width: '110px',
              height: '110px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fafafa',
              borderRadius: '6px',
              p: 0.5,
              flexShrink: 0,
            }}
          >
            {hasProductData ? (
              <SimpleQRCode
                value={qrData}
                size={100}
                showActions={false}
                onGenerated={(dataURL) => {
                  setQrCodeDataURL(dataURL);
                  console.log(
                    'QR Code generated for product:',
                    productName,
                    'DataURL length:',
                    dataURL.length
                  );
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px dashed #ccc',
                  borderRadius: '6px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <MUHTypography
                    text="QR"
                    size="12px"
                    weight={600}
                    sx={{ color: '#999' }}
                  />
                </Box>
                <MUHTypography
                  text="Enter product details"
                  size="9px"
                  sx={{
                    color: '#999',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                />
              </Box>
            )}
          </Grid>
          <Grid
            container
            sx={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              height: '110px',
              pl: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                pt: 0.5,
              }}
            >
              <MUHTypography
                text={productName || 'Product Name'}
                family={theme.fontFamily.roboto}
                weight={600}
                size={'15px'}
                sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  mb: 0.5,
                  color: productName ? '#333333' : '#999999',
                  lineHeight: 1.3,
                  fontStyle: productName ? 'normal' : 'italic',
                }}
              />
              <MUHTypography
                text={skuId ? `SKU ID : ${skuId}` : 'SKU ID : Not entered'}
                size={'13px'}
                family={theme.fontFamily.roboto}
                sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  color: skuId ? '#666666' : '#999999',
                  lineHeight: 1.3,
                  fontStyle: skuId ? 'normal' : 'italic',
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '5px',
                  background: GRADIENT_BG,
                  p: 0.5,
                  gap: 0.3,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={LandingAppbarLogo}
                  width={18}
                  height={18}
                  alt="Logo"
                />
                <img
                  src={ProjectNameLogo}
                  width={32}
                  height={12}
                  alt="Project Name"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid width={'100%'} sx={{ zIndex: 1 }}>
          <ButtonComponent
            buttonText={
              hasProductData ? 'Print Tag' : 'Enter Product Details to Print'
            }
            btnHeight={35}
            buttonFontSize={14}
            buttonFontWeight={500}
            bgColor={hasProductData ? theme.Colors.primary : '#cccccc'}
            btnBorderRadius={2}
            onClick={handlePrintTag}
            disabled={!hasProductData}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QRCodeSection;
