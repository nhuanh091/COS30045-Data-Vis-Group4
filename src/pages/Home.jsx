// src/pages/Home.jsx
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF7FF',
        backgroundImage:
          'radial-gradient(ellipse at 80% 10%, rgba(97,25,110,0.07) 0%, transparent 60%)',
        px: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 560,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* Eyebrow */}
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

        {/* Subtext */}
        <Typography
          variant="body1"
          sx={{
            color: '#6B7280',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            maxWidth: 440,
          }}
        >
          Explore patterns in roadside drug testing across seven Australian
          jurisdictions, five age groups, and twenty-four months of enforcement
          data.
        </Typography>

        {/* CTA */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{
            mt: 1,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
          }}
        >
          View Dashboard →
        </Button>
      </Box>
    </Box>
  )
}

export default Home
