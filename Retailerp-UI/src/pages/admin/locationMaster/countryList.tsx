import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CountryService } from '@services/CountryService';
import { useEdit } from '@hooks/useEdit';
import { useDebounce } from '@hooks/useDebounce';
import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { CONFIRM_MODAL } from '@constants/Constance';
import { DisableIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import CommonTableFilter from '@components/CommonTableFilter';
import { useNavigate } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import MUHListItemCell from '@components/MUHListItemCell';

const LocationList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);

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
      field: 'country',
      headerName: 'Country',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      //    renderCell: ({ row }: { row: any }) => (
      //   <MUHListItemCell
      //     title={row.country}
      //     titleStyle={{ color: theme.Colors.primary }}
      //     isLink={`/admin/locationMaster/stateView?countryId=${row.country_id}&countryName=${row.country}`}
      //   />
      // ),
      renderCell: ({ row }: { row: any }) => {
        const params = new URLSearchParams({
          type: 'view',
          rowId: String(row?.country_id || ''),
        }).toString();
        return (
          <MUHListItemCell
            title={row.country}
            titleStyle={{ color: theme.Colors.primary }}
            isLink={`/admin/countryCreate/form?${params}`}
          />
        );
      },
    },
    {
      field: 'short_name',
      headerName: 'Short Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'currency_symbol',
      headerName: 'Currency Symbol',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  const initialValues = {
    status: 0,
    location: '',
    search: '',
  };

  const edit = useEdit(initialValues);
  const debouncedSearchTerm = useDebounce(edit.getValue('search'), 500);

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
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
      rowId: rowData?.country_id,
    }).toString();
    navigateTo(`/admin/countryCreate/form?${params}`);
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
        text: 'Disable',
        renderIcon: () => <DisableIcon />,
        onClick: () => {
          const props = {
            title: 'Disable',
            description: 'Are you sure you want to disable this country?',
            onCancelClick: () => handleCancelModal(),
            color: theme.Colors.redPrimary,
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: () => handleDeleteCountry(),
          };
          setConfirmModalOpen({ open: true, ...props });
          setSelectedCountryId((rowData as any)?.country_id);
        },
      },
    ];
  };

  const handleDeleteCountry = async () => {
    try {
      if (!selectedCountryId) return;

      await CountryService.delete(selectedCountryId, {
        successMessage: 'Country disabled successfully',
        failureMessage: 'Failed to disable country',
      });

      handleCancelModal();
      fetchData({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: edit.getValue('search'),
      });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to disable country');
    }
  };

  const fetchData = async (params?: any) => {
    try {
      setLoading(true);
      const response: any = await CountryService.getAll(params);

      if (response?.data?.statusCode === 200) {
        const countries = response?.data?.data?.countries || [];
        const formattedData = countries.map((country: any, index: number) => ({
          id: country.id,
          s_no: params?.page
            ? params.page * params.pageSize + index + 1
            : index + 1,
          country: country.country_name,
          country_id: country.id,
          short_name: country.short_name,
          currency_symbol: country.currency_symbol,
          country_code: country.country_code,
          country_image_url: country.country_image_url,
          status: country.status || 'Active',
        }));
        setBranchData(formattedData);
        setTotalCount(response?.data?.data?.total || countries.length);
      } else {
        setBranchData([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setLoading(false);
      setBranchData([]);
      setTotalCount(0);
      toast.error(err?.message || 'Failed to fetch countries');
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: edit.getValue('search') || undefined,
    };
    fetchData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    const params = {
      page: 0,
      pageSize: pagination.pageSize,
      search: debouncedSearchTerm || undefined,
    };
    setPagination({ ...pagination, page: 0 });
    fetchData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleSearchChange = (searchText: string) => {
    if (!searchText || searchText.length === 0) {
      setPagination({ page: 0, pageSize: pagination.pageSize });
    }
  };

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="COUNTRY MASTER"
          count={totalCount}
          btnName="Create Master"
          navigateUrl="/admin/countryCreate/form?type=create"
          titleStyle={{ color: '#6D2E3D' }}
        />
        <Grid container sx={contentLayout} mt={0}>
          <Grid container sx={tableFilterContainerStyle}>
            <CommonTableFilter
              selectItems={columns}
              selectedValue={hiddenColumns}
              handleSelectValue={handleSelectValue}
              handleFilterClear={handleFilterClear}
              edit={edit}
              onSearchChange={handleSearchChange}
            />
          </Grid>

          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={branchData}
            getRowActions={renderRowAction}
            loading={loading}
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={pagination}
            onPaginationModelChange={setPagination}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default LocationList;
