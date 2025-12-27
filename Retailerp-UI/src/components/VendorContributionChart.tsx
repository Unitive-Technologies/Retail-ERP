import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  Paper,
} from '@mui/material';

interface VendorData {
  vendor: string;
  gold: number;
  silver: number;
}

interface VendorContributionChartProps {
  data?: VendorData[];
  title?: string;
  height?: number;
  maxValue?: number;
  filterBy?: 'material' | 'value'; // New prop for filter type
}

const defaultVendorData: VendorData[] = [
  { vendor: 'Golden Hub PHL Ltd...', gold: 16558585, silver: 12000000 },
  { vendor: 'Shivashree Surphere', gold: 14000000, silver: 11000000 },
  { vendor: 'Distant Silver Works', gold: 12000000, silver: 10000000 },
  { vendor: 'Sparake Designer Hub', gold: 10000000, silver: 8000000 },
  { vendor: 'Golden Wrap & Co.', gold: 8000000, silver: 6000000 },
  { vendor: 'Khan Kasting Studio', gold: 5000000, silver: 4000000 },
];

// Updated Y-axis formatter to match your image exactly
const yAxisValueFormatter = (value: number): string => {
  if (value === 30000000) return '30r';
  if (value === 25000000) return '2.5Cr';
  if (value === 20000000) return '20r';
  if (value === 15000000) return '1.5Cr';
  if (value === 10000000) return '10r';
  if (value === 5000000) return '50L';
  if (value === 0) return '0';
  return '';
};

const VendorContributionChart: React.FC<VendorContributionChartProps> = ({
  data = defaultVendorData,
  title = 'Vendor Contribution',
  height = 270,
  maxValue = 30000000,
  filterBy = 'material', // Default to 'material'
}) => {
  const [filterValue, setFilterValue] = React.useState<string>('all');

  const handleFilterChange = (event: any) => {
    setFilterValue(event.target.value);
  };

  // Filter data based on selection
  const filteredData = React.useMemo(() => {
    if (filterValue === 'gold') {
      return data.map((item) => ({
        vendor: item.vendor,
        gold: item.gold,
        silver: 0,
      }));
    } else if (filterValue === 'silver') {
      return data.map((item) => ({
        vendor: item.vendor,
        gold: 0,
        silver: item.silver,
      }));
    }
    return data;
  }, [data, filterValue]);

  // Get filter options based on filterBy prop
  const getFilterOptions = () => {
    if (filterBy === 'value') {
      return [
        { value: 'all', label: 'By Value' },
        { value: 'gold', label: 'Gold Value' },
        { value: 'silver', label: 'Silver Value' },
      ];
    }
    // Default to material filter
    return [
      { value: 'all', label: 'By Material' },
      { value: 'gold', label: 'Gold' },
      { value: 'silver', label: 'Silver' },
    ];
  };

  const filterOptions = getFilterOptions();

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        border: '1px solid #E5E7EB',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          style={{
            fontSize: '18px',
            color: '#000000',
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        <FormControl
          size="small"
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '14px',
              height: '36px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E2E7',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E2E7',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E2E7',
            },
          }}
        >
          <Select
            value={filterValue}
            onChange={handleFilterChange}
            displayEmpty
            sx={{
              fontSize: '14px',
              color: '#222',
              '& .MuiSelect-select': {
                padding: '8px 14px',
              },
            }}
          >
            {filterOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: '14px' }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <BarChart
        height={height}
        dataset={filteredData as any}
        margin={{ top: 30, right: 20, left: 55, bottom: 70 }}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'vendor',
            tickLabelStyle: {
              fontSize: 12,
              fontWeight: 600,
              fill: '#444',
            },
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: maxValue,
            valueFormatter: yAxisValueFormatter,
            tickLabelStyle: {
              fontSize: 12,
              fontWeight: 600,
              fill: '#666',
            },
          },
        ]}
        series={[
          {
            dataKey: 'gold',
            label: 'Gold',
            color: '#FFD786',
          },
          {
            dataKey: 'silver',
            label: 'Silver',
            color: '#C1C1C1',
          },
        ]}
        grid={{ horizontal: true, vertical: false }}
        slotProps={{
          legend: {
            position: { vertical: 'bottom', horizontal: 'center' },
            labelStyle: {
              fontSize: 12,
              fontWeight: 600,
            },
          },
        }}
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: '#e2e2e2',
            strokeWidth: 1,
          },
          '& .MuiChartsAxis-tick': {
            stroke: '#e2e2e2',
            strokeWidth: 1,
          },
          '& .MuiChartsGrid-line': {
            stroke: '#e8e8e8',
            strokeDasharray: '4 4',
          },
          '& .MuiBarElement-root[data-id="gold"]': {
            fill: '#FFD700',
            transition: '0.2s',
            '&:hover': {
              opacity: 0.8,
            },
          },
          '& .MuiBarElement-root[data-id="silver"]': {
            fill: '#C0C0C0',
            transition: '0.2s',
            '&:hover': {
              opacity: 0.8,
            },
          },
        }}
      />
    </Paper>
  );
};

export default VendorContributionChart;
