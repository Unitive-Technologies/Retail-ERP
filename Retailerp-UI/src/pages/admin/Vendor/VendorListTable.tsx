import { ConfirmModal, MUHTable } from '@components/index';

import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { GoldenPlanImages, RowEditIcon, RowViewIcon } from '@assets/Images';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, useTheme } from '@mui/material';

// import { API_SERVICES } from '@services/index'; // Uncomment when using API

import React from 'react';
import PageHeader from '@components/PageHeader';
import VendorListTableFilter from '../master/vendor/VendorTableFilter';
import MUHListItemCell from '@components/MUHListItemCell';

// Dummy data for Vendor List Table
const dummyVendorData = [
  {
    id: 1,
    s_no: 1,
    vendor_id: 'VEN 01/24-25',
    vendor_name: 'Golden Hub Pvt., Ltd.',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 15000000,
    total_paid: 12000000,
    outstanding: 3000000,
    branch: 'Avadi',
  },
  {
    id: 2,
    s_no: 2,
    vendor_id: 'VEN 02/24-25',
    vendor_name: 'Shiva Silver Suppliers',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 18000000,
    total_paid: 15000000,
    outstanding: 3000000,
    branch: 'Ambathur',
  },
  {
    id: 3,
    s_no: 3,
    vendor_id: 'VEN 03/24-25',
    vendor_name: 'Jai Shree Jewels',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 12500000,
    total_paid: 10000000,
    outstanding: 2500000,
    branch: 'Coimbatore',
  },
  {
    id: 4,
    s_no: 4,
    vendor_id: 'VEN 04/24-25',
    vendor_name: 'Kalash Gold & Silver Mart',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 20000000,
    total_paid: 18000000,
    outstanding: 2000000,
    branch: 'Salem',
  },
  {
    id: 5,
    s_no: 5,
    vendor_id: 'VEN 05/24-25',
    vendor_name: 'Sai Precious Metals',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 16500000,
    total_paid: 14000000,
    outstanding: 2500000,
    branch: 'Avadi',
  },
  {
    id: 6,
    s_no: 6,
    vendor_id: 'VEN 06/24-25',
    vendor_name: 'Elegant Silver Works',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 14000000,
    total_paid: 12000000,
    outstanding: 2000000,
    branch: 'Ambathur',
  },
  {
    id: 7,
    s_no: 7,
    vendor_id: 'VEN 07/24-25',
    vendor_name: 'Sparakle Designer Hub',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 17500000,
    total_paid: 15000000,
    outstanding: 2500000,
    branch: 'Coimbatore',
  },
  {
    id: 8,
    s_no: 8,
    vendor_id: 'VEN 08/24-25',
    vendor_name: 'Golden Wrap & Co.',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 19000000,
    total_paid: 17000000,
    outstanding: 2000000,
    branch: 'Salem',
  },
  {
    id: 9,
    s_no: 9,
    vendor_id: 'VEN 09/24-25',
    vendor_name: 'Kiran Kasting Studio',
    vendor_image_url: GoldenPlanImages,
    total_purchase: 16000000,
    total_paid: 13500000,
    outstanding: 2500000,
    branch: 'Avadi',
  },
];

const VendorListTable = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = React.useState<number | string>(
    location.pathname.includes('vendorListTable') ? 1 : 0
  );
  const [vendorList, setVendorList] = useState<any[]>(dummyVendorData);
  const [confirmModalOpen, setconfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    status: 0,
    offer_plan: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'vendor_id',
      headerName: 'Vendor ID',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <MUHListItemCell
            title={row.vendor_id}
            titleStyle={{
              color: theme.Colors.primary,
            }}
            // isLink={'/admin/vendorOverview'}
            isLink={'/admin/vendorOverview/vendorListTable/overview'}
          />
        );
      },
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.vendor_image_url || GoldenPlanImages;
        return (
          <Grid
            sx={{
              display: 'flex',
              gap: 1,
              height: '100%',
              alignItems: 'center',
            }}
          >
            <img
              src={src}
              alt={row.material_type || 'material'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Grid>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.Colors.black,
                }}
              >
                {row.vendor_name}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },

    {
      field: 'total_purchase',
      headerName: 'Total Purchase',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_paid',
      headerName: 'Total Paid',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'outstanding',
      headerName: 'Outstanding',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };

  const handleSelectValue = (item: { headerName: never }) => {
    let hiddenCols = [];
    if (hiddenColumns.includes(item.headerName)) {
      hiddenCols = hiddenColumns.filter(
        (field: any) => field !== item.headerName
      );
      setHiddenColumns([...hiddenCols]);
    } else {
      hiddenCols = [...hiddenColumns, item.headerName];
      setHiddenColumns([...hiddenCols]);
    }
    handleCustomizeColumn(hiddenCols);
  };

  const handleFilterClear = () => {
    edit.reset();
    setHiddenColumns([]);
  };

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    // navigateTo(`/admin/master/vendorCreate/form?${params}`);
  };

  const handleCancelModal = () => {
    setconfirmModalOpen({ open: false });
  };

  const renderRowAction = (rowData: never) => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => {
          const props = {
            title: 'Edit',
            description: 'Do you want to modify data?',
            onCancelClick: () => handleCancelModal(),
            color: '#FF742F',
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setconfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
    ];
  };

  // Uncomment when ready to use API
  // const fetchData = async (params?: any) => {
  //   try {
  //     setLoading(true);
  //     const response: any =
  //       await API_SERVICES.VendorService.getAllVendor(params);
  //     if (response?.data?.statusCode === HTTP_STATUSES.OK) {
  //       const vendors = response?.data.data.vendors || [];
  //       const sortedVendors = [...vendors].sort((a: any, b: any) => {
  //         if (a?.created_at && b?.created_at) {
  //           return (
  //             new Date(b.created_at).getTime() -
  //             new Date(a.created_at).getTime()
  //           );
  //         }
  //         return (b?.id || 0) - (a?.id || 0);
  //       });
  //       setVendorList(sortedVendors);
  //     } else {
  //       setVendorList(dummyVendorData);
  //     }
  //   } catch {
  //     setVendorList(dummyVendorData);
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // For now, use dummy data directly
    // Uncomment below to use API when ready
    // const mtOpt = edit.getValue('materialType');
    // const materialType = mtOpt?.label || undefined;
    // const search = edit.getValue('search') || undefined;
    // const params: any = {};
    // if (materialType) params.materialType = materialType;
    // if (search) params.search = search;
    // fetchData(Object.keys(params).length ? params : undefined);

    // Using dummy data for now
    setVendorList(dummyVendorData);
    setLoading(false);
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="VENDOR LIST"
          useSwitchTabDesign={true}
          showDownloadBtn={false}
          tabContent={[
            { label: 'Vendor Overview', id: 0 },
            { label: 'Vendor List', id: 1 },
          ]}
          showlistBtn={false}
          showCreateBtn={false}
          showBackButton={false}
          currentTabVal={currentTab}
          onTabChange={(val) => {
            setCurrentTab(val);

            if (val === 0 && currentTab !== 0) {
              navigateTo('/admin/vendorOverview');
            } else if (val === 1 && currentTab !== 1) {
              navigateTo('/admin/vendorOverview/vendorListTable');
            }
          }}
          switchTabContainerWidth="fit-content"
        />

        <Grid container sx={contentLayout}>
          <VendorListTableFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={vendorList}
            getRowActions={renderRowAction}
            isLoading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default VendorListTable;
