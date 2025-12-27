import { RouterProvider } from 'react-router-dom';
import createRoutes from './routes/root';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { TOAST_DURATION } from '@constants/Constance';
import { CssBaseline, useTheme } from '@mui/material';

function App() {
  const theme = useTheme();
  return (
    <>
      <CssBaseline />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            padding: '10px',
            color: theme.Colors.whitePrimary,
            fontSize: 15,
          },
          success: {
            style: {
              background: 'green',
            },
            duration: 2000,
          },
          error: {
            style: {
              background: 'red',
            },
            duration: TOAST_DURATION,
          },
        }}
      />
      <RouterProvider router={createRoutes()} />
    </>
  );
}

export default App;
