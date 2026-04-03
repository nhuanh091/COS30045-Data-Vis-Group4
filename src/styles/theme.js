import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6D28D9', // Vivid Violet
    },
    secondary: {
      main: '#A78BFA', // Softer Purple
    },
    background: {
      default: '#F9FAFB', // Light Gray
    },
    text: {
      primary: '#1F2937', // Dark Gray
      secondary: '#6B7280', // Medium Gray
    }
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  }
})

export default theme
