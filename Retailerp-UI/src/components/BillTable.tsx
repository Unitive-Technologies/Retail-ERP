import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import * as theme from '../theme/schemes/PurelightTheme';
import Grid from '@mui/system/Grid';

interface EarningsItem {
  payType: string;
  amount: number;
}

interface BillTableProps {
  title?: string;
  data: EarningsItem[];
  labelColumnName?: string;
  amountColumnName?: string;
  showTotal?: boolean;
  currencySymbol?: string;
}

const BillTable: React.FC<BillTableProps> = ({
  title = 'EARNINGS',
  data,
  labelColumnName = 'Pay Type',
  amountColumnName = 'Amount',
  showTotal = true,
  currencySymbol = '₹',
}) => {
  const total = showTotal
    ? data.reduce((sum, item) => sum + item.amount, 0)
    : 0;

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.Colors.whitePrimary,
        borderRadius: '8px',
        border: `1px solid ${theme.Colors.grayLight}`,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: '10px',
          borderBottom: `1px solid ${theme.Colors.grayLight}`,
        }}
      >
        <Box
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: theme.Colors.blackSecondary,
            fontFamily: 'Roboto-Regular',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Box>
      </Box>

      {/* Table */}
      <Grid
        sx={{
          padding: '30px',
        }}
      >
        <Table
          sx={{ width: '100%', border: `1px solid ${theme.Colors.grayLight}` }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.Colors.whiteLight,
              }}
            >
              <TableCell
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.Colors.blackSecondary,
                  fontFamily: 'Roboto-Regular',
                  padding: '12px 20px',
                  borderBottom: `1px solid ${theme.Colors.grayLight}`,
                  borderRight: `1px solid ${theme.Colors.grayLight}`,
                }}
              >
                {labelColumnName}
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.Colors.blackSecondary,
                  fontFamily: 'Roboto-Regular',
                  padding: '12px 20px',
                  borderBottom: `1px solid ${theme.Colors.grayLight}`,
                }}
              >
                {amountColumnName}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td': {
                    borderBottom: showTotal
                      ? `1px solid ${theme.Colors.grayLight}`
                      : 'none',
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: theme.Colors.black,
                    fontFamily: 'Roboto-Regular',
                    padding: '12px 20px',
                    borderRight: `1px solid ${theme.Colors.grayLight}`,
                  }}
                >
                  {item.payType}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: theme.Colors.black,
                    fontFamily: 'Roboto-Regular',
                    padding: '12px 20px',
                  }}
                >
                  {currencySymbol}
                  {formatAmount(item.amount)}
                </TableCell>
              </TableRow>
            ))}

            {/* Total Row */}
            {showTotal && (
              <TableRow
                sx={{
                  backgroundColor: theme.Colors.whiteLight,
                }}
              >
                <TableCell
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: theme.Colors.blackSecondary,
                    fontFamily: 'Roboto-Regular',
                    padding: '12px 20px',
                    borderBottom: 'none',
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: theme.Colors.blackSecondary,
                    fontFamily: 'Roboto-Regular',
                    padding: '12px 20px',
                    borderBottom: 'none',
                  }}
                >
                  {currencySymbol}
                  {formatAmount(total)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Grid>
    </Box>
  );
};

export default BillTable;
