import { DisableIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import {
  CommonFilterAutoSearchProps,
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import {
  AutoSearchSelectWithLabel,
  ConfirmModal,
  MUHTable,
} from '@components/index';
import MUHListItemCell from '@components/MUHListItemCell';
import PageHeader from '@components/PageHeader';
import { CONFIRM_MODAL } from '@constants/Constance';
import { DistrictService } from '@services/DistrictService';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import { Grid } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DistrictList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [countryOptions, setCountryOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [stateOptions, setStateOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      renderCell: (params: {
        api: { getSortedRowIds: () => (string | number)[] };
        id: string | number;
      }) => {
        const index = params.api.getSortedRowIds().indexOf(params.id);
        const serialNumber = index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'country',
      headerName: 'Country',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'state',
      headerName: 'State',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      // renderCell: ({ row }: { row: { state: string } }) => (
      //   <MUHListItemCell
      //     title={row.state}
      //     titleStyle={{ color: theme.Colors.primary }}
      //     // isLink={`/admin/locationMaster/stateView?countryId=${row.country_id}&countryName=${row.country_name}`}
      //   />
      // ),
    },
    {
      field: 'district',
      headerName: 'District',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'short_name',
      headerName: 'Short Name',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  const initialValues = {
    country: null as { label: string; value: number } | null,
    state: null as { label: string; value: number } | null,
    location: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };
  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };
  const handleSelectValue = (item: { headerName: string }) => {
    let hiddenCols: string[] = [];
    if (hiddenColumns.includes(item.headerName)) {
      hiddenCols = hiddenColumns.filter(
        (field: string) => field !== item.headerName
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

  const handleEditUser = (rowData: { id: number }, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: String(rowData?.id),
    }).toString();
    navigateTo(`/admin/locationMaster/districtCreate?${params}`);
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
        onClick: () => {},
      },
    ];
  };

  // Fetch countries for filter
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await DropDownServiceAll.getAllCountry();
        type CountryItem = {
          id: number;
          country_name?: string;
          name?: string;
        };
        const countries: CountryItem[] =
          (
            res as {
              data?: {
                data?: { countries?: CountryItem[] };
                countries?: CountryItem[];
              };
            }
          )?.data?.data?.countries ||
          (res as { data?: { countries?: CountryItem[] } })?.data?.countries ||
          [];
        const formattedCountries = countries.map((item: CountryItem) => ({
          label: String(item.country_name || item.name || ''),
          value: Number(item.id),
        }));
        setCountryOptions(formattedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountryOptions([]);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      const selectedCountry = edit.getValue('country') as {
        label: string;
        value: number;
      } | null;

      if (!selectedCountry?.value) {
        setStateOptions([]);
        return;
      }

      try {
        const res = await DropDownServiceAll.getAllStates({
          country_id: selectedCountry.value,
        });
        type StateItem = {
          id: number;
          state_name?: string;
          name?: string;
        };
        const states: StateItem[] =
          (
            res as {
              data?: {
                data?: { states?: StateItem[] };
                states?: StateItem[];
              };
            }
          )?.data?.data?.states ||
          (res as { data?: { states?: StateItem[] } })?.data?.states ||
          [];
        const formattedStates = states.map((item: StateItem) => ({
          label: String(item.state_name || item.name || ''),
          value: Number(item.id),
        }));
        setStateOptions(formattedStates);
      } catch (error) {
        console.error('Error fetching states:', error);
        setStateOptions([]);
      }
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit.getValue('country')]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const selectedCountry = edit.getValue('country') as {
        label: string;
        value: number;
      } | null;
      const selectedState = edit.getValue('state') as {
        label: string;
        value: number;
      } | null;
      const searchValue = edit.getValue('search') as string;

      const params: {
        country_id?: number;
        state_id?: number;
        search?: string;
      } = {};
      if (selectedCountry?.value) {
        params.country_id = selectedCountry.value;
      }
      if (selectedState?.value) {
        params.state_id = selectedState.value;
      }
      if (searchValue?.trim()) {
        params.search = searchValue.trim();
      }

      const response = await DistrictService.getAll(params);
      type DistrictItem = {
        id: number;
        country_id: number;
        state_id: number;
        short_name: string;
        district_name: string;
        country_name: string;
        state_name: string;
      };
      const districts: DistrictItem[] =
        (
          response as {
            data?: {
              data?: { districts?: DistrictItem[] };
              districts?: DistrictItem[];
            };
          }
        )?.data?.data?.districts ||
        (response as { data?: { districts?: DistrictItem[] } })?.data
          ?.districts ||
        [];

      // Map API response to table format
      const formattedData = districts.map((district: DistrictItem) => ({
        id: district.id,
        country: district.country_name || '',
        state: district.state_name || '',
        district: district.district_name || '',
        short_name: district.short_name || '',
        country_id: district.country_id,
        state_id: district.state_id,
      }));

      setBranchData(formattedData);
    } catch (err: unknown) {
      setLoading(false);
      setBranchData([]);
      const error = err as { message?: string };
      toast.error(error?.message || 'Failed to fetch districts');
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    edit.getValue('country'),
    edit.getValue('state'),
    edit.getValue('search'),
  ]);
  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="DISTRICT MASTER"
          btnName="Create Master"
          navigateUrl="/admin/locationMaster/districtCreate?type=create"
        />
        <Grid container sx={contentLayout} mt={0}>
          <Grid container sx={tableFilterContainerStyle}>
            <Grid size={1.3}>
              <AutoSearchSelectWithLabel
                options={countryOptions}
                placeholder="Country"
                iconStyle={{
                  color: theme.Colors.blackLightLow,
                }}
                value={edit?.getValue('country')}
                onChange={(_e, value) => {
                  edit.update({ country: value, state: null });
                }}
                {...CommonFilterAutoSearchProps}
              />
            </Grid>
            <Grid size={1.3}>
              <AutoSearchSelectWithLabel
                options={stateOptions}
                placeholder="State"
                iconStyle={{
                  color: theme.Colors.blackLightLow,
                }}
                value={edit?.getValue('state')}
                onChange={(_e, value) => {
                  edit.update({ state: value });
                }}
                {...CommonFilterAutoSearchProps}
              />
            </Grid>
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
              (column) =>
                column.headerName && !hiddenColumns.includes(column.headerName)
            )}
            rows={branchData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};
export default DistrictList;
