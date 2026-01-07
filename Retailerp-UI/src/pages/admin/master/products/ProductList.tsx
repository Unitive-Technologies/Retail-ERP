import { contentLayout } from '@components/CommonStyles';
import Grid from '@mui/material/Grid2';
import ProductTableFilter from './ProductTableFilter';
import { ConfirmModal } from '@components/index';
import {
  CONFIRM_MODAL,
  HTTP_STATUSES,
  VARIATION_TYPE,
} from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  DeleteOutlinedIcon,
  PendingIcon,
  RowEditIcon,
  RowViewIcon,
  SoldOutIcon,
} from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { API_SERVICES } from '@services/index';
import CollapsibleProductTable from './CollapsibleProductTable';
import { useDebounce } from '@hooks/useDebounce';
import MenuDropDown from '@components/MUHMenuDropDown';
import {
  PDF_TITLE,
  PRODUCT_LIST_COLUMN_MAPPING,
  PRODUCT_LIST_PDF_HEADERS,
} from '@constants/PdfConstants';
import StatusCard from '@components/StatusCard';
import { useTheme } from '@mui/material';
import { InActiveStatusIcon } from '@assets/Images/AdminImages';

const ProductList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [productData, setProductData] = useState<object[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<any[]>([]);
  const [cardCounts, setCardCounts] = useState({
    stockInHand: 0,
    stockQty: 0,
    deleted: 0,
    soldOut: 0,
  });

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const card = [
    {
      img: InActiveStatusIcon,
      img2: InActiveStatusIcon,
      title: 'Stock In Hand',

      value: cardCounts.stockInHand,

      qty: cardCounts.stockQty,
      activeTab: activeTab,
    },
    {
      img: PendingIcon,
      img2: PendingIcon,
      title: 'Deleted Products',
      value: cardCounts.deleted,
      activeTab: activeTab,
    },
    {
      img: SoldOutIcon,
      img2: SoldOutIcon,
      title: 'Sold Out',
      value: cardCounts.soldOut,
      activeTab: activeTab,
    },
  ];
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
    { field: 'branch_name', headerName: 'Branch' },
    { field: 'grn_no', headerName: 'GRN No.' },
    { field: 'ref_no_id', headerName: 'Ref No.' },
    { field: 'sku_id', headerName: 'SKU ID' },
    // { field: 'hsn_code', headerName: 'HSN Code' },
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

  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1);
  };
  const calculateTotals = (details: any[] = []) => {
    return details.reduce(
      (acc, curr) => {
        acc.total_quantity += Number(curr.quantity || 0);
        acc.total_weight += Number(curr.net_weight || 0);
        return acc;
      },
      { total_quantity: 0, total_weight: 0 }
    );
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
    navigateTo(`/admin/master/product/form?${params}`);
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

  const fetchProductCounts = async () => {
    try {
      const response: any = await API_SERVICES.ProductListCountService.getAll();

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const data = response?.data?.data;

        setCardCounts({
          stockInHand: data?.stockInHand?.productCount ?? 0,
          stockQty: data?.stockInHand?.totalQuantity ?? 0, // ✅ FIX HERE
          deleted: data?.deleted ?? 0,
          soldOut: data?.soldOut ?? 0,
        });
      }
    } catch (error) {
      toast.error('Unable to load product counts');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductCounts();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    edit.getValue('material_type_id'),
    edit.getValue('category_id'),
    edit.getValue('subcategory_id'),
    debouncedSearch,
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setProductData([]);

      const params: any = {
        page: currentPage,
        limit: pageLimit,
      };

      const materialTypeId = edit.getValue('material_type_id')?.value;
      const categoryId = edit.getValue('category_id')?.value;
      const subcategoryId = edit.getValue('subcategory_id')?.value;
      const search = edit.getValue('search');

      if (materialTypeId) params.material_type_id = materialTypeId;
      if (categoryId) params.category_id = categoryId;
      if (subcategoryId) params.subcategory_id = subcategoryId;
      if (search) params.search = search;

      let response: any;

      // ---------------- API Call by Tab ----------------
      switch (activeTab) {
        case 1: // Deleted Products
          response = await API_SERVICES.ProductDeleteService.getAll(params);
          break;

        case 2: // Sold Out
          response = await API_SERVICES.ProductSoldOutService.getAll(params);
          break;

        default: // Stock In Hand
          response =
            await API_SERVICES.ProductStockInHandsService.getAll(params);
          break;
      }

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const products = response?.data?.data?.products ?? [];
        console.log('Sold Out API response:', products);
        const pagination = response?.data?.data?.pagination;
        const total = pagination?.total ?? products.length;

        const startIndex = (currentPage - 1) * pageLimit;

        // ---------------- Data Mapping ----------------
        const mappedProducts = products.map((item: any, index: number) => {
          let details: any[] = [];

          // ✅ Deleted / Sold Out (item_details)
          if (
            Array.isArray(item.item_details) &&
            item.item_details.length > 0
          ) {
            details = item.item_details.map((i: any, idx: number) => ({
              ...i,
              id: i.id || idx + Math.random(),
            }));
          }

          // ✅ Stock In Hand (variations)
          else if (activeTab === 0 && Array.isArray(item.variations)) {
            details = item.variations.map((v: any, idx: number) => ({
              // id: v.id || idx + Math.random(),
              id: v.id || `${item.id}-${idx}`,
              branch_name: item.branch_name,
              sku_id: v.sku_id || '-',
              product_name: item.product_name || '-',
              quantity: v.quantity ?? 0,
              weight: v.weight ?? 0,
              purity: item.purity || '-',
              variation: v.variation_name || 'NA',
            }));
          }

          // ---------------- Totals Calculation ----------------
          const { total_quantity, total_weight } =
            activeTab === 1 || activeTab === 2
              ? calculateTotals(details)
              : {
                  total_quantity: item.total_quantity ?? 0,
                  total_weight: item.total_weight ?? 0,
                };

          return {
            ...item,
            s_no: startIndex + index + 1,
            itemDetails: details,
            total_quantity,
            total_weight: total_weight,
          };
        });

        setProductData(mappedProducts);
        setTotalCount(total);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    activeTab,
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

  // PDF / Print config
  const columnMapping = PRODUCT_LIST_COLUMN_MAPPING;
  const pdfHeaders = PRODUCT_LIST_PDF_HEADERS;
  const fileName = PDF_TITLE.productList;

  const pdfData: any = productData?.length
    ? productData.map((row: any, index: number) => {
        const variationCount = row?.itemDetails?.length || row?.variation_count;
        const variationText =
          variationCount && row?.variation_type === VARIATION_TYPE.WITH
            ? variationCount.toString()
            : 'NA';

        return {
          s_no: row?.s_no ?? index + 1,
          sku_id: row?.sku_id || '-',
          hsn_code: row?.hsn_code || '-',
          product_name: row?.product_name || '-',
          purity: row?.purity || '-',
          variation: variationText,
          total_quantity: row?.total_quantity ?? '',
          total_weight: row?.total_weight ?? '',
          image_urls: row?.image_urls || [],
        };
      })
    : [];

  const handleOpenDownloadMenu = (e: any) => {
    setMenuAnchorEl(e.currentTarget as HTMLElement);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="Product list"
          titleStyle={{ color: theme.Colors.black }}
          count={totalCount}
          btnName="Create Product"
          navigateUrl="/admin/master/product/form?type=create"
          showDownloadBtn={true}
          onDownloadClick={handleOpenDownloadMenu}
          onPrintClick={() => window.print()}
        />
        <StatusCard data={card} onClickCard={onclickActiveTab} />
      </Grid>
      <Grid container sx={contentLayout} className="print-area">
        {/* Print heading */}
        <div className="print-only" style={{ width: '100%', marginBottom: 12 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#000',
              paddingBottom: 8,
              marginBottom: 8,
            }}
          >
            Product List ({productData?.length})
          </div>
        </div>

        {/* Simple print-only table to avoid horizontal scroll cut-off */}
        <div className="print-only" style={{ width: '100%', marginBottom: 16 }}>
          <table
            style={{
              width: '100%',
              tableLayout: 'fixed',
              fontSize: 11,
            }}
          >
            <thead>
              <tr>
                {PRODUCT_LIST_PDF_HEADERS.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: '8px 4px',
                      backgroundColor: '#f3e1e5',
                      textAlign: 'left',
                      fontWeight: 600,
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pdfData.map((row: any, index: number) => (
                <tr key={index}>
                  {PRODUCT_LIST_PDF_HEADERS.map((col) => {
                    if (col.key === 'product_name') {
                      const name = row.product_name ?? '';
                      const imageUrl =
                        Array.isArray(row.image_urls) && row.image_urls.length
                          ? row.image_urls[0]
                          : null;
                      return (
                        <td
                          key={col.key}
                          style={{
                            padding: '6px 4px',
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                            borderBottom: '1px solid #f0f0f0',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt="product"
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                            <span>{name}</span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={col.key}
                        style={{
                          padding: '6px 4px',
                          wordWrap: 'break-word',
                          whiteSpace: 'normal',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        {row[col.key] ?? ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Filters & download - hide in print */}
        <div className="print-hide" style={{ width: '100%' }}>
          <MenuDropDown
            anchorEl={menuAnchorEl}
            handleCloseMenu={handleCloseMenu}
            hiddenCols={hiddenColumns}
            columnMapping={columnMapping}
            pdfData={pdfData}
            pdfHeaders={pdfHeaders}
            fileName={fileName}
            address={''}
          />
          <ProductTableFilter
            selectItems={columns.filter((i) => i.field !== 'expand')}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
        </div>

        {/* Main interactive table - hidden in print */}
        <div className="print-hide" style={{ width: '100%' }}>
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
        </div>
        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </>
  );
};

export default ProductList;
