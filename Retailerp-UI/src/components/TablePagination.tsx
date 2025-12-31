import { useState, useEffect, ReactElement } from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FirstPage, LastPage } from '@mui/icons-material';
import MUHSelectBoxComponent from './MUHSelectBoxComponent';
import MUHTypography from './MUHTypography';

interface TablePaginationProps {
  totalRows: number;
  isPagination?: boolean;
  paginationTextColor?: string;
  paginationBadgeColor?: string;
  paginationBorderColor?: string;
  onPageChange: (page: number, value: number) => void;
  initialValue?: number;
  renderItem?: (item: PaginationRenderItemParams) => ReactElement;
}

const paginationOptions = [5, 10, 20];

const TablePagination = ({
  totalRows,
  isPagination = true,
  paginationBadgeColor,
  onPageChange,
  initialValue = paginationOptions[1],
  renderItem,
}: TablePaginationProps) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const count = totalRows ? Math.ceil(totalRows / value) : 1;
    setPageCount(count);
    setPage(1);
    onPageChange(1, value);
  }, [totalRows, value]);

  const handleChangePagination = (event: any, newPage: number) => {
    event.preventDefault();
    setPage(newPage);
    onPageChange(newPage, value);
  };

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  if (!isPagination) return null;

  return (
    <Grid
      container
      alignItems="center"
      justifyContent={'space-between'}
      px={2.5}
      py={2}
      className="table-pagination"
    >
      <Grid minWidth={'120px'}>
        <MUHSelectBoxComponent
          isPlaceholderNone
          isCheckbox={false}
          value={value}
          onChange={handleChange}
          selectItems={
            paginationOptions?.length
              ? paginationOptions?.map((item: any) => {
                  return {
                    label: item,
                    value: item,
                  };
                })
              : []
          }
          iconColor={theme.Colors.blackLightLow}
          selectBoxStyle={{
            borderRadius: '8px',
            color: theme.Colors.blueLight,
            height: '32px',
          }}
          displayEmpty
          renderValue={(val: any) => (
            <MUHTypography
              text={`Show ${val}`}
              size={13}
              color={theme.Colors.blueLight}
              family="Roboto-Regular"
            />
          )}
          borderColor={theme.Colors.grayBorderLight}
        />
      </Grid>
      <Grid>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePagination}
          {...(renderItem ? { renderItem } : {})}
          sx={{
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: paginationBadgeColor
                ? paginationBadgeColor
                : theme.Colors.primary,
              color: theme.Colors.whitePrimary,
              fontSize: 13,
              fontWeight: 400,
            },
            '& .MuiPaginationItem-root': {
              color: theme.Colors.blueLightSecondary,
              fontSize: 13,
              fontWeight: 400,
              backgroundColor: theme.Colors.blueLightLow,
            },
            '& .MuiPaginationItem-previousNext': {
              color: theme.Colors.black,
              border: `1px solid ${theme.Colors.grayDarkDim}`,
              backgroundColor: theme.Colors.whitePrimary,
            },
          }}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: FirstPage, next: LastPage }}
              {...item}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default TablePagination;
