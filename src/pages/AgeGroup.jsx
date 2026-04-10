// src/pages/AgeGroup.jsx
import { useMemo } from 'react'
import { Box, Card, CardContent, Typography, useMediaQuery } from '@mui/material'
import { useStore } from '../store/useStore'
import {
  aggregateByMonth,
  aggregateByMonthAndAgeGroup,
  aggregateByDrugType,
  aggregateByDetectionMethodWithBest,
  aggregateByAgeGroup,
  computeKPIs,
} from '../data/dataUtils'
import FilterBar from '../components/FilterBar'
import LineChart from '../charts/AgeGroup/LineChart'
import DonutChart from '../charts/AgeGroup/DonutChart'
import DivergingBarChart from '../charts/AgeGroup/DivergingBarChart'
import StackedBarChart from '../charts/AgeGroup/StackedBarChart'
import InsightsBox from '../components/InsightsBox'

const DRUG_COLORS = ['#61196E', '#E99E1C', '#7658B2', '#BF6BA1', '#852501', '#A48ECA', '#D1D5DB']

function AgeGroup() {
  const { rawData, filteredData, filters, resetFilters } = useStore()
  const isWide = useMediaQuery('(min-width:900px)')

  // KPIs use fully filtered data
  const kpis = useMemo(() => computeKPIs(filteredData), [filteredData])

  // LineChart (age group trends): filter by year/month/stage but NOT ageGroup
  // ageGroup only controls fading in the chart
  // LineChart: filter by stage only. Year/month controls the visual "selected time" indicator,
  // ageGroup controls line fading — neither affects the data.
  const lineChartData = useMemo(() => {
    let result = rawData
    if (filters.stage) {
      result = result.filter(d => d.DETECTION_METHOD === filters.stage)
    }
    return aggregateByMonthAndAgeGroup(result)
  }, [rawData, filters.stage])

  // DivergingBarChart (fines vs charges by age group): filter by year/month/stage but NOT ageGroup
  const divergingData = useMemo(() => {
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
    return aggregateByAgeGroup(result)
  }, [rawData, filters.year, filters.month, filters.stage])

  // StackedBarChart (detection methods): filter by year/month/ageGroup but NOT stage
  const stackedData = useMemo(() => {
    let result = rawData
    if (filters.year !== null && filters.year !== undefined) {
      result = result.filter(d => Number(d.YEAR) === filters.year)
    }
    if (filters.month !== null && filters.month !== undefined) {
      result = result.filter(d => Number(d.MONTH) === filters.month)
    }
    if (filters.ageGroup) {
      result = result.filter(d => d.AGE_GROUP === filters.ageGroup)
    }
    return aggregateByDetectionMethodWithBest(result)
  }, [rawData, filters.year, filters.month, filters.ageGroup])

  // DonutChart (drug types): use fully filtered data
  const drugTypeData = useMemo(() => aggregateByDrugType(filteredData), [filteredData])

  const fmt = (n) => n.toLocaleString()
  const pct = kpis.positiveRate.toFixed(1) + '%'

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      <Typography variant="h2" sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
        Age Group Analysis
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
        BITRE Australian roadside drug testing — 2023–2024
      </Typography>

      <FilterBar visibleFilters={['year', 'month', 'ageGroup', 'stage']} />

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
              Trends by Age Group
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
              Monthly positive detections for each age group
            </Typography>
            <LineChart data={lineChartData} onReset={resetFilters} />
            {/* Inline KPI summary
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
                mt: 2,
                pt: 2,
                borderTop: '1px solid #F3F4F6',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280' }}>
                  Total Tests
                </Typography>
                <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.6rem', color: '#1F2937', lineHeight: 1.1 }}>
                  {fmt(kpis.totalTests)}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280' }}>
                  Positive Rate
                </Typography>
                <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.6rem', color: '#E99E1C', lineHeight: 1.1 }}>
                  {pct}
                </Typography>
              </Box>
            </Box> */}
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
              Fines vs Charges by Age Group
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
              Comparative enforcement outcomes across demographics
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

      {/* Insights Section */}
      <InsightsBox insights={[
        {
          title: 'High-Risk Demographics',
          description: 'The 17-25 and 26-39 age brackets represent the highest frequency of positive detections. This highlights a critical demographic that should be the primary focus for targeted road safety and educational campaigns.'
        },
        {
          title: 'Severity Varies by Age',
          description: 'While Fines are universally higher than formal charges across all ages, older demographics (e.g., 40-64) see a slightly higher proportion of charges compared to younger drivers, which may indicate issues with compounding offenses or harsher policing for repeat infractions.'
        },
        {
          title: 'Testing Stage Efficiency',
          description: 'Oral fluid tests (Stage 1) make up the overwhelming majority of initial detection methods. These tests remain highly correlated with positive confirmatory laboratory analysis (Stage 3), underscoring the reliability of roadside tools.'
        }
      ]} />
    </Box>
  )
}
export default AgeGroup
