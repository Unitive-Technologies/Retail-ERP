import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const Gold = () => {
const { option } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#4E2223', fontWeight: 600 }}>
        Gold - {option}
      </Typography>
    </Box>
  );
};

export default Gold;