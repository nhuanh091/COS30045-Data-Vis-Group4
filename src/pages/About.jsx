import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
} from '@mui/material'
import {
  TrackChangesRounded,
  GroupsRounded,
  PolicyRounded,
  PublicRounded,
  BuildRounded,
  VerifiedRounded,
  TrendingUpRounded,
  FilterAltRounded,
  MapRounded,
} from '@mui/icons-material'

// Team Members 
const team = [
  {
    name: 'Nam Anh',
    role: 'Team Member',
    avatar: 'NA',
    color: '#7658B2',
  },
  {
    name: 'Như Anh',
    role: 'Leader',
    avatar: 'NA',
    color: '#A48ECA',
  },
  {
    name: 'Tùng Dương',
    role: 'Team Member',
    avatar: 'TD',
    color: '#60509D',
  },
]

// Tech Stack 
const tools = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Vite', color: '#646CFF' },
  { name: 'D3.js', color: '#E99E1C' },
  { name: 'MUI', color: '#7658B2' },
  { name: 'Zustand', color: '#60509D' },
]

// Target Audiences 
const audiences = [
  {
    icon: <PolicyRounded />,
    title: 'Policymakers & Law Enforcement',
    desc: 'Evaluate whether roadside drug testing effectively targets high-risk demographics and locations.',
    color: '#61196E',
  },
  {
    icon: <TrendingUpRounded />,
    title: 'Researchers & Analysts',
    desc: 'Investigate correlations between detection methods, drug types, and regional enforcement outcomes.',
    color: '#7658B2',
  },
  {
    icon: <PublicRounded />,
    title: 'General Public',
    desc: 'Transparently understand drug driving enforcement across states and territories.',
    color: '#A48ECA',
  },
]

// Key Tasks 
const keyTasks = [
  { icon: <FilterAltRounded />, label: 'Filter & Drill Down by jurisdiction, month, and testing stage' },
  { icon: <GroupsRounded />, label: 'Compare demographics across age groups and enforcement outcomes' },
  { icon: <MapRounded />, label: 'Track geospatial trends and identify hotspots across regions' },
]

function About() {
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          mb: 4,
          background: 'linear-gradient(135deg, #2D1B4E 0%, #61196E 50%, #7658B2 100%)',
          p: { xs: 4, md: 6 },
          color: '#fff',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(164,142,202,0.12)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(233,158,28,0.1)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            label="COS30045 — Data Visualisation"
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.12)',
              color: '#EDDDEC',
              fontWeight: 600,
              fontSize: '0.7rem',
              mb: 2,
              backdropFilter: 'blur(8px)',
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              lineHeight: 1.15,
              mb: 1.5,
              background: 'linear-gradient(135deg, #fff 0%, #EDDDEC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Positive Drug Test
            <br />
            Analytics Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(237,221,236,0.7)',
              maxWidth: 600,
              fontSize: '0.95rem',
              lineHeight: 1.7,
            }}
          >
            An interactive tool visualising BITRE's roadside drug testing data across
            Australia — uncovering geographic, demographic, and enforcement trends from
            the restructured 2023 dataset.
          </Typography>
        </Box>
      </Box>

      {/* Why This Dashboard */}
      <Card
        sx={{
          mb: 4,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #EDDDEC',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <TrackChangesRounded sx={{ color: '#7658B2', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} color="#2D1B4E">
              Why This Dashboard?
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: '#4B5563', lineHeight: 1.8, maxWidth: 800 }}
          >
            In 2023, BITRE restructured its data collection — introducing monthly
            tracking, age-group breakdowns by remoteness area, and severity-level
            enforcement outcomes (charges vs. arrests). Existing static reports fail to
            capture this new depth. This project fills that gap with a targeted,
            interactive tool that transforms complex tabular data into actionable visual
            insights for better decision-making.
          </Typography>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Typography variant="h6" fontWeight={700} color="#2D1B4E" sx={{ mb: 2 }}>
        Target Audience
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {audiences.map((a) => (
          <Grid size={{ xs: 12, md: 4 }} key={a.title}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #EDDDEC',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(97,25,110,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: `${a.color}15`,
                    color: a.color,
                    width: 44,
                    height: 44,
                    mb: 2,
                  }}
                >
                  {a.icon}
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700} color="#2D1B4E" gutterBottom>
                  {a.title}
                </Typography>
                <Typography variant="body2" color="#6B7280" sx={{ lineHeight: 1.7 }}>
                  {a.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Key Tasks */}
      <Card
        sx={{
          mb: 4,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #EDDDEC',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h6" fontWeight={700} color="#2D1B4E" sx={{ mb: 2.5 }}>
            Key Tasks Users Can Perform
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {keyTasks.map((t, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: '#F5F0F7',
                  borderRadius: '12px',
                  border: '1px solid rgba(118,88,178,0.08)',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#7658B215',
                    color: '#7658B2',
                    width: 38,
                    height: 38,
                  }}
                >
                  {t.icon}
                </Avatar>
                <Typography variant="body2" fontWeight={500} color="#374151">
                  {t.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Impact */}
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #2D1B4E 0%, #61196E 100%)',
          color: '#fff',
          border: 'none',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <VerifiedRounded sx={{ color: '#E99E1C' }} />
            <Typography variant="h6" fontWeight={700}>
              Impact on Decision-Making
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              {
                title: 'Resource Allocation',
                desc: 'Deploy testing units efficiently using regional and temporal hotspot data.',
              },
              {
                title: 'Public Safety Campaigns',
                desc: 'Design demographic-specific educational campaigns based on dominant at-risk age groups.',
              },
              {
                title: 'Transparency',
                desc: 'Provide the public with a clear, unbiased narrative of nationwide drug enforcement policies.',
              },
            ].map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    height: '100%',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#E99E1C' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(237,221,236,0.7)', lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Team & Tools Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Team */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #EDDDEC',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <GroupsRounded sx={{ color: '#7658B2' }} />
                <Typography variant="h6" fontWeight={700} color="#2D1B4E">
                  Team — Group 4
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {team.map((m) => (
                  <Box
                    key={m.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      bgcolor: '#F5F0F7',
                      borderRadius: '12px',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: m.color,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {m.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="#2D1B4E">
                        {m.name}
                      </Typography>
                      <Typography variant="caption" color="#6B7280">
                        {m.role}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tools */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #EDDDEC',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <BuildRounded sx={{ color: '#7658B2' }} />
                <Typography variant="h6" fontWeight={700} color="#2D1B4E">
                  Tech Stack
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {tools.map((t) => (
                  <Chip
                    key={t.name}
                    label={t.name}
                    sx={{
                      bgcolor: `${t.color}15`,
                      color: t.color,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      px: 1,
                      border: `1px solid ${t.color}30`,
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default About
