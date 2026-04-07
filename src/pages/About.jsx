import React from 'react'
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material'
import {
  TrackChangesRounded,
  GroupsRounded,
  BuildRounded,
  TimelineRounded,
  MapRounded,
  VerifiedRounded,
  PeopleRounded
} from '@mui/icons-material'

const team = [
  { name: 'Nam Anh', role: 'Team Member', avatar: 'NA', color: '#7658B2' },
  { name: 'Như Anh', role: 'Leader', avatar: 'NA', color: '#61196E' },
  { name: 'Tùng Dương', role: 'Team Member', avatar: 'TD', color: '#2D1B4E' },
]

const tools = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Vite', color: '#646CFF' },
  { name: 'D3.js', color: '#F9A03C' },
  { name: 'MUI', color: '#007FFF' },
  { name: 'Zustand', color: '#433929' },
]

const keyTasks = [
  { icon: <TimelineRounded />, label: 'Filter & Drill Down by jurisdiction, month, and testing stage' },
  { icon: <PeopleRounded />, label: 'Compare demographics across age groups and enforcement outcomes' },
  { icon: <MapRounded />, label: 'Track geospatial trends and identify hotspots across regions' },
]

function About() {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        // Shifting right by using more balanced padding to center in the visual workspace
        // Previous (pl: 30, pr: 290) was too far left. 
        // Balanced (pl: 160, pr: 160) centers it relative to the white area.
        pl: { lg: '160px', md: '40px', xs: '16px' }, 
        pr: { lg: '160px', md: '40px', xs: '16px' }, 
        display: 'flex', 
        justifyContent: 'center',
        pb: 10,
        pt: 4
      }}
    >
      <Box sx={{ maxWidth: 1600, width: '100%', px: { xs: 2.5, md: 5 } }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            mb: 5,
            background: 'linear-gradient(135deg, #2D1B4E 0%, #61196E 50%, #7658B2 100%)',
            p: { xs: 5, md: 7 },
            color: '#fff',
            boxShadow: '0 20px 50px rgba(45,27,78,0.2)'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 350,
              height: 350,
              borderRadius: '50%',
              bgcolor: 'rgba(164,142,202,0.15)',
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Chip
              label="COS30045 — Data Visualisation"
              size="medium"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#EDDDEC', fontWeight: 700, mb: 3, fontSize: '0.9rem' }}
            />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.6rem' },
                lineHeight: 1.1,
                mb: 2,
                background: 'linear-gradient(135deg, #fff 0%, #EDDDEC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"DM Serif Display", serif',
              }}
            >
              Positive Drug Test Analytics Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(237,221,236,0.9)', maxWidth: 1000, fontSize: '1.3rem', fontWeight: 400 }}>
              An interactive tool uncovering geographic, demographic, and enforcement trends from BITRE's roadside drug testing datasets.
            </Typography>
          </Box>
        </Box>

        {/* Why This Dashboard */}
        <Card sx={{ mb: 5, borderRadius: '24px', border: '1px solid #EDDDEC', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TrackChangesRounded sx={{ color: '#7658B2', fontSize: 36 }} />
              <Typography variant="h4" fontWeight={800} color="#2D1B4E" sx={{ fontSize: '1.8rem' }}>Why This Dashboard?</Typography>
            </Box>
            <Typography variant="h6" color="#4B5563" sx={{ lineHeight: 1.7, fontWeight: 400 }}>
              In 2023, BITRE restructured its data collection. This interactive project transforms complex records into actionable visual insights for better policy evaluation and public transparency across Australia.
            </Typography>
          </CardContent>
        </Card>

        {/* Key Tasks */}
        <Typography variant="h4" fontWeight={800} color="#2D1B4E" sx={{ mb: 3, ml: 1, fontSize: '1.8rem' }}>Key Tasks</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 6 }}>
          {keyTasks.map((t, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                p: 3.5,
                bgcolor: '#F5F0F7',
                borderRadius: '20px',
                border: '1px solid rgba(118,88,178,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#EFEEF5' }
              }}
            >
              <Avatar sx={{ bgcolor: '#7658B220', color: '#7658B2', width: 56, height: 56 }}>
                {React.cloneElement(t.icon, { sx: { fontSize: 28 } })}
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#374151" sx={{ fontSize: '1.25rem' }}>{t.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Impact Section */}
        <Card sx={{ mb: 6, borderRadius: '32px', background: 'linear-gradient(135deg, #2D1B4E 0%, #61196E 100%)', border: 'none', color: '#fff', boxShadow: '0 20px 50px rgba(45,27,78,0.2)' }}>
          <CardContent sx={{ p: { xs: 5, md: 6 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
              <VerifiedRounded sx={{ color: '#E99E1C', fontSize: 44 }} />
              <Typography variant="h3" fontWeight={800} sx={{ fontSize: '2.2rem' }}>Impact on Decision-Making</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { title: 'Resource Allocation', desc: 'Deploy testing units efficiently using geographic and temporal hotspot data.' },
                { title: 'Public Safety Campaigns', desc: 'Design demographic-specific educational campaigns based on dominant at-risk age groups.' },
                { title: 'Transparency', desc: 'Provide the public with a clear, unbiased narrative of nationwide drug enforcement policies.' },
              ].map((item) => (
                <Box key={item.title} sx={{ p: 4, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h5" fontWeight={800} color="#E99E1C" sx={{ mb: 1, fontSize: '1.4rem' }}>{item.title}</Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(237,221,236,0.85)', lineHeight: 1.6, fontSize: '1.1rem' }}>{item.desc}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Team & Tools Row */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ height: '100%', borderRadius: '24px', background: 'white', border: '1px solid #EDDDEC' }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4 }}>
                  <GroupsRounded sx={{ color: '#7658B2', fontSize: 36 }} />
                  <Typography variant="h4" fontWeight={800} color="#2D1B4E" sx={{ fontSize: '1.8rem' }}>Team — Group 4</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {team.map((m) => (
                    <Box key={m.name} sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: '#F5F0F7', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Avatar sx={{ bgcolor: m.color, fontWeight: 800, fontSize: '1rem', width: 50, height: 50 }}>{m.avatar}</Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={800} color="#2D1B4E" sx={{ fontSize: '1.2rem', lineHeight: 1 }}>{m.name}</Typography>
                        <Typography variant="body2" color="#6B7280" fontWeight={500}>{m.role}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%', borderRadius: '24px', background: 'white', border: '1px solid #EDDDEC' }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4 }}>
                  <BuildRounded sx={{ color: '#7658B2', fontSize: 36 }} />
                  <Typography variant="h4" fontWeight={800} color="#2D1B4E" sx={{ fontSize: '1.8rem' }}>Stack</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {tools.map((t) => (
                    <Chip key={t.name} label={t.name} size="medium" sx={{ bgcolor: `${t.color}15`, color: t.color, fontSize: '1rem', fontWeight: 800, px: 1, height: '44px', borderRadius: '12px' }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default About
