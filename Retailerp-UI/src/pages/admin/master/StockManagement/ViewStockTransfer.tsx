import { StudImg } from '@assets/Images';
import {
  columnCellStyle,
  tableColumnStyle,
  tableRowStyle,
} from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/system/Grid';
import { useLocation } from 'react-router-dom';

type BranchInfo = {
  name: string;
  addressLines: string[];
  phone: string;
  date?: string;
};
const stockItems = [
  {
    id: 1,
    sku_id: 'SKU_SLM_528',
    hsn_code: '85259878',
    material_type: 'Gold',
    category: 'Earrings',
    sub_category: 'Stud',
    description: 'Silver Ring',
    quantity: 10,
    weight: '10.25 g',
    amount: '1,52,585',
  },
];

const DEFAULT_BRANCH_FROM: BranchInfo = {
  name: 'Kalash Gold & Silver Mart',
  addressLines: [
    '125/A, 1st Cross Street',
    'Gandhipuram',
    'Coimbatore',
    '605205',
  ],
  phone: '+91 8963689696',
  date: '16/05/2025',
};

const DEFAULT_BRANCH_TO: BranchInfo = {
  name: 'Classic Jewels & Silver Emporium',
  addressLines: ['45, VGP Layout', 'Anna Nagar', 'Chennai - 600040'],
  phone: '+91 9845662233',
};

type TransferDetails = {
  transfer_no?: string;
  date?: string;
  branch_from?: string;
  branch_to?: string;
  approved_by?: string;
  quantity?: number | string;
  weight?: string;
};

type TransferMeta = {
  label: string;
  value: string;
};

type StockItem = {
  id: number;
  sku_id: string;
  hsn_code: string;
  material_type: string;
  category: string;
  sub_category: string;
  description: string;
  quantity: number;
  weight: string;
  amount: string;
};

const ViewStockTransfer = () => {
  const theme = useTheme();
  const location = useLocation();
  const transferDetails = (location.state as TransferDetails) || {};

  const branchFrom: BranchInfo = {
    name: transferDetails.branch_from || DEFAULT_BRANCH_FROM.name,
    addressLines: DEFAULT_BRANCH_FROM.addressLines,
    phone: DEFAULT_BRANCH_FROM.phone,
    date: transferDetails.date || DEFAULT_BRANCH_FROM.date,
  };

  const branchTo: BranchInfo = {
    name: transferDetails.branch_to || DEFAULT_BRANCH_TO.name,
    addressLines: DEFAULT_BRANCH_TO.addressLines,
    phone: DEFAULT_BRANCH_TO.phone,
  };

  const transferMeta: TransferMeta[] = [
    { label: 'Transfer No', value: transferDetails.transfer_no || 'TRA1003' },
    { label: 'Reference No', value: 'REF1025' },
    { label: 'Staff Name', value: transferDetails.approved_by || 'Mani' },
    { label: 'Transport Details', value: 'Truck' },
  ];

  const totalQuantity = stockItems.reduce(
    (sum: number, item: StockItem) => sum + Number(item.quantity || 0),
    0
  );

  const totalWeight =
    stockItems
      .reduce((sum: number, item: StockItem) => {
        const numeric = parseFloat(item.weight);
        return sum + (isNaN(numeric) ? 0 : numeric);
      }, 0)
      .toFixed(2) + ' g';

  const totalAmount = stockItems.reduce((sum: number, item: StockItem) => {
    const numeric = Number(String(item.amount).replace(/,/g, ''));
    return sum + (isNaN(numeric) ? 0 : numeric);
  }, 0);

  const renderBranchCard = (
    title: string,
    info: BranchInfo,
    rightContent: React.ReactNode
  ) => (
    <Box
      sx={{
        borderRadius: '12px',
        boxShadow: 'none',
        backgroundColor: theme.Colors.whitePrimary,
        border: '1px solid #E4E7EC',
        mb: 3,
      }}
    >
      <Box sx={{ p: 2.5 }}>
        {/* Header Title */}

        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            mb: 2,
            color: '#101828',
          }}
        >
          {title}
        </Typography>

        {/* Content Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* LEFT SECTION */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Avatar + Branch Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={StudImg}
                alt="Logo"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />

              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#101828',
                }}
              >
                {info.name}
              </Typography>
            </Box>

            {/* Address Lines (Indented Under Title) */}
            <Box>
              {info.addressLines.map((line, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: '15px',
                    color: '#475467',
                    lineHeight: '22px',
                  }}
                >
                  {line}
                </Typography>
              ))}

              <Typography
                sx={{
                  fontSize: '15px',
                  color: '#475467',
                  lineHeight: '22px',
                  mt: 0.5,
                }}
              >
                <strong>Phone:</strong> {info.phone}
              </Typography>
            </Box>
          </Box>

          {rightContent}
        </Box>
      </Box>
    </Box>
  );

  const renderDateBadge = (date?: string) =>
    date ? (
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#7A1B2F',
          whiteSpace: 'nowrap',
        }}
      >
        Date:{' '}
        <Box component="span" sx={{ color: '#101828', ml: 1 }}>
          {date}
        </Box>
      </Typography>
    ) : null;

  const renderMetaList = (meta: TransferMeta[]) => (
    <Box
      sx={{
        borderRadius: '8px',
        p: 2,
      }}
    >
      {meta.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: item === meta[meta.length - 1] ? 0 : 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#7A1B2F',
            }}
          >
            {item.label}:
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#101828',
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <PageHeader
          title="VIEW STOCK TRANSFER"
          titleStyle={{ color: theme.Colors.black }}
          navigateUrl="/admin/stock/transfer"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={true}
          showBackButton={false}
        />

        <Grid container>
          <Grid size={{ xs: 12 }}>
            {renderBranchCard(
              'BRANCH FROM',
              branchFrom,
              renderDateBadge(branchFrom.date)
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            {renderBranchCard(
              'BRANCH TO',
              branchTo,
              renderMetaList(transferMeta)
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                border: '1px solid #E4E7EC',
                borderRadius: '8px 8px 0px 0px',
                boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)',
                backgroundColor: theme.Colors.whitePrimary,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#101828',
                  // mb: 2,
                }}
              >
                ITEM DETAILS
              </Typography>
            </Box>
            <Box
              sx={{
                border: '1px solid #E4E7EC',
                borderRadius: '0px 0px 8px 8px',
                boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)',
                backgroundColor: theme.Colors.whitePrimary,
                p: 2,
                borderTop: 'none',
              }}
            >
              <Grid width={'100%'} paddingTop={2}>
                {/* Table Header */}
                <Grid
                  container
                  sx={{
                    ...tableColumnStyle,
                    backgroundColor: '#F8F9FA',
                    borderRight: `1px solid ${theme.Colors?.grayWhiteDim || '#E0E0E0'}`,
                  }}
                >
                  <Grid size={0.6} sx={columnCellStyle}>
                    S.No
                  </Grid>

                  <Grid size={1.5} sx={columnCellStyle}>
                    SKU ID
                  </Grid>

                  <Grid size={1.2} sx={columnCellStyle}>
                    HSN Code
                  </Grid>

                  <Grid size={1.1} sx={columnCellStyle}>
                    Material Type
                  </Grid>

                  <Grid size={1.2} sx={columnCellStyle}>
                    Category
                  </Grid>

                  <Grid size={1.2} sx={columnCellStyle}>
                    Sub Category
                  </Grid>

                  <Grid size={1.7} sx={columnCellStyle}>
                    Product Description
                  </Grid>

                  <Grid size={1} sx={columnCellStyle}>
                    Quantity
                  </Grid>

                  <Grid size={1.1} sx={columnCellStyle}>
                    Weight
                  </Grid>

                  <Grid size={1} sx={{ ...columnCellStyle, border: 'none' }}>
                    Amount
                  </Grid>
                </Grid>

                {/* Table Rows */}
                {stockItems.map((row: StockItem, index: number) => (
                  <Grid container sx={tableRowStyle} key={row.id}>
                    <Grid
                      size={0.6}
                      sx={{ ...columnCellStyle, fontWeight: 500 }}
                    >
                      {index + 1}
                    </Grid>

                    <Grid size={1.5} sx={columnCellStyle}>
                      {row.sku_id}
                    </Grid>

                    <Grid size={1.2} sx={columnCellStyle}>
                      {row.hsn_code}
                    </Grid>

                    <Grid size={1.1} sx={columnCellStyle}>
                      {row.material_type}
                    </Grid>

                    <Grid size={1.2} sx={columnCellStyle}>
                      {row.category}
                    </Grid>

                    <Grid size={1.2} sx={columnCellStyle}>
                      {row.sub_category}
                    </Grid>

                    <Grid size={1.7} sx={columnCellStyle}>
                      {row.description}
                    </Grid>

                    <Grid size={1} sx={columnCellStyle}>
                      {row.quantity}
                    </Grid>

                    <Grid size={1.1} sx={columnCellStyle}>
                      {row.weight}
                    </Grid>

                    <Grid
                      size={1}
                      sx={{
                        ...columnCellStyle,
                        border: 'none',
                        fontWeight: 500,
                      }}
                    >
                      ₹{row.amount}
                    </Grid>
                  </Grid>
                ))}

                {/* Total Row */}
                <Grid
                  container
                  sx={{
                    ...tableRowStyle,
                    backgroundColor: '#F5F5F5',
                    fontWeight: 600,
                    borderLeft: `1px solid ${theme.Colors.grayWhiteDim}`,
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    borderBottom: `1px solid ${theme.Colors.grayWhiteDim}`,
                  }}
                >
                  {/* Empty columns */}
                  <Grid size={0.6} sx={columnCellStyle}></Grid>
                  <Grid size={1.5} sx={columnCellStyle}></Grid>
                  <Grid size={1.2} sx={columnCellStyle}></Grid>
                  <Grid size={1.1} sx={columnCellStyle}></Grid>
                  <Grid size={1.2} sx={columnCellStyle}></Grid>
                  <Grid size={1.2} sx={columnCellStyle}></Grid>

                  <Grid size={1.7} sx={columnCellStyle}>
                    Total
                  </Grid>

                  <Grid size={1} sx={columnCellStyle}>
                    {totalQuantity}
                  </Grid>

                  <Grid size={1.1} sx={columnCellStyle}>
                    {totalWeight}
                  </Grid>

                  <Grid
                    size={1}
                    sx={{
                      ...columnCellStyle,
                      border: 'none',
                    }}
                  >
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid container size={12} spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                p: 2,
                height: '100%',
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#101828',
                  mb: 0.5,
                }}
              >
                REMARKS
              </Typography>
              <Box
                sx={{
                  width: '60px',
                  height: '3px',
                  backgroundColor: '#7A1B2F',
                  mb: 2,
                }}
              />
              <Box
                sx={{
                  border: '1px solid #E4E7EC',
                  borderRadius: '8px',
                  backgroundColor: theme.Colors.whitePrimary,
                  p: 2,
                  minHeight: '190px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                    lineHeight: '22px',
                  }}
                >
                  Lorem ipsum dolor sit amet. Ut adipisci corrupti vel
                  repudiandae culpa id enim ipsum vel expedita sint. Aut odio
                  recusandae et aliquam dolor eum eligendi doloribus cum
                  perspiciatis quia est quae asperiores. Et ullam officiis et
                  doloribus dolorem aut laborum cupiditate eos inventore.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                backgroundColor: '#FCE7F3',
                borderRadius: '8px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#101828',
                  }}
                >
                  Grand Total
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #E4E7EC',
                    borderRadius: '8px',
                    backgroundColor: theme.Colors.whitePrimary,
                    p: 1.5,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#101828',
                    }}
                  >
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#101828',
                  }}
                >
                  Total Product
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #E4E7EC',
                    borderRadius: '8px',
                    backgroundColor: theme.Colors.whitePrimary,
                    p: 1.5,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#101828',
                    }}
                  >
                    {stockItems.length}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#101828',
                  }}
                >
                  Total Weight
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #E4E7EC',
                    borderRadius: '8px',
                    backgroundColor: theme.Colors.whitePrimary,
                    p: 1.5,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#101828',
                    }}
                  >
                    {totalWeight}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#101828',
                  }}
                >
                  Total Quantity
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #E4E7EC',
                    borderRadius: '8px',
                    backgroundColor: theme.Colors.whitePrimary,
                    p: 1.5,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#101828',
                    }}
                  >
                    {totalQuantity}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* </Box> */}
    </>
  );
};

export default ViewStockTransfer;
