import { contentLayout } from '@components/CommonStyles';
import Grid from '@mui/material/Grid2';
import ProductTableFilter from './ProductTableFilter';
import { ConfirmModal } from '@components/index';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DeleteOutlinedIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { API_SERVICES } from '@services/index';
import CollapsibleProductTable from './CollapsibleProductTable';
import { useDebounce } from '@hooks/useDebounce';

type ViewProductSummaryProps = {
  refNoId: string | number;
  showPageHeader?: boolean;
};

const ViewProductSummary: React.FC<ViewProductSummaryProps> = ({ refNoId, showPageHeader = true }) => {
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [productData, setProductData] = useState<object[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<any[]>([]);

  const initialValues = {
    material_type_id: '',
    category_id: '',
    subcategory_id: '',
    search: '',
  };

  const edit = useEdit(initialValues);
  const debouncedSearch = useDebounce(edit.getValue('search'), 500);

  const columns = [
    { field: 'expand', headerName: '' },
    { field: 's_no', headerName: 'S.No' },
    { field: 'sku_id', headerName: 'SKU ID' },
    { field: 'hsn_code', headerName: 'HSN Code' },
    { field: 'product_name', headerName: 'Product Name' },
    { field: 'purity', headerName: 'Purity' },
    { field: 'variation', headerName: 'Variation' },
    { field: 'total_quantity', headerName: 'Quantity' },
    { field: 'total_weight', headerName: 'Weight' },
    { field: 'action', headerName: 'Action' },
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
    setCurrentPage(1);
  };

  const handleEditProduct = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    // navigateTo(`/admin/master/product/form?${params}`);
  };

  const handleDeleteProduct = async (rowData: any) => {
    try {
      handleCancelModal();
      setLoading(true);
      await API_SERVICES.ProductService.delete(rowData?.id, {
        successMessage: 'Product deleted successfully',
        failureMessage: 'Failed to delete product',
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setLoading(false);
    }
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
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () =>
              handleEditProduct(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditProduct(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Delete',
        renderIcon: () => <DeleteOutlinedIcon />,
        onClick: () => {
          const props = {
            title: 'Delete Product',
            description: 'Are you sure you want to delete this product?',
            onCancelClick: () => handleCancelModal(),
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: () => handleDeleteProduct(rowData),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setProductData([]);

      const params: any = {
        ref_no_id: refNoId,
        page: currentPage,
        limit: pageLimit,
      };
      const materialTypeId = edit.getValue('material_type_id')?.value;
      const categoryId = edit.getValue('category_id')?.value;
      const subcategoryId = edit.getValue('subcategory_id')?.value;
      const search = edit.getValue('search');

      if (materialTypeId) {
        params.material_type_id = materialTypeId;
      }
      if (categoryId) {
        params.category_id = categoryId;
      }
      if (subcategoryId) {
        params.subcategory_id = subcategoryId;
      }
      if (search) {
        params.search = search;
      }

      const response: any = await API_SERVICES.ProductService.getAll(params);
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const products = response?.data?.data?.products ?? [];
        const pagination = response?.data?.data?.pagination;
        const total = pagination?.total ?? products.length;
        
        // Calculate s_no based on current page
        const startIndex = (currentPage - 1) * pageLimit;
        for (let i = 0; i < products?.length; i++) {
          products[i].s_no = startIndex + i + 1;
        }
        
        setProductData(products);
        setTotalCount(total);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    edit.getValue('material_type_id'),
    edit.getValue('category_id'),
    edit.getValue('subcategory_id'),
    debouncedSearch,
  ]);

  useEffect(() => {
    if (refNoId) {
      fetchData();
    }
  }, [
    refNoId,
    edit.getValue('material_type_id'),
    edit.getValue('category_id'),
    edit.getValue('subcategory_id'),
    debouncedSearch,
    currentPage,
    pageLimit,
  ]);

  const handlePaginationChange = (page: number, limit: number) => {
    setCurrentPage(page);
    setPageLimit(limit);
  };

  return (
    <>
      {showPageHeader && (
        <PageHeader
          title="Product Summary"
          count={totalCount}
          btnName="Create Product"
          navigateUrl="/admin/master/product/form?type=create"
          showDownloadBtn={true}
          showCreateBtn={true}
        />
      )}
      <Grid container sx={contentLayout}>
        <ProductTableFilter
          selectItems={columns.filter((i) => i.field !== 'expand')}
          selectedValue={hiddenColumns}
          handleSelectValue={handleSelectValue}
          handleFilterClear={handleFilterClear}
          edit={edit}
          isViewSummary={true}
        />
        <CollapsibleProductTable
          rows={productData}
          isPagination={true}
          totalCount={totalCount}
          onPaginationChange={handlePaginationChange}
          columns={columns.filter(
            (col) => !hiddenColumns.includes(col.headerName)
          )}
          getRowActions={renderRowAction}
          isLoading={loading}
          onSelectedRowsChange={(selected) => {
            setSelectedProductIds(selected.map((p: any) => p.id));
          }}
          selectedRowIds={selectedProductIds}
        />
        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </>
  );
};

export default ViewProductSummary;