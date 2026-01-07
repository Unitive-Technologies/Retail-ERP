import PageHeader from '@components/PageHeader';
import PayrollViewComponent from '@components/PayrollViewComponent';
import { PayrollData } from '@constants/DummyData';

const EmployeeViewPayroll = () => {
  return (
    <>
      <PageHeader
        title="PAYROLL"
        // navigateUrl="/admin/hr/payroll"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={true}
        showBackButton={false}
      />
      <PayrollViewComponent payrollData={PayrollData} />
    </>
  );
};

export default EmployeeViewPayroll;
