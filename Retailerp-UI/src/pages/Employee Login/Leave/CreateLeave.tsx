import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageHeader from '@components/PageHeader';
import { TextareaAutosize, Typography, useTheme } from '@mui/material';

import { styles } from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { commonSelectBoxProps } from '@components/CommonStyles';
import dayjs from 'dayjs';
import FormAction from '@components/ProjectCommon/FormAction';

const PurchaseReport = () => {
  const theme = useTheme();

  /* ---------------- State ---------------- */
  const [leaveDate, setLeaveDate] = useState<any>(dayjs('2025-01-10'));
  const [leaveType, setLeaveType] = useState<string>('casual_leave');
  const [reason, setReason] = useState<string>('');

  const OfferType = [
    { label: 'Casual Leave', value: 'casual_leave' },
    { label: 'Sick Leave', value: 'sick_leave' },
    { label: 'Earned Leave', value: 'earned_leave' },
    { label: 'Maternity Leave', value: 'maternity_leave' },
    { label: 'Paternity Leave', value: 'paternity_leave' },
  ];

  /* ---------------- Handlers ---------------- */
  const handleCreate = () => {
    const payload = {
      leave_date: leaveDate ? dayjs(leaveDate).format('YYYY-MM-DD') : null,
      leave_type: leaveType,
      reason,
    };

    console.log('Create Leave Payload:', payload);
    // API call goes here
  };

  const handleCancel = () => {
    setLeaveDate(null);
    setLeaveType('');
    setReason('');
  };

  return (
    <>
      <Grid
        container
        direction="column"
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        {/* Header */}
        <PageHeader
          title="Create Leave Request"
          showDownloadBtn={false}
          showCreateBtn={false}
          showlistBtn={false}
          titleStyle={{ color: theme.Colors.black }}
        />

        {/* Card */}
        <Grid
          container
          direction="column"
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <Grid container padding="20px" spacing={2}>
            {/* Leave Date */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <MUHDatePickerComponent
                labelText="Leave Date"
                value={leaveDate}
                useNewIcon
                required
                handleChange={(newDate: any) => setLeaveDate(newDate)}
                handleClear={() => setLeaveDate(null)}
              />
            </Grid>

            {/* Leave Type */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <MUHSelectBoxComponent
                selectLabel="Leave Type"
                required
                value={leaveType}
                onChange={(e: any) => setLeaveType(e.target.value)}
                selectItems={OfferType}
                {...commonSelectBoxProps}
              />
            </Grid>

            {/* Reason */}
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  color: theme.Colors.black,
                  fontWeight: theme.fontWeight.medium,
                  fontSize: theme.MetricsSizes.small_xx,
                  fontFamily: theme.fontFamily.roboto,
                  minWidth: '120px',
                  width: '18%',
                }}
              >
                Reason
              </Typography>

              <TextareaAutosize
                minRows={2}
                maxRows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  border: `1px solid ${theme.Colors.silverFoilWhite}`,
                  resize: 'vertical',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: theme.fontFamily.roboto,
                  padding: '10px',
                  color: theme.Colors.black,
                  backgroundColor: theme.Colors.whitePrimary,
                }}
                onFocus={(e) => {
                  e.target.style.border = `1px solid ${theme.Colors.primary}`;
                }}
                onBlur={(e) => {
                  e.target.style.border = `1px solid ${theme.Colors.silverFoilWhite}`;
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Actions */}
      </Grid>
      <FormAction handleCreate={handleCreate} handleCancel={handleCancel} />
    </>
  );
};

export default PurchaseReport;
