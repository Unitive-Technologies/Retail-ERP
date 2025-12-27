import { useState } from 'react';
import { Dayjs } from 'dayjs';
import { commonTextInputProps } from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  DragDropUpload,
  styles,
  TextInput,
} from '@components/index';
import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { CardContent, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import { useNavigate } from 'react-router-dom';

const AssetScrap = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/admin/assetManagement/create');
  };
  const handleCreate = () => {};
  const [selectedBranch, setSelectedBranch] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [receiptDate, setReceiptDate] = useState<Dayjs | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const onBrowseClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    let previewURL = '';
    previewURL = URL.createObjectURL(file);

    setUploadedFile(file);
    setUploadedImageUrl(previewURL);
  };

  const handleDeleteImage = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedFile(null);
    setUploadedImageUrl(null);
  };

  return (
    <>
      <Grid container flexDirection={'column'} sx={{ flex: 1, minHeight: 0 }}>
        <PageHeader
          title="ASSET SCRAP"
          navigateUrl="/admin/assetManagement"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
          showBackButton={false}
        />
        <Grid container sx={{ width: '100%' }}>
          <Grid
            flexDirection={'row'}
            sx={{
              width: '100%',
              border: `1px solid ${theme.Colors.grayLight}`,
              borderRadius: '8px',
              backgroundColor: theme.Colors.whitePrimary,
              mb: 3,
              mt: 2,
            }}
          >
            <CardContent
              sx={{ p: 3, borderBottom: `1px solid ${theme.Colors.grayLight}` }}
            >
              <MUHTypography
                size={'16px'}
                weight={600}
                sx={{
                  fontFamily: 'Roboto-regular',
                  backgroundColor: theme.Colors.whitePrimary,
                }}
              >
                RECEIPT DETAILS
              </MUHTypography>
            </CardContent>
            <Grid container spacing={2} sx={{ padding: '20px' }}>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput inputLabel="Receipt No" {...commonTextInputProps} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <MUHDatePickerComponent
                  labelText="Receipt Date"
                  required
                  value={receiptDate}
                  handleChange={(newValue: Dayjs | null) => {
                    setReceiptDate(newValue);
                  }}
                  handleClear={() => {
                    setReceiptDate(null);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <AutoSearchSelectWithLabel
                  required
                  label="Bill Type"
                  options={[{ label: 'Others', value: 1 }]}
                  value={selectedBranch}
                  onChange={(_e, value) => setSelectedBranch(value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <AutoSearchSelectWithLabel
                  required
                  label="Payment Mode"
                  options={[
                    { label: 'Cash', value: 1 },
                    { label: 'Debit card', value: 2 },
                  ]}
                  value={selectedBranch}
                  onChange={(_e, value) => setSelectedBranch(value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <AutoSearchSelectWithLabel
                  required
                  label="Account Name"
                  options={[
                    { label: 'Scrap Scale', value: 1 },
                    { label: 'Scrap Scale 1', value: 2 },
                  ]}
                  value={selectedBranch}
                  onChange={(_e, value) => setSelectedBranch(value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <TextInput inputLabel="Amount" {...commonTextInputProps} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput
                  inputLabel="Amount in Words"
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <TextInput inputLabel="Remarks" {...commonTextInputProps} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <DragDropUpload
                  labelText="Upload Document"
                  fileName={uploadedFile?.name}
                  image_url={uploadedImageUrl}
                  onBrowseButtonClick={(e) => onBrowseClick(e)}
                  handleDeleteImage={() => handleDeleteImage()}
                  required
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* ITEM Details */}

        <FormAction
          firstBtntxt="Create"
          secondBtntx="Cancel"
          handleCancel={handleCancel}
          handleCreate={handleCreate}
          {...commonTextInputProps}
        />
      </Grid>
    </>
  );
};

export default AssetScrap;
