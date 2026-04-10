// src/charts/HeatmapChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'

const METRICS = ['Fines', 'Charges', 'Arrests']
const DATA_KEY = { Fines: 'fines', Charges: 'charges', Arrests: 'arrests' }
const MARGIN = { top: 32, right: 24, bottom: 16, left: 56 }

/**
 * HeatmapChart — jurisdiction × outcome grid.
 * Click a row to toggle that jurisdiction in filters.jurisdictions.
 * @param {{ data: Array<{ jurisdiction: string, fines: number, charges: number, arrests: number }> }} props
 */
function HeatmapChart({ data = [] }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [dims, setDims] = useState({ width: 0, height: 0 })
  const { filters, setFilter } = useStore()

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDims({ width, height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const { width, height } = dims
    if (!data.length || width === 0 || height === 0) return

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top - MARGIN.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const jurisdictions = data.map((d) => d.jurisdiction)

    const xScale = d3.scaleBand().domain(METRICS).range([0, innerW]).padding(0.1)
    const yScale = d3.scaleBand().domain(jurisdictions).range([0, innerH]).padding(0.12)

    // Per-column sequential color scales (independent normalization per metric)
    const colorScales = {}
    METRICS.forEach((m) => {
      const key = DATA_KEY[m]
      const ext = d3.extent(data, (d) => d[key])
      colorScales[m] = d3.scaleSequential()
        .domain(ext[0] === ext[1] ? [0, ext[1] || 1] : ext)
        .interpolator(d3.interpolateRgb('#EDDDEC', '#61196E'))
    })

    // X axis (metric labels on top)
    g.append('g')
      .call(d3.axisTop(xScale).tickSize(0))
      .call((ax) => ax.select('.domain').remove())
      .selectAll('text')
      .style('font-size', '0.75rem')
      .style('font-family', 'Inter, sans-serif')
      .style('fill', '#6B7280')
      .style('font-weight', '600')

    // Y axis (jurisdiction labels on left)
    g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0))
      .call((ax) => ax.select('.domain').remove())
      .selectAll('text')
      .style('font-size', '0.75rem')
      .style('font-family', 'Inter, sans-serif')
      .style('fill', '#1F2937')
      .style('font-weight', '500')

    const selectedJurs = filters.jurisdictions
    const hasSelection = selectedJurs.length > 0

    const tooltip = d3.select(containerRef.current).select('.chart-tooltip')

    data.forEach((row) => {
      const isSelected = selectedJurs.includes(row.jurisdiction)
      const rowOpacity = hasSelection ? (isSelected ? 1 : 0.35) : 1

      METRICS.forEach((m) => {
        const val = row[DATA_KEY[m]]
        const x = xScale(m)
        const y = yScale(row.jurisdiction)
        const w = xScale.bandwidth()
        const h = yScale.bandwidth()

        g.append('rect')
          .attr('x', x).attr('y', y).attr('width', w).attr('height', h)
          .attr('rx', 6).attr('ry', 6)
          .attr('fill', colorScales[m](val))
          .attr('opacity', rowOpacity)
          .style('cursor', 'pointer')
          .on('mouseover', () => {
            tooltip.style('opacity', 1)
              .html(`<strong>${row.jurisdiction}</strong> — ${m}<br/>${val.toLocaleString()}`)
          })
          .on('mousemove', (event) => {
            const [mx, my] = d3.pointer(event, containerRef.current)
            tooltip.style('left', `${mx + 12}px`).style('top', `${my - 40}px`)
          })
          .on('mouseleave', () => tooltip.style('opacity', 0))
          .on('click', () => {
            const cur = filters.jurisdictions
            if (cur.includes(row.jurisdiction)) {
              setFilter('jurisdictions', cur.filter((j) => j !== row.jurisdiction))
            } else {
              setFilter('jurisdictions', [...cur, row.jurisdiction])
            }
          })

        // Threshold: use white text on dark cells
        const maxVal = d3.extent(data, (d) => d[DATA_KEY[m]])[1] || 1
        const textColor = val > maxVal * 0.55 ? '#fff' : '#1F2937'

        g.append('text')
          .attr('x', x + w / 2).attr('y', y + h / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .style('font-size', Math.min(11, h * 0.35) + 'px')
          .style('font-family', 'Inter, sans-serif')
          .style('font-weight', '600')
          .style('fill', textColor)
          .style('pointer-events', 'none')
          .attr('opacity', rowOpacity)
          .text(val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)
      })
    })
  }, [data, dims, filters.jurisdictions])

  if (!data.length) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          No data
        </Typography>
      </Box>
    )
  }

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg ref={svgRef} />
      <Box
        className="chart-tooltip"
        sx={{
          position: 'absolute',
          background: 'white',
          padding: '6px 10px',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          fontSize: '0.75rem',
          fontFamily: 'Inter, sans-serif',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.1s',
          zIndex: 10,
          lineHeight: 1.6,
          border: '1px solid #EDDDEC',
          whiteSpace: 'nowrap',
        }}
      />
    </Box>
  )
}

export default HeatmapChart
