import PageHeader from '@components/PageHeader';
import Grid from '@mui/system/Grid';
import { Box, Typography, useTheme } from '@mui/material';
import { GoldenPlanImages } from '@assets/Images';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { ViewQuotationData } from '@constants/DummyData';
import toast from 'react-hot-toast';
import FormAction from '@components/ProjectCommon/FormAction';

const ViewQuotation = () => {
  const theme = useTheme();
  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const handleCreate = () => {};
  const handleCancel = () => {};
  const styles = {
    card: {
      border: `1px solid ${theme.Colors.grayLight}`,
      backgroundColor: theme.Colors.whitePrimary,
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
    },
    companyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    companyName: {
      fontWeight: 500,
      color: theme.Colors.black,
      fontSize: '16px !important',
    },
    addrText: {
      color: theme.Colors.black,
      fontSize: '14px',
      fontWeight: 500,
    },
    metaCol: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '6px',
    },
    metaRow: {
      display: 'flex',
      gap: '10px',
      fontWeight: 600,
      fontSize: '16px',
    },
    metaValue: {
      color: theme.Colors.black,
      fontWeight: 600,
      fontSize: '16px',
    },
  };
  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'material_type',
      headerName: 'Material Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'sub_category',
      headerName: 'Sub Category',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'product_description',
      headerName: 'Product Description',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'purity',
      headerName: 'Purity',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'weight',
      headerName: 'Weight',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'rate',
      headerName: 'Rate',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
  ];
  const fetchData = async () => {
    try {
      setLoading(true);
      setOfferData(ViewQuotationData); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setOfferData([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="view quotation"
          titleStyle={{
            color: theme.Colors.black,
          }}
          showCreateBtn={false}
          showlistBtn={true}
          navigateUrl="/admin/purchases/quotation"
        />
        <Grid container sx={styles.card}>
          <Grid
            container
            sx={{
              width: '100%',
              alignItems: 'flex-start',
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid flexDirection={'row'} sx={styles.companyRow}>
                <img
                  src={GoldenPlanImages}
                  alt="logo"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: theme.Colors.grayLight,
                  }}
                />
                <Typography sx={styles.companyName}>
                  Golden Hub Pvt., Ltd.,
                </Typography>
              </Grid>
              <Grid
                flexDirection={'column'}
                sx={{ display: 'flex', gap: '8px' }}
              >
                <Grid sx={styles.addrText}>123/1, West street, KM Nagar</Grid>
                <Grid sx={styles.addrText}>Chennai</Grid>
                <Grid sx={styles.addrText}>Tamil Nadu</Grid>
                <Grid sx={styles.addrText}>600028</Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.metaCol}>
              <Grid sx={styles.metaRow}>
                <Typography
                  sx={{ ...styles.metaValue, color: theme.Colors.primary }}
                >
                  Quotation ID :
                </Typography>
                <Typography sx={styles.metaValue}>QUT 54/24-25</Typography>
              </Grid>
              <Grid sx={styles.metaRow}>
                <Typography
                  sx={{ ...styles.metaValue, color: theme.Colors.primary }}
                >
                  QR ID :
                </Typography>
                <Typography sx={styles.metaValue}>QR 52/24-25</Typography>
              </Grid>
              <Grid sx={styles.metaRow}>
                <Typography
                  sx={{ ...styles.metaValue, color: theme.Colors.primary }}
                >
                  Quotation Date :
                </Typography>
                <Typography sx={styles.metaValue}>05/02/2025</Typography>
              </Grid>
              <Grid sx={styles.metaRow}>
                <Typography
                  sx={{ ...styles.metaValue, color: theme.Colors.primary }}
                >
                  Expiry Date :
                </Typography>
                <Typography sx={styles.metaValue}>12/02/2025</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid container> */}
        <Grid
          container
          sx={{
            backgroundColor: '#fff',
            border: '1px solid #E4E4E4',
          }}
          size={12}
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
            container
            sx={{ backgroundColor: '#fff', borderTop: '1px solid #E4E4E4' }}
            size={12}
          >
            <MUHTable
              columns={columns}
              rows={offerData}
              loading={loading}
              isPagination={false}
            />
          </Grid>
        </Grid>
        {/* <Box sx={{ paddingTop: 2, mb: 2 }}> */}
        <Grid
          container
          size={12}
          spacing={3}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {/* Left Side - In Words and Remarks */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* In Words */}

            <Typography
              style={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontWeight: 600,
                color: theme.Colors.black,
                fontFamily: theme.fontFamily.roboto,
                // marginBottom: 1,
                borderBottom: '2px solid  #471923',
                width: 'fit-content',
              }}
            >
              TERMS & CONDITIONS
            </Typography>
            <Box
              sx={{
                border: '1px solid #D9D9D9',
                backgroundColor: '#fff',
                borderRadius: '4px',
                p: 2,
                mt: 2,
                height: '90px',
              }}
            >
              <Typography
                sx={{
                  fontSize: theme.MetricsSizes.regular,
                  color: theme.Colors.black,
                  fontWeight: theme.fontWeight.mediumBold,
                  fontFamily: theme.fontFamily.roboto,
                }}
              >
                {/* {summary.inWords} */}
              </Typography>
            </Box>
            <Typography
              style={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontWeight: 600,
                color: theme.Colors.black,
                fontFamily: theme.fontFamily.roboto,
                marginTop: '10px',
                borderBottom: '2px solid  #471923',
                width: 'fit-content',
              }}
            >
              ATTACHED FILES
            </Typography>
            <Box
              sx={{
                border: '1px solid #D9D9D9',
                backgroundColor: '#fff',
                borderRadius: '4px',
                p: 2,
                mt: 2,
                height: '90px',
              }}
            >
              <Typography
                sx={{
                  fontSize: theme.MetricsSizes.regular,
                  color: theme.Colors.black,
                  fontWeight: theme.fontWeight.mediumBold,
                  fontFamily: theme.fontFamily.roboto,
                }}
              >
                {/* {summary.inWords} */}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                backgroundColor: '#F8EBF0',
                border: '1px solid #DCDCDC',
                borderRadius: '4px',
                p: 0,
              }}
            >
              {/* Sub Total */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid #E0E0E0',
                }}
              >
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: theme.fontWeight.medium,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  Sub Total
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small,
                    fontWeight: theme.fontWeight.mediumBold,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {/* {summary.subTotal} */}₹ 21,000.00
                </Typography>
              </Box>

              {/* SGST */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid #E0E0E0',
                }}
              >
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: theme.fontWeight.medium,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  SGST
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {/* {summary.sgstPercentage} */} 1.5%
                  </Typography>
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {/* {summary.sgstAmount} */} ₹ 290.00
                  </Typography>
                </Box>
              </Box>

              {/* CGST */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid #E0E0E0',
                }}
              >
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: theme.fontWeight.medium,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  CGST
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {/* {summary.cgstPercentage} */}1.5%
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#000000',
                    }}
                  >
                    {/* {summary.cgstAmount} */}₹ 290.00
                  </Typography>
                </Box>
              </Box>

              {/* Discount */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid #E0E0E0',
                }}
              >
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: theme.fontWeight.medium,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  Discount
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {/* {summary.discountPercentage} */}2%
                  </Typography>
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {/* {summary.discountAmount} */}₹ 115.00
                  </Typography>
                </Box>
              </Box>

              {/* Total Amount */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                }}
              >
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: theme.fontWeight.medium,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  Total Amount
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: theme.fontWeight.mediumBold,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {/* {summary.totalAmount} */} ₹ 21,465.00
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {/* </Box> */}
      </Grid>
      <FormAction
        firstBtntxt="Raise Po"
        secondBtntx="Cancel"
        handleCancel={handleCancel}
        handleCreate={handleCreate}
      />
    </>
  );
};
export default ViewQuotation;
