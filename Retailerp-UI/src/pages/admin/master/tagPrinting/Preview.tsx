import React from 'react';
import { DialogComp } from '@components/index';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LandingAppbarLogo, ProjectNameLogo } from '@assets/Images';

interface SchemeDetailProps {
  onClose?: () => void;
}

const Preview: React.FC<SchemeDetailProps> = ({ onClose }) => {
  const theme = useTheme();
  const renderDialogContent = () => {
    return (
      <Grid container borderTop="2px solid #E4E4E4" justifyContent="center">
        <Grid
          container
          size={12}
          mt={5}
          sx={{ border: '1px solid #E4E4E4', borderRadius: '8px' }}
        >
          {/* QR Code Preview Section */}

          <Grid size={12} padding={1}>
            <Typography
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: theme.Colors.black,
              }}
            >
              QR Code
            </Typography>
          </Grid>

          <Grid size={12}>
            <Grid
              sx={{
                p: 4,
                backgroundColor: '#F2F2F2',
                borderTop: `1px solid ${theme.Colors.grayLight}`,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.Colors.whitePrimary,
                  borderRadius: '8px',
                  width: '450px',
                  position: 'relative',
                  p: 2,
                }}
              >
                <Box display="flex" gap={3} alignItems="flex-start">
                  {/* QR Code Section */}
                  <Box>
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8dGV4dCB4PSI2MCIgeT0iNjAiIGZvcnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+"
                      alt="QR Code"
                      style={{
                        width: '124px',
                        height: '125px',
                      }}
                    />
                  </Box>

                  {/* Product Information Section */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '125px',
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: theme.Colors.black,
                        marginBottom: '4px',
                      }}
                    >
                      Elegant Silver Stud
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: theme.Colors.black,
                        marginBottom: 'auto',
                      }}
                    >
                      SKU: ESS_124
                    </Typography>

                    {/* CHANDERA Logo positioned at bottom right of text area */}
                    <Box
                      sx={{
                        alignSelf: 'flex-end',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '4px',
                        background: `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`,
                        px: 1,
                        py: 1,
                        gap: 0.5,
                        cursor: 'pointer',
                        width: '76px',
                        height: '33px',
                      }}
                    >
                      <img src={LandingAppbarLogo} style={{ height: '16px' }} />
                      <img src={ProjectNameLogo} style={{ height: '16px' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <DialogComp
        open={true}
        dialogTitle={'PREVIEW'}
        dialogTitleStyle={{
          // fontFamily: 'Roboto',
          fontSize: '16px',
          fontWeight: 600,
          color: '#000000',
        }}
        renderDialogContent={renderDialogContent}
        onClose={onClose}
      />
    </>
  );
};

export default Preview;
