import { Box, useMediaQuery } from '@mui/material'
import Sidebar from './Sidebar'

const DRAWER_WIDTH = 260

function Layout({ children }) {
  const isMobile = useMediaQuery('(max-width:900px)')

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          pt: isMobile ? 8 : { xs: 2, sm: 3, md: 4 },
          bgcolor: '#F5F0F7',
          minHeight: '100vh',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
