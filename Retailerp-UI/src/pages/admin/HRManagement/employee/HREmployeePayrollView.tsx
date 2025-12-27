import PageHeader from '@components/PageHeader';
import PayrollViewComponent from '@components/PayrollViewComponent';
import { PayrollData } from '@constants/DummyData';

const HrEmployeePayrollView = () => {
  return (
    <>
      <PageHeader
        title="PAYROLL"
        showCreateBtn={false}
        showlistBtn={true}
        navigateUrl="/admin/hr/employee"
      />
      <PayrollViewComponent payrollData={PayrollData} />
    </>
  );
};

export default HrEmployeePayrollView;
