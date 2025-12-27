import { ConfirmModal, MUHTable } from '@components/index';
import PageHeader from '@components/PageHeader';
import { HolidaysListData } from '@constants/DummyData';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

import HolidaysTableFilter from './HolidaysTableFilter';
import toast from 'react-hot-toast';

const HolidaysList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const [confirmModalOpen, setconfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [HolidayData, setHolidayData] = useState<object[]>([]);
  const initialValues = {
    status: 0,
    offer_plan: '',
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
    },

    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.1,
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
    navigateTo(`/admin/master/vendorCreate/form?${params}`);
  };

  const handleCancelModal = () => {
    setconfirmModalOpen({ open: false });
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
            onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setconfirmModalOpen({ open: true, ...props });
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
      setHolidayData(HolidaysListData); //TODO: need to call backend api
    } catch (err: any) {
      setLoading(false);
      setHolidayData([]);
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
          title="HOLIDAYS LIST"
          titleStyle={{ color: theme.Colors.black }}
          btnName="Create Holiday"
          navigateUrl="/admin/hr/holidays/create"
        />

        <Grid container sx={contentLayout}>
          <HolidaysTableFilter
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
            rows={HolidayData}
            getRowActions={renderRowAction}
            isLoading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default HolidaysList;
