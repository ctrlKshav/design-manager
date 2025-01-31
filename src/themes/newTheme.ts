import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#6366f1', // Indigo
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#ec4899', // Pink
        light: '#f472b6',
        dark: '#db2777',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      body1: {
        lineHeight: 1.7,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
    },
  });