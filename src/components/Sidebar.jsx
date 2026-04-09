import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
} from '@mui/material'
import {
  HomeRounded,
  BarChartRounded,
  InfoRounded,
  MenuRounded,
  CloseRounded,
  ScienceRounded,
  MapRounded,
} from '@mui/icons-material'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Home',                  icon: <HomeRounded />,     path: '/' },
  { label: 'Dashboard',             icon: <BarChartRounded />, path: '/dashboard' },
  { label: 'Jurisdiction Analysis', icon: <MapRounded />,      path: '/jurisdiction' },
  { label: 'Insights',              icon: <ScienceRounded />,  path: '/insights' },
  { label: 'About',                 icon: <InfoRounded />,     path: '/about' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width:900px)')
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleNavigate = (path) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#FFFFFF',
        borderRight: '1px solid #EDDDEC',
        py: 2,
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2,
          mb: 1,
          cursor: 'pointer',
        }}
        onClick={() => handleNavigate('/')}
      >
        <Avatar
          sx={{
            bgcolor: '#61196E',
            width: 40,
            height: 40,
          }}
        >
          <ScienceRounded sx={{ fontSize: 22 }} />
        </Avatar>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: '#61196E',
            }}
          >
            BITRE
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#9CA3AF',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Drug Test Analytics
          </Typography>
        </Box>
      </Box>

      {/* Divider line */}
      <Box sx={{ mx: 3, mb: 2, borderBottom: '1px solid #F3F4F6' }} />

      {/* Navigation */}
      <List sx={{ px: 1.5, flex: 1 }} component="nav">
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => handleNavigate(item.path)}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              py: 1.2,
              px: 2,
              color: isActive(item.path) ? '#61196E' : '#6B7280',
              bgcolor: isActive(item.path) ? '#FAF7FF' : 'transparent',
              borderLeft: isActive(item.path) ? '3px solid #E99E1C' : '3px solid transparent',
              '&:hover': {
                bgcolor: '#FAF7FF',
                color: '#61196E',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path) ? '#E99E1C' : '#9CA3AF',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.88rem',
                fontWeight: isActive(item.path) ? 700 : 500,
                color: 'inherit',
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Footer branding */}
      <Box sx={{ px: 3, py: 2 }}>
        <Box sx={{ borderTop: '1px solid #F3F4F6', pt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#9CA3AF',
              fontSize: '0.65rem',
              display: 'block',
              textAlign: 'center',
            }}
          >
            COS30045 — Group 4
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#D1D5DB',
              fontSize: '0.6rem',
              display: 'block',
              textAlign: 'center',
              mt: 0.3,
            }}
          >
            Data Visualisation 2024
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            bgcolor: '#61196E',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(97,25,110,0.2)',
            '&:hover': { bgcolor: '#4D1058' },
          }}
        >
          {mobileOpen ? <CloseRounded /> : <MenuRounded />}
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Desktop permanent sidebar
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: '4px 0 16px rgba(0,0,0,0.06)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  )
}

export default Sidebar
