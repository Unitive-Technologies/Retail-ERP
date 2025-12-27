import React, { useEffect, useState } from 'react';
import { IconButton, SxProps } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridCallbackDetails,
  GridColDef,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import MenuActionComp from './MenuActionComp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TablePagination from './TablePagination';
import Grid from '@mui/material/Grid2';
import MUHLoader from './MUHLoader';
import * as theme from '../theme/schemes/PurelightTheme';

type Props = DataGridProps & {
  columns: GridColDef[];
  getRowActions?: any;
  actionIconStyle?: React.CSSProperties;
  onSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => void;
  rowHeight?: number;
  rows: any[];
  isPagination?: boolean;
  renderSelectBox?: () => React.ReactNode;
  isLoading?: boolean;
  checkboxSelection?: boolean;
  paginationTextColor?: string;
  paginationBadgeColor?: string;
  paginationBorderColor?: string;
  isCheckboxSelection?: boolean;
  tableStyle?: any;
};

const checkBoxContainerStyle: SxProps = {
  width: '40px !important',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  // color:theme.Colors.grayBorderLight
};

const checkBoxStyle: SxProps = {
  ml: 0.9,
  width: '18px !important',
  height: '18px !important',
  // color:theme.Colors.grayBorderLight,
};

const cellStyle: SxProps = {
  color: theme.Colors.black,
  fontWeight: 400,
  fontSize: '14px',
  fontFamily: 'Roboto-Regular',
};

const columnCellStyle: SxProps = {
  backgroundColor: theme.Colors.whiteLight,
  fontSize: '13.5px',
  fontWeight: 600,
  fontFamily: 'Roboto-Regular',
  color: theme.Colors.black,
};

const columnSeperatorStyle: SxProps = {
  color: 'transparent',
  ':hover': {
    color: theme.Colors.grayBorderLight,
  },
};

const actionColumnStyle: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
};

const actionDefaultStyle: SxProps = {
  color: theme.Colors.black,
  fontWeight: 400,
  fontSize: '20px',
};

const TableComponent = (props: Props) => {
  const {
    columns,
    getRowActions,
    actionIconStyle,
    rowHeight,
    rows,
    isPagination = true,
    onSelectionModelChange,
    renderSelectBox,
    isLoading,
    checkboxSelection = true,
    paginationTextColor,
    paginationBadgeColor,
    paginationBorderColor,
    isCheckboxSelection = true,
    tableStyle,
    ...rest
  } = props;
  const [colDefs, setColDefs] = useState(columns);
  const [selectedActionRow, setSelectedActionRow] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentValue, setCurrentValue] = useState(10);

  const handleClose = () => {
    setAnchorEl(null);
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
    if (!selectedActionRow) {
      return;
    }
    const rowActions = getRowActions(selectedActionRow);
    if (!rowActions?.length) {
      return;
    }
    return (
      <MenuActionComp
        open={open}
        selectedActionRow={selectedActionRow}
        rowActions={rowActions}
        handleClose={handleClose}
        anchorEl={anchorEl}
      />
    );
  };

  useEffect(() => {
    const updatedDefs = [...columns];
    if (getRowActions) {
      updatedDefs.push({
        headerName: 'Action',
        field: 'action',
        sortable: false,
        disableColumnMenu: true,
        flex: 0.5,
        renderCell: ({ row }: any) => (
          <Grid sx={actionColumnStyle}>
            <IconButton onClick={(e) => handleActionsIconSelect(e, row)}>
              <MoreVertIcon
                sx={{ ...actionDefaultStyle, ...actionIconStyle }}
              />
              {row.id === selectedActionRow?.id && renderActions()}
            </IconButton>
          </Grid>
        ),
      });
    }
    setColDefs(updatedDefs);
  }, [selectedActionRow, columns]);

  return (
    <Grid width={'100%'}>
      {isLoading ? (
        <MUHLoader />
      ) : (
        <Grid size={12}>
          <DataGrid
            columns={colDefs}
            rows={isPagination ? rows.slice(
              (currentPage - 1) * currentValue,
              currentPage * currentValue
            ) : rows}
            checkboxSelection={isCheckboxSelection ? true : false}
            disableRowSelectionOnClick
            columnHeaderHeight={45}
            rowHeight={65}
            disableEval={true}
            hideFooter={true}
            sx={{
              border: 'none',
              '& .MuiDataGrid-row': {
                borderBottom: `1px solid ${theme.Colors.blueLightLow}`,
              },
              '& .MuiCheckbox-root': {
                '&:hover': { backgroundColor: 'transparent' },
              },
              '& .MuiDataGrid-cellCheckbox': checkBoxContainerStyle,
              '& .MuiDataGrid-columnHeaderCheckbox': checkBoxContainerStyle,
              '& .MuiCheckbox-root svg': checkBoxStyle,
              '& .MuiDataGrid-cell': {
                ...cellStyle as any,
                ...(isCheckboxSelection ? {} : { paddingLeft: 5 }),
              },
              '& .MuiDataGrid-columnHeader': {
                ...columnCellStyle as any,
                ...(isCheckboxSelection ? {} : { paddingLeft: 5 }),
              },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 },
              '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
              '& .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
              '& .MuiDataGrid-columnSeparator': columnSeperatorStyle,
              '& .MuiTouchRipple-root': { display: 'none' },
              '& .MuiDataGrid-cellEmpty': { display: 'none !important' },
              ...tableStyle,
            }}
            {...rest}
          />
          <TablePagination
            totalRows={rows.length}
            isPagination={isPagination}
            paginationTextColor={paginationTextColor}
            paginationBadgeColor={paginationBadgeColor}
            paginationBorderColor={paginationBorderColor}
            onPageChange={(page, value) => {
              setCurrentPage(page);
              setCurrentValue(value);
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default TableComponent;
