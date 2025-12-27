import React from 'react';
import { DialogComp } from '@components/index';
import { Grid } from '@mui/system';

import SchemeSideNav from './SchemeSideNav';

interface SchemeDetailProps {
  onClose?: () => void;
}

const SchemeDetail: React.FC<SchemeDetailProps> = ({ onClose }) => {
  const renderDialogContent = () => {
    return (
      <Grid container spacing={3} justifyContent="space-between">
        <SchemeSideNav onClose={onClose} />
      </Grid>
    );
  };
  return <DialogComp open={true} renderDialogContent={renderDialogContent} />;
};

export default SchemeDetail;
