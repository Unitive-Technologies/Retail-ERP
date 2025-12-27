import DonutChartComponent from '@components/DonutChartComponent';

const DonutChart = () => {
  return (
    <DonutChartComponent
      title="Sales By Category"
      donutTitle="sales"
      chartData={{
        series: [70, 30],
        labels: ['Gold', 'Silver'],
        colors: ['#BB4E65', '#F3CC86'],
      }}
    />
  );
};

export default DonutChart;
