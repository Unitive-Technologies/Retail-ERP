import { contentLayout } from '@components/CommonStyles';
import Grid from '@mui/material/Grid2';
import SchemeDetailFilter from './SchemeDetailFilter';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme } from '@mui/material';

const SchemeDetails = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [schemeData, setSchemeData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    branch: 0,
    mode: 0,
    search: '',
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'date_of_scheme',
      headerName: 'Date of Scheme',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'scheme_id',
      headerName: 'Scheme ID',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.scheme_id}
          titleStyle={{ color: theme.Colors.primary }}
          isLink={`/admin/customer/savingScheme/view`}
        />
      ),
    },
    {
      field: 'next_due',
      headerName: 'Next Due',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'saving_scheme',
      headerName: 'Saving Scheme',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'installment_amount',
      headerName: 'Installment Amount',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={`₹${row.installment_amount?.toLocaleString()}`}
          titleStyle={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'mode',
      headerName: 'Mode',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.mode}
          titleStyle={{
            color:
              row.mode === 'Online'
                ? theme.Colors.primary
                : theme.Colors.textSecondary,
          }}
        />
      ),
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'dues',
      headerName: 'Dues',
      flex: 0.6,
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
    navigateTo(`/admin/scheme/form?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const renderRowAction = (rowData: never) => {
    console.log(rowData, 'rowwwwww');
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
    ];
  };

  // Sample scheme data
  const sampleSchemeData = [
    {
      id: 1,
      date_of_scheme: '05/06/2025',
      scheme_id: 'SCH 58/24-25',
      next_due: '05/07/2025',
      saving_scheme: 'Golden Promise Plan',
      installment_amount: 2000,
      mode: 'Offline',
      branch: 'HKM Branch',
      dues: '1/12',
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setSchemeData([]);

      setSchemeData(sampleSchemeData);
    } catch (err: any) {
      setLoading(false);
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
      <Grid container sx={contentLayout}>
        <SchemeDetailFilter
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
          rows={schemeData}
          getRowActions={renderRowAction}
          loading={loading}
        />
        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </>
  );
};

export default SchemeDetails;
