import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography } from '@mui/material';

interface BranchData {
  branch: string;
  value: number;
}

interface BranchWiseSalesProps {
  data?: BranchData[];
  title?: string;
  height?: number;
  maxValue?: number;
}

const defaultData: BranchData[] = [
  { branch: 'Avadi', value: 10000000 },
  { branch: 'Ambathur', value: 16558585 },
  { branch: 'Ambathur OE', value: 15000000 },
  { branch: 'Ambathur SE', value: 20000000 },
  { branch: 'Coimbatore', value: 8000000 },
  { branch: 'Salem', value: 30000000 },
];

const yAxisValueFormatter = (value: number): string => {
  if (value === 30000000) return '3Cr';
  if (value === 25000000) return '2.5Cr';
  if (value === 20000000) return '2Cr';
  if (value === 15000000) return '1.5Cr';
  if (value === 10000000) return '1Cr';
  if (value === 8000000) return '80L';
  return '';
};

const BarChartSales: React.FC<BranchWiseSalesProps> = ({
  data = defaultData,
  title = 'Branch Wise Sales',
  height = 270,
  maxValue = 30000000,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}
    >
      <Typography
        variant="inherit"
        sx={{
          fontWeight: 500,
          fontFamily: 'Roboto-Medium',
          fontSize: 16,
        }}
      >
        {title}
      </Typography>

      <BarChart
        height={height}
        dataset={data}
        margin={{ top: 30, right: 20, left: 55, bottom: 32 }}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'branch',
            tickLabelStyle: { fontSize: 13, fontWeight: 600, fill: '#444' },
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: maxValue,
            valueFormatter: yAxisValueFormatter,
            tickLabelStyle: { fontSize: 12, fontWeight: 600, fill: '#666' },
          },
        ]}
        series={[
          {
            dataKey: 'value',
            color: '#F3D8D9',
          },
        ]}
        grid={{ horizontal: true, vertical: false }}
        slotProps={{ legend: { hidden: true } }}
        sx={{
          '& .MuiBarElement-root': {
            fill: '#F3D8D9',
            transition: '0.2s',
          },

          '& .MuiBarElement-root:hover': {
            fill: '#7A1B2F !important',
          },

          '& .MuiChartsAxis-line': { stroke: '#e2e2e2' },
          '& .MuiChartsAxis-tick': { stroke: '#e2e2e2' },
          '& .MuiChartsGrid-line': {
            stroke: '#e8e8e8',
            strokeDasharray: '4 4',
          },
        }}
      />
    </Paper>
  );
};

export default BarChartSales;
