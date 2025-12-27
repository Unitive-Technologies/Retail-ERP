/* eslint-disable react/prop-types */
import { useTheme, Box, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import React, { memo, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

interface DonutChartComponentProps {
  title?: string;
  donutTitle?: string;
  chartData?: {
    series: number[];
    labels: string[];
    colors: string[];
    percentages?: string[];
    gradientToColors?: string[];
  };
  onSegmentClick?: (segmentIndex: number) => void;
}

// Default chart data to prevent undefined errors
const defaultChartData = {
  series: [0],
  labels: ['No Data'],
  colors: ['#cccccc'],
  percentages: ['0%'],
  gradientToColors: ['#cccccc'],
};

const DonutChartComponent: React.FC<DonutChartComponentProps> = memo(
  function DonutChartComponent({
    title = 'SUBSCRIPTION BASED USER',
    donutTitle = 'USER',
    chartData = defaultChartData,
    onSegmentClick,
  }) {
    const theme = useTheme();

    const handleChartClick = (
      event: any,
      chartContext: any,
      config: { dataPointIndex: number }
    ) => {
      const clickedIndex = config?.dataPointIndex;
      if (clickedIndex !== -1 && onSegmentClick) {
        onSegmentClick(clickedIndex);
      }
    };

    // Safe destructuring with fallbacks
    const {
      series = [],
      labels = [],
      colors = [],
      percentages = [],
      gradientToColors = [],
    } = chartData || defaultChartData;

    const apexOptions: ApexOptions = useMemo(() => {
      return {
        chart: {
          type: 'donut',
          toolbar: {
            show: false,
          },
          events: {
            dataPointSelection: handleChartClick,
          },
        },
        colors: colors.length > 0 ? colors : defaultChartData.colors,
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  offsetY: 10,
                  formatter: function () {
                    return donutTitle + '';
                  },
                },
                value: {
                  show: false,
                },
                total: {
                  show: true,
                  label: donutTitle,
                  fontSize: '22px',
                  fontWeight: 600,
                  offsetY: 10,
                  color: theme.palette.text.secondary,
                  formatter: function () {
                    return donutTitle + '';
                  },
                },
              },
            },
            expandOnClick: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          colors: ['#fff'],
        },
        legend: {
          show: false,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors:
              gradientToColors.length > 0 ? gradientToColors : colors,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 90, 100],
          },
        },
        states: {
          hover: { filter: { type: 'none' } },
          active: { filter: { type: 'none' } },
        },
        tooltip: {
          enabled: true,
          y: {
            title: {
              formatter: () => '',
            },
            formatter: (
              val: number,
              { seriesIndex }: { seriesIndex: number }
            ) => {
              const label = labels[seriesIndex] || 'Unknown';
              return `${label}: ${val}`;
            },
          },
        },
      };
    }, [
      chartData,
      donutTitle,
      theme.palette.text.secondary,
      colors,
      gradientToColors,
      labels,
    ]);

    return (
      <Box
        sx={{
          p: 3,
          bgcolor: theme.Colors?.whitePrimary || 'white',
          borderRadius: '10px',
          boxShadow: theme.shadows[1],
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          style={{
            fontSize: theme.MetricsSizes?.regular || '16px',
            fontFamily: theme.fontFamily?.inter || 'Inter, sans-serif',
            color: theme.Colors?.blackPrimary || 'black',
            fontWeight: theme.fontWeight?.mediumBold || 600,
            textAlign: 'left',
            width: '100%',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '500px',
              height: { xs: '250px', sm: '300px' },
            }}
          >
            <ReactApexChart
              options={apexOptions}
              series={series.length > 0 ? series : defaultChartData.series}
              type="donut"
              height="100%"
              width="100%"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 3,
              mt: 2,
            }}
          >
            {labels.map((label, index) => (
              <Box
                key={label || `label-${index}`}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '5px',
                    bgcolor: colors[index] || defaultChartData.colors[0],
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {label || 'No Label'}
                  </Typography>
                  {percentages && percentages[index] && (
                    <Typography variant="body2" fontWeight="bold">
                      {percentages[index]}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
);

export default DonutChartComponent;
