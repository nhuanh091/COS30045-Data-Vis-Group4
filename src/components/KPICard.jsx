// src/components/KPICard.jsx
import { Typography, Card } from '@mui/material'

/**
 * A metric tile used in the Dashboard bento grid.
 *
 * @param {string} label       - Short uppercase label (e.g. "Fines")
 * @param {string} value       - Pre-formatted display value (e.g. "4,231")
 * @param {string} accentColor - Hex colour for the top border accent
 */
function KPICard({ label, value, accentColor = '#61196E' }) {
  return (
    <Card
      sx={{
        borderTop: `3px solid ${accentColor}`,
        borderRadius: '12px',
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.09em',
          color: '#6B7280',
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: '1.75rem',
          color: '#1F2937',
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Card>
  )
}

export default KPICard
