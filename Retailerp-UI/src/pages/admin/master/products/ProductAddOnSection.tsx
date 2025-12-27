import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { sectionContainerStyle } from '@components/CommonStyles';
import { MUHTable } from '@components/index';
import MUHTextInput from '@components/MUHTextInput';
import { InputAdornment, useTheme } from '@mui/material';
import { GridColDef, GridSearchIcon } from '@mui/x-data-grid';
import MUHListItemCell from '@components/MUHListItemCell';
import { useDebounce } from '@hooks/useDebounce';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';

type Props = {
  isAddOn: boolean;
  setIsAddOn: any;
  addOn: any[];
  setAddOn: any;
  type: string | null;
  currentProductId?: number | null;
};

const ProductAddOnSection: React.FC<Props> = ({
  isAddOn,
  setIsAddOn,
  addOn,
  setAddOn,
  type,
  currentProductId,
}: Props) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const debouncedSearch = useDebounce(searchValue, 500);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'sku_id',
      headerName: 'SKU ID',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'category_name',
      headerName: 'Category',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          avatarImg={row?.category_image_url}
          title={row?.category_name}
        />
      ),
    },
    {
      field: 'subcategory_name',
      headerName: 'Sub Category',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          avatarImg={row?.subcategory_image_url}
          title={row?.subcategory_name}
        />
      ),
    },
    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          avatarImg={row?.image_urls?.length > 0 ? row?.image_urls[0] : ''}
          title={row.product_name}
        />
      ),
    },
  ];

  const handleSwitch = () => {
    setIsAddOn(!isAddOn);
    if (!addOn?.length) {
      setRows([]);
    }
  };

  const filterCurrentProduct = (items: any[] = []) =>
    currentProductId
      ? items.filter((item) => item?.id !== currentProductId)
      : items;

  useEffect(() => {
    const fetchAddons = async () => {
      if (!debouncedSearch) return;

      const params = { search: debouncedSearch };
      const res: any = await API_SERVICES.ProductService.searchAddons(params);

      if (res?.data?.statusCode === HTTP_STATUSES.OK) {
        const products = filterCurrentProduct(res?.data?.data?.products ?? []);

        const mappedProducts = products.map((p: any, i: number) => ({
          ...p,
          s_no: i + 1,
        }));

        const updatedRows = mergeSelectedWithResults(mappedProducts);
        setRows(updatedRows);
      }
    };

    fetchAddons();
  }, [debouncedSearch]);

  const mergeSelectedWithResults = (fetchedProducts: any[]) => {
    const filteredSelected = filterCurrentProduct(addOn);
    const selectedIds = new Set(
      filteredSelected.map((a: any) => (typeof a === 'object' ? a.id : a))
    );

    const merged = [
      ...filteredSelected,
      ...fetchedProducts.filter((item) => !selectedIds.has(item.id)),
    ];

    return merged.map((p, index) => ({ ...p, s_no: index + 1 }));
  };

  useEffect(() => {
    if (type !== 'create' && addOn?.length) {
      const fetchAddons = async () => {
        const params = { product_ids: addOn.join(',') };
        const res: any = await API_SERVICES.ProductService.searchAddons(params);

        if (res?.data?.statusCode === HTTP_STATUSES.OK) {
          const products = filterCurrentProduct(
            res?.data?.data?.products ?? []
          );
          const mappedProducts = products.map((p: any, i: number) => ({
            ...p,
            id: p.id ?? p.product_id ?? p.sku_id ?? `addon_${i}`,
            s_no: i + 1,
          }));
          setRows(mappedProducts);
          setAddOn(mappedProducts);
        }
      };
      fetchAddons();
    }
  }, []);
  console.log(rows, 'rowsss----');
  return (
    <Grid width={'100%'}>
      <FormSectionHeader
        title="Add On"
        isSwith={true}
        handleSwitch={handleSwitch}
        isAddOn={isAddOn}
      />
      {isAddOn ? (
        <Grid container gap={1} sx={sectionContainerStyle}>
          <MUHTextInput
            value={searchValue}
            onChange={(e: any) => setSearchValue(e.target.value)}
            placeholderText="Search Product/Scan Tag"
            placeholderColor={'#D2D2D2'}
            placeholderFontSize={14}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <GridSearchIcon
                      sx={{ color: theme.Colors.black, opacity: 0.8, p: 0.3 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            padding={0.01}
            fontSize={14}
            fontWeight={400}
            height={40}
            borderColor="#E4E4E4"
          />
          <Grid
            container
            width={'100%'}
            sx={{
              border: '1px solid #E4E4E4',
              boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.12)',
              borderRadius: '8px',
              maxHeight: '300px',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {rows?.length ? (
              <MUHTable
                columns={columns}
                rows={rows}
                checkboxSelection
                isPagination={false}
                tableStyle={{ borderRadius: '8px' }}
                getRowId={(row) => row?.id}
                rowSelectionModel={addOn.map((a) => a.id)}
                onRowSelectionModelChange={(selectedIds) => {
                  const selectedRows = rows.filter((r) =>
                    selectedIds.includes(r.id)
                  );
                  setAddOn(selectedRows);

                  const reordered = mergeSelectedWithResults(rows);
                  setRows(reordered);
                }}
              />
            ) : null}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default React.memo(ProductAddOnSection);
