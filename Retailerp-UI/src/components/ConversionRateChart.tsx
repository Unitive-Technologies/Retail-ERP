import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ConversionRateChartProps {
  quotationData?: number[];
  salesOrderData?: number[];
  height?: number;
}

const defaultQuotation = [75, 60, 65, 72, 88, 80, 70, 60, 55, 50, 40, 38];
const defaultSalesOrder = [40, 50, 45, 38, 30, 28, 35, 45, 48, 42, 30, 28];

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const ConversionRateChart: React.FC<ConversionRateChartProps> = ({
  quotationData = defaultQuotation,
  salesOrderData = defaultSalesOrder,
  height = 320,
}) => {
  const series = [
    {
      name: 'Quotation',
      data: quotationData,
      color: '#FF6A7A',
    },
    {
      name: 'Sales Order',
      data: salesOrderData,
      color: '#3F51F7',
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: months,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#555',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 130,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#666',
        },
      },
    },
    grid: {
      strokeDashArray: 4,
      borderColor: '#E5E7EB',
    },
    legend: {
      position: 'bottom',
      markers: {
        width: 10,
        height: 10,
        radius: 50,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        p: 2.5,
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
      }}
    >
      <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 1 }}>
        Conversion Rate
      </Typography>

      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </Box>
  );
};

export default ConversionRateChart;
