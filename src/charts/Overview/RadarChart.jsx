// src/charts/RadarChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'
import { JURISDICTIONS_LIST } from '../../data/mockData'

const AXES = ['Amphetamine', 'Cannabis', 'Cocaine', 'Ecstasy', 'Methylamphetamine', 'Other']
const AXIS_KEY = {
  Amphetamine: 'amphetamine',
  Cannabis: 'cannabis',
  Cocaine: 'cocaine',
  Ecstasy: 'ecstasy',
  Methylamphetamine: 'methylamphetamine',
  Other: 'other',
}
// One color per jurisdiction (7 jurisdictions max)
const JUR_COLORS = ['#61196E', '#E99E1C', '#7658B2', '#BF6BA1', '#852501', '#A48ECA', '#10B981']

/**
 * RadarChart — drug type composition per jurisdiction.
 * No jurisdiction filter active → shows aggregate of all jurisdictions.
 * Filter active → shows one overlaid polygon per selected jurisdiction.
 * Click a legend label to toggle that jurisdiction in filters.jurisdictions.
 *
 * @param {{ data: Record<string, { amphetamine, cannabis, cocaine, ecstasy, methylamphetamine, other }> }} props
 */
function RadarChart({ data = {} }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(0)
  const { filters, setFilter } = useStore()

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!Object.keys(data).length || width === 0) return

    const size = Math.min(width, 320)
    const radius = size / 2 - 52   // leave room for axis labels
    const cx = size / 2
    const cy = size / 2
    const numAxes = AXES.length
    const angleOf = (i) => (i * 2 * Math.PI) / numAxes - Math.PI / 2

    // Determine which jurisdictions to draw
    const selectedJurs = filters.jurisdictions.length > 0
      ? filters.jurisdictions.filter((j) => data[j])
      : null

    // Build datasets
    let datasets
    if (selectedJurs && selectedJurs.length > 0) {
      // Filter mode: show only selected jurisdictions
      datasets = selectedJurs.map((j, i) => ({
        label: j,
        values: data[j],
        color: JUR_COLORS[JURISDICTIONS_LIST.indexOf(j) % JUR_COLORS.length],
      }))
    } else {
      // Original view: show all jurisdictions overlaid
      datasets = JURISDICTIONS_LIST
        .filter((j) => data[j])
        .map((j, i) => ({
          label: j,
          values: data[j],
          color: JUR_COLORS[i % JUR_COLORS.length],
        }))
    }

    const maxVal = d3.max(
      datasets.flatMap((ds) => AXES.map((ax) => ds.values[AXIS_KEY[ax]] || 0))
    ) || 1

    const rScale = d3.scaleLinear().domain([0, maxVal]).range([0, radius])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', size).attr('height', size)

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)

      // Concentric grid rings
      ;[0.2, 0.4, 0.6, 0.8, 1].forEach((pct) => {
        g.append('circle')
          .attr('r', radius * pct)
          .attr('fill', 'none')
          .attr('stroke', '#F3F4F6')
          .attr('stroke-width', 1)
      })

    // Axis spokes + labels
    AXES.forEach((axis, i) => {
      const angle = angleOf(i)
      const x2 = Math.cos(angle) * radius
      const y2 = Math.sin(angle) * radius
      const lx = Math.cos(angle) * (radius + 26)
      const ly = Math.sin(angle) * (radius + 26)

      g.append('line')
        .attr('x1', 0).attr('y1', 0).attr('x2', x2).attr('y2', y2)
        .attr('stroke', '#EDDDEC').attr('stroke-width', 1)

      const anchor = Math.abs(Math.cos(angle)) < 0.15 ? 'middle'
        : Math.cos(angle) > 0 ? 'start' : 'end'

      g.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('dy', '0.35em')
        .attr('text-anchor', anchor)
        .style('font-size', '0.62rem')
        .style('font-family', 'Inter, sans-serif')
        .style('fill', '#6B7280')
        .text(axis)
    })

    // Polygons (fill + stroke)
    datasets.forEach((ds) => {
      const points = AXES.map((ax, i) => {
        const val = ds.values[AXIS_KEY[ax]] || 0
        const r = rScale(val)
        const angle = angleOf(i)
        return [Math.cos(angle) * r, Math.sin(angle) * r]
      })
      const pointsStr = points.map((p) => p.join(',')).join(' ')

      g.append('polygon')
        .attr('points', pointsStr)
        .attr('fill', ds.color)
        .attr('fill-opacity', 0.15)
        .attr('stroke', ds.color)
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.85)
    })
  }, [data, width, filters.jurisdictions])

  const handleLegendClick = (jur) => {
    const cur = filters.jurisdictions
    if (cur.includes(jur)) {
      setFilter('jurisdictions', cur.filter((j) => j !== jur))
    } else {
      setFilter('jurisdictions', [...cur, jur])
    }
  }

  const hasData = Object.keys(data).length > 0

  if (!hasData) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          No data
        </Typography>
      </Box>
    )
  }

  const selectedJurs = filters.jurisdictions
  const hasAnySelected = selectedJurs.length > 0

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      {/* Jurisdiction legend — click to toggle filter */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
        {JURISDICTIONS_LIST.filter((j) => data[j]).map((jur, i) => {
          const isSelected = selectedJurs.includes(jur)
          return (
            <Box
              key={jur}
              onClick={() => handleLegendClick(jur)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.5,
                cursor: 'pointer', borderRadius: '6px',
                px: 1, py: 0.3,
                bgcolor: isSelected ? '#FAF7FF' : 'transparent',
                border: isSelected ? '1px solid #EDDDEC' : '1px solid transparent',
                opacity: hasAnySelected && !isSelected ? 0.45 : 1,
                transition: 'all 0.15s',
                '&:hover': { bgcolor: '#FAF7FF' },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: JUR_COLORS[i % JUR_COLORS.length], flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', color: '#1F2937', fontWeight: isSelected ? 700 : 400 }}>
                {jur}
              </Typography>
            </Box>
          )
        })}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} />
      </Box>
    </Box>
  )
}

export default RadarChart
