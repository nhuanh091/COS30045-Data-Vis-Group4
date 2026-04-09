// src/pages/Home.jsx
//
// Home page for the COS30045 Drug Driving Visualisation project.
//
// Sections (top → bottom):
//   1. Hero           – headline, sub-copy, CTA to /insights
//   2. Dashboards     – 3 navigation cards: Overview, Age Group, Location
//   3. Key Insights   – 3 data-driven findings from the BITRE dataset
//   4. Start Exploring – quick-jump cards to all major pages
//   5. Footer credit
//
import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  BarChartRounded,
  PeopleRounded,
  MapRounded,
  ScienceRounded,
  InfoRounded,
  ArrowForwardRounded,
  CalendarMonthRounded,
  LocalPoliceRounded,
  GrassRounded,
} from '@mui/icons-material'

// ---------------------------------------------------------------------------
// Data – Dashboard navigation cards
// Each card links to its own dashboard view.
// ---------------------------------------------------------------------------
const dashboardCards = [
  {
    icon: <BarChartRounded />,
    title: 'Overview',
    desc: 'Monthly testing trends, drug type distributions, and detection method breakdowns across all jurisdictions for 2023–2024.',
    path: '/dashboard',
    accentColor: '#61196E',
    lightBg: '#F9F0FA',
  },
  {
    icon: <PeopleRounded />,
    title: 'Age Group',
    desc: 'Enforcement outcomes broken down by age bracket — from under-16 to 65+ — showing which demographics have the highest positive detection rates.',
    path: '/dashboard#age-group',
    accentColor: '#7658B2',
    lightBg: '#F4F1FB',
  },
  {
    icon: <MapRounded />,
    title: 'Location',
    desc: 'Positive drug tests per state and territory — compare how NSW, Victoria, Queensland, WA, and other jurisdictions measure up.',
    path: '/dashboard#jurisdiction',
    accentColor: '#E99E1C',
    lightBg: '#FEF8EC',
  },
]

// ---------------------------------------------------------------------------
// Data – Key insights derived from the BITRE 2023–2024 dataset
// Replace placeholder copy with real findings as analysis deepens.
// ---------------------------------------------------------------------------
const keyInsights = [
  {
    icon: <CalendarMonthRounded />,
    title: '2023: First Full National Dataset',
    desc: 'The 2023 reporting year marked the first time all seven Australian jurisdictions submitted drug driving data simultaneously, giving researchers a complete national picture for the very first time.',
    accentColor: '#61196E',
    tag: 'Coverage',
  },
  {
    icon: <GrassRounded />,
    title: 'Cannabis Leads All Detections',
    desc: 'Cannabis consistently accounts for the largest share of positive results nationally — with methamphetamine emerging as a significant secondary substance, particularly in Western Australia and Queensland.',
    accentColor: '#7658B2',
    tag: 'Substances',
  },
  {
    icon: <LocalPoliceRounded />,
    title: 'Q2–Q3 Enforcement Peaks',
    desc: 'Testing volumes spike markedly in Q2 and Q3 each year, coinciding with targeted enforcement campaigns. Positive detection rates remain relatively stable at 3–5%, suggesting consistent underlying demand rather than campaign-driven deterrence.',
    accentColor: '#E99E1C',
    tag: 'Trends',
  },
]

// ---------------------------------------------------------------------------
// Data – Quick-jump "Start Exploring" cards (bottom of page)
// ---------------------------------------------------------------------------
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
    desc: 'Learn about the data source, project impact, and the team behind this COS30045 Data Visualisation project.',
    path: '/about',
    gradient: 'linear-gradient(135deg, #4D1058 0%, #A48ECA 100%)',
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ background: '#FAF7FF', minHeight: '100vh' }}>

      {/* ── 1. Hero ── */}
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
        {/* Subtle radial background accents */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 80% 10%, rgba(97,25,110,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 90%, rgba(118,88,178,0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            position: 'relative',
            maxWidth: 620,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Dataset badge */}
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

          {/* Headline */}
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                lineHeight: 1.15,
                color: '#1F2937',
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

          {/* Sub-copy */}
          <Typography
            variant="body1"
            sx={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480 }}
          >
            Explore patterns in roadside drug testing across seven Australian
            jurisdictions, five age groups, and twenty-four months of enforcement
            data.
          </Typography>

          {/* CTA – redirects to Insights page */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/insights')}
            endIcon={<ArrowForwardRounded />}
            sx={{ mt: 1, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
          >
            Explore Insights
          </Button>
        </Box>
      </Box>

      {/* ── 2. Dashboard Navigation Cards ── */}
      {/*
        Matches reference image: heading + "View All" on the left, then all 3 cards
        grouped inside one shared rounded block container (light background).
        Each card inside is white with icon block, title, desc, and arrow link.
      */}
      <Box sx={{ px: { xs: 2, md: 5 }, pb: { xs: 5, md: 7 }, maxWidth: 1100, mx: 'auto' }}>

        {/* Section heading row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#61196E', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>
              Our Dashboards
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, color: '#1F2937', lineHeight: 1.2 }}>
              Explore the Data
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/dashboard')}
            sx={{ borderColor: '#EDDDEC', color: '#61196E', fontWeight: 700, fontSize: '0.8rem', borderRadius: '10px', px: 2.5, whiteSpace: 'nowrap' }}
          >
            View All →
          </Button>
        </Box>

        {/* Shared group block — all 3 cards live inside this container */}
        <Box
          sx={{
            bgcolor: '#F3EDF7',
            borderRadius: '28px',
            p: { xs: 2, md: 2.5 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 2, md: 2 },
          }}
        >
          {dashboardCards.map((card) => (
            <Box
              key={card.title}
              onClick={() => navigate(card.path)}
              sx={{
                bgcolor: '#fff',
                borderRadius: '20px',
                p: { xs: 3, md: 3.5 },
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'all 0.25s ease',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(97,25,110,0.10)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              {/* Icon block */}
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: '16px',
                  bgcolor: card.lightBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.accentColor,
                  '& svg': { fontSize: 30 },
                }}
              >
                {card.icon}
              </Box>

              {/* Title */}
              <Typography variant="h3" sx={{ fontSize: '1.08rem', fontWeight: 700, color: '#1F2937' }}>
                {card.title}
              </Typography>

              {/* Description */}
              <Typography sx={{ color: '#4B5563', fontSize: '0.88rem', lineHeight: 1.7, flexGrow: 1 }}>
                {card.desc}
              </Typography>

              {/* Arrow link */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: card.accentColor,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                }}
              >
                Learn More <ArrowForwardRounded sx={{ fontSize: 15 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── 3. Key Insights ── */}
      {/*
        Data-driven findings from the BITRE 2023–2024 dataset.
        Replaces the generic "What the Data Reveals" analysis pillars.
        Each insight has a tag badge, icon, title, and a short paragraph.
      */}
      <Box sx={{ px: { xs: 2, md: 5 }, pb: { xs: 5, md: 7 }, maxWidth: 1100, mx: 'auto' }}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, color: '#1F2937', mb: 1 }}
        >
          What the Data Shows
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', mb: 4, maxWidth: 520 }}>
          Three standout findings from the BITRE national drug driving dataset, across 24 months of Australian enforcement records.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {keyInsights.map((insight) => (
            <Card
              key={insight.title}
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
              <CardContent
                sx={{
                  p: { xs: 3, md: 4 },
                  '&:last-child': { pb: { xs: 3, md: 4 } },
                  display: 'flex',
                  gap: 3,
                  alignItems: { xs: 'flex-start', md: 'center' },
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    minWidth: 56,
                    borderRadius: '16px',
                    bgcolor: `${insight.accentColor}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: insight.accentColor,
                    '& svg': { fontSize: 28 },
                  }}
                >
                  {insight.icon}
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {/* Tag badge */}
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      px: 1.2,
                      py: 0.25,
                      mb: 0.75,
                      borderRadius: '6px',
                      bgcolor: `${insight.accentColor}12`,
                      color: insight.accentColor,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {insight.tag}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h3"
                    sx={{ fontSize: '1.12rem', color: '#1F2937', mb: 0.75 }}
                  >
                    {insight.title}
                  </Typography>

                  {/* Body */}
                  <Typography sx={{ color: '#4B5563', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {insight.desc}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ── 4. Start Exploring ── */}
      {/* Quick-jump gradient cards to all major pages */}
      <Box sx={{ px: { xs: 2, md: 5 }, pb: { xs: 6, md: 10 }, maxWidth: 1100, mx: 'auto' }}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, color: '#1F2937', mb: 1 }}
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
                <Typography
                  sx={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(237,221,236,0.85)' }}
                >
                  {page.desc}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 2.5,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Explore <ArrowForwardRounded sx={{ fontSize: 16 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── 5. Footer credit ── */}
      <Box sx={{ textAlign: 'center', py: 4, borderTop: '1px solid #EDDDEC' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', letterSpacing: '0.06em' }}>
          COS30045 — Data Visualisation 2024 · Group 4 · BITRE Dataset
        </Typography>
      </Box>

    </Box>
  )
}

export default Home
