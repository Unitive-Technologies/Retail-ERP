import { useTheme, IconButton, Box } from '@mui/material';
import { Add, Delete, Download } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { ButtonComponent, DragDropUpload, TextInput } from '@components/index';
import {
  columnCellStyle,
  formLayoutStyle,
  tableColumnStyle,
  tableRowStyle,
  tableSelectBoxProps,
  tableTextInputProps,
} from '@components/CommonStyles';
import { docNames } from '@constants/Constance';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import { isValidAadhaar, isValidGSTIN, isValidPAN } from '@utils/form-util';
import { useState } from 'react';

type Props = {
  edit: any;
  type?: string | null;
};

const KYCDetails = ({ edit, type }: Props) => {
  const theme = useTheme();
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [uploadingRowIndex, setUploadingRowIndex] = useState<number | null>(
    null
  );
  const allRows = edit.getValue('kyc_details') || [];
  const isReadOnly = type === 'view';

  // Filter out empty rows in view mode
  const rows = isReadOnly
    ? allRows.filter(
        (row: any) =>
          row && (row.docName || row.docNo || row.document_url || row.file)
      )
    : allRows;

  const mapDocNameToValue = (val: any) => {
    if (val == null || val === '') return '';
    const v = String(val).trim();

    const match = docNames.find(
      (opt: any) => String(opt.value) === v || String(opt.label) === v
    );
    return match ? match.value : '';
  };

  const mapDocNameToLabel = (val: any) => {
    if (val == null || val === '') return '-';
    const v = String(val).trim();

    const match = docNames.find(
      (opt: any) => String(opt.value) === v || String(opt.label) === v
    );
    return match ? match.label : v;
  };
  const defaultRow = [{ docName: '', docNo: '', file: null, document_url: '' }];

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (rows.length > 0) {
      const isServerRow = 'id' in (lastRow || {});
      const hasMissing =
        !lastRow?.docName ||
        !lastRow?.docNo ||
        !(lastRow?.file || lastRow?.document_url);
      if (!isServerRow && hasMissing) {
        toast.error('Please fill all fields before adding a new row.');
        return;
      }
    }

    const newRow = {
      // id: Date.now(),
      docName: '',
      docNo: '',
      file: null,
      document_url: '',
    };

    edit.update({ kyc_details: [...rows, newRow] });
  };

  const handleDeleteRow = async (id: number | undefined, rowIndex: number) => {
    if (rows.length > 1) {
      const row = rows[rowIndex];
      if (row && row.id) {
        try {
          const res: any = await API_SERVICES.KycService.deleteKyc(row.id, {
            successMessage: 'KYC deleted successfully',
            failureMessage: 'Failed to delete KYC',
          });
          if (res?.status < HTTP_STATUSES.BAD_REQUEST) {
            const updated = rows.filter((r: any) => r.id !== row.id);
            edit.update({ kyc_details: updated });
          }
        } catch (err: any) {
          console.log(err);
        }
      } else {
        const updated = [...rows];
        updated.splice(rowIndex, 1);
        edit.update({ kyc_details: updated });
      }
    }
  };

  const handleInputChange = (rowIndex: number, field: string, value: any) => {
    const currentRows = edit.getValue('kyc_details') || [];
    if (currentRows.length === 0) {
      const first = {
        docName: '',
        docNo: '',
        file: null,
        document_url: '',
      } as any;
      first[field] = value;
      edit.update({ kyc_details: [first] });
      return;
    }
    if (rowIndex < 0 || rowIndex >= currentRows.length) return;
    const updatedRows = [...currentRows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
    edit.update({ kyc_details: updatedRows });
  };

  const onBrowseClick = async (event: any, rowIndex: number) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    let previewURL = '';
    previewURL = URL.createObjectURL(file);

    // Set local preview first
    const updatedPreview = [...rows];
    updatedPreview[rowIndex] = {
      ...updatedPreview[rowIndex],
      file,
      document_url: previewURL,
    };
    edit.update({ kyc_details: updatedPreview });

    // mark upload start
    try {
      setIsDocumentUploading(true);
      setUploadingRowIndex(rowIndex);
      const formData = new FormData();
      formData.append('files', file);

      const uploadImageRes =
        await API_SERVICES.ImageUploadService.uploadImage(formData);

      const res: any = uploadImageRes;

      if (
        res?.status < HTTP_STATUSES.BAD_REQUEST &&
        res?.data?.data?.images?.length
      ) {
        const document_url = res.data.data.images[0].Location;

        const updated = [...rows];
        updated[rowIndex] = {
          ...updated[rowIndex],
          file,
          document_url,
        };

        edit.update({ kyc_details: updated });
        toast.success('KYC document uploaded successfully');
      } else {
        toast.error('Failed to upload KYC document');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed. Please try again.');
    } finally {
      setIsDocumentUploading(false);
      setUploadingRowIndex(null);
      if (event?.target) {
        event.target.value = '';
      }
    }
  };

  const handleDeleteImage = (rowIndex: number) => {
    const updated = [...rows];
    updated[rowIndex] = {
      ...updated[rowIndex],
      file: null,
      document_url: '',
    };
    edit.update({ kyc_details: updated });

    toast.success('KYC document removed successfully');
  };

  const handleDownloadClick = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Grid width={'100%'} pb={2} sx={formLayoutStyle}>
      <Grid container sx={tableColumnStyle}>
        <Grid sx={columnCellStyle} size={1}>
          S.No
        </Grid>
        <Grid sx={columnCellStyle} size={3.33}>
          Document Name
        </Grid>
        <Grid sx={columnCellStyle} size={3.33}>
          Document No
        </Grid>
        <Grid
          sx={{
            ...columnCellStyle,
            ...(isReadOnly && { borderRight: 'none' }),
          }}
          size={3.33}
        >
          Document File
        </Grid>
        {!isReadOnly && (
          <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
            Action
          </Grid>
        )}
      </Grid>

      {(rows.length > 0 ? rows : isReadOnly ? [] : defaultRow).map(
        (row: any, index: number) => (
          <Grid container sx={tableRowStyle} key={row.id ?? index}>
            <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 500 }}>
              {index + 1}
            </Grid>
            <Grid
              size={3.33}
              sx={{
                borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                display: 'flex',
                alignItems: 'center',
                px: 1,
              }}
            >
              {isReadOnly ? (
                <Box sx={{ fontSize: 14, color: theme.Colors.grayPrimary }}>
                  {mapDocNameToLabel(row.docName)}
                </Box>
              ) : (
                <MUHSelectBoxComponent
                  isCheckbox={false}
                  placeholderText="Select Document Name"
                  value={mapDocNameToValue(row.docName)}
                  onChange={(e: any) =>
                    handleInputChange(index, 'docName', e.target.value)
                  }
                  selectItems={docNames}
                  disabled={isReadOnly}
                  {...tableSelectBoxProps}
                />
              )}
            </Grid>

            <Grid
              size={3.33}
              sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
            >
              <TextInput
                placeholderText="Enter Document Number"
                value={row.docNo}
                onChange={(e: any) => {
                  const selected = mapDocNameToValue(row.docName);
                  const valRaw = String(e.target.value || '');
                  let next = valRaw;
                  if (selected === 1) {
                    // PAN: Alphanumeric, uppercase, max 10
                    next = valRaw
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '')
                      .slice(0, 10);
                  } else if (selected === 2) {
                    // GST: Alphanumeric, uppercase, max 15
                    next = valRaw
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '')
                      .slice(0, 15);
                  } else if (selected === 4) {
                    // Aadhaar: digits only, max 12
                    next = valRaw.replace(/\D+/g, '').slice(0, 12);
                  } else {
                    // Default: remove non-alphanumerics
                    next = valRaw.replace(/[^a-zA-Z0-9]/g, '');
                  }
                  handleInputChange(index, 'docNo', next);
                }}
                disabled={isReadOnly}
                isError={(() => {
                  const selected = mapDocNameToValue(row.docName);
                  const value = row.docNo || '';
                  if (!value) return false;
                  if (selected === 1) return !isValidPAN(value);
                  if (selected === 2) return !isValidGSTIN(value);
                  if (selected === 4) return !isValidAadhaar(value);
                  return false;
                })()}
                {...tableTextInputProps}
              />
            </Grid>
            <Grid
              size={3.33}
              sx={{
                ...(!isReadOnly && {
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                }),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box width={'90%'}>
                {(() => {
                  const imageUrl = row?.document_url;
                  const isUploading =
                    isDocumentUploading && uploadingRowIndex === index;

                  if (!isReadOnly) {
                    return (
                      <DragDropUpload
                        required={false}
                        fileName={row?.file?.name}
                        disabled={isUploading}
                        image_url={imageUrl}
                        onBrowseButtonClick={(e) => onBrowseClick(e, index)}
                        handleDeleteImage={() => handleDeleteImage(index)}
                        uploadText={isUploading ? 'Uploading...' : undefined}
                      />
                    );
                  }

                  if (imageUrl) {
                    return (
                      <ButtonComponent
                        buttonText="Download"
                        btnWidth={'100%'}
                        startIcon={<Download />}
                        btnBorderRadius={2}
                        onClick={() => handleDownloadClick(imageUrl)}
                      />
                    );
                  }
                  return (
                    <Box
                      sx={{
                        fontSize: 14,
                        color: theme.Colors.grayPrimary,
                        textAlign: 'center',
                      }}
                    >
                      No file uploaded
                    </Box>
                  );
                })()}
              </Box>
            </Grid>
            {!isReadOnly && (
              <Grid
                size={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {rows.length === 0 || rows.length - 1 == index ? (
                  <IconButton onClick={handleAddRow}>
                    <Add sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleDeleteRow(row.id, index)}>
                    <Delete sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                )}
              </Grid>
            )}
          </Grid>
        )
      )}
    </Grid>
  );
};

export default KYCDetails;
