import React from 'react';
import {
  columnCellStyle,
  commonTextInputProps,
  formLayoutStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
} from '@components/CommonStyles';
import { TextInput, styles } from '@components/index';
import PageHeader from '@components/PageHeader';
import { IconButton, Typography, useTheme, CardContent } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import FormAction from '@components/ProjectCommon/FormAction';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';

const MakingChageType = [
  { label: 'Color', value: 'Color' },
  { label: 'Stone Type', value: 'Stone Type' },
  { label: 'Size', value: 'Size' },
  { label: 'Material', value: 'Material' },
];

const tableSelectBoxProps = { sx: { width: '100%' } };

const CreateJournal = () => {
  const theme = useTheme();
  const handleSave = () => {};
  const handleCancel = () => {};

  type StateRow = {
    id: string;
    account: string;
    description: string;
    debit: string;
    credit: string;
  };

  const generateId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const [stateRows, setStateRows] = React.useState<StateRow[]>([
    { id: generateId(), account: '', description: '', debit: '', credit: '' },
  ]);

  const [journalId, setJournalId] = React.useState();
  const [journalDate, setJournalDate] = React.useState(null);

  const isReadOnly = false;

  const handleRowInputChange = (
    id: string,
    field: keyof Omit<StateRow, 'id'>,
    value: string
  ) => {
    setStateRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAccountChange = (id: string, value: string) => {
    setStateRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, account: value } : r))
    );
  };

  const handleAddStateRow = () => {
    const lastRow = stateRows[stateRows.length - 1];
    if (
      lastRow.account.trim() ||
      lastRow.description.trim() ||
      lastRow.debit.trim() ||
      lastRow.credit.trim()
    ) {
      setStateRows((prev) => [
        ...prev,
        {
          id: generateId(),
          account: '',
          description: '',
          debit: '',
          credit: '',
        },
      ]);
    }
  };

  const handleDeleteStateRow = (id: string) => {
    setStateRows((prev) => prev.filter((r) => r.id !== id));
  };

  const totalDebit = stateRows.reduce(
    (sum, r) => sum + (parseFloat(r.debit) || 0),
    0
  );
  const totalCredit = stateRows.reduce(
    (sum, r) => sum + (parseFloat(r.credit) || 0),
    0
  );
  const difference = totalDebit - totalCredit;

  return (
    <Grid container flexDirection={'column'} sx={{ flex: 1, minHeight: 0 }}>
      <PageHeader
        title="CREATE NEW JOURNAL"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
        showBackButton={false}
      />

      {/* BASIC DETAILS CARD */}
      <Grid
        flexDirection={'row'}
        sx={{
          width: '100%',
          border: `1px solid #E4E4E4`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
          mb: 3,
          mt: 2,
        }}
      >
        <CardContent sx={{ p: 3, borderBottom: `1px solid #E4E4E4` }}>
          <Typography
            sx={{
              fontFamily: theme.fontFamily.roboto,
              fontWeight: theme.fontWeight.mediumBold,
              fontSize: theme.MetricsSizes.small_xxx,
              color: theme.Colors.blackPrimary,
            }}
          >
            BASIC DETAILS
          </Typography>
        </CardContent>
        <Grid container spacing={2} sx={{ padding: '20px' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Journal ID"
              value={journalId}
              disabled={isReadOnly}
              onChange={(e) => setJournalId(e.target.value)}
              {...commonTextInputProps}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <MUHDatePickerComponent
              labelText="Date"
              value={journalDate}
              handleChange={(newValue) => setJournalDate(newValue)}
              handleClear={() => setJournalDate(null)}
              isReadOnly={isReadOnly}
              required
            />
          </Grid>
        </Grid>
      </Grid>

      {/* JOURNAL ENTRY TABLE */}
      <Grid
        flexDirection={'row'}
        sx={{
          width: '100%',
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
          mb: 3,
          mt: 2,
        }}
      >
        <CardContent sx={{ p: 3, borderBottom: `1px solid #E4E4E4` }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: theme.MetricsSizes.small_xxx,
              color: theme.Colors.blackPrimary,
            }}
          >
            JOURNAL ENTRY
          </Typography>
        </CardContent>
        <Grid
          width={'100%'}
          pb={2}
          sx={{
            ...formLayoutStyle,
            borderTop: 'none',
            borderRadius: '0px 0px 8px 8px',
            padding: '10px',
          }}
        >
          {/* Table Header */}
          <Grid container sx={tableColumnStyle}>
            <Grid sx={columnCellStyle} size={1}>
              S.No
            </Grid>
            <Grid sx={columnCellStyle} size={3}>
              Account
            </Grid>
            <Grid sx={columnCellStyle} size={3}>
              Description
            </Grid>
            <Grid sx={columnCellStyle} size={2}>
              Debit
            </Grid>
            <Grid sx={columnCellStyle} size={2}>
              Credit
            </Grid>
            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
              Action
            </Grid>
          </Grid>

          {/* Table Rows */}
          {stateRows.map((row, index) => (
            <Grid container sx={tableRowStyle} key={row.id}>
              <Grid
                size={1}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  textAlign: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {index + 1}
              </Grid>

              <Grid
                size={3}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <MUHSelectBoxComponent
                  isCheckbox={false}
                  placeholderText="Select Variant Type"
                  value={row.account}
                  onChange={(e: any) =>
                    handleAccountChange(row.id, e.target.value)
                  }
                  selectItems={MakingChageType}
                  disabled={isReadOnly}
                  {...tableSelectBoxProps}
                />
              </Grid>

              <Grid
                size={3}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  placeholderText="Enter Description"
                  value={row.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRowInputChange(row.id, 'description', e.target.value)
                  }
                  disabled={isReadOnly}
                  {...tableTextInputProps}
                />
              </Grid>

              <Grid
                size={2}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TextInput
                  placeholderText="Enter Debit"
                  value={row.debit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRowInputChange(row.id, 'debit', e.target.value)
                  }
                  disabled={isReadOnly}
                  {...tableTextInputProps}
                />
              </Grid>

              <Grid
                size={2}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TextInput
                  placeholderText="Enter Credit"
                  value={row.credit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRowInputChange(row.id, 'credit', e.target.value)
                  }
                  disabled={isReadOnly}
                  {...tableTextInputProps}
                />
              </Grid>

              <Grid
                size={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index === stateRows.length - 1 ? (
                  <IconButton onClick={handleAddStateRow}>
                    <Add sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleDeleteStateRow(row.id)}>
                    <Delete sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          {/* Total Row */}
          <Grid
            container
            sx={{
              p: 1,
              background: '#FAF6F6',
              alignItems: 'center',
              borderTop: '1px solid #E4E4E4',
            }}
          >
            {/* Empty S.No and Account columns */}
            <Grid size={1}></Grid>
            <Grid size={3}></Grid>
            {/* Label under Description */}
            <Grid size={3}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#912C2C',
                  fontSize: theme.MetricsSizes.medium,
                  textAlign: 'left',
                }}
              >
                Total
              </Typography>
            </Grid>
            {/* Debit */}
            <Grid size={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#912C2C',
                  fontSize: theme.MetricsSizes.medium,
                  textAlign: 'right',
                }}
              >
                ₹{totalDebit.toLocaleString()}
              </Typography>
            </Grid>
            {/* Credit */}
            <Grid size={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#912C2C',
                  fontSize: theme.MetricsSizes.medium,
                  textAlign: 'right',
                }}
              >
                ₹{totalCredit.toLocaleString()}
              </Typography>
            </Grid>
            {/* Action column */}
            <Grid size={1}></Grid>
          </Grid>

          {/* Difference Row */}
          <Grid
            container
            sx={{
              p: 1,
              background: '#FAF6F6',
              alignItems: 'center',
              borderBottom: '1px solid #E4E4E4',
            }}
          >
            <Grid size={1}></Grid>
            <Grid size={3}></Grid>
            <Grid size={3}>
              <Typography sx={{ color: theme.Colors.blackPrimary }}>
                Difference
              </Typography>
            </Grid>
            <Grid size={2}>
              <Typography
                sx={{
                  textAlign: 'right',
                  color: theme.Colors.blackPrimary,
                }}
              >
                ₹{difference > 0 ? difference : 0}
              </Typography>
            </Grid>
            <Grid size={2}>
              <Typography
                sx={{
                  textAlign: 'right',
                  color: theme.Colors.blackPrimary,
                }}
              >
                ₹{difference < 0 ? Math.abs(difference) : 0}
              </Typography>
            </Grid>
            <Grid size={1}></Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        width={'100%'}
        justifyContent={'center'}
        sx={{ mt: 3, mb: 2 }}
      >
        <FormAction
          firstBtntxt="Create"
          secondBtntx="Reject"
          handleCancel={handleCancel}
          handleCreate={handleSave}
          {...commonTextInputProps}
        />
      </Grid>
    </Grid>
  );
};

export default CreateJournal;
