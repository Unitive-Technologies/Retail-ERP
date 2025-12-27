import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { ConfirmModal, MUHTable } from '@components/index';

import { DeactiveIcon, RowViewIcon, SchemeCartIcon } from '@assets/Images';

import { stockTransferList } from '@constants/DummyData';
import { useTheme } from '@mui/material';
import StockInHandsFilter from './StockListFilter';
import MUHListItemCell from '@components/MUHListItemCell';

const StockTransfer = () => {
  const theme = useTheme();

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
      title: 'Approval Pending',
      value: 24,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Approved',
      value: 20,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Rejected',
      value: 10,
      activeTab: activeTab,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },

    {
      field: 'transfer_no',
      headerName: 'Transfer No',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        return (
          <MUHListItemCell
            title={row.transfer_no}
            titleStyle={{ color: theme.Colors.primary }}
            isLink={`/admin/stock/transfer/view`}
            state={row}
          />
        );
      },
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
      field: 'branch_from',
      headerName: 'Branch From',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'branch_to',
      headerName: 'Branch To',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'approved_by',
      headerName: 'Approved By',
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
      field: 'weight',
      headerName: 'Weight',
      flex: 1,
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setOfferData(stockTransferList); //TODO: need to call backend api
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
  const renderRowAction = (rowData: never) => {
    return [
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        // onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Approve',
        renderIcon: () => <DeactiveIcon />,
        // onClick: () => handleDeactivate(rowData),
      },
      {
        text: 'Reject',
        renderIcon: () => <DeactiveIcon />,
        // onClick: () => handleDeactive(rowData),
      },
    ];
  };
  return (
    <>
      <Grid container spacing={2}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <PageHeader
          title="STOCK TRANSFER LIST"
          showDownloadBtn={true}
          titleStyle={{ color: theme.Colors.black }}
          showlistBtn={false}
          showCreateBtn={true}
          btnName="Create Stock Transfer"
          // showBackButton={false}
          navigateUrl="/admin/stock/transfer/create"
        />
        <Grid container sx={contentLayout}>
          <StockInHandsFilter
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

export default StockTransfer;
