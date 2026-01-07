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
import { useTheme, Box, Typography } from '@mui/material';

import SalesOrderFilter from './SalesOrderFilter';
import MUHListItemCell from '@components/MUHListItemCell';

const SalesOrderList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const salesOrderRows = [
    {
      id: 1,
      date: '12/02/2025',
      purchase_id: 'PO 58/24-25',
      item_details: 'Pendant, Earrings',
      quantity: 52,
    },
    {
      id: 2,
      date: '15/02/2025',
      purchase_id: 'PO 57/24-25',
      item_details: 'Pendant, Earrings',
      quantity: 52,
    },
  ];

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
      title: 'Received',
      value: 125,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Sent',
      value: 89,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Rejected',
      value: 36,
      activeTab: activeTab,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'purchase_id',
      headerName: 'Purchase ID',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <MUHListItemCell
          title={row.purchase_id}
          titleStyle={{ color: theme.Colors.primary }}
          isLink={`/admin/revenue/view?id=${row.id}`}
        />
      ),
    },
    {
      field: 'item_details',
      headerName: 'Item Details',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.7,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
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
      setOfferData(salesOrderRows); //TODO: need to call backend api
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
        <StatusCard data={card} onClickCard={onclickActiveTab} />

        <PageHeader
          title="SALES ORDER LIST"
          showDownloadBtn={true}
          titleStyle={{ color: theme.Colors.black }}
          showCreateBtn={true}
          btnName="Create Sales Order"
          showBackButton={false}
          navigateUrl="/admin/savingScheme/create"
        />

        <Grid container sx={contentLayout}>
          <SalesOrderFilter
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
            rows={salesOrderRows}
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

export default SalesOrderList;
