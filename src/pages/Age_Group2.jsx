// src/pages/Dashboard.jsx
import { useMemo } from 'react'
import { Box, Card, CardContent, Typography, useMediaQuery } from '@mui/material'
import { useStore } from '../store/useStore'
import {
  aggregateByMonth,
  aggregateByMonthAndAgeGroup,
  aggregateByDrugType,
  aggregateByDetectionMethod,
  aggregateByDetectionMethodWithBest,
  aggregateByJurisdiction,
  aggregateByAgeGroup,
  computeKPIs,
} from '../data/dataUtils'
import FilterBar from '../components/FilterBar'
import KPICard from '../components/KPICard'
import LineBarChart from '../charts/LineBarChart'
import LineChart from '../charts/LineChart'
import DonutChart from '../charts/DonutChart'
import BarChart from '../charts/BarChart'
import GroupedBarChart from '../charts/GroupedBarChart'
import DivergingBarChart from '../charts/DivergingBarChart'
import StackedBarChart from '../charts/StackedBarChart'

const DRUG_COLORS  = ['#61196E', '#E99E1C', '#7658B2', '#BF6BA1', '#852501', '#A48ECA', '#D1D5DB']
const STAGE_COLORS = ['#61196E', '#A48ECA', '#E99E1C']

function Age_Group2() {
  const { filteredData, resetFilters } = useStore()
  const isWide = useMediaQuery('(min-width:900px)')

  const monthlyData         = useMemo(() => aggregateByMonth(filteredData),                [filteredData])
  const monthlyAgeGroupData = useMemo(() => aggregateByMonthAndAgeGroup(filteredData),    [filteredData])
  const drugTypeData        = useMemo(() => aggregateByDrugType(filteredData),            [filteredData])
  const detectionData       = useMemo(() => aggregateByDetectionMethod(filteredData),     [filteredData])
  const detectionMethodData = useMemo(() => aggregateByDetectionMethodWithBest(filteredData), [filteredData])
  const jurisdictionData    = useMemo(() => aggregateByJurisdiction(filteredData),        [filteredData])
  const ageGroupData        = useMemo(() => aggregateByAgeGroup(filteredData),            [filteredData])
  const arrestsByAge        = useMemo(() => ageGroupData.map(d => ({ jurisdiction: d.ageGroup, positives: d.arrests })).sort((a, b) => b.positives - a.positives), [ageGroupData])
  const kpis                = useMemo(() => computeKPIs(filteredData),                    [filteredData])

  const fmt = (n) => n.toLocaleString()
  const pct = kpis.positiveRate.toFixed(1) + '%'

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      <Typography variant="h2" sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
        Drug Enforcement Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
        BITRE Australian roadside drug testing — 2023–2024
      </Typography>

      <FilterBar />

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
            <LineChart data={monthlyAgeGroupData} onReset={resetFilters} />
            {/* Inline KPI summary */}
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
            </Box>
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

          {/* Detection method donut */}
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h3" sx={{ fontSize: '0.9rem', mb: 1.5 }}>
                Detection Methods
              </Typography>
              <DonutChart data={detectionData} colors={STAGE_COLORS} title="Detection" />
            </CardContent>
          </Card>
        </Box>
      </Box> 

      {/* Row 2: Jurisdiction + Age Group */}
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
            <DivergingBarChart data={ageGroupData} onReset={resetFilters} />
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="h3" sx={{ fontSize: '1.1rem', mb: 0.25 }}>
              Arrests by Age Group
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
              Number of arrests per age group
            </Typography>
            <StackedBarChart 
              data={detectionMethodData} 
              groupField="detectionMethod"
              stackFields={['best', 'notBest']}
              stackLabels={['Best Detection', 'Not Best']}
              colors={['#E99E1C', '#BF6BA1']}
              onReset={resetFilters} 
            />
          </CardContent>
        </Card>
      </Box>

      {/* Row 3: Detection Methods Stacked */}
      <Box sx={{ mt: 2 }}>
        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="h3" sx={{ fontSize: '1.1rem', mb: 0.25 }}>
              Detection Methods
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
              Tests by detection method and whether they were best detection
            </Typography>
            <StackedBarChart 
              data={detectionMethodData} 
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

export default Age_Group2
