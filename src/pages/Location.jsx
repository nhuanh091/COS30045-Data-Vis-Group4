// src/pages/Location.jsx
import { useMemo, useState, useEffect } from 'react'
import * as d3 from 'd3'
import { Box, Card, CardContent, Typography, useMediaQuery, CircularProgress } from '@mui/material'
import { useStore } from '../store/useStore'
import {
  aggregateByDrugType,
  aggregateByDetectionMethodWithBest,
  computeKPIs,
  applyFilters
} from '../data/dataUtils'
import {
  aggregateByMonthAndLocationGroup,
  aggregateByLocationGroup
} from '../data/locationDataUtils'

import FilterBar from '../components/FilterBar'
import LineChart from '../charts/Location/LineChart'
import DonutChart from '../charts/AgeGroup/DonutChart'
import DivergingBarChart from '../charts/Location/DivergingBarChart'
import StackedBarChart from '../charts/AgeGroup/StackedBarChart'

const DRUG_COLORS = ['#61196E', '#E99E1C', '#7658B2', '#BF6BA1', '#852501', '#A48ECA', '#D1D5DB']

function Location() {
  const { filters, resetFilters } = useStore()
  const isWide = useMediaQuery('(min-width:900px)')

  // Load location-specific data locally
  const [locationRawData, setLocationRawData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    d3.csv('/data/location_positive_drug_cleaned.csv')
      .then((data) => {
        setLocationRawData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error loading location data:", err)
        setIsLoading(false)
      })
  }, [])

  // Apply all global filters to calculate our primary filtered data
  const filteredData = useMemo(() => {
    if (!locationRawData.length) return []
    return applyFilters(locationRawData, filters)
  }, [locationRawData, filters])

  // Top level KPIs
  const kpis = useMemo(() => computeKPIs(filteredData), [filteredData])

  // LineChart (location trends): filter by year/month/stage but NOT locationGroup (to show all fade lines)
  const lineChartData = useMemo(() => {
    let result = locationRawData
    if (filters.stage) {
      result = result.filter(d => d.DETECTION_METHOD === filters.stage)
    }
    return aggregateByMonthAndLocationGroup(result)
  }, [locationRawData, filters.stage])

  // DivergingBarChart (fines vs charges by location): filter by year/month/stage but NOT locationGroup
  const divergingData = useMemo(() => {
    let result = locationRawData
    if (filters.year !== null && filters.year !== undefined) {
      result = result.filter(d => Number(d.YEAR) === filters.year)
    }
    if (filters.month !== null && filters.month !== undefined) {
      result = result.filter(d => Number(d.MONTH) === filters.month)
    }
    if (filters.stage) {
      result = result.filter(d => d.DETECTION_METHOD === filters.stage)
    }
    return aggregateByLocationGroup(result)
  }, [locationRawData, filters.year, filters.month, filters.stage])

  // StackedBarChart (detection methods): filter by year/month/locationGroup but NOT stage
  const stackedData = useMemo(() => {
    let result = locationRawData
    if (filters.year !== null && filters.year !== undefined) {
      result = result.filter(d => Number(d.YEAR) === filters.year)
    }
    if (filters.month !== null && filters.month !== undefined) {
      result = result.filter(d => Number(d.MONTH) === filters.month)
    }
    if (filters.locationGroup) {
      result = result.filter(d => d.LOCATION === filters.locationGroup)
    }
    return aggregateByDetectionMethodWithBest(result)
  }, [locationRawData, filters.year, filters.month, filters.locationGroup])

  // DonutChart (drug types): use fully filtered data
  const drugTypeData = useMemo(() => aggregateByDrugType(filteredData), [filteredData])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#61196E' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      <Typography variant="h2" sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
        Location Analysis
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
        BITRE Australian roadside drug testing — 2023–2024
      </Typography>

      {/* Render Location Filter! */}
      <FilterBar visibleFilters={['year', 'month', 'locationGroup', 'stage']} />

      {/* Row 1: Trend chart (2fr) + right column (1fr) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isWide ? '2fr 1fr' : '1fr',
          gap: 2,
          mb: 2,
          alignItems: 'start',
        }}
      >
        {/* Trend chart */}
        <Card sx={{ p: 0, minWidth: 0 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="h3" sx={{ fontSize: '1.1rem', mb: 0.25 }}>
              Trends by Location
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
              Monthly positive detections for each regional mapping
            </Typography>
            <LineChart data={lineChartData} onReset={resetFilters} />
          </CardContent>
        </Card>

        {/* Right column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          {/* Drug type donut */}
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h3" sx={{ fontSize: '0.9rem', mb: 1.5 }}>
                Drug Type Distribution
              </Typography>
              <DonutChart data={drugTypeData} colors={DRUG_COLORS} title="Drug Types" />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Row 2: Diverging + Stacked */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isWide ? '1fr 1fr' : '1fr',
          gap: 2,
        }}
      >
        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="h3" sx={{ fontSize: '1.1rem', mb: 0.25 }}>
              Fines vs Charges by Location
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
              Comparative enforcement outcomes across locations
            </Typography>
            <DivergingBarChart data={divergingData} onReset={resetFilters} />
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="h3" sx={{ fontSize: '1.1rem', mb: 0.25 }}>
              Detection Methods
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
              Best vs non-best detection by stage
            </Typography>
            <StackedBarChart
              data={stackedData}
              groupField="detectionMethod"
              stackFields={['best', 'notBest']}
              stackLabels={['Best Detection', 'Not Best']}
              colors={['#E99E1C', '#BF6BA1']}
              onReset={resetFilters}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
export default Location
