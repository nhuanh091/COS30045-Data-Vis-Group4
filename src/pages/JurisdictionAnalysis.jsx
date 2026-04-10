// src/pages/JurisdictionAnalysis.jsx
import { useMemo } from 'react'
import { Box, Paper, Typography, useMediaQuery } from '@mui/material'
import { useStore } from '../store/useStore'
import FilterBar from '../components/FilterBar'
import LineBarChart from '../charts/LineBarChart'
import HeatmapChart from '../charts/HeatmapChart'
import RadarChart from '../charts/RadarChart'
import SunburstChart from '../charts/SunburstChart'
import {
  aggregateHeatmapData,
  aggregateRadarData,
  aggregateSunburstData,
  aggregateByMonth,
  computeKPIs,
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
  const { rawData, filteredData, filters, resetFilters, setFilter } = useStore()
  const isWide = useMediaQuery('(min-width:1200px)')

  const monthlyStats = useMemo(() => aggregateByMonth(filteredData), [filteredData])
  const kpis = useMemo(() => computeKPIs(filteredData), [filteredData])
  // Heatmap: filter by year, month & stage (so cell values update),
  // but NOT by jurisdiction (those only control fading via opacity in the chart)
  const heatmapFilteredData = useMemo(() => {
    let result = rawData
    if (filters.year !== null && filters.year !== undefined) {
      result = result.filter(d => Number(d.YEAR) === filters.year)
    }
    if (filters.month !== null && filters.month !== undefined) {
      result = result.filter(d => Number(d.MONTH) === filters.month)
    }
    if (filters.stage) {
      result = result.filter(d => d.DETECTION_METHOD === filters.stage)
    }
    return result
  }, [rawData, filters.year, filters.month, filters.stage])
  const heatmapData = useMemo(() => aggregateHeatmapData(heatmapFilteredData), [heatmapFilteredData])
  // LineBarChart: filter by jurisdiction & stage (so bar heights update),
  // but NOT by year/month (those only control fading via opacity in the chart)
  const lineBarFilteredData = useMemo(() => {
    let result = rawData
    if (filters.jurisdictions?.length > 0) {
      result = result.filter(d => filters.jurisdictions.includes(d.JURISDICTION))
    }
    if (filters.stage) {
      result = result.filter(d => d.DETECTION_METHOD === filters.stage)
    }
    return result
  }, [rawData, filters.jurisdictions, filters.stage])
  const allMonthlyStats = useMemo(() => aggregateByMonth(lineBarFilteredData), [lineBarFilteredData])
  const radarData    = aggregateRadarData(filteredData)
  const sunburstData = aggregateSunburstData(filteredData)

  const fmt = (n) => n.toLocaleString()
  const pct = kpis.positiveRate.toFixed(1) + '%'

  return (
    <Box sx={{ px: 3, pt: 3, pb: 2 }}>
      <FilterBar />

      {/* Row 1: LineBarChart (left) + KPI Cards (right) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isWide ? '2fr 1fr' : '1fr',
          gap: 2,
          mb: 3,
          alignItems: 'start',
        }}
      >
        {/* LineBarChart */}
        <Paper elevation={0} sx={CARD_SX}>
          <Typography sx={TITLE_SX}>Monthly Trends</Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <LineBarChart data={allMonthlyStats} onReset={resetFilters} />
          </Box>
        </Paper>

        {/* KPI Cards Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          {/* Total Tests Card */}
          <Paper elevation={0} sx={{
            p: 2,
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(97,25,110,0.07)',
            border: '1px solid #EDDDEC',
            background: '#F9FAFB',
          }}>
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61196E', mb: 0.5 }}>
              Tests Conducted
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', color: '#61196E', lineHeight: 1.1 }}>
              {fmt(kpis.totalTests)}
            </Typography>
          </Paper>

          {/* Positive Rate Card (purple background) */}
          <Paper elevation={0} sx={{
            p: 2,
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(97,25,110,0.07)',
            border: '1px solid #EDDDEC',
            background: '#61196E',
          }}>
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D1D5DB', mb: 0.5 }}>
              Positive Results
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', color: '#E99E1C', lineHeight: 1.1 }}>
              {pct}
            </Typography>
          </Paper>

          {/* Other Metrics Card */}
          <Paper elevation={0} sx={{
            p: 2,
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(97,25,110,0.07)',
            border: '1px solid #EDDDEC',
            background: '#F9FAFB',
          }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61196E' }}>
                Fines
              </Typography>
              <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.5rem', color: '#1F2937', lineHeight: 1.1 }}>
                {fmt(kpis.fines)}
              </Typography>
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61196E' }}>
                Arrests
              </Typography>
              <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.5rem', color: '#1F2937', lineHeight: 1.1 }}>
                {fmt(kpis.arrests)}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61196E' }}>
                Charges
              </Typography>
              <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.5rem', color: '#1F2937', lineHeight: 1.1 }}>
                {fmt(kpis.charges)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Row 2: Radar + Sunburst (left, 2fr) + Heatmap (right, 1fr) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isWide ? '2fr 1fr' : '1fr',
          gap: 2,
          alignItems: 'start',
        }}
      >
        {/* Left: Radar and Sunburst side by side */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
          }}
        >
          {/* Radar */}
          <Paper elevation={0} sx={CARD_SX}>
            <Typography sx={TITLE_SX}>Drug Types by Jurisdiction</Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <RadarChart data={radarData} />
            </Box>
          </Paper>

          {/* Sunburst */}
          <Paper elevation={0} sx={CARD_SX}>
            <Typography sx={TITLE_SX}>Detection Stage × Best Method</Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <SunburstChart data={sunburstData} />
            </Box>
          </Paper>
        </Box>

        {/* Right: Heatmap */}
        <Paper elevation={0} sx={{...CARD_SX, height: '420px'}}>
          <Typography sx={TITLE_SX}>Outcomes by Jurisdiction</Typography>
          <Box sx={{ flex: 1, minHeight: 0, width: '100%', height: 'calc(100% - 48px)' }}>
            <HeatmapChart data={heatmapData} />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default JurisdictionAnalysis
