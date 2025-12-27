import {
  useTheme,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { ApexOptions } from 'apexcharts';
import React, { memo, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SalesStatisticsChartProps {
  data?: {
    month: string;
    value: number;
  }[];
  labels?: string[];
  title?: string;
  height?: number;
}

const defaultData = [
  { month: 'JAN', value: 2500000 },
  { month: 'FEB', value: 3000000 },
  { month: 'MAR', value: 2200000 },
  { month: 'APR', value: 3200000 },
  { month: 'MAY', value: 3700000 },
  { month: 'JUN', value: 2800000 },
  { month: 'JUL', value: 2600000 },
  { month: 'AUG', value: 1846348 },
  { month: 'SEP', value: 2450000 },
  { month: 'OCT', value: 2400000 },
  { month: 'NOV', value: 2300000 },
  { month: 'DEC', value: 3500000 },
];

const SalesStatisticsChart: React.FC<SalesStatisticsChartProps> = memo(
  function SalesStatisticsChart({
    data = defaultData,
    labels = defaultData.map((d) => d.month),
    title = 'Sales Statistics',
    height = 350,
  }) {
    const theme = useTheme();
    const [timeFilter, setTimeFilter] = useState('Yearly');

    const formatCurrency = (value: number): string => {
      return `₹${value.toLocaleString('en-IN')}`;
    };

    // Format Y axis to L & Cr like your image
    const formatYAxis = (value: number): string => {
      if (value >= 10000000) return `${value / 10000000}Cr`;
      if (value >= 100000) return `${value / 100000}L`;
      return `${value}`;
    };

    const values = data.map((item) => item.value);
    const maxValue = Math.max(...values);

    // auto round to nearest 10Lakhs or 1Cr
    const yAxisMax =
      maxValue > 10000000
        ? Math.ceil(maxValue / 10000000) * 10000000
        : Math.ceil(maxValue / 1000000) * 1000000;

    const apexOptions: ApexOptions = {
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },

      stroke: {
        width: 2.5,
        curve: 'smooth',
        colors: ['rgba(212, 165, 165, 0.7)'],
        dashArray: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.1,
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.4,
          stops: [0, 48, 100],
          colorStops: [
            {
              offset: 0,
              color: '#F9EAEA',
              opacity: 1,
            },
            {
              offset: 48,
              color: '#F9EAEA',
              opacity: 0.9,
            },
            {
              offset: 100,
              color: '#FFFFFF',
              opacity: 0.8,
            },
          ],
        },
      },
      markers: {
        colors: ['#D4A5A5'],
        strokeColors: '#fff',
        strokeWidth: 2,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        hover: {
          size: 6,
          sizeOffset: 1,
          colors: ['#D4A5A5'],
          strokeColors: '#fff',
          strokeWidth: 2,
        },
      },

      xaxis: {
        categories: labels,
        labels: {
          style: { fontSize: '12px', fontWeight: 600, colors: '#555' },
        },
      },

      yaxis: {
        min: 0,
        max: yAxisMax,
        labels: {
          formatter: formatYAxis,
          style: { fontSize: '12px', fontWeight: 600, colors: '#666' },
        },
      },

      tooltip: {
        y: {
          formatter: formatCurrency,
        },
      },

      grid: {
        borderColor: '#e8e8e8',
        strokeDashArray: 4,
      },
    };

    const series = [
      {
        name: 'Sales',
        data: values,
      },
    ];

    return (
      <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontSize={18} fontWeight={700}>
            {title}
          </Typography>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
            >
              <MenuItem value="Yearly">Yearly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ReactApexChart
          type="area"
          height={height}
          options={apexOptions}
          series={series}
        />
      </Box>
    );
  }
);

export default SalesStatisticsChart;
