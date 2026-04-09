// src/pages/JurisdictionAnalysis.jsx
import { Box, Paper, Typography } from '@mui/material'
import { useStore } from '../store/useStore'
import FilterBar from '../components/FilterBar'
import HeatmapChart from '../charts/HeatmapChart'
import RadarChart from '../charts/RadarChart'
import SunburstChart from '../charts/SunburstChart'
import {
  aggregateHeatmapData,
  aggregateRadarData,
  aggregateSunburstData,
} from '../data/dataUtils'
import '../styles/jurisdiction.css'

const CARD_SX = {
  borderRadius: '16px',
  p: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(97,25,110,0.07)',
  border: '1px solid #EDDDEC',
}

const TITLE_SX = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#61196E',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  mb: 1.5,
  fontFamily: 'Inter, sans-serif',
  flexShrink: 0,
}

function JurisdictionAnalysis() {
  const { filteredData } = useStore()

  const heatmapData  = aggregateHeatmapData(filteredData)
  const radarData    = aggregateRadarData(filteredData)
  const sunburstData = aggregateSunburstData(filteredData)

  return (
    <Box sx={{ px: 3, pt: 3, pb: 2 }}>
      <FilterBar />

      <div className="jurisdiction-grid">
        {/* Left: Heatmap */}
        <Paper elevation={0} className="jur-heatmap" sx={CARD_SX}>
          <Typography sx={TITLE_SX}>Outcomes by Jurisdiction</Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <HeatmapChart data={heatmapData} />
          </Box>
        </Paper>

        {/* Top-right: Radar */}
        <Paper elevation={0} className="jur-radar" sx={CARD_SX}>
          <Typography sx={TITLE_SX}>Drug Types by Jurisdiction</Typography>
          <RadarChart data={radarData} />
        </Paper>

        {/* Bottom-right: Sunburst */}
        <Paper elevation={0} className="jur-sunburst" sx={CARD_SX}>
          <Typography sx={TITLE_SX}>Detection Stage × Best Method</Typography>
          <SunburstChart data={sunburstData} />
        </Paper>
      </div>
    </Box>
  )
}

export default JurisdictionAnalysis
