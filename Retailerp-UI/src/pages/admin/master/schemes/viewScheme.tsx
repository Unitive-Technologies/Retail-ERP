import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ConfirmModal, MUHTable } from '@components/index';
import { useNavigate } from 'react-router-dom';
import {
  CompletedIcon,
  RowEditIcon,
  RowViewIcon,
  OnGoingIcon,
  TotalValueTillIcon,
} from '@assets/Images';
import { CONFIRM_MODAL } from '@constants/Constance';
import { DivyamGoldSaverData } from '@constants/DummyData';
import { useTheme, Box, Typography } from '@mui/material';
import ViewTableFilter from './ViewTableFilter';

const ViewScheme = () => {
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
      img: OnGoingIcon,
      img2: OnGoingIcon,
      title: 'On-Going',
      value: 24,
      activeTab: activeTab,
    },
    {
      img: CompletedIcon,
      img2: CompletedIcon,
      title: 'Completed',
      value: 20,
      activeTab: activeTab,
    },
    {
      img: TotalValueTillIcon,
      img2: TotalValueTillIcon,
      title: 'Total Value Till Date',
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
      field: 'date_scheme',
      headerName: 'Date of Scheme',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'scheme_id',
      headerName: 'Scheme ID',
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
            {row.scheme_id}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'mobile_number',
      headerName: 'Mobile Number',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'saving_scheme',
      headerName: 'Saving Scheme',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Installment_Amount',
      headerName: 'Installment Amount',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'dues',
      headerName: 'Dues',
      flex: 0.7,
      align: 'left',
      sortable: true,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <Grid
              sx={{
                backgroundColor: '#F1F1F1',
                borderRadius: '50px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                style={{
                  fontFamily: theme.fontFamily.interRegular,
                  fontSize: '13px',
                  fontWeight: 400,
                  color: theme.Colors.black,
                }}
              >
                {row.due1} / {row.due2}
              </Typography>
            </Grid>
          </Box>
        );
      },
    },
    {
      field: 'mode',
      headerName: 'Mode',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
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
      setOfferData(DivyamGoldSaverData); //TODO: need to call backend api
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
          title="DIVYAM GOLD SAVER"
          count={offerData.length}
          showDownloadBtn={false}
          titleStyle={{ color: theme.Colors.black }}
          showCreateBtn={false}
          showBackButton={true}
          navigateUrl="/admin/master/schemes"
        />
        <StatusCard data={card} onClickCard={onclickActiveTab} />

        <Grid container sx={contentLayout}>
          <ViewTableFilter
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

export default ViewScheme;
