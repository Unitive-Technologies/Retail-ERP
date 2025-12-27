import { useState } from 'react';
import PageHeader from '@components/PageHeader';
import HrEmployeeAttendance from './HREmployeeAttendance';
import HrEmployeePayroll from './HREmployeePayroll';
import HrEmployeeDetailsInfo from './HREmployeeDetailsInfo';
import Grid from '@mui/material/Grid2';
import EmployeeCardComponent from '@components/EmployeeCardComponent';
import { useLocation } from 'react-router-dom';

const HrEmployeeDetails = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<number | string>(0);
  const { rowData } = location.state || {};

  const tabsData = [
    {
      label: 'Employee Details',
      id: 0,
      content: () => (
        <>
          <HrEmployeeDetailsInfo />
        </>
      ),
    },
    {
      label: 'Attendance',
      id: 1,
      content: () => <HrEmployeeAttendance />,
    },
    {
      label: 'Payroll',
      id: 2,
      content: () => <HrEmployeePayroll />,
    },
  ];

  const onTabChange = (val: number | string) => setSelectedTab(val);

  const renderTabContent = (val: number | string) => {
    const active = tabsData.find((item) => item.id === val);
    return active ? active.content() : null;
  };

  return (
    <>
      <EmployeeCardComponent
        name={rowData.employee_name}
        employeeId={rowData.employee_id}
        department={rowData.department}
        designation={rowData.designation}
        dateOfJoining={rowData.joined_date}
      />
      <PageHeader
        showTabNavigation={true}
        showCreateBtn={false}
        showlistBtn={true}
        tabContent={tabsData}
        currentTabVal={selectedTab}
        onTabChange={onTabChange}
        navigateUrl="/admin/hr/employee"
      />
      <Grid py={2}>{renderTabContent(selectedTab)}</Grid>
    </>
  );
};

export default HrEmployeeDetails;
