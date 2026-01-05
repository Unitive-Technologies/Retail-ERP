import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import PageHeader from '@components/PageHeader';
import { useTheme } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MUHListItemCell from '@components/MUHListItemCell';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import { CONFIRM_MODAL } from '@constants/Constance';
import BranchListFilter from './BranchListFilter';
import { useEdit } from '@hooks/useEdit';
import { branchListData } from '@constants/DummyData';

type BranchRow = {
  id: number;
  branch_no: string;
  branch_name: string;
  location: string;
  branch_admin: string;
  contact_number: string;
};

type BranchWiseSalesProps = {
  onBranchSelect?: (branch: BranchRow) => void;
};

const BranchListTable = ({
  onBranchSelect: _onBranchSelect,
}: BranchWiseSalesProps) => {
  const [currentTab, setCurrentTab] = React.useState<number | string>(1);
  const navigateTo = useNavigate();
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const theme = useTheme();

  const initialValues = {
    branch: '',
    status: '',
    search: '',
  };
  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const index = params.api.getSortedRowIds().indexOf(params.id);
        const serialNumber = index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'branch_no',
      headerName: 'Branch No',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        return (
          <MUHListItemCell
            title={row.branch_name}
            titleStyle={{ color: theme.Colors.primary }}
            isLink={`/admin/branch/filterList`}
            state={row}
          />
        );
      },
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch_admin',
      headerName: 'Branch Admin',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'contact_number',
      headerName: 'Contact Number',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  const handleTabChange = (val: number | string) => {
    setCurrentTab(val);
    if (val === 0) navigateTo('/admin/branch/overview');
    if (val === 1) navigateTo('/admin/branch/list');
  };

  const handleEditBranch = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/branch/form?${params}`);
  };

  const renderRowAction = (rowData: any) => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => handleEditBranch(rowData, CONFIRM_MODAL.edit),
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditBranch(rowData, CONFIRM_MODAL.view),
      },
    ];
  };
  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };
  const handleSelectValue = (item: { headerName: never }) => {
    let hiddenCols = [];
    if (hiddenColumns.includes(item.headerName)) {
      hiddenCols = hiddenColumns.filter(
        (field: any) => field !== item.headerName
      );
      setHiddenColumns([...hiddenCols]);
    } else {
      hiddenCols = [...hiddenColumns, item.headerName];
      setHiddenColumns([...hiddenCols]);
    }
    handleCustomizeColumn(hiddenCols);
  };

  const handleFilterClear = () => {
    edit.reset();
    setHiddenColumns([]);
  };
  return (
    <Grid container width="100%" mt={1.5}>
      <PageHeader
        title="BRANCH OVERVIEW"
        useSwitchTabDesign={true}
        tabContent={[
          { label: 'Branch Overview', id: 0 },
          { label: 'Branch-Wise', id: 1 },
        ]}
        showlistBtn={false}
        showDownloadBtn={false}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
        onTabChange={handleTabChange}
        switchTabContainerWidth="fit-content"
      />
      <Grid container sx={contentLayout}>
        <BranchListFilter
          selectItems={columns}
          selectedValue={hiddenColumns}
          handleSelectValue={handleSelectValue}
          handleFilterClear={handleFilterClear}
          edit={edit}
        />
        <MUHTable
          columns={columns}
          rows={branchListData}
          isCheckboxSelection={true}
          getRowActions={renderRowAction}
        />
      </Grid>
    </Grid>
  );
};

export default BranchListTable;
