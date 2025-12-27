import React, { useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Checkbox,
  Box,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import { Loader } from '@components/index';
import ResizableHeader, {
  ColumnTableCell,
} from '../../../../utils/renderResizableColumn';
import MenuActionComp from '@components/MenuActionComp';
import TablePagination from '@components/TablePagination';
import Grid from '@mui/material/Grid2';
import { TableArrowIcon } from '@assets/Images/AdminImages';
import { VARIATION_TYPE } from '@constants/Constance';

const RowTableCell = styled(TableCell)(() => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontSize: '14px',
  fontWeight: 400,
  fontFamily: 'Roboto-Regular',
  padding: '15px 5px',
  textAlign: 'center',
  color: '#000000',
}));

interface ColumnDef {
  field: string;
  headerName: string;
}

interface CollapsibleProductTableProps {
  rows: any[];
  columns: ColumnDef[];
  getRowActions: (row: any) => any[];
  isLoading?: boolean;
  onSelectedRowsChange?: (data: any) => void;
  selectedRowIds?: any;
  isPagination?: boolean;
  paginationTextColor?: string;
  totalCount?: number;
  onPaginationChange?: (page: number, limit: number) => void;
}

const CollapsibleProductTable: React.FC<CollapsibleProductTableProps> = ({
  rows,
  columns,
  getRowActions,
  isLoading,
  onSelectedRowsChange,
  selectedRowIds,
  isPagination,
  paginationTextColor,
  totalCount = 0,
  onPaginationChange,
}) => {
  const theme = useTheme();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const selectedRows = selectedRowIds || [];
  const selectAll = rows.length > 0 && selectedRows.length === rows.length;

  const [selectedActionRow, setSelectedActionRow] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    checkbox: 40,
    expand: 30,
    s_no: 50,
    sku_id: 120,
    hsn_code: 110,
    product_name: 200,
    purity: 100,
    variation: 90,
    total_quantity: 90,
    total_weight: 110,
    action: 60,
  });

  const resizingCol = useRef<{
    col: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleExpandClick = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleActionsIconSelect = (e: any, row: any) => {
    if (row?.id === selectedActionRow?.id) {
      setSelectedActionRow(null);
      setAnchorEl(null);
    } else {
      setSelectedActionRow(row);
      setAnchorEl(e.currentTarget);
    }
    e.stopPropagation();
  };

  const renderActions = () => {
    if (!selectedActionRow) return null;
    const rowActions = getRowActions(selectedActionRow);
    return (
      <MenuActionComp
        open={Boolean(anchorEl)}
        selectedActionRow={selectedActionRow}
        rowActions={rowActions}
        handleClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
      />
    );
  };

  const handleCheckboxChange = (row: any) => {
    const updatedSelected = selectedRows.includes(row.id)
      ? selectedRows.filter((id: any) => id !== row.id)
      : [...selectedRows, row.id];

    const selectedData = rows.filter((r) => updatedSelected.includes(r.id));
    onSelectedRowsChange?.(selectedData);
  };

  const handleSelectAll = () => {
    const selectedData = selectAll ? [] : [...rows];
    onSelectedRowsChange?.(selectedData);
  };

  const handleMouseDown = (col: string, e: React.MouseEvent) => {
    resizingCol.current = {
      col,
      startX: e.clientX,
      startWidth: columnWidths[col],
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingCol.current) return;
      const newWidth =
        resizingCol.current.startWidth +
        (moveEvent.clientX - resizingCol.current.startX);

      setColumnWidths((prev) => ({
        ...prev,
        [col]: Math.max(newWidth, 50),
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      resizingCol.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const wrapWithTooltip = (content: React.ReactNode, title: string) => {
    return (
      <Tooltip title={title} arrow>
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {content}
        </span>
      </Tooltip>
    );
  };

  const renderCellContent = (field: string, row: any) => {
    switch (field) {
      case 'sku_id':
        const skuId = row.sku_id || '-';
        return wrapWithTooltip(skuId, skuId);
      case 'hsn_code':
        const hsnCode = row.hsn_code || '-';
        return wrapWithTooltip(hsnCode, hsnCode);
      case 'product_name':
        const productName = row.product_name || '-';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {row?.image_urls?.length > 0 && (
              <img
                src={row.image_urls[0]}
                alt="product"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            )}
            {wrapWithTooltip(productName, productName)}
          </Box>
        );
      // case 'purity':
      // const purityValue = Number(row?.purity);
      // const displayValue =
      //   !isNaN(purityValue) && row?.purity !== null
      //     ? purityValue.toFixed(2) + ' %'
      //     : '-';
      // return wrapWithTooltip(displayValue, displayValue);
      case 'purity':
        const purityValue = Number(row?.purity);
        if (isNaN(purityValue) || row?.purity === null) {
          return wrapWithTooltip('-', '-');
        }
        let purityStr = purityValue.toFixed(2);
        purityStr = purityStr.replace(/0+$/, '').replace(/\.$/, '');
        const purityDisplay = `${purityStr} %`;
        return wrapWithTooltip(purityDisplay, purityDisplay);
      case 'variation':
        const variationCount = row?.itemDetails?.length || row?.variation_count;
        const variationText =
          variationCount && row?.variation_type === VARIATION_TYPE.WITH
            ? variationCount.toString()
            : 'NA';
        return wrapWithTooltip(variationText, variationText);
      case 'total_quantity':
        const quantity = row.total_quantity || '-';
        return wrapWithTooltip(quantity, quantity);
      case 'total_weight':
        const weightValue = Number(row?.total_weight);
        const weightDisplay =
          !isNaN(weightValue) && row?.total_weight !== null
            ? weightValue.toFixed(2) + ' g'
            : '-';
        return wrapWithTooltip(weightDisplay, weightDisplay);
      case 'action':
        return (
          <IconButton onClick={(e) => handleActionsIconSelect(e, row)}>
            <MoreVertIcon style={{ color: theme.Colors.black }} />
            {row.id === selectedActionRow?.id && renderActions()}
          </IconButton>
        );
      case 'expand':
        const hasVariations = row?.variation_type === VARIATION_TYPE.WITH;
        return (
          <IconButton
            onClick={() => hasVariations && handleExpandClick(row.id)}
            disabled={!hasVariations}
            sx={{
              p: '0px',
              opacity: hasVariations ? 1 : 0.5,
              cursor: hasVariations ? 'pointer' : 'not-allowed',
            }}
          >
            <img
              src={TableArrowIcon}
              alt=""
              style={{
                width: '24px',
                height: '24px',
                transform:
                  expandedRow === row.id ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </IconButton>
        );
      default:
        const defaultValue = row[field] ?? '';
        return wrapWithTooltip(defaultValue, String(defaultValue));
    }
  };

  const renderChildCellContent = (field: string, child: any, parent: any) => {
    switch (field) {
      case 'sku_id':
        const childSkuId = child.sku_id || '-';
        return wrapWithTooltip(childSkuId, childSkuId);
      case 'hsn_code':
        const parentHsnCode = parent.hsn_code || '-';
        return wrapWithTooltip(parentHsnCode, parentHsnCode);
      case 'product_name':
        const netWeight = Number(child?.net_weight);
        const weightText =
          !isNaN(netWeight) && child?.net_weight !== null
            ? `${netWeight.toFixed(2)} g`
            : '';
        const productNameText = parent?.product_name || '-';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {parent?.image_urls?.length > 0 && (
              <img
                src={parent.image_urls[0]}
                alt="product"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  objectFit: 'cover',
                }}
              />
            )}
            <Box>
              <Tooltip title={productNameText} arrow>
                <Typography
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {productNameText}
                </Typography>
              </Tooltip>
              {weightText && (
                <Tooltip title={weightText} arrow>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    {weightText}
                  </Typography>
                </Tooltip>
              )}
            </Box>
          </Box>
        );
      case 'quantity':
        const childQuantity = child.quantity || '-';
        return wrapWithTooltip(childQuantity, childQuantity);
      case 'weight':
        const childWeight =
          Number(child?.net_weight) * Number(child?.quantity || 0);
        const childWeightDisplay =
          !isNaN(childWeight) && child?.net_weight !== null
            ? childWeight.toFixed(2) + ' g'
            : '-';
        return wrapWithTooltip(childWeightDisplay, childWeightDisplay);
      case 'action':
        return (
          <IconButton>
            <MoreVertIcon style={{ color: theme.Colors.blackPrimary }} />
          </IconButton>
        );
      default:
        const defaultValue = child[field] ?? '';
        return wrapWithTooltip(defaultValue, String(defaultValue));
    }
  };

  return (
    <Grid sx={{ backgroundColor: '#FFFFFF', width: '100%' }}>
      {isLoading ? (
        <Loader />
      ) : (
        <TableContainer
          component={Paper}
          className="p-4"
          sx={{
            boxShadow: 'none',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                background: '#a8a8a8',
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#c1c1c1 #f1f1f1',
          }}
        >
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow
                style={{
                  background: theme.Colors.whiteLight,
                }}
              >
                {/* Checkbox header */}
                <ResizableHeader
                  colKey="checkbox"
                  label={
                    <Checkbox
                      size="small"
                      sx={{
                        ml: 0.9,
                        width: '18px !important',
                        height: '18px !important',
                        padding: 0,
                        // color: theme.Colors.grayBorderLight,
                        '&.Mui-checked': {
                          color: theme.Colors.primary,
                        },
                        '& .MuiSvgIcon-root': {
                          width: '18px',
                          height: '18px',
                        },
                      }}
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < rows.length
                      }
                      checked={
                        rows.length > 0 && selectedRows.length === rows.length
                      }
                      onChange={handleSelectAll}
                    />
                  }
                  width={columnWidths.checkbox}
                  onMouseDown={handleMouseDown}
                />

                {/* Other columns dynamically */}
                {columns.map((col) => (
                  <ResizableHeader
                    key={col.field}
                    colKey={col.field}
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'left',
                          fontWeight: 600,
                          fontSize: '13.5px',
                          fontFamily: theme.fontFamily.roboto,
                        }}
                      >
                        {col.headerName}
                        {/* {!['s_no', 'action', 'expand'].includes(col.field) && (
                          <ArrowUpward sx={{ fontSize: '18px', ml: 0.5 }} />
                        )} */}
                      </Box>
                    }
                    width={columnWidths[col.field] ?? 120}
                    onMouseDown={handleMouseDown}
                  />
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    sx={{
                      height: '65px',
                      '&:hover': {
                        backgroundColor: selectedRows.includes(row.id)
                          ? 'rgba(109, 46, 61, 0.08)'
                          : theme.Colors.whitePure,
                      },
                      backgroundColor: selectedRows.includes(row.id)
                        ? 'rgba(109, 46, 61, 0.08)'
                        : 'inherit',
                    }}
                  >
                    {/* Checkbox cell */}
                    <RowTableCell
                      sx={{
                        width: columnWidths.checkbox,
                      }}
                    >
                      <Checkbox
                        size="small"
                        sx={{
                          ml: 0.9,
                          width: '18px !important',
                          height: '18px !important',
                          padding: 0,
                          // color: theme.Colors.grayBorderLight,
                          '&.Mui-checked': {
                            color: theme.Colors.primary,
                          },
                          '& .MuiSvgIcon-root': {
                            width: '18px',
                            height: '18px',
                          },
                        }}
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleCheckboxChange(row)}
                      />
                    </RowTableCell>
                    {/* Other dynamic cells */}
                    {columns.map((col) => (
                      <RowTableCell
                        key={col.field}
                        sx={{
                          width: columnWidths[col.field] ?? 120,
                          textAlign: 'left',
                          pl: col.field === 's_no' ? 1 : 0,
                          color: '#000000',
                          fontWeight: 400,
                          fontSize: '14px',
                        }}
                      >
                        <Box>{renderCellContent(col.field, row)}</Box>
                      </RowTableCell>
                    ))}
                  </TableRow>

                  {/* Collapsible children */}
                  {Array.isArray(row.itemDetails) &&
                    row.itemDetails.length > 0 &&
                    row?.variation_type === VARIATION_TYPE.WITH && (
                      <TableRow>
                        <RowTableCell
                          style={{
                            padding: 0,
                            border: '0px !important',
                          }}
                          colSpan={columns.length + 1}
                        >
                          <Collapse
                            in={expandedRow === row.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow
                                  style={{
                                    background: theme.Colors.whiteLight,
                                    // textAlign: 'start',
                                  }}
                                >
                                  <ColumnTableCell
                                    sx={{
                                      width: 130,
                                    }}
                                  ></ColumnTableCell>
                                  {[
                                    'SKU ID',
                                    'HSN Code',
                                    'Product Name',
                                    'Quantity',
                                    'Weight',
                                    '',
                                  ].map((head) => (
                                    <ColumnTableCell key={head}>
                                      {head}
                                    </ColumnTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody
                              // style={{
                              //   background: them,
                              // }}
                              >
                                {row.itemDetails.map((child: any) => (
                                  <TableRow key={child.id}>
                                    <RowTableCell sx={{ width: 130 }} />
                                    <RowTableCell
                                      sx={{
                                        textAlign: 'start',
                                        width: 120,
                                      }}
                                    >
                                      {renderChildCellContent(
                                        'sku_id',
                                        child,
                                        row
                                      )}
                                    </RowTableCell>
                                    <RowTableCell
                                      sx={{ textAlign: 'start', width: 110 }}
                                    >
                                      {renderChildCellContent(
                                        'hsn_code',
                                        child,
                                        row
                                      )}
                                    </RowTableCell>
                                    <RowTableCell sx={{ width: 320 }}>
                                      {renderChildCellContent(
                                        'product_name',
                                        child,
                                        row
                                      )}
                                    </RowTableCell>
                                    <RowTableCell sx={{ textAlign: 'start' }}>
                                      {renderChildCellContent(
                                        'quantity',
                                        child,
                                        row
                                      )}
                                    </RowTableCell>
                                    <RowTableCell sx={{ textAlign: 'start' }}>
                                      {renderChildCellContent(
                                        'weight',
                                        child,
                                        row
                                      )}
                                    </RowTableCell>
                                    <RowTableCell>
                                      {renderChildCellContent(
                                        'action',
                                        child,
                                        row
                                      )}
                                    </RowTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </RowTableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isPagination && (
        <TablePagination
          totalRows={totalCount}
          isPagination={isPagination}
          paginationTextColor={paginationTextColor}
          onPageChange={(page, limit) => {
            onPaginationChange?.(page, limit);
          }}
        />
      )}
    </Grid>
  );
};

export default CollapsibleProductTable;
