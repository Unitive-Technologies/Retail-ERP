interface ThemeProviderWrapperProps {
    children: ReactNode; 
  }

import { ReactNode } from "react";
import { PureLightTheme } from "./schemes/PurelightTheme"; 
import { ThemeProvider, CssBaseline } from "@mui/material";

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
    const theme = PureLightTheme();
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  };
  
  export default ThemeProviderWrapper;

