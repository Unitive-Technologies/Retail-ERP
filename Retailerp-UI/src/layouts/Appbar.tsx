import { useState, useEffect } from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import {
  createTheme,
  styled,
  ThemeProvider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  Typography,
  Divider,
} from '@mui/material';
import {
  ArrowBackIos,
  NotificationsNoneOutlined,
  Add,
  Delete,
} from '@mui/icons-material';
import { DialogCloseIcon, GoldEditIcon } from '@assets/Images';
import Grid from '@mui/material/Grid2';
import { ButtonComponent, TextInput } from '@components/index';
import {
  BillingIcon,
  GoldRateArrowIcon,
  LandingAppbarLogo,
} from '@assets/Images';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { MaterialTypeService } from '@services/materialTypeService';
import { PurityService } from '@services/purityService';
import { Badge } from '@mui/material';
import MUHTypography from '@components/MUHTypography';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import AdminProfileMenu from './AdminProfileMenu';
import {
  columnCellStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
  tableSelectBoxProps,
} from '@components/CommonStyles';
import toast from 'react-hot-toast';
import FormAction from '@components/ProjectCommon/FormAction';
import { formatCurrency } from '@constants/AmountFormats';

const CustomTheme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '20px',
        },
      },
    },
  },
});

interface AppBarProps extends MuiAppBarProps {
  open: boolean;
  drawerWidth: number;
  onMenuClick: () => void;
}

const AppbarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== 'open' && prop !== 'drawerWidth' && prop !== 'onMenuClick',
})<AppBarProps>(({ theme, open, drawerWidth }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.Colors.whitePrimary,
  boxShadow: 'none',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    backgroundColor: theme.Colors.whitePrimary,
    boxShadow: 'none',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const GRADIENT_BG = `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`;

const CustomBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    height: '13px',
    minWidth: '24px',
    borderRadius: '500px',
    fontSize: '9px',
    backgroundColor: theme.palette.warning.main,
    color: theme.Colors.whitePrimary,
    top: -4,
  },
}));
const Appbar = (props: AppBarProps) => {
  const theme = useTheme();

  const [goldRate, setGoldRate] = useState('');
  const [goldRates, setGoldRates] = useState<any[]>([]);
  const [purities, setPurities] = useState<any[]>([]);

  // Fetch gold rates from API
  const fetchGoldRates = async () => {
    try {
      const response: any = await MaterialTypeService.getAll();
      if (response.data.data.materialTypes) {
        const materialData = response.data.data.materialTypes as any;
        const rates = materialData.map((item: any) => ({
          label: `${item?.purity_name || ''} ${item.material_type} - ${formatCurrency(item.material_price)}/g`,
          value: item.id,
          material_type: item.material_type,
          material_price: item.material_price,
          purity_name: item.purity_name,
          purity_percentage: item.purity_percentage,
          material_image_url: item.material_image_url,
          website_visibility: item.website_visibility || false,
        }));
        setGoldRates(rates);
      }
    } catch (error) {
      console.error('Error fetching gold rates:', error);
    }
  };

  // Fetch purities from API
  const fetchPurities = async () => {
    try {
      const response: any = await PurityService.getAll();
      console.log(response.data.data, 'response.data.data');

      if (response.data.data) {
        setPurities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching purities:', error);
    }
  };

  useEffect(() => {
    fetchGoldRates();
    fetchPurities();
  }, []);

  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [goldRateDialogOpen, setGoldRateDialogOpen] = useState(false);
  const [rateRows, setRateRows] = useState([
    {
      id: 1,
      material_type: '',
      purity_name: '',
      // material_image_url: '',
      purity_percentage: '',
      material_price: '',
      website_visibility: false,
    },
  ]);

  const handleProfileClick = (e: any) => {
    setProfileAnchorEl(e.currentTarget);
  };
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleEditGoldRate = () => {
    setRateRows([
      {
        id: Date.now(),
        material_type: '',
        purity_name: '',
        purity_percentage: '',
        // material_image_url: '',
        material_price: '',
        website_visibility: false,
      },
    ]);
    setGoldRateDialogOpen(true);
  };

  const handleCloseGoldRateDialog = () => {
    setGoldRateDialogOpen(false);
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      material_type: '',
      purity_name: '',
      purity_percentage: '',
      // material_image_url: '',
      material_price: '',
      website_visibility: false,
    };
    setRateRows([...rateRows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    if (rateRows.length > 1) {
      setRateRows(rateRows.filter((row) => row.id !== id));
    } else {
      toast.error('At least one row is required');
    }
  };

  const handleRowChange = (id: number, field: string, value: any) => {
    // If material_type is being changed, auto-populate purity fields
    if (field === 'material_type' && value) {
      // Find the matching material data from goldRates
      const matchingMaterial = goldRates.find(
        (rate: any) => rate.label.split(' - ')[0] === value
      );

      if (matchingMaterial) {
        const materialPurityName = matchingMaterial.purity_percentage;
        const matchingPurity = purities.find(
          (p: any) =>
            parseFloat(p.purity_value) === parseFloat(materialPurityName)
        );

        // Update the row with material type and purity information
        setRateRows(
          rateRows.map((row) =>
            row.id === id
              ? {
                  ...row,
                  material_type: value,
                  material_price: matchingMaterial.material_price,
                  purity_name: matchingMaterial.purity_name,
                  purity_percentage: matchingPurity
                    ? matchingPurity.purity_value
                    : matchingMaterial.purity_percentage,
                  website_visibility:
                    matchingMaterial.website_visibility || false,
                }
              : row
          )
        );
        return;
      }
    }

    // For all other fields, update normally
    setRateRows(
      rateRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSaveGoldRates = async () => {
    // Validate all rows
    const hasEmptyFields = rateRows.some(
      (row) =>
        !row.material_type ||
        !row.purity_name ||
        !row.purity_percentage ||
        !row.material_price
    );

    if (hasEmptyFields) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (goldRates.length === 0) {
        toast.error(
          'Gold rates data not available. Please refresh and try again.'
        );
        return;
      }

      const materials = rateRows.map((row) => {
        const matchingGoldRate = goldRates.find(
          (rate: any) => rate.label.split(' - ')[0] === row.material_type
        );

        return {
          id: matchingGoldRate?.value,
          material_type: matchingGoldRate.material_type,
          material_image_url: matchingGoldRate?.material_image_url || '',
          material_price: parseFloat(row.material_price),
          purity_name: row.purity_name,
          purity_percentage: parseFloat(row.purity_percentage),
          website_visibility: row.website_visibility || false,
        };
      });

      // Make single bulk API call
      try {
        const result: any = await MaterialTypeService.bulkReplace(materials, {
          successMessage: 'Material types updated successfully',
          failureMessage: 'Failed to update material types',
        });
        console.log('Bulk API call result:', result);

        // Clear the table data after saving
        setRateRows([]);
        setGoldRateDialogOpen(false);
        fetchGoldRates();
      } catch (apiError) {
        toast.error('API call failed: ' + (apiError as Error).message);
        return;
      }
    } catch (error) {
      console.error('Error updating gold rates:', error);
      toast.error('Failed to update gold rates');
    }
  };

  const materialTypeOptions = goldRates.map((rate: any) => ({
    label: rate.material_type,
    value: rate.label.split(' - ')[0],
  }));

  const left = () => {
    return (
      <IconButton
        sx={{
          background: theme.Colors.primaryLight,
          width: '24px',
          height: '24px',
          ':hover': { background: theme.Colors.primaryLight },
          transform: props.open ? 'rotate(360deg)' : 'rotate(180deg)',
        }}
        onClick={props.onMenuClick}
      >
        <ArrowBackIos
          sx={{ color: theme.Colors.primaryDarkEnd, p: 0.5, pl: 1 }}
        />
      </IconButton>
    );
  };

  const right = () => {
    return (
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box sx={{ mr: 2 }}>
          <ButtonComponent
            startIcon={<BillingIcon />}
            buttonText="Billing"
            buttonFontSize={12}
            bgColor={theme.Colors.primary}
            buttonTextColor={theme.Colors.whitePrimary}
            buttonFontWeight={500}
            btnBorderRadius={100}
            btnHeight={35}
            buttonStyle={{ fontFamily: 'Roboto slab' }}
          />
        </Box>

        <ThemeProvider theme={CustomTheme}>
          <MUHSelectBoxComponent
            isCheckbox={false}
            value={goldRate}
            placeholderText="Gold & Silver Rate"
            onChange={(e: any) => {
              const value = e.target.value;
              if (value === '__edit__') {
                handleEditGoldRate();
              } else {
                setGoldRate(value);
              }
            }}
            selectItems={[
              ...goldRates,
              {
                label: 'Edit',
                value: '__edit__',
                icon: <GoldEditIcon style={{ width: 16, height: 16 }} />,
              },
            ]}
            menuItemTextColor={theme.Colors.primaryDarkStart}
            menuItemTextSize={12}
            placeholderColor={theme.Colors.primaryDarkStart}
            selectBoxStyle={{
              background: theme.Colors.primaryLight,
              borderRadius: '100px',
              fontSize: '12px',
              padding: '5px',
              color: theme.Colors.primaryDarkStart,
              height: '35px',
              fontFamily: 'Roboto slab',
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiSelect-select': {
                justifyContent: 'center', // Ensure centering in this specific instance
                textAlign: 'center',
              },
              '& .MuiSelect-icon': {
                backgroundColor: 'rgba(255, 255, 255, 0.39)',
                borderRadius: '100px',
                padding: '6px',
                width: '24px',
                height: '24px',
                mt: -0.7,
              },
            }}
            textStyle={{
              textAlign: 'center', // Add this prop
              width: '100%',
            }}
            IconComponent={GoldRateArrowIcon}
          />
        </ThemeProvider>
        <Box sx={{ ml: 2 }}>
          <CustomBadge badgeContent={3} color="warning">
            <NotificationsNoneOutlined
              sx={{ color: theme.Colors.blackLight }}
            />
          </CustomBadge>
        </Box>
        <Box
          sx={{
            width: '33px',
            height: '33px',
            background: GRADIENT_BG,
            borderRadius: '100px',
            ml: 4,
          }}
        >
          <img
            src={LandingAppbarLogo}
            style={{ objectFit: 'cover', width: '33px', height: '33px' }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 1,
            cursor: 'pointer',
          }}
          onClick={handleProfileClick}
        >
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <MUHTypography
              text="Chaneira Jewel"
              size={13}
              color={theme.Colors.blackSecondary}
              sx={{ lineHeight: '14px' }}
            />
            <MUHTypography
              text="Super Admin"
              size={10}
              color={theme.Colors.blackLight}
            />
          </Box>
          <Box>
            <ArrowDownIcon
              sx={{
                fontSize: 18,
                ml: 0.1,
                color: '#1C1B1F',
                cursor: 'pointer',
              }}
            />
          </Box>
        </Box>
      </Grid>
    );
  };

  return (
    <AppbarStyled
      open={props.open}
      drawerWidth={props.drawerWidth}
      onMenuClick={props.onMenuClick}
      position="fixed"
    >
      <Toolbar
        sx={{
          minHeight: '60px !important',
          height: '60px !important',
          p: '18px !important',
          pr: '14px !important',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.Colors.grayLight}`,
        }}
      >
        {left()} {right()}
        <AdminProfileMenu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
        />
      </Toolbar>

      {/* Gold Rate Edit Dialog */}
      <Dialog
        open={goldRateDialogOpen}
        onClose={handleCloseGoldRateDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#F5F5F5',
            borderBottom: `1px solid ${theme.Colors.grayLight}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            px: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: theme.Colors.black,
              fontFamily: theme.fontFamily.roboto,
              textTransform: 'uppercase',
            }}
          >
            Material Price{' '}
          </Typography>
          <IconButton onClick={handleCloseGoldRateDialog}>
            <DialogCloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ width: '100%' }}>
            {/* Table Header */}
            <Grid container sx={tableColumnStyle}>
              <Grid sx={columnCellStyle} size={0.8}>
                S.No
              </Grid>
              <Grid sx={columnCellStyle} size={1.8}>
                Material Type
              </Grid>
              <Grid sx={columnCellStyle} size={1.8}>
                Purity in Name
              </Grid>
              <Grid sx={columnCellStyle} size={1.8}>
                Purity in Percentage
              </Grid>
              <Grid sx={columnCellStyle} size={1.8}>
                Price
              </Grid>
              <Grid sx={columnCellStyle} size={1.8}>
                Website Visibility
              </Grid>
              <Grid sx={{ ...columnCellStyle, borderRight: 'none' }} size={0.8}>
                Action
              </Grid>
            </Grid>

            {/* Separator */}
            <Divider
              sx={{
                // borderColor: theme.Colors.primary,
                borderWidth: 1,
                my: 0,
              }}
            />

            {/* Table Rows */}
            {rateRows.map((row, index) => (
              <Grid
                container
                sx={{ ...tableRowStyle, borderBottom: 'none' }}
                key={row.id}
              >
                <Grid
                  size={0.8}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 500,
                  }}
                >
                  {index + 1}
                </Grid>
                <Grid
                  size={1.8}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MUHSelectBoxComponent
                    placeholderText="Select Material Type"
                    value={row.material_type || ''}
                    onChange={(e: any) =>
                      handleRowChange(row.id, 'material_type', e.target.value)
                    }
                    selectItems={materialTypeOptions}
                    {...tableSelectBoxProps}
                    isCheckbox={false}
                    // borderColor={theme.Colors.primary}
                    // focusBorderColor={theme.Colors.primary}
                    ishover={false}
                  />
                </Grid>
                <Grid
                  size={1.8}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    placeholderText="Purity in Name"
                    value={row.purity_name || ''}
                    onChange={(e: any) =>
                      handleRowChange(row.id, 'purity_name', e.target.value)
                    }
                    {...tableTextInputProps}
                  />
                </Grid>
                <Grid
                  size={1.8}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px', // Consistent padding for all cells
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1, // Increased gap
                      width: '100%',
                    }}
                  >
                    <MUHSelectBoxComponent
                      placeholderText="Select Purity"
                      value={row.purity_percentage || ''}
                      onChange={(event: any) => {
                        const value = event.target.value;
                        const selectedPurity = purities.find(
                          (p: any) => p.purity_value === value
                        );
                        if (selectedPurity) {
                          handleRowChange(
                            row.id,
                            'purity_percentage',
                            selectedPurity.purity_value
                          );
                        }
                      }}
                      selectItems={purities.map((purity: any) => ({
                        label: purity.purity_value,
                        value: purity.purity_value,
                      }))}
                      {...tableSelectBoxProps}
                    />
                  </Box>
                </Grid>
                <Grid
                  size={1.8}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: theme.Colors.black,
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                        minWidth: '20px',
                      }}
                    >
                      ₹
                    </Typography>
                    <TextInput
                      placeholderText="Enter Price"
                      value={
                        row.material_price
                          ? parseFloat(row.material_price).toLocaleString(
                              'en-IN',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : ''
                      }
                      onChange={(e: any) => {
                        const value = e.target.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/,/g, '');
                        handleRowChange(row.id, 'material_price', value);
                      }}
                      {...tableTextInputProps}
                    />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: theme.Colors.black,
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                        minWidth: '20px',
                      }}
                    >
                      /g
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  size={1.8}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Switch
                    checked={row.website_visibility}
                    onChange={(e) =>
                      handleRowChange(
                        row.id,
                        'website_visibility',
                        e.target.checked
                      )
                    }
                    size="medium"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.Colors.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: theme.Colors.primary,
                        },
                    }}
                  />
                </Grid>
                <Grid
                  size={0.8}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {rateRows.length === 0 || rateRows.length - 1 === index ? (
                    <IconButton onClick={handleAddRow}>
                      <Add sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleDeleteRow(row.id)}>
                      <Delete sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.Colors.grayLight}`,
            justifyContent: 'center',
            gap: 2,
            '& > *': {
              marginTop: 0,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              width: '100%',
            }}
          >
            <FormAction
              handleCreate={handleSaveGoldRates}
              handleCancel={handleCloseGoldRateDialog}
              firstBtntxt="Save"
              secondBtntx="Cancel"
              btnWidth={120}
            />
          </Box>
        </DialogActions>
      </Dialog>
    </AppbarStyled>
  );
};

export default Appbar;
