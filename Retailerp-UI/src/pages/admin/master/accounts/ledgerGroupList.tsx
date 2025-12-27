import PageHeader from '@components/PageHeader';
import { Grid } from '@mui/system';
import { useEffect, useState } from 'react';
import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import CommonTableFilter from '@components/CommonTableFilter';
import { useEdit } from '@hooks/useEdit';
import toast from 'react-hot-toast';
import { DeleteOutlinedIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import { useTheme } from '@mui/material';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { API_SERVICES } from '@services/index';

export interface LedgerGroupModel {
  id: number;
  s_no: number;
  ledger_group_name: string;
  ledger_group_id: string;
}

const LedgerGroupList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [ledgerGroupData, setLedgerGroupData] = useState<LedgerGroupModel[]>(
    []
  );
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const initialValues = {
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
  ];

  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };

  const handleSelectValue = (item: { headerName: never }) => {
    let hiddenCols = [];
    if (hiddenColumns.includes(item.headerName)) {
      hiddenCols = hiddenColumns.filter((field) => field !== item.headerName);
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

  const handleEditLedgerGRoup = (rowData: LedgerGroupModel, type: string) => {
    const params = new URLSearchParams({
      type: type,
    }).toString();
    navigateTo(`/admin/master/accounts/ledgerGroup/form?${params}`, {
      state: { rowData: rowData, type: type },
    });
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleDeleteLedgerGrp = async (rowData: LedgerGroupModel) => {
    try {
      setConfirmModalOpen({ open: false });

      const response: any = await API_SERVICES.AccountService.deleteLedgerGrp(
        rowData.id,
        {
          successMessage: 'Ledger group deleted successfully!',
          failureMessage: 'Failed to delete ledger group',
        }
      );

      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        // Refresh the list after successful deletion
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting ledger group:', error);
      toast.error('Failed to delete ledger group');
    }
  };

  const renderRowAction = (rowData: LedgerGroupModel) => {
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
            onConfirmClick: () =>
              handleEditLedgerGRoup(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditLedgerGRoup(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Delete',
        renderIcon: () => <DeleteOutlinedIcon />,
        onClick: () => {
          const props = {
            title: 'Delete Ledger Group',
            description:
              'Are you sure you want to delete this Ledger Group? This action cannot be undone.',
            onCancelClick: () => handleCancelModal(),
            color: theme.Colors.redPrimary,
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: () => handleDeleteLedgerGrp(rowData),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // API call to fetch categories
      const response: any = await API_SERVICES.AccountService.getAllLedgerGrp({
        search: edit.getValue('search') || '',
      });

      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        const transformedData = response?.data.data?.ledgerGroups?.map(
          (item: any, index: number) => ({
            id: item.id || index + 1,
            s_no: index + 1,
            ledger_group_name: item.ledger_group_name || '',
            ledger_group_id: item.ledger_group_no || '',
            ...item,
          })
        );
        setLedgerGroupData(transformedData || []);
      } else {
        console.warn('API call failed');
        setLedgerGroupData([]);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [edit.getValue('search')]);

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="LEDGER GROUP LIST"
          count={ledgerGroupData.length}
          btnName="Create Ledger Group"
          navigateUrl="/admin/master/accounts/ledgerGroup/form?create"
          navigateState={{ rowData: {}, type: CONFIRM_MODAL.create }}
        />
        <Grid container sx={contentLayout} mt={0}>
          <Grid container sx={tableFilterContainerStyle}>
            <CommonTableFilter
              selectItems={columns}
              selectedValue={hiddenColumns}
              handleSelectValue={handleSelectValue}
              handleFilterClear={handleFilterClear}
              edit={edit}
            />
          </Grid>
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={ledgerGroupData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};
export default LedgerGroupList;
