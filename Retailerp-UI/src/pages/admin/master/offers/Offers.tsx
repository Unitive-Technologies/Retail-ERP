import {
  ActiveStatusIcon,
  AllStatusIcon,
  InActiveStatusIcon,
} from '@assets/Images/AdminImages';
import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BranchTableFilter from '../branch/BranchTableFilter';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ChipComponent, ConfirmModal, MUHTable } from '@components/index';
import { useNavigate } from 'react-router-dom';
import { DeactiveIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import { CONFIRM_MODAL } from '@constants/Constance';
import { OfferData } from '@constants/DummyData';
import { useTheme } from '@mui/material';

const Offers = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [showSelectedCategory, setSelectedCategory] = useState(false);

  const initialValues = {
    status: 0,
    offer_plan: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const card = [
    {
      img: AllStatusIcon,
      img2: AllStatusIcon,
      title: 'Total Offer',
      value: 5,
      activeTab: activeTab,
    },
    {
      img: ActiveStatusIcon,
      img2: ActiveStatusIcon,
      title: 'Active',
      value: 4,
      activeTab: activeTab,
    },
    {
      img: InActiveStatusIcon,
      img2: InActiveStatusIcon,
      title: 'In Active',
      value: 1,
      activeTab: activeTab,
    },
  ];

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
      field: 'offer_id',
      headerName: 'Offer ID',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'offer_plan',
      headerName: 'Offer Plan',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'offer_type',
      headerName: 'Offer Type',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'offer_value',
      headerName: 'Offer Value',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'validity',
      headerName: 'Validity',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'description',
      headerName: 'Offer Description',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => (
        <Grid container alignItems="center" style={{ height: '100%' }}>
          {(() => {
            const isActive = String(row?.status ?? '').toLowerCase() === 'active';
            return (
              <ChipComponent
                label={isActive ? 'Active' : 'Inactive'}
                style={{
                  backgroundColor: isActive
                    ? theme.Colors.primary
                    : theme.Colors.primaryLight,
                  color: isActive? theme.Colors.whitePrimary:theme.Colors.primary,
                  fontSize: 10,
                  fontWeight: 700,
                  width: 105,
                  height: '24px',
                }}
              />
            );
          })()}
        </Grid>
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

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/offerCreate/form?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleDeactive =(rowData:any) =>{}

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
            setConfirmModalOpen({ open: true, ...props });
          },
        },
        {
          text: 'View',
          renderIcon: () => <RowViewIcon />,
          onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
        },
        {
          text: 'Deactive',
          renderIcon : () =><DeactiveIcon/>,
          onClick: () =>handleDeactive(rowData)
        }
      ];
    };

  const fetchData = async () => {
    try {
      setLoading(true);
      setOfferData(OfferData); //TODO: need to call backend api
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
          title="COUNTRY MASTER"
          count={offerData.length}
          btnName="Create Offers"
          navigateUrl="/admin/master/offerCreate/form?type=create"
        />

        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <Grid container sx={contentLayout}>
          <BranchTableFilter
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

export default Offers;
