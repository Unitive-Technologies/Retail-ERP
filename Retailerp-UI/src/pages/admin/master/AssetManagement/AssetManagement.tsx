import { contentLayout } from '@components/CommonStyles';
import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import PageHeader from '@components/PageHeader';
import { useEdit } from '@hooks/useEdit';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme } from '@mui/material';

import { assetManagementData } from '@constants/DummyData';
import AssetManageTableFilter from './AssetManageTableFilter';

const AssetManagement = () => {
  const theme = useTheme();

  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [tableData, setTableData] = useState<object[]>(assetManagementData);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    status: 0,
    branch: '',
    mode: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'asset_id',
      headerName: 'Asset ID',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.asset_id}
          titleStyle={{ color: theme.Colors.primary }}
          isLink="/admin/assetManagement/view"
        />
      ),
    },
    {
      field: 'asset_category',
      headerName: 'Asset Category',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'asset_name',
      headerName: 'Asset Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: { row: any }) => {
        const getColor = (status: string) => {
          switch (status.toLowerCase()) {
            case 'update pending':
              return '#ff0000'; // red
            case 'under maintenance':
              return '#6d2e3d';
            case 'in use':
              return '#00aa44';
            case 'retired':
              return '#ff0000';
            default:
              return '#000000'; // default black
          }
        };

        return (
          <span
            style={{
              color: getColor(row.status),
            }}
          >
            {row.status}
          </span>
        );
      },
    },

    {
      field: 'branch_from',
      headerName: 'Branch From',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

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
    setTableData(assetManagementData);
  };

  const renderRowAction = (rowData: never) => {
    return [
      // {
      //   text: 'Edit',
      //   renderIcon: () => <RowEditIcon />,
      //   onClick: () => {
      //     const props = {
      //       title: 'Edit',
      //       description: 'Do you want to modify data?',
      //       onCancelClick: () => handleCancelModal(),
      //       color: '#FF742F',
      //       iconType: CONFIRM_MODAL.edit,
      //       onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
      //     };
      //     setConfirmModalOpen({ open: true, ...props });
      //   },
      // },
      // {
      //   text: 'View',
      //   renderIcon: () => <RowViewIcon />,
      //   onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      // },
      // {
      //   text: 'Delete',
      //   renderIcon: () => <DeleteOutlinedIcon />,
      //   onClick: () => {},
      // },
    ];
  };

  return (
    <>
      <PageHeader
        title="ASSET MANAGEMENT"
        titleStyle={{ color: theme.Colors.blackPrimary }}
        btnName="Create Asset"
        navigateUrl="/admin/assetManagement/create"
      />
      <Grid container sx={contentLayout}>
        <AssetManageTableFilter
          selectItems={columns}
          selectedValue={hiddenColumns}
          handleSelectValue={handleSelectValue}
          handleFilterClear={handleFilterClear}
          edit={edit}
        />
        <MUHTable
          columns={columns.filter(
            (column) => !hiddenColumns.includes(column.headerName)
          )}
          rows={tableData}
          getRowActions={renderRowAction}
          loading={false}
        />
        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </>
  );
};

export default AssetManagement;
