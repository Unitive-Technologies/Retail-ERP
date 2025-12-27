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
import { RowEditIcon, RowViewIcon, SchemeCartIcon } from '@assets/Images';
import { CONFIRM_MODAL } from '@constants/Constance';
import { DivyamGoldSaverData } from '@constants/DummyData';
import { useTheme, Box, Typography } from '@mui/material';

import SavingSchemeTableFilter from './SavingSchemeTableFilter';

const SavingSchemeList = () => {
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
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Total Enrolment',
      value: 125,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Active',
      value: 89,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Completed',
      value: 36,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Not Enrolled',
      value: 76,
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
            onClick={() => navigate(`/admin/savingScheme/view`)}
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
      field: 'mode',
      headerName: 'Mode',
      flex: 0.8,
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
        }}
      >
        <Box
          sx={{
            backgroundColor: '#F2F2F2',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: theme.fontFamily.interRegular,
              fontSize: '16px',   
              fontWeight: 400,      
              color: theme.Colors.black,
              lineHeight: 1,
            }}
          >
            {row.due1}/{row.due2}
          </Typography>
        </Box>
      </Box>
    );
  },
}
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
          title="SAVING SCHEME LIST"
          showDownloadBtn={true}
          titleStyle={{ color: theme.Colors.black }}
          showCreateBtn={true}
          btnName="New Enrollment"
          showBackButton={false}
          navigateUrl="/admin/savingScheme/create"
        />
        <StatusCard data={card} onClickCard={onclickActiveTab} />

        <Grid container sx={contentLayout}>
          <SavingSchemeTableFilter
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
            // isCheckboxSelection={false}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default SavingSchemeList;
