import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Box, useTheme } from '@mui/system';
import { contentLayout } from '@components/CommonStyles';
import { Paper } from '@mui/material';

const DistrictViewPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const stateName = searchParams.get('stateName') || '';
  const stateCode = searchParams.get('stateCode') || '';
  const countryId = searchParams.get('countryId') || '';
  const countryName = searchParams.get('countryName') || '';
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      renderCell: (params: any) => {
        const index = params.api.getSortedRowIds().indexOf(params.id);
        const serialNumber = index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'district_name',
      headerName: 'District Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'short_name',
      headerName: 'Short Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const rows = [
    { id: 1, district_name: 'Chennai', short_name: 'CHN' },
    { id: 2, district_name: 'Salem', short_name: 'SLM' },
    { id: 3, district_name: 'Coimbatore', short_name: 'CBR' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title={`${(stateName || '').toUpperCase()}${stateCode ? ' - ' + stateCode : ''}`}
        // count={rows.length}
        btnName="List Page"
        navigateUrl={`/admin/locationMaster/stateView?countryId=${countryId}&countryName=${countryName}`}
      />
      <Grid container sx={contentLayout}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ pt: 2 }}>
            <MUHTable
              columns={columns}
              rows={rows}
              loading={false}
              isCheckboxSelection={false}
            />
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default DistrictViewPage;
