import PageHeader from '@components/PageHeader';
import { Grid } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEdit } from '@hooks/useEdit';
import toast from 'react-hot-toast';
import { DeleteOutlinedIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import { useTheme } from '@mui/material';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { API_SERVICES } from '@services/index';
import LedgerTableFilter from './ledgerTableFilter';

const LedgerList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [ledgerData, setLedgerData] = useState<any>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const initialValues = {
    search: '',
    ledger_group: 0,
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
    },
    {
      field: 'ledger_group_id',
      headerName: 'Ledger Group ID',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'ledger_group_name',
      headerName: 'Ledger Group Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'ledger_name',
      headerName: 'Ledger Name',
      flex: 1.5,
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

  const handleEditLedger = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
    }).toString();
    navigateTo(`/admin/master/accounts/ledger/form?${params}`, {
      state: { rowData: rowData, type: type },
    });
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleDeleteLedger = async (rowData: any) => {
    try {
      setConfirmModalOpen({ open: false });

      const response: any = await API_SERVICES.AccountService.deleteLedger(
        rowData.id,
        {
          successMessage: 'Ledger deleted successfully!',
          failureMessage: 'Failed to delete ledger',
        }
      );

      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        // Refresh the list after successful deletion
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting ledger:', error);
      toast.error('Failed to delete ledger');
    }
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
            color: theme.Colors.orangePrimary,
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () => handleEditLedger(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditLedger(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Delete',
        renderIcon: () => <DeleteOutlinedIcon />,
        onClick: () => {
          const props = {
            title: 'Delete Ledger',
            description:
              'Are you sure you want to delete this Ledger? This action cannot be undone.',
            onCancelClick: () => handleCancelModal(),
            color: theme.Colors.redPrimary,
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: () => handleDeleteLedger(rowData),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
    ];
  };

  const searchValue = edit.getValue('search');
  const ledgerGroupValue = edit.getValue('ledger_group');
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchValue || '',
        ledger_group_no: ledgerGroupValue || null,
      };
      const response: any =
        await API_SERVICES.AccountService.getAllLedger(params);
      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        const transformedData = response?.data.data?.ledgers?.map(
          (item: any, index: number) => ({
            id: item.id || index + 1,
            s_no: index + 1,
            ledger_group_name: item.ledgerGroup.ledger_group_name || '',
            ledger_group_id: item.ledgerGroup.ledger_group_no || '',
            ledger_name: item.ledger_name || '',
            ...item,
          })
        );
        setLedgerData(transformedData || []);
      } else {
        console.warn('API call failed');
        setLedgerData([]);
      }
    } catch (err: any) {
      setLedgerData([]);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  }, [searchValue, ledgerGroupValue]);

  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="LEDGER LIST"
          count={ledgerData.length}
          btnName="Create Ledger"
          navigateUrl="/admin/master/accounts/ledger/form?create"
          navigateState={{ rowData: {}, type: CONFIRM_MODAL.create }}
        />
        <Grid container sx={contentLayout} mt={0}>
          <LedgerTableFilter
            selectItems={columns}
            handleSelectValue={handleSelectValue}
            selectedValue={hiddenColumns}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={ledgerData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};
export default LedgerList;
