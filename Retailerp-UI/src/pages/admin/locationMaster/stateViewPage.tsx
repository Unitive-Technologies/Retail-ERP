import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme, Paper, Box } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';

const StateViewPage = () => {
  const [searchParams] = useSearchParams();
  const countryName = searchParams.get('countryName') || '';
  const countryId = searchParams.get('countryId') || '';
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
        return <span>{index + 1}</span>;
      },
    },
    {
      field: 'state_name',
      headerName: 'State Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.state_name}
          titleStyle={{
            color: theme.Colors.primary,
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          isLink={`/admin/locationMaster/districtView?stateCode=${row.state_code}&stateName=${row.state_name}&countryId=${countryId}&countryName=${countryName}`}
        />
      ),
    },
    {
      field: 'short_name',
      headerName: 'Short Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'state_code',
      headerName: 'State Code',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      align: 'left',
    },
  ];

  const rows = [
    { id: 1, state_name: 'Tamil Nadu', short_name: 'IN', state_code: '33' },
    { id: 2, state_name: 'Kerala', short_name: 'UAE', state_code: '32' },
    { id: 3, state_name: 'Puducherry', short_name: 'UAE', state_code: '34' },
    { id: 4, state_name: 'Delhi', short_name: 'UAE', state_code: '7' },
  ];

  return (
    <>
      <PageHeader
        title={(countryName || 'India').toUpperCase()}
        btnName="List Page"
        navigateUrl="/admin/locationMaster"
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

export default StateViewPage;
