import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ChipComponent, ConfirmModal, MUHTable } from '@components/index';
import { useNavigate } from 'react-router-dom';
import {
  CompletedIcon,
  PendingIcon,
  RowEditIcon,
  RowViewIcon,
  GoldenPlanImages,
  RejectIcon,
  WhitePendingIcon,
} from '@assets/Images';
import { CONFIRM_MODAL } from '@constants/Constance';
import { PurchaseData } from '@constants/DummyData';
import { useTheme, Avatar, Box, Typography } from '@mui/material';
import PurchaseTableFilter from './PurchaseTableFilter';

const PurchaseList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });

  const initialValues = {
    status: 0,
    offer_plan: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const card = [
    {
      img: PendingIcon,
      img2: WhitePendingIcon,
      title: 'Approval Pending',
      value: 24,
      activeTab: activeTab,
    },
    {
      img: CompletedIcon,
      img2: CompletedIcon,
      title: 'Approved',
      value: 20,
      activeTab: activeTab,
    },
    {
      img: RejectIcon,
      img2: RejectIcon,
      title: 'Completed',
      value: 10,
      activeTab: activeTab,
    },
  ];

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
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'po_no',
      headerName: 'PO No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            sx={{
              color: theme.Colors.primary,
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',

              textDecoration: 'underline',
            }}
            onClick={() =>
              navigate(`/admin/purchases/purchase/viewPurchaseOrder`)
            }
          >
            {row.po_no}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}
        >
          <Avatar
            src={row.vendor_logo || GoldenPlanImages}
            alt={row.vendor_name}
            sx={{ width: 28, height: 28 }}
          />
          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
            {row.vendor_name}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'weight',
      headerName: 'Weight',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography sx={{ color: theme.Colors.black }}>
            {row.created_role}
          </Typography>
          <Typography sx={{ color: theme.Colors.blueLightSecondary, mb: 0.2 }}>
            {row.created_by}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }: any) => (
        <ChipComponent
          label={row.status}
          style={{
            backgroundColor: row.status === 'Online' ? '#F3D8D9' : '#6D2E3D',
            color:
              row.status === 'Offline' ? theme.Colors.whitePrimary : '#6D2E3D',
            border: 'none',
            fontSize: '14px',
            fontWeight: 400,
            width: 100,
            height: '24px',
          }}
        />
      ),
    },
  ];

  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };

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

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
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
            // onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        // onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
      // {
      //   text: 'Deactive',
      //   renderIcon: () => <DeactiveIcon />,
      //   onClick: () => handleDeactive(rowData),
      // },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setOfferData(PurchaseData); //TODO: need to call backend api
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
      <Grid container spacing={1}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <PageHeader
          title="PURCHASE LIST"
          titleStyle={{ color: theme.Colors.black }}
          btnName="Create Purchase order"
          navigateUrl="/admin/purchases/purchase/createPurchaseOrder"
        />
        <Grid container sx={contentLayout}>
          <PurchaseTableFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
            isOfferPlan={true}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={offerData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default PurchaseList;
