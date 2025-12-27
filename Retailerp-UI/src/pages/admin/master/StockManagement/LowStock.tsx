import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import Grid from '@mui/system/Grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { GridColDef } from '@mui/x-data-grid';
import { MUHTable } from '@components/index';

import { LowstockList } from '@constants/DummyData';
import { useTheme } from '@mui/material';
import CommonTableFilter from '@components/CommonTableFilter';

const LowStock = () => {
  const theme = useTheme();

  const [offerData, setOfferData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    status: 0,
    offer_plan: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  // ---------------- COLUMNS ----------------
  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'sub_category',
      headerName: 'Sub Category',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'low',
      headerName: 'Low',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
  ];

  // ---------- COLUMN FILTER ITEMS ----------
  const selectItems = columns.map((col) => ({
    label: col.headerName,
    headerName: col.headerName,
  }));

  const [selectedValue, setSelectedValue] = useState<any[]>([]);

  // ---------------- HANDLERS ----------------
  const handleSelectValue = (item: { headerName: string }) => {
    let updatedHidden = [];

    if (hiddenColumns.includes(item.headerName)) {
      updatedHidden = hiddenColumns.filter((x) => x !== item.headerName);
    } else {
      updatedHidden = [...hiddenColumns, item.headerName];
    }

    setHiddenColumns(updatedHidden);
    setSelectedValue(updatedHidden);
  };

  const handleFilterClear = () => {
    edit.reset();
    setHiddenColumns([]);
    setSelectedValue([]);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setOfferData(LowstockList); // TODO: replace with API
    } catch (err: any) {
      toast.error(err?.message);
      setOfferData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- RENDER ----------------

  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="LOW STOCK"
          showDownloadBtn={true}
          titleStyle={{ color: theme.Colors.black }}
          showlistBtn={true}
          showCreateBtn={false}
        />

        <Grid container sx={contentLayout}>
          <CommonTableFilter
            selectItems={selectItems}
            selectedValue={selectedValue}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />

          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={offerData}
            loading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LowStock;
