// src/charts/SunburstChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'

const STAGE_COLORS = { 'Stage 1': '#61196E', 'Stage 2': '#A48ECA', 'Stage 3': '#E99E1C' }

// Mix a hex color with white. amount=0 → original, amount=1 → pure white.
function tintColor(hex, amount) {
  const c = d3.rgb(hex)
  return d3.rgb(
    Math.round(c.r + (255 - c.r) * amount),
    Math.round(c.g + (255 - c.g) * amount),
    Math.round(c.b + (255 - c.b) * amount)
  ).formatHex()
}

/**
 * SunburstChart — detection stage × best detection method.
 * Level 1: Stage 1/2/3. Level 2: Yes/No best detection.
 * Click a Stage arc to toggle filters.stage.
 *
 * @param {{ data: { name: string, children: Array } }} props — D3 hierarchy tree from aggregateSunburstData
 */
function SunburstChart({ data }) {
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
    if (!data || !data.children || width === 0) return

    const size = Math.min(width, 280)
    const radius = size / 2
    const cx = size / 2
    const cy = size / 2

    const root = d3.hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (a.data.name || '').localeCompare(b.data.name || ''))

    const partition = d3.partition().size([2 * Math.PI, radius])
    partition(root)

    const arc = d3.arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.015))
      .padRadius(radius * 0.5)
      .innerRadius((d) => d.y0 + 4)
      .outerRadius((d) => d.y1 - 2)

    const getColor = (d) => {
      if (d.depth === 0) return 'transparent'
      const stageHex = STAGE_COLORS[d.depth === 1 ? d.data.name : d.parent.data.name] || '#A48ECA'
      if (d.depth === 1) return stageHex
      return d.data.name === 'Yes' ? tintColor(stageHex, 0.35) : tintColor(stageHex, 0.65)
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', size).attr('height', size)

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)
    const tooltip = d3.select(containerRef.current).select('.chart-tooltip')
    const total = root.value || 1

    g.selectAll('path')
      .data(root.descendants().filter((d) => d.depth > 0))
      .join('path')
      .attr('d', arc)
      .attr('fill', getColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('opacity', (d) => {
        if (d.depth !== 1 || filters.stage === null) return 1
        return d.data.name === filters.stage ? 1 : 0.4
      })
      .style('cursor', (d) => (d.depth === 1 ? 'pointer' : 'default'))
      .on('mouseover', (event, d) => {
        const pct = ((d.value / total) * 100).toFixed(1)
        const label = d.depth === 1
          ? d.data.name
          : `${d.parent.data.name} → ${d.data.name}`
        tooltip.style('opacity', 1)
          .html(`<strong>${label}</strong><br/>${d.value.toLocaleString()} (${pct}%)`)
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltip.style('left', `${mx + 12}px`).style('top', `${my - 40}px`)
      })
      .on('mouseleave', () => tooltip.style('opacity', 0))
      .on('click', (event, d) => {
        if (d.depth !== 1) return
        setFilter('stage', filters.stage === d.data.name ? null : d.data.name)
      })

    // Centre total label
    g.append('text')
      .attr('text-anchor', 'middle').attr('dy', '-0.2em')
      .style('font-size', Math.max(10, radius * 0.18) + 'px')
      .style('font-weight', '800')
      .style('font-family', '"DM Serif Display", serif')
      .style('fill', '#1F2937')
      .text(total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total)

    g.append('text')
      .attr('text-anchor', 'middle').attr('dy', '1.1em')
      .style('font-size', Math.max(8, radius * 0.1) + 'px')
      .style('font-family', 'Inter, sans-serif')
      .style('fill', '#9CA3AF')
      .text('total tests')
  }, [data, width, filters.stage])

  if (!data || !data.children) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          No data
        </Typography>
      </Box>
    )
  }

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      {/* Stage legend — click to toggle filter */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
        {Object.entries(STAGE_COLORS).map(([stage, color]) => {
          const isSelected = filters.stage === stage
          const hasSelection = filters.stage !== null
          return (
            <Box
              key={stage}
              onClick={() => setFilter('stage', filters.stage === stage ? null : stage)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.5,
                cursor: 'pointer', borderRadius: '6px',
                px: 1, py: 0.3,
                bgcolor: isSelected ? '#FAF7FF' : 'transparent',
                border: isSelected ? '1px solid #EDDDEC' : '1px solid transparent',
                opacity: hasSelection && !isSelected ? 0.45 : 1,
                transition: 'all 0.15s',
                '&:hover': { bgcolor: '#FAF7FF' },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', color: '#1F2937', fontWeight: isSelected ? 700 : 400 }}>
                {stage}
              </Typography>
            </Box>
          )
        })}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} />
      </Box>
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

export default SunburstChart
