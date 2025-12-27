/* eslint-disable react/prop-types */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  memo,
  useMemo,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
  useState,
  useEffect,
} from 'react';
import { Grid, styled, useTheme } from '@mui/material';
import type { ReactElement } from 'react';
import toast from 'react-hot-toast';
import { Delete } from '@mui/icons-material';
import { CONFIRM_MODAL } from '@constants/Constance';
import { PlusIcon } from '@assets/Images';

export interface TableRowData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface RenderCellProps {
  row: TableRowData;
  isEditable: boolean;
  rowIndex: number;
  handleRowDataChange: (rowIndex: number, values: TableRowData) => void;
  itmIndex?: number;
}

export interface TableColumnProps extends TableCellProps {
  title: string;
  field: string;
  renderCell?: (props: RenderCellProps) => ReactElement | JSX.Element | string;
  align?: TableCellProps['align'];
  colSpan?: TableCellProps['colSpan'];
}

export interface TableComponentProps {
  tableColumnProperties: TableColumnProps[];
  tableRowData: TableRowData[];
  isSerialNoColumn?: boolean;
  handleAddService?: () => void;
  handleDelete?: (val: unknown, idx: number) => void;
  onTableDataChange?: (data: TableRowData[]) => void;
  type: string | null;
}

export interface TableV2Ref {
  makeRowEditable: (rowIndex: number) => void;
  handleCancelEdits: () => void;
  addNewEditableRow: (emptyRowTemplate?: TableRowData) => void;
  isValid: (requiredFields?: string[]) => boolean;
  getEditedRow: () => TableRowData;
  getEditedLength: () => number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.Colors.blackPrimary,
  fontWeight: theme.fontWeight.mediumBold,
  fontSize: theme.MetricsSizes.small_xx,
  padding: '16px 14px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  background: 'transparent',
}));

const TableV2 = memo(
  forwardRef<TableV2Ref, TableComponentProps>(function TableV2(
    {
      tableColumnProperties,
      tableRowData = [],
      isSerialNoColumn = false,
      handleAddService,
      handleDelete,
      onTableDataChange,
      type,
    },
    ref: ForwardedRef<TableV2Ref>
  ) {
    const theme = useTheme();

    const [editableIndex, setEditableIndex] = useState<number | null>(null);
    const [internalData, setInternalData] =
      useState<TableRowData[]>(tableRowData);
    const [originalData, setOriginalData] = useState<TableRowData[]>([]);

    // Update internal data when tableRowData changes from parent
    // useEffect(() => {
    //   setInternalData(tableRowData);
    // }, [tableRowData]);

    useEffect(() => {
      if (editableIndex === null) {
        console.log(tableRowData, 'rowData');
        setInternalData(tableRowData);
      }
    }, [tableRowData, editableIndex]);

    useImperativeHandle(
      ref,
      () => ({
        makeRowEditable: (rowIndex) => {
          // if (editableIndex !== null) {
          //   toast.error('Already have a editable row');
          //   return;
          // }
          // Store original data before making row editable
          setOriginalData([...internalData]);
          setEditableIndex(rowIndex);
        },
        handleCancelEdits: () => {
          setInternalData(originalData);
          setEditableIndex(null);
        },
        addNewEditableRow: (emptyRowTemplate?: TableRowData) => {
          //   if (editableIndex !== null) {
          //     toast.error('Already have a editable row');
          //     return;
          //   }
          const emptyRow = emptyRowTemplate || {};
          setOriginalData([...internalData]);
          // setInternalData((prev) => [...prev, emptyRow]);
          setInternalData((prev) => {
            const newRowIndex = prev.length;
            setEditableIndex(newRowIndex);
            return [...prev, emptyRow];
          });
          setEditableIndex(internalData.length);
        },
        isValid: (requiredFields?: string[]) => {
          if (editableIndex === null) return true;
          const currentRow = internalData[editableIndex];
          const fieldsToValidate = requiredFields || Object.keys(currentRow);

          // Check if all required fields have values
          for (const field of fieldsToValidate) {
            if (
              currentRow[field] === undefined ||
              currentRow[field] === null ||
              currentRow[field] === ''
            ) {
              toast.error(`${field} is required`);
              return false;
            }
          }

          // All validations passed
          return true;
        },
        getEditedRow: () => {
          return internalData[editableIndex as number];
        },
        getEditedLength: () => internalData.length,
      }),
      [editableIndex, internalData, originalData]
    );

    const handleRowDataChange = (rowIndex: number, values: TableRowData) => {
      const newData = [...internalData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        ...values,
      };
      setInternalData(newData);
      onTableDataChange?.(newData);
    };
    // const handleRowDataChange = (rowIndex: number, values: TableRowData) => {
    //   const newData = [...tableRowData];
    //   newData[rowIndex] = {
    //     ...newData[rowIndex],
    //     ...values,
    //   };
    //   // Call parent function to update
    //   onTableDataChange?.(newData);
    // };

    const renderTableHeader = useMemo(() => {
      return tableColumnProperties?.length
        ? tableColumnProperties.map((item, index) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { renderCell, title, field, ...rest } = item;
            return (
              <StyledTableCell
                key={index}
                colSpan={item?.colSpan || 1}
                align={item?.align || 'left'}
                {...rest}
              >
                {title}
              </StyledTableCell>
            );
          })
        : null;
    }, [tableColumnProperties]);

    const renderTableRow = (row: TableRowData, rowIndex: number) => {
      return tableColumnProperties?.length
        ? tableColumnProperties.map((item, index) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { renderCell, title, field, ...rest } = item;
            return (
              <StyledTableCell
                key={index}
                colSpan={item?.colSpan || 1}
                align={item?.align || 'left'}
                sx={{
                  color: theme.Colors.black,
                  fontWeight: 400,
                  padding: '1px 1px',
                }}
                {...rest}
              >
                {renderCell?.({
                  row,
                  isEditable: editableIndex === rowIndex,
                  rowIndex,
                  handleRowDataChange,
                  itmIndex: index,
                }) ?? row[field]}
              </StyledTableCell>
            );
          })
        : null;
    };

    return (
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: '50vh',
          width: '100%',
          //border: `1.5px solid ${theme.Colors.ashyGray}`,
          padding: '0px !important',
        }}
      >
        {' '}
        <Table stickyHeader sx={{ width: '100%', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.Colors.whiteLight,
                position: 'sticky',
                zIndex: 3,
              }}
            >
              {isSerialNoColumn ? (
                <StyledTableCell
                  colSpan={1}
                  align={'left'}
                  sx={{ width: '100px' }}
                >
                  S.No
                </StyledTableCell>
              ) : null}
              {renderTableHeader}
              {isSerialNoColumn && type == CONFIRM_MODAL.view ? (
                <StyledTableCell
                  colSpan={1}
                  align={'center'}
                  sx={{ width: '100px' }}
                >
                  Action
                </StyledTableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {internalData?.length
              ? internalData.map((row, index) => (
                  <TableRow
                    sx={{
                      //   backgroundColor:
                      //     index % 2 ? theme.Colors.whitePrimary : '#F8F8F8',
                      //   '&:last-child td, &:last-child th': { border: 0 },
                      borderBottom: '#D9D5EC',
                    }}
                    key={`row-${index}`}
                  >
                    {isSerialNoColumn ? (
                      <StyledTableCell
                        colSpan={1}
                        align={'left'}
                        sx={{
                          minWidth: 50,
                          color: theme.Colors.black,
                          fontWeight: 400,
                        }}
                      >
                        {index + 1}
                      </StyledTableCell>
                    ) : null}
                    {renderTableRow(row, index)}
                    {isSerialNoColumn && type == CONFIRM_MODAL.view ? (
                      <StyledTableCell
                        colSpan={1}
                        align={'center'}
                        sx={{
                          minWidth: 100,
                          color: theme.Colors.black,
                          fontWeight: 400,
                          cursor: 'pointer',
                        }}
                      >
                        {index === internalData?.length - 1 ? (
                          <Grid
                            container
                            justifyContent={'center'}
                            alignItems={'center'}
                            gap={1}
                          >
                            <PlusIcon onClick={handleAddService} />
                          </Grid>
                        ) : (
                          <Delete
                            onClick={() =>
                              handleDelete && handleDelete(row, index)
                            }
                            style={{ color: theme.Colors.primary }}
                          />
                        )}
                      </StyledTableCell>
                    ) : null}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    );
  })
);

export default TableV2;
