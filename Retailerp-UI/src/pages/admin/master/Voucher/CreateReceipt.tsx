import { useState } from 'react';
import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import {
  TextInput,
  AutoSearchSelectWithLabel,
  styles,
} from '@components/index';
import FormAction from '@components/ProjectCommon/FormAction';
import {
  formLayoutWithHeaderStyle,
  commonTextInputProps,
} from '@components/CommonStyles';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import { useEdit } from '@hooks/useEdit';

const billTypes = [
  { label: 'Invoice', value: 'invoice' },
  { label: 'Receipt', value: 'receipt' },
];
const paymentModes = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank', value: 'bank' },
];
const invoiceNos = [{ label: 'INV 01/25-25', value: 'INV 01/25-25' }];
const accountNames = [{ label: 'Praveen Kumar', value: 'Praveen Kumar' }];

// Set initial values like CreateEmployee
const UserInitialValues = {
  payment_no: '',
  payment_date: '',
  bill_type: null,
  invoice_no: null,
  payment_mode: null,
  account_name: null,
  amount: '',
  amount_in_words: '',
  remarks: '',
};

const CreateReceipt = () => {
  const [form, setForm] = useState(UserInitialValues);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };
  const edit = useEdit(UserInitialValues);

  return (
    <Grid container flexDirection={'column'}>
      <PageHeader
        title="CREATE RECEIPT"
        navigateUrl="/admin/voucher"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
      />
      <Grid container flexDirection={'column'}>
        <h3 style={{ margin: '16px 0 8px 0' }}>PAYMENT DETAILS</h3>
        <Grid container sx={formLayoutWithHeaderStyle} spacing={2}>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Receipt No "
              value={form.receipt_no}
              disabled
              {...commonTextInputProps}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <MUHDatePickerComponent
              labelText="Receipt Date"
              handleChange={(newValue) =>
                edit.update({ receipt_date: newValue })
              }
              handleClear={() => edit.update({ receipt_date: null })}
              required
              value={undefined}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Bill Type"
              options={billTypes}
              value={form.bill_type}
              onChange={(e, value) => handleChange('bill_type', value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Payment Mode"
              options={paymentModes}
              value={form.payment_mode}
              onChange={(e, value) => handleChange('payment_mode', value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Account Name"
              options={accountNames}
              value={form.account_name}
              onChange={(e, value) => handleChange('account_name', value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Amount "
              value={`₹ ${form.amount.toLocaleString()}`}
              disabled={false}
              {...commonTextInputProps}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Amount In Words "
              value={form.amount_in_words}
              disabled={false}
              {...commonTextInputProps}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Remarks "
              value={form.remarks}
              disabled={false}
              {...commonTextInputProps}
            />
          </Grid>
        </Grid>
      </Grid>
      <FormAction
        handleCreate={() => {}}
        handleCancel={() => {}}
        disableCreate={false}
      />
    </Grid>
  );
};

export default CreateReceipt;
