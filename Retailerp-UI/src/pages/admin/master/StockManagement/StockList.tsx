import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import Grid from '@mui/system/Grid';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ConfirmModal, MUHTable } from '@components/index';
import { GoldenPlanImages, SchemeCartIcon } from '@assets/Images';

import {
  LowstockList,
  OutofstockList,
  StockHandList,
} from '@constants/DummyData';
import { useTheme, Box, Typography, Avatar } from '@mui/material';
import StockInHandsFilter from './StockListFilter';

type DatasetType = 'stockInHand' | 'lowStock' | 'outStock';

const StockList = () => {
  const theme = useTheme();

  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [confirmModalOpen] = useState({ open: false });
  const [selectedDataset, setSelectedDataset] =
    useState<DatasetType>('stockInHand');

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
      title: 'Stock In Hand',
      value: 520,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Low Stock',
      value: 10,
      activeTab: activeTab,
    },
    {
      img: SchemeCartIcon,
      img2: SchemeCartIcon,
      title: 'Out Stock',
      value: 5,
      activeTab: activeTab,
    },
  ];

  const stockColumns = useMemo<GridColDef[]>(
    () => [
      {
        field: 's_no',
        headerName: 'S.No',
        flex: 0.6,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'center',
      },
      {
        field: 'category_name',
        headerName: 'Category Name',
        flex: 1.5,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: '100%',
            }}
          >
            <Avatar
              src={params.row.vendor_logo || GoldenPlanImages}
              alt={params.row.category_name}
              sx={{ width: 28, height: 28 }}
            />
            <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
              {params.row.category_name}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'sub_category',
        headerName: 'Sub Category',
        flex: 1.5,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: '100%',
            }}
          >
            <Avatar
              src={params.row.vendor_logo || GoldenPlanImages}
              alt={params.row.sub_category}
              sx={{ width: 28, height: 28 }}
            />
            <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
              {params.row.sub_category}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'sku_id',
        headerName: 'SKU ID',
        flex: 1.5,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'product',
        headerName: 'Product',
        flex: 1.5,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'purity',
        headerName: 'Purity',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'grs_weight',
        headerName: 'Grs Weight',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'net_weight',
        headerName: 'Net Weight',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        flex: 0.8,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
    ],
    []
  );

  const lowStockColumns = useMemo<GridColDef[]>(
    () => [
      {
        field: 's_no',
        headerName: 'S.No',
        flex: 0.2,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'center',
      },
      {
        field: 'sub_category',
        headerName: 'Sub Category',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: '100%',
            }}
          >
            <Avatar
              src={params.row.vendor_logo || GoldenPlanImages}
              alt={params.row.sub_category}
              sx={{ width: 28, height: 28 }}
            />
            <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
              {params.row.sub_category}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'low',
        headerName: 'Low',
        flex: 0.8,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 0.8,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
    ],
    []
  );

  const outStockColumns = useMemo<GridColDef[]>(
    () => [
      {
        field: 's_no',
        headerName: 'S.No',
        flex: 0.4,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'center',
      },
      {
        field: 'branch_name',
        headerName: 'Branch Name',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'sub_category',
        headerName: 'Sub Category',
        flex: 1.5,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: '100%',
            }}
          >
            <Avatar
              src={params.row.vendor_logo || GoldenPlanImages}
              alt={params.row.sub_category}
              sx={{ width: 28, height: 28 }}
            />
            <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
              {params.row.sub_category}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        flex: 0.8,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 0.8,
        sortable: false,
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
      },
    ],
    []
  );

  const formattedLowStockList = useMemo(
    () =>
      LowstockList.map(({ Action, ...rest }) => ({
        ...rest,
        action: Action ?? '',
      })),
    []
  );

  const formattedOutStockList = useMemo(
    () =>
      OutofstockList.map(({ Action, ...rest }) => ({
        ...rest,
        action: Action ?? '',
      })),
    []
  );

  const datasetConfig = useMemo(
    () => ({
      stockInHand: {
        columns: stockColumns,
        rows: StockHandList,
      },
      lowStock: {
        columns: lowStockColumns,
        rows: formattedLowStockList,
      },
      outStock: {
        columns: outStockColumns,
        rows: formattedOutStockList,
      },
    }),
    [
      stockColumns,
      lowStockColumns,
      outStockColumns,
      formattedLowStockList,
      formattedOutStockList,
    ]
  );

  const [currentColumns, setCurrentColumns] =
    useState<GridColDef[]>(stockColumns);

  const filterSelectItems = useMemo(
    () =>
      currentColumns.map((column) => ({
        headerName: column.headerName ?? column.field ?? '',
      })),
    [currentColumns]
  );

  // Dynamic title based on selected dataset
  const pageTitle = useMemo(() => {
    switch (selectedDataset) {
      case 'stockInHand':
        return 'STOCK IN HANDS';
      case 'lowStock':
        return 'LOW STOCK';
      case 'outStock':
        return 'OUT OF STOCK';
      default:
        return 'STOCK IN HANDS';
    }
  }, [selectedDataset]);

  // Dynamic search placeholder based on selected dataset
  const searchPlaceholder = useMemo(() => {
    switch (selectedDataset) {
      case 'stockInHand':
        return 'Search...';
      case 'lowStock':
        return 'Search... ';
      case 'outStock':
        return 'Search...';
      default:
        return 'Search...';
    }
  }, [selectedDataset]);

  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
    if (index === 0) setSelectedDataset('stockInHand');
    if (index === 1) setSelectedDataset('lowStock');
    if (index === 2) setSelectedDataset('outStock');
  };

  type ColumnSelectItem = {
    headerName: string;
  };

  const handleSelectValue = (item: ColumnSelectItem) => {
    const targetHeader = item.headerName;
    let updatedHidden: string[] = [];

    if (hiddenColumns.includes(targetHeader)) {
      updatedHidden = hiddenColumns.filter((field) => field !== targetHeader);
    } else {
      updatedHidden = [...hiddenColumns, targetHeader];
    }

    setHiddenColumns(updatedHidden);
  };

  const handleFilterClear = () => {
    edit.reset();
    setHiddenColumns([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = datasetConfig[selectedDataset];
        setOfferData(config.rows);
        setCurrentColumns(config.columns);
        setHiddenColumns([]);
      } catch (error) {
        setOfferData([]);
        const message =
          error instanceof Error ? error.message : 'Failed to load data';
        toast.error(message);
        console.log(error, 'err');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [datasetConfig, selectedDataset]);

  return (
    <>
      <Grid container spacing={2}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <PageHeader
          title={pageTitle}
          showDownloadBtn={true}
          titleStyle={{ color: theme.Colors.black }}
          showlistBtn={true}
          showCreateBtn={false}
          // showBackButton={false}
          // navigateUrl="/admin/savingScheme/create"
        />
        <Grid container sx={contentLayout}>
          <StockInHandsFilter
            selectItems={filterSelectItems}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
            isOfferPlan={true}
            showCategoryFilters={selectedDataset === 'stockInHand'}
            placeholderText={searchPlaceholder}
          />
          <MUHTable
            columns={currentColumns.filter(
              (column) =>
                !hiddenColumns.includes(column.headerName ?? column.field ?? '')
            )}
            rows={offerData}
            // getRowActions={renderRowAction}
            loading={loading}
            // isCheckboxSelection={false}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default StockList;
