import { Box, CircularProgress } from '@mui/material';

const MUHLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default MUHLoader;