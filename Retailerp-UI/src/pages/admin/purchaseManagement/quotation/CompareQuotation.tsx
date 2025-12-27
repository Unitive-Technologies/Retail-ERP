import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Typography, useTheme, Checkbox } from '@mui/material';
import {
  columnCellStyle,
  commonTextInputProps,
  tableColumnStyle,
  tableRowStyle,
} from '@components/CommonStyles';

import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';

const CompareQuotation = () => {
  const theme = useTheme();
  const [selectedVendors, setSelectedVendors] = useState<{
    [key: string]: boolean;
  }>({});

  const handleVendorSelection = (vendorKey: string, checked: boolean) => {
    setSelectedVendors((prev) => ({ ...prev, [vendorKey]: checked }));
  };
  const handleCreate = () => {};
  const handleCancel = () => {};

  const rows = [
    {
      id: 1,
      materialType: 'Gold',
      category: 'Necklace',
      subCategory: 'Nakshtra',
      description: 'Others',
      purity: '99.9%',
      orderedWeight: '50.00',
      receivedWeight: '50',
      rate: '₹12,555.00',
      amount: '₹12,555.00',
    },
    {
      id: 2,
      materialType: 'Gold',
      category: 'Earrings',
      subCategory: 'Studs',
      description: 'Flower Design',
      purity: '99.9%',
      orderedWeight: '20.00',
      receivedWeight: '20',
      rate: '₹12,555.00',
      amount: '₹12,555.00',
    },
  ];

  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="Compare Quotation"
          titleStyle={{
            color: theme.Colors.black,
          }}
          showCreateBtn={false}
          showlistBtn={true}
          navigateUrl="/admin/purchases/quotation"
        />

        <Grid
          container
          size={12}
          sx={{
            backgroundColor: theme.Colors.whitePrimary,
            border: '1px solid #E4E4E4',
            borderRadius: '4px',
          }}
        >
          <Typography
            style={{
              fontFamily: theme.fontFamily.roboto,
              fontWeight: theme.fontWeight.mediumBold,
              fontSize: '16px',
              paddingTop: '10px',
              paddingLeft: '10px',
            }}
          >
            ITEM DETAILS
          </Typography>
          <Grid
            width="100%"
            p={2}
            borderBottom="1px solid #E4E4E4"
            borderTop="1px solid #E4E4E4"
          >
            {/* === HEADER === */}
            <Grid
              container
              sx={{
                ...tableColumnStyle,
                borderRadius: '8px 8px 0px 0px',
                backgroundColor: '#F8F9FA',
                borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              }}
            >
              <Grid sx={columnCellStyle} size={0.6}>
                S.No
              </Grid>
              <Grid sx={columnCellStyle} size={1.4}>
                Material Type
              </Grid>
              <Grid sx={columnCellStyle} size={1.2}>
                Category
              </Grid>
              <Grid sx={columnCellStyle} size={1.4}>
                Sub Category
              </Grid>
              <Grid sx={columnCellStyle} size={1.3}>
                Product Name
              </Grid>
              <Grid sx={columnCellStyle} size={1}>
                Purity
              </Grid>
              <Grid sx={columnCellStyle} size={1}>
                Weight
              </Grid>
              <Grid sx={columnCellStyle} size={1}>
                Quantity
              </Grid>
              <Grid sx={columnCellStyle} size={1.5}>
                Golden Hub Pvt., Ltd.
              </Grid>
              <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
                Sparkle Designers Hub
              </Grid>
            </Grid>

            {/* === ITEM ROWS === */}
            {rows.map((row, index) => (
              <Grid
                container
                sx={{ ...tableRowStyle, backgroundColor: '#FFFFFF' }}
                key={row.id}
              >
                <Grid size={0.6} sx={columnCellStyle}>
                  {index + 1}
                </Grid>
                <Grid size={1.4} sx={columnCellStyle}>
                  {row.materialType}
                </Grid>
                <Grid size={1.2} sx={columnCellStyle}>
                  {row.category}
                </Grid>
                <Grid size={1.4} sx={columnCellStyle}>
                  {row.subCategory}
                </Grid>
                <Grid size={1.3} sx={columnCellStyle}>
                  {row.description}
                </Grid>
                <Grid size={1} sx={columnCellStyle}>
                  {row.purity}
                </Grid>
                <Grid size={1} sx={columnCellStyle}>
                  {row.orderedWeight}
                </Grid>
                <Grid size={1} sx={columnCellStyle}>
                  {row.receivedWeight}
                </Grid>
                {/* <Grid size={1.5} sx={columnCellStyle}>
            {row.rate}
          </Grid>
          <Grid size={1.5} sx={{ ...columnCellStyle, borderRight: 'none' }}>
            {row.amount}
          </Grid> */}

                {/* Golden Hub Pvt. Ltd. */}
                <Grid size={1.5} sx={columnCellStyle}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>{row.rate}</Typography>
                    <Checkbox
                      checked={selectedVendors[`golden_hub_${row.id}`] || false}
                      onChange={(e) =>
                        handleVendorSelection(
                          `golden_hub_${row.id}`,
                          e.target.checked
                        )
                      }
                      sx={{
                        color: '#CBCBCB',
                      }}
                      size="small"
                    />
                  </Box>
                </Grid>

                {/* Sparkle Designers Hub */}
                <Grid
                  size={1.5}
                  sx={{ ...columnCellStyle, borderRight: 'none' }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>{row.amount}</Typography>
                    <Checkbox
                      checked={
                        selectedVendors[`sparkle_designers_${row.id}`] || false
                      }
                      onChange={(e) =>
                        handleVendorSelection(
                          `sparkle_designers_${row.id}`,
                          e.target.checked
                        )
                      }
                      sx={{
                        color: '#CBCBCB',
                      }}
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            ))}

            {/* === TOTAL AMOUNT === */}
            {/* <Grid container sx={tableRowStyle}>
        <Grid
          size={8.9}
          sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
        >
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            height="100%"
            pr={2}
          >
            <Box textAlign="right">
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                Total Amount
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#666' }}>
                Inc. GST
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={1.5} sx={columnCellStyle}>
          ₹25,525.00
        </Grid>
        <Grid size={1.5} sx={{ ...columnCellStyle, borderRight: 'none' }}>
          ₹25,525.00
        </Grid>
      </Grid> */}

            {/* === TERMS & CONDITION === */}
            {/* <Grid container sx={tableRowStyle}>
        <Grid
          size={8.9}
          sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
        >
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            height="100%"
            pr={2}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              Terms & Condition
            </Typography>
          </Box>
        </Grid>
        <Grid size={1.5} sx={{ ...columnCellStyle, whiteSpace: 'normal' }}>
          Lorem ipsum dolor sit amet. Ut culpa id enim ipsum vel ex
        </Grid>
        <Grid
          size={1.5}
          sx={{ ...columnCellStyle, borderRight: 'none', whiteSpace: 'normal' }}
        >
          Lorem ipsum dolor sit amet. Ut adipisci corrupti vel
        </Grid>
      </Grid> */}

            {/* === ATTACHED FILES === */}
            {/* <Grid container sx={tableRowStyle}>
        <Grid
          size={8.9}
          sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
        >
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            height="100%"
            pr={2}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              Attached Files
            </Typography>
          </Box>
        </Grid>
        <Grid
          size={1.5}
          sx={{ ...columnCellStyle, flexDirection: 'column', gap: 0.5 }}
        >
          <Link
            sx={{
              fontSize: 12,
              color: theme.Colors.primary,
              textDecoration: 'none',
            }}
          >
            Quotation_privacy_policy.pdf
          </Link>
          <Link
            sx={{
              fontSize: 12,
              color: theme.Colors.primary,
              textDecoration: 'none',
            }}
          >
            Terms_&_Conditions.pdf
          </Link>
        </Grid>
        <Grid
          size={1.5}
          sx={{
            ...columnCellStyle,
            borderRight: 'none',
            textAlign: 'center',
          }}
        >
          -
        </Grid>
      </Grid> */}

            <Grid
              container
              sx={{
                ...tableRowStyle,
                backgroundColor: '#FBF4F7',
                fontWeight: 600,
                borderBottom: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderLeft: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                border: '0px 0px 8px 8px',
              }}
            >
              <Grid size={0.6} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.4} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.2} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.4} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid
                size={1.3}
                sx={{ ...columnCellStyle, fontWeight: 600 }}
              ></Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* {totals.orderedWeight.toFixed(2)} g */}
              </Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'Total Amount Inc. GST'}
              </Grid>
              <Grid size={1.5} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'₹25,525.00'}
              </Grid>
              <Grid size={1.5} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'₹25,525.00'}
              </Grid>

              {/* <Grid
          size={1}
          sx={{
            ...columnCellStyle,
            border: 'none',
            fontWeight: 600,
           
          }}
        >
        
        </Grid> */}
            </Grid>
            <Grid
              container
              sx={{
                ...tableRowStyle,
                backgroundColor: '#FBF4F7',
                fontWeight: 600,
                borderBottom: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderLeft: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                border: '0px 0px 8px 8px',
              }}
            >
              <Grid size={0.6} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.4} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.2} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.4} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid
                size={1.3}
                sx={{ ...columnCellStyle, fontWeight: 600 }}
              ></Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* {totals.orderedWeight.toFixed(2)} g */}
              </Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'Terms & Condition'}
              </Grid>
              <Grid size={1.5} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'Lorem ipsum dolor sit amet. Ut adipisci corrupti vel'}
              </Grid>
              <Grid size={1.5} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'Lorem ipsum dolor sit amet. Ut adipisci corrupti vel'}
              </Grid>

              {/* <Grid
          size={1}
          sx={{
            ...columnCellStyle,
            border: 'none',
            fontWeight: 600,
           
          }}
        >
        
        </Grid> */}
            </Grid>
            <Grid
              container
              sx={{
                ...tableRowStyle,
                backgroundColor: '#FBF4F7',
                fontWeight: 600,
                borderBottom: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderLeft: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                border: '0px 0px 8px 8px',
              }}
            >
              <Grid size={0.6} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.4} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.2} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid size={1.4} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid
                size={1.3}
                sx={{ ...columnCellStyle, fontWeight: 600 }}
              ></Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {/* Empty */}
              </Grid>
              <Grid
                size={1}
                sx={{ ...columnCellStyle, fontWeight: 600 }}
              ></Grid>
              <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'Attached Files'}
              </Grid>
              <Grid
                size={1.5}
                sx={{
                  ...columnCellStyle,
                  color: theme.Colors.primary,
                  fontWeight: 500,
                  textDecoration: 'underline',
                  fontSize: '10px',
                }}
              >
                {'Quotation_privacy_policy.pdf Terms & Conditions.pdf'}
              </Grid>
              <Grid size={1.5} sx={{ ...columnCellStyle, fontWeight: 600 }}>
                {'-'}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <FormAction
        firstBtntxt="Raise Po"
        secondBtntx="Cancel"
        handleCancel={handleCancel}
        handleCreate={handleCreate}
        {...commonTextInputProps}
      />
    </>
  );
};

export default CompareQuotation;
