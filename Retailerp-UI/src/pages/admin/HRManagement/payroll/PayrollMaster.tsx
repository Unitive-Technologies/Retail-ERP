import React from 'react';
import {
  columnCellStyle,
  commonTextInputProps,
  formLayoutStyle,
  tableColumnStyle,
  tableRowStyle,
  tableSelectBoxProps,
  tableTextInputProps,
} from '@components/CommonStyles';
import { TextInput } from '@components/index';
import PageHeader from '@components/PageHeader';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { MakingChageType } from '@constants/Constance';
import FormAction from '@components/ProjectCommon/FormAction';

const PayrollMaster = () => {
  const theme = useTheme();
  const handleSave = () => {};
  const handleCancel = () => {};

  type MasterRow = {
    id: string;
    payType: string;
    calculationType?: string;
    value: string;
  };

  const generateId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const [earningRows, setEarningRows] = React.useState<MasterRow[]>([
    { id: generateId(), payType: '', calculationType: '', value: '' },
  ]);
  const [deductionRows, setDeductionRows] = React.useState<MasterRow[]>([
    { id: generateId(), payType: '', calculationType: '', value: '' },
  ]);

  const isReadOnly = false;

  const createDefaultRow = (): MasterRow => ({
    id: generateId(),
    payType: '',
    calculationType: '',
    value: '',
  });

  // Handlers for Earnings
  const handleEarningInputChange = (
    id: string,
    field: keyof Omit<MasterRow, 'id'>,
    value: string
  ) => {
    setEarningRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleEarningCalcChange = (id: string, value: string) => {
    setEarningRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, calculationType: value } : r))
    );
  };

  const handleAddEarningRow = () => {
    setEarningRows((prev) => [...prev, createDefaultRow()]);
  };

  const handleDeleteEarningRow = (id: string) => {
    setEarningRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Handlers for Deductions
  const handleDeductionInputChange = (
    id: string,
    field: keyof Omit<MasterRow, 'id'>,
    value: string
  ) => {
    setDeductionRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeductionCalcChange = (id: string, value: string) => {
    setDeductionRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, calculationType: value } : r))
    );
  };

  const handleAddDeductionRow = () => {
    setDeductionRows((prev) => [...prev, createDefaultRow()]);
  };

  const handleDeleteDeductionRow = (id: string) => {
    setDeductionRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          titleStyle={{ color: theme.Colors.black }}
          title="PAYROLL MASTER"
          navigateUrl="/admin/hr/payroll"
          showCreateBtn={false}
          showlistBtn={false}
          showDownloadBtn={true}
          showBackButton={false}
        />

        {/* --------- EARNINGS TABLE --------- */}
        <Grid container width={'100%'} sx={{ padding: '10px' }}>
          <Grid
            width={'100%'}
            sx={{
              border: '1px solid #E4E4E4',
              borderRadius: '8px 8px 0px 0px',
              backgroundColor: theme.Colors.whitePrimary,
              padding: '10px',
            }}
          >
            <Typography
              style={{
                fontFamily: theme.fontFamily.roboto,
                fontWeight: theme.fontWeight.mediumBold,
                fontSize: theme.MetricsSizes.small_xxx,
                color: theme.Colors.blackPrimary,
              }}
            >
              EARNINGS
            </Typography>
          </Grid>

          <Grid
            width={'100%'}
            pb={2}
            sx={{
              ...formLayoutStyle,
              borderTop: 'none',
              borderRadius: '0px 0px 8px 8px',
            }}
          >
            <Grid container sx={tableColumnStyle}>
              <Grid sx={columnCellStyle} size={3.5}>
                Pay Type
              </Grid>
              <Grid sx={columnCellStyle} size={3.5}>
                Calculation Type
              </Grid>
              <Grid sx={columnCellStyle} size={3.5}>
                Value
              </Grid>
              <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
                Action
              </Grid>
            </Grid>

            {earningRows.map((row: MasterRow, index: number) => (
              <Grid container sx={tableRowStyle} key={row.id}>
                {/* Pay Type */}
                <Grid
                  size={3.5}
                  sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
                >
                  <TextInput
                    placeholderText="Enter Pay Type"
                    value={row.payType || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEarningInputChange(
                        row.id,
                        'payType',
                        e.target.value
                      )
                    }
                    disabled={isReadOnly}
                    {...tableTextInputProps}
                  />
                </Grid>

                {/* Calculation Type */}
                <Grid
                  size={3.5}
                  sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
                >
                  <MUHSelectBoxComponent
                    isCheckbox={false}
                    placeholderText="Select Calculation Type"
                    value={row.calculationType || ''}
                    onChange={(e: any) =>
                      handleEarningCalcChange(row.id, e.target.value)
                    }
                    selectItems={MakingChageType}
                    disabled={isReadOnly}
                    {...tableSelectBoxProps}
                  />
                </Grid>

                {/* Value */}
                <Grid
                  size={3.5}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    {row.calculationType === 'Amount' && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          pointerEvents: 'none',
                        }}
                      >
                        ₹
                      </Typography>
                    )}
                    <TextInput
                      value={row.value || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleEarningInputChange(
                          row.id,
                          'value',
                          e.target.value
                        )
                      }
                      disabled={isReadOnly}
                      {...tableTextInputProps}
                      inputBoxTextStyle={{
                        ...(row.calculationType === 'Amount' && {
                          paddingLeft: '28px',
                        }),
                        ...(row.calculationType === 'Percentage' && {
                          paddingLeft: '24px',
                        }),
                      }}
                    />
                    {row.calculationType === 'Percentage' && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          right: '290px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          pointerEvents: 'none',
                        }}
                      >
                        %
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Add / Delete Buttons */}
                <Grid
                  size={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {earningRows.length - 1 === index ? (
                    <IconButton onClick={handleAddEarningRow}>
                      <Add sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleDeleteEarningRow(row.id)}>
                      <Delete sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* --------- DEDUCTIONS TABLE --------- */}
        <Grid container width={'100%'} sx={{ padding: '10px' }}>
          <Grid
            width={'100%'}
            sx={{
              border: '1px solid #E4E4E4',
              backgroundColor: theme.Colors.whitePrimary,
              padding: '10px',
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <Typography
              style={{
                fontFamily: theme.fontFamily.roboto,
                fontWeight: theme.fontWeight.mediumBold,
                fontSize: theme.MetricsSizes.small_xxx,
                color: theme.Colors.blackPrimary,
              }}
            >
              DEDUCTIONS
            </Typography>
          </Grid>

          <Grid
            width={'100%'}
            pb={2}
            sx={{
              ...formLayoutStyle,
              borderTop: 'none',
              borderRadius: '0px 0px 8px 8px',
            }}
          >
            <Grid container sx={tableColumnStyle}>
              <Grid sx={columnCellStyle} size={3.5}>
                Pay Type
              </Grid>
              <Grid sx={columnCellStyle} size={3.5}>
                Calculation Type
              </Grid>
              <Grid sx={columnCellStyle} size={3.5}>
                Value
              </Grid>
              <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
                Action
              </Grid>
            </Grid>

            {deductionRows.map((row: MasterRow, index: number) => (
              <Grid container sx={tableRowStyle} key={row.id}>
                {/* Pay Type */}
                <Grid
                  size={3.5}
                  sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
                >
                  <TextInput
                    placeholderText="Enter Pay Type"
                    value={row.payType || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleDeductionInputChange(
                        row.id,
                        'payType',
                        e.target.value
                      )
                    }
                    disabled={isReadOnly}
                    {...tableTextInputProps}
                  />
                </Grid>

                {/* Calculation Type */}
                <Grid
                  size={3.5}
                  sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
                >
                  <MUHSelectBoxComponent
                    isCheckbox={false}
                    placeholderText="Select Calculation Type"
                    value={row.calculationType || ''}
                    onChange={(e: any) =>
                      handleDeductionCalcChange(row.id, e.target.value)
                    }
                    selectItems={MakingChageType}
                    disabled={isReadOnly}
                    {...tableSelectBoxProps}
                  />
                </Grid>

                {/* Value */}
                <Grid
                  size={3.5}
                  sx={{
                    borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    {row.calculationType === 'Amount' && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          pointerEvents: 'none',
                        }}
                      >
                        ₹
                      </Typography>
                    )}
                    <TextInput
                      placeholderText="Enter Value"
                      value={row.value || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleDeductionInputChange(
                          row.id,
                          'value',
                          e.target.value
                        )
                      }
                      disabled={isReadOnly}
                      {...tableTextInputProps}
                      inputBoxTextStyle={{
                        ...(row.calculationType === 'Amount' && {
                          paddingLeft: '28px',
                        }),
                        ...(row.calculationType === 'Percentage' && {
                          paddingRight: '24px',
                        }),
                      }}
                    />
                    {row.calculationType === 'Percentage' && (
                      <Typography
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                          fontWeight: 600,
                          color: theme.palette.text.primary,

                          pointerEvents: 'none',
                        }}
                      >
                        %
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Add / Delete Buttons */}
                <Grid
                  size={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {deductionRows.length - 1 === index ? (
                    <IconButton onClick={handleAddDeductionRow}>
                      <Add sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleDeleteDeductionRow(row.id)}
                    >
                      <Delete sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Form Action Buttons */}
      <Grid
        container
        width={'100%'}
        justifyContent={'center'}
        sx={{ mt: 3, mb: 2 }}
      >
        <FormAction
          firstBtntxt="Save"
          secondBtntx="Cancel"
          handleCancel={handleCancel}
          handleCreate={handleSave}
          {...commonTextInputProps}
        />
      </Grid>
    </>
  );
};

export default PayrollMaster;
