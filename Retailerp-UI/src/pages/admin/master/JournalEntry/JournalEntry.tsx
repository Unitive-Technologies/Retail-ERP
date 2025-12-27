import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { useTheme, Box, Typography } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import { roleData } from '@constants/DummyData';
import MUHListItemCell from '@components/MUHListItemCell';
import JournalList from './JournalList';

const JournalEntry = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    branch: '',
    status: '',
    search: '',
    dateRange: [],
  };

  const edit = useEdit(initialValues);

  // ✅ Dummy Role Data (like your screenshot)

  // ✅ Define columns
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S.No',
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'journal_id',
      headerName: 'Journal ID',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <MUHListItemCell
          title={row.journal_id}
          titleStyle={{ color: theme.Colors.primary }}
          // isLink={`/admin/accounts/journal/view/${row.id}`}
        />
      ),
    },

    {
      field: 'account',
      headerName: 'Account',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_debit',
      headerName: 'Total Debit',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => `₹${row.total_debit}`,
    },
    {
      field: 'total_credit',
      headerName: 'Total Credit',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => `₹${row.total_credit}`,
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => `₹${row.total_amount}`,
    },
  ];

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/employee/role?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const renderRowAction = (rowData: any) => {
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setBranchData(roleData);
    } catch (err: any) {
      setLoading(false);
      setBranchData([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dummyRows = [
    {
      id: 1,
      date: '12/02/2025',
      journal_id: 'JRN 010/24-25',
      account: 'Machinery',
      description: 'Weighing Scale',
      total_debit: 1000,
      total_credit: 1000,
      total_amount: 1000,
    },
    {
      id: 2,
      date: '12/02/2025',
      journal_id: 'JRN 010/24-25',
      account: 'Machinery',
      description: 'Weighing Scale',
      total_debit: 1000,
      total_credit: 1000,
      total_amount: 1000,
    },
    {
      id: 3,
      date: '12/02/2025',
      journal_id: 'JRN 010/24-25',
      account: 'Machinery',
      description: 'Weighing Scale',
      total_debit: 1000,
      total_credit: 1000,
      total_amount: 1000,
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
  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="Journal Entry"
          count={dummyRows.length}
          btnName="Create New Asset"
          navigateUrl="/admin/journalEntry/create"
        />
        <Grid container sx={contentLayout}>
          <JournalList
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
            rows={dummyRows}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default JournalEntry;
