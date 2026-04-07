import { createTheme } from '@mui/material/styles';

// Pass 1 — build palette and shape first so we can reference tokens in Pass 2
const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#61196E', // Eminence (Deep Purple)
      light: '#7658B2', // Royal Purple
      dark: '#4D1058',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A48ECA', // African Violet
      light: '#EDDDEC', // Platinum
      dark: '#60509D', // Liberty
    },
    // The "Purple & Yellow" combo from the Gamboge image
    warning: {
      main: '#E99E1C', // Gamboge (Golden Yellow)
      light: '#FDCBB4', // Apricot
      dark: '#852501', // Sienna
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
    },
    error: {
      main: '#BF6BA1', // Sky Magenta (using as a soft error/accent)
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    background: {
      default: '#F3F4F6', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

// Pass 2 — add typography and components using palette tokens
const theme = createTheme(baseTheme, {
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
      color: baseTheme.palette.primary.main,
    },
    h2: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
      color: baseTheme.palette.text.primary,
    },
    h3: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 28px',
          fontWeight: 700,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0px 10px 30px rgba(97, 25, 110, 0.05)',
          border: '1px solid #EDDDEC',
        },
      },
    },
  },
});

export default theme;
