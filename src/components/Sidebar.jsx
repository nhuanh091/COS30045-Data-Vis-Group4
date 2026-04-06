import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
} from '@mui/material'
import {
  HomeRounded,
  BarChartRounded,
  LocationOnRounded,
  GroupsRounded,
  InfoRounded,
  ExpandLess,
  ExpandMore,
  MenuRounded,
  CloseRounded,
  ScienceRounded,
} from '@mui/icons-material'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Home', icon: <HomeRounded />, path: '/' },
  {
    label: 'Dashboard',
    icon: <BarChartRounded />,
    children: [
      { label: 'Overview', icon: <BarChartRounded />, path: '/' },
      { label: 'Location', icon: <LocationOnRounded />, path: '/overview/locations' },
      { label: 'Age Group', icon: <GroupsRounded />, path: '/overview/age-group' },
    ],
  },
  { label: 'About', icon: <InfoRounded />, path: '/about' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width:900px)')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(
    location.pathname.startsWith('/overview') || location.pathname === '/'
  )

  const isActive = (path) => location.pathname === path
  const isDashboardActive = location.pathname.startsWith('/overview') || location.pathname === '/'

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
        background: 'linear-gradient(180deg, #2D1B4E 0%, #1A0E2E 100%)',
        color: '#fff',
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
            bgcolor: '#7658B2',
            width: 40,
            height: 40,
            boxShadow: '0 0 20px rgba(118,88,178,0.4)',
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
              background: 'linear-gradient(135deg, #A48ECA 0%, #EDDDEC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BITRE
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(237,221,236,0.5)',
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
      <Box sx={{ mx: 3, mb: 2, borderBottom: '1px solid rgba(164,142,202,0.15)' }} />

      {/* Navigation */}
      <List sx={{ px: 1.5, flex: 1 }} component="nav">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => setDashboardOpen(!dashboardOpen)}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    py: 1.2,
                    px: 2,
                    color: isDashboardActive ? '#fff' : 'rgba(237,221,236,0.6)',
                    bgcolor: isDashboardActive
                      ? 'rgba(118,88,178,0.2)'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(118,88,178,0.15)',
                      color: '#fff',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isDashboardActive
                        ? '#A48ECA'
                        : 'rgba(237,221,236,0.4)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.88rem',
                      fontWeight: isDashboardActive ? 700 : 500,
                    }}
                  />
                  {dashboardOpen ? (
                    <ExpandLess sx={{ fontSize: 18, opacity: 0.6 }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: 18, opacity: 0.6 }} />
                  )}
                </ListItemButton>
                <Collapse in={dashboardOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 2 }}>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.label}
                        onClick={() => handleNavigate(child.path)}
                        sx={{
                          borderRadius: '10px',
                          mb: 0.3,
                          py: 0.9,
                          px: 2,
                          color: isActive(child.path)
                            ? '#fff'
                            : 'rgba(237,221,236,0.5)',
                          bgcolor: isActive(child.path)
                            ? 'rgba(118,88,178,0.3)'
                            : 'transparent',
                          borderLeft: isActive(child.path)
                            ? '3px solid #A48ECA'
                            : '3px solid transparent',
                          '&:hover': {
                            bgcolor: 'rgba(118,88,178,0.12)',
                            color: '#fff',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive(child.path)
                              ? '#E99E1C'
                              : 'rgba(237,221,236,0.35)',
                            minWidth: 36,
                            '& svg': { fontSize: 19 },
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: '0.82rem',
                            fontWeight: isActive(child.path) ? 600 : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )
          }

          return (
            <ListItemButton
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: '12px',
                mb: 0.5,
                py: 1.2,
                px: 2,
                color: isActive(item.path) ? '#fff' : 'rgba(237,221,236,0.6)',
                bgcolor: isActive(item.path)
                  ? 'rgba(118,88,178,0.25)'
                  : 'transparent',
                borderLeft: isActive(item.path)
                  ? '3px solid #E99E1C'
                  : '3px solid transparent',
                '&:hover': {
                  bgcolor: 'rgba(118,88,178,0.15)',
                  color: '#fff',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? '#E99E1C'
                    : 'rgba(237,221,236,0.4)',
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
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* Footer branding */}
      <Box sx={{ px: 3, py: 2 }}>
        <Box sx={{ borderTop: '1px solid rgba(164,142,202,0.15)', pt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(237,221,236,0.3)',
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
              color: 'rgba(237,221,236,0.2)',
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
            bgcolor: '#2D1B4E',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(45,27,78,0.4)',
            '&:hover': { bgcolor: '#3D2B5E' },
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
              boxShadow: '4px 0 30px rgba(45,27,78,0.12)',
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
