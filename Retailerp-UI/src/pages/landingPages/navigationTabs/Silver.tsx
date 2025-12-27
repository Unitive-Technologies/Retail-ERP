import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const Silver = () => {
const { option } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#4E2223', fontWeight: 600 }}>
        Silver - {option}
      </Typography>
    </Box>
  );
};

export default Silver;