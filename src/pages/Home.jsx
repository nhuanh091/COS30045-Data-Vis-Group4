import { Box, Typography, Button } from '@mui/material'

function Home() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: 2 
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        Analytics Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to your financial analytics project.
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Box>
  )
}

export default Home
