import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6D28D9', // Vivid Violet
      light: '#8B5CF6',
      dark: '#5B21B6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A78BFA', // Softer Purple
      light: '#C4B5FD',
      dark: '#7C3AED',
    },
    success: {
      main: '#10B981', // Income Green
      light: '#D1FAE5',
      dark: '#059669',
    },
    error: {
      main: '#EF4444', // Expense Red
      light: '#FEE2E2',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    info: {
      main: '#3B82F6',
      light: '#DBEAFE',
    },
    background: {
      default: '#F9FAFB', // Very Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937', // Dark Gray (Headers)
      secondary: '#6B7280', // Lighter Gray (Body)
      disabled: '#9CA3AF',
    },
    divider: '#F3F4F6',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.75rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(109, 40, 217, 0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#8B5CF6',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F3F4F6',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
