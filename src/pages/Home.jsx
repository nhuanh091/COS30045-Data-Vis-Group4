// src/pages/Home.jsx
import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUpRounded,
  MapRounded,
  PeopleRounded,
  BarChartRounded,
  ScienceRounded,
  InfoRounded,
  ArrowForwardRounded,
} from '@mui/icons-material'

const scopeStats = [
  { value: '7', label: 'Jurisdictions', sub: 'All states & territories' },
  { value: '24', label: 'Months', sub: 'Jan 2023 – Dec 2024' },
  { value: '5', label: 'Age Groups', sub: 'From under-16 to 65+' },
  { value: '3', label: 'Detection Stages', sub: 'Oral fluid to confirmatory' },
]

const analysisPillars = [
  {
    icon: <TrendingUpRounded />,
    title: 'Temporal Trends',
    desc: 'Testing volumes peak in Q2–Q3 each year, aligned with enforcement campaigns. Positive detection rates remain at approximately 3–5% nationally, with short-term spikes around public holidays.',
    color: '#E99E1C',
  },
  {
    icon: <MapRounded />,
    title: 'Regional Differences',
    desc: 'NSW and Victoria lead in total tests, but smaller jurisdictions show comparable positive rates when normalised. Western Australia and Queensland report significant methamphetamine and cannabis detections.',
    color: '#7658B2',
  },
  {
    icon: <PeopleRounded />,
    title: 'Demographic Patterns',
    desc: 'The 17–25 and 26–39 age groups account for the highest proportion of positive results. Cannabis remains the most frequently detected substance, followed by methylamphetamine.',
    color: '#61196E',
  },
]

const explorePages = [
  {
    icon: <BarChartRounded />,
    title: 'Interactive Dashboard',
    desc: 'Filter by jurisdiction, year, month, and detection stage. Visualise trends, drug type distributions, and enforcement outcomes in real time.',
    path: '/dashboard',
    gradient: 'linear-gradient(135deg, #61196E 0%, #7658B2 100%)',
  },
  {
    icon: <ScienceRounded />,
    title: 'Key Findings',
    desc: 'Read curated analysis of temporal patterns, regional differences, and demographic breakdowns derived from the full dataset.',
    path: '/insights',
    gradient: 'linear-gradient(135deg, #2D1B4E 0%, #61196E 100%)',
  },
  {
    icon: <InfoRounded />,
    title: 'About the Project',
    desc: 'Learn about the data source, target audience, project impact, and the team behind this COS30045 Data Visualisation project.',
    path: '/about',
    gradient: 'linear-gradient(135deg, #4D1058 0%, #A48ECA 100%)',
  },
]

function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ background: '#FAF7FF', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 3,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
        }}
      >
        {/* Background accent */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 80% 10%, rgba(97,25,110,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 90%, rgba(118,88,178,0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', maxWidth: 620, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#61196E',
            }}
          >
            BITRE · 2023–2024 Dataset
          </Typography>

          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                lineHeight: 1.15,
                color: '#1F2937',
                mb: 0,
              }}
            >
              Australia's Drug Driving
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                lineHeight: 1.15,
                fontStyle: 'italic',
                color: '#61196E',
              }}
            >
              Enforcement Data
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480 }}
          >
            Explore patterns in roadside drug testing across seven Australian
            jurisdictions, five age groups, and twenty-four months of enforcement
            data.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 1, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
          >
            View Dashboard →
          </Button>
        </Box>
      </Box>

      {/* ── Dataset scope strip ── */}
      <Box sx={{ px: { xs: 2, md: 5 }, pb: { xs: 5, md: 7 }, maxWidth: 1100, mx: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {scopeStats.map((s) => (
            <Box
              key={s.label}
              sx={{
                textAlign: 'center',
                p: { xs: 2.5, md: 3.5 },
                borderRadius: '20px',
                bgcolor: 'white',
                border: '1px solid #EDDDEC',
                transition: 'box-shadow 0.25s ease',
                '&:hover': { boxShadow: '0 8px 24px rgba(97,25,110,0.08)' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"DM Serif Display", serif',
                  fontSize: { xs: '2.2rem', md: '2.8rem' },
                  color: '#61196E',
                  lineHeight: 1,
                }}
              >
                {s.value}
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1F2937', mt: 1 }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', mt: 0.25 }}>
                {s.sub}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Analysis pillars ── */}
      <Box sx={{ px: { xs: 2, md: 5 }, pb: { xs: 5, md: 7 }, maxWidth: 1100, mx: 'auto' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.6rem', md: '2rem' },
            color: '#1F2937',
            mb: 1,
          }}
        >
          What the Data Reveals
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', mb: 4, maxWidth: 520 }}>
          Three lenses into Australia's roadside drug testing enforcement, each uncovering distinct patterns in the BITRE dataset.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {analysisPillars.map((p) => (
            <Card
              key={p.title}
              sx={{
                borderRadius: '20px',
                border: '1px solid #EDDDEC',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(97,25,110,0.07)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 }, '&:last-child': { pb: { xs: 3, md: 4 } }, display: 'flex', gap: 3, alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    minWidth: 56,
                    borderRadius: '16px',
                    bgcolor: `${p.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p.color,
                    '& svg': { fontSize: 28 },
                  }}
                >
                  {p.icon}
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontSize: '1.15rem', color: '#1F2937', mb: 0.75 }}>
                    {p.title}
                  </Typography>
                  <Typography sx={{ color: '#4B5563', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {p.desc}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ── Explore pages ── */}
      <Box sx={{ px: { xs: 2, md: 5 }, pb: { xs: 6, md: 10 }, maxWidth: 1100, mx: 'auto' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.6rem', md: '2rem' },
            color: '#1F2937',
            mb: 1,
          }}
        >
          Start Exploring
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', mb: 4, maxWidth: 480 }}>
          Jump into an interactive dashboard, read curated insights, or learn about the project and team.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {explorePages.map((page) => (
            <Box
              key={page.title}
              onClick={() => navigate(page.path)}
              sx={{
                cursor: 'pointer',
                borderRadius: '24px',
                background: page.gradient,
                p: { xs: 3.5, md: 4 },
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 220,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(45,27,78,0.25)',
                },
              }}
            >
              <Box>
                <Box sx={{ mb: 2, '& svg': { fontSize: 32, opacity: 0.85 } }}>
                  {page.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"DM Serif Display", serif',
                    fontSize: '1.35rem',
                    mb: 1.5,
                  }}
                >
                  {page.title}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(237,221,236,0.85)' }}>
                  {page.desc}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2.5, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                Explore <ArrowForwardRounded sx={{ fontSize: 16 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Footer credit ── */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          borderTop: '1px solid #EDDDEC',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', letterSpacing: '0.06em' }}>
          COS30045 — Data Visualisation 2024 · Group 4 · BITRE Dataset
        </Typography>
      </Box>
    </Box>
  )
}

export default Home
