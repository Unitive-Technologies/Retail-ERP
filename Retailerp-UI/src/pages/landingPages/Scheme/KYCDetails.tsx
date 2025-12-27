import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SelectBoxComponent, TextInput } from '../../../components/index';

interface KYCDetailsProps {
  onFormChange?: (formData: KYCFormData) => void;
  initialData?: Partial<KYCFormData>;
}

interface KYCFormData {
  idProof: string;
  idProofNo: string;
  nominee: string;
  nomineeRelation: string;
}

const KYCDetails: React.FC<KYCDetailsProps> = ({
  onFormChange,
  initialData = {},
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<KYCFormData>({
    idProof: initialData.idProof || 'PAN Card',
    idProofNo: initialData.idProofNo || '',
    nominee: initialData.nominee || 'Kannan',
    nomineeRelation: initialData.nomineeRelation || '',
  });

  const idProofOptions = [
    { value: 'PAN Card', label: 'PAN Card' },
    { value: 'Aadhaar Card', label: 'Aadhaar Card' },
    { value: 'Driving License', label: 'Driving License' },
    { value: 'Passport', label: 'Passport' },
    { value: 'Voter ID', label: 'Voter ID' },
  ];

  const handleFieldChange = (field: keyof KYCFormData, value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);

    if (onFormChange) {
      onFormChange(updatedFormData);
    }
  };

  const handleIdProofNoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFieldChange('idProofNo', event.target.value);
  };

  const handleNomineeRelationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFieldChange('nomineeRelation', event.target.value);
  };

  return (
    <Box
      sx={
        {
          // p: 3,
        }
      }
    >
      {/* Header */}
      <Box
        sx={{
          borderRadius: '12px 12px 0px 0px',
          border: `1px solid #E1E1E1`,
          borderBottom: '0px',

          p: 2,
        }}
      >
        <Typography
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: theme.Colors.black,
            fontFamily: 'Roboto Slab',

            textAlign: 'left',
          }}
        >
          ENTER KYC DETAILS
        </Typography>
      </Box>

      <Grid
        container
        sx={{
          borderRadius: '0px 0px 12px 12px',
          border: `1px solid #E1E1E1`,
          mb: 4,
          p: 2,
        }}
        spacing={3}
      >
        {/* ID Proof */}
        <Grid size={6}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: theme.Colors.black,
              marginBottom: 1,
              fontFamily: 'Roboto Slab',
            }}
          >
            ID Proof
          </Typography>
          <SelectBoxComponent
            value={formData.idProof}
            onChange={(event) =>
              handleFieldChange('idProof', event.target.value)
            }
            selectItems={idProofOptions}
            variant="outlined"
            fullWidth
            selectHeight={45}
            borderRadius={1}
            placeholderText="Select ID Proof"
          />
        </Grid>

        {/* ID Proof No */}
        <Grid size={6}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: theme.Colors.black,
              marginBottom: 1,
              fontFamily: 'Roboto Slab',
            }}
          >
            ID Proof No
          </Typography>
          <TextInput
            value={formData.idProofNo}
            onChange={handleIdProofNoChange}
            variant="outlined"
            fullWidth
            height={45}
            borderRadius={1}
            placeholderText="Enter ID Proof Number"
            inputProps={{
              style: { textTransform: 'uppercase' },
            }}
          />
        </Grid>

        {/* Nominee */}
        <Grid size={6}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: theme.Colors.black,
              fontFamily: 'Roboto Slab',
              marginBottom: 1,
            }}
          >
            Nominee
          </Typography>
          <TextInput
            value={formData.nominee}
            onChange={(e) => handleFieldChange('nominee', e.target.value)}
            placeholder="Enter Nominee"
            variant="outlined"
            fullWidth
            borderRadius={1}
            fontFamily="Roboto Slab"
            fontWeight={400}
            fontSize={16}
          />
        </Grid>

        {/* Nominee Relation */}
        <Grid size={6}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: theme.Colors.black,
              fontFamily: 'Roboto Slab',
              marginBottom: 1,
            }}
          >
            Nominee Relation
          </Typography>
          <TextInput
            value={formData.nomineeRelation}
            onChange={handleNomineeRelationChange}
            variant="outlined"
            fullWidth
            height={45}
            borderRadius={1}
            placeholderText="Enter Relation"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default KYCDetails;
