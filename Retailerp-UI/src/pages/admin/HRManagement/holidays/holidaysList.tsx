import { ConfirmModal, MUHTable } from '@components/index';
import PageHeader from '@components/PageHeader';
import Grid from '@mui/system/Grid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import HolidaysTableFilter from './HolidaysTableFilter';
import toast from 'react-hot-toast';
import { HolidaysService } from '@services/HRManagementServices';
import dayjs from 'dayjs';

const HolidaysList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const [confirmModalOpen, setConfirmModalOpen] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    onCancelClick?: () => void;
    color?: string;
    iconType?: string;
    onConfirmClick?: () => void;
  }>({
    open: false,
  });
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [holidayData, setHolidayData] = useState<object[]>([]);
  const [allHolidayData, setAllHolidayData] = useState<object[]>([]);

  const fetchData = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      const response: any = await HolidaysService.getHolidays(params);
      
      const data = response?.data?.data || [];
      setAllHolidayData(data);
      setHolidayData(data);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch holidays');
      setAllHolidayData([]);
      setHolidayData([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const initialValues = useMemo(
    () => ({
      status: 0,
      offer_plan: '',
      search: '',
    }),
    []
  );

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 's_no',
        headerName: 'S.No',
        flex: 0.39,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'center',
        renderCell: (params: any) => {
          const fullIndex = holidayData.findIndex(
            (row: any) => row.id === params.row.id
          );
          const serialNumber =
            fullIndex >= 0
              ? fullIndex + 1
              : params.api.getSortedRowIds().indexOf(params.id) + 1;
          return <span>{serialNumber}</span>;
        },
      },
      {
        field: 'holiday_name',
        headerName: 'Name',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
      },
      {
        field: 'holiday_date',
        headerName: 'Date',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params: any) => {
          const date = params.value;
          return date ? dayjs(date).format('DD MMM YYYY') : '-';
        },
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1.1,
        sortable: false,
        disableColumnMenu: true,
      },
    ],
    []
  );

  const handleSelectValue = useCallback((item: { headerName: string }) => {
    setHiddenColumns((prev) =>
      prev.includes(item.headerName)
        ? prev.filter((col) => col !== item.headerName)
        : [...prev, item.headerName]
    );
  }, []);

  const handleFilterClear = useCallback(() => {
    edit.reset();
    setHiddenColumns([]);
    fetchData();
  }, [edit, fetchData]);

  const handleDateChange = useCallback((newDate: any) => {
    edit.update({ joining_date: newDate });
    if (newDate) {
      let date: Date;
      if (newDate instanceof Date) {
        date = newDate;
      } else if (typeof newDate === 'string') {
        date = new Date(newDate);
      } else if (newDate && typeof newDate === 'object' && newDate.$d) {
        date = newDate.$d;
      } else {
        return; 
      }
      const params = {
        month: date.getMonth() + 1, 
        year: date.getFullYear(),
      };
      fetchData(params);
    } else {
      fetchData();
    }
  }, [edit, fetchData]);

  const handleSearchChange = useCallback((text: string) => {
    edit.update({ search: text });
    
    if (!text.trim()) {
      // If search is empty, show all data
      setHolidayData(allHolidayData);
      return;
    }
    
    // Filter data based on search text
    const filteredData = allHolidayData.filter((holiday: any) => {
      const searchText = text.toLowerCase();
      const holidayName = holiday.holiday_name?.toLowerCase() || '';
      const description = holiday.description?.toLowerCase() || '';
      const holidayDate = holiday.holiday_date ? new Date(holiday.holiday_date).toLocaleDateString().toLowerCase() : '';
      
      return (
        holidayName.includes(searchText) ||
        description.includes(searchText) ||
        holidayDate.includes(searchText)
      );
    });
    
    setHolidayData(filteredData);
  }, [edit, allHolidayData]);

  // if api updates
  //   const handleSearchChange = useCallback((text: string) => {
  //   edit.update({ search: text });
  //   const params: any = {};
    
  //   if (text) {
  //     params.search = text;
  //   }
    
  //   fetchData(params);
  // }, [edit, fetchData]);

  const handleEditUser = useCallback(
    (rowData: any) => {
      navigateTo(`/admin/hr/holidays/create`, {
        state: {
          holidayData: rowData,
          isEdit: true,
        },
      });
    },
    [navigateTo]
  );

  const handleCancelModal = useCallback(() => {
    setConfirmModalOpen({ open: false });
  }, []);

  const renderRowAction = useCallback(
    (rowData: any) => [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () =>
          setConfirmModalOpen({
            open: true,
            title: 'Edit',
            description: 'Do you want to modify data?',
            onCancelClick: handleCancelModal,
            color: '#FF742F',
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () => handleEditUser(rowData),
          }),
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => {},
      },
    ],
    [handleCancelModal, handleEditUser]
  );

  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumns.includes(col.headerName!)),
    [columns, hiddenColumns]
  );

  return (
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
          onDateChange={handleDateChange}
          onSearchChange={handleSearchChange}
        />

        <MUHTable
          columns={visibleColumns}
          rows={holidayData}
          getRowActions={renderRowAction}
          isLoading={loading}
        />

        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </Grid>
  );
};

export default HolidaysList;
