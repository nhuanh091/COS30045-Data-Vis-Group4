// src/charts/BarChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'

const MARGIN = { top: 10, right: 60, bottom: 10, left: 48 }

/**
 * Horizontal sorted bar chart — positive drug tests by jurisdiction.
 *
 * @param {Array}    data     - [{ jurisdiction: string, positives: number }], sorted desc
 * @param {function} onReset  - called when user clicks "Reset filters" in empty state
 */
function BarChart({ data = [], onReset }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!data || data.length === 0 || width === 0) return

    const barHeight = 32
    const height = data.length * (barHeight + 8) + MARGIN.top + MARGIN.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top - MARGIN.bottom

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.positives) * 1.15])
      .range([0, innerW])

    const y = d3.scaleBand()
      .domain(data.map((d) => d.jurisdiction))
      .range([0, innerH])
      .padding(0.25)

    const bars = g
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d) => y(d.jurisdiction))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', '#61196E')
      .attr('rx', 4)

    bars.transition().duration(300)
      .attr('width', (d) => x(d.positives))

    g.selectAll('.bar-label')
      .data(data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => x(d.positives) + 6)
      .attr('y', (d) => y(d.jurisdiction) + y.bandwidth() / 2 + 4)
      .style('font-size', '0.7rem')
      .style('fill', '#6B7280')
      .style('font-family', 'Inter, sans-serif')
      .text((d) => d.positives.toLocaleString())

    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick text')
          .style('font-size', '0.75rem')
          .style('fill', '#374151')
          .style('font-family', 'Inter, sans-serif')
          .attr('dx', '-6')
      )

    const tooltipEl = d3.select(containerRef.current).select('.chart-tooltip')

    bars
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('fill', '#7658B2')
        tooltipEl.style('opacity', 1)
          .html(`<strong>${d.jurisdiction}</strong><br/>Positives: <strong>${d.positives.toLocaleString()}</strong>`)
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltipEl.style('left', `${mx + 12}px`).style('top', `${my - 36}px`)
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('fill', '#61196E')
        tooltipEl.style('opacity', 0)
      })
  }, [data, width])

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          No data matches the current filters.{' '}
          <Box component="span" onClick={onReset}
            sx={{ color: '#61196E', cursor: 'pointer', textDecoration: 'underline' }}>
            Reset filters
          </Box>
        </Typography>
      </Box>
    )
  }

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
      <Box className="chart-tooltip" sx={{
        position: 'absolute', background: 'white', padding: '6px 10px',
        borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        fontSize: '0.75rem', fontFamily: 'Inter, sans-serif',
        pointerEvents: 'none', opacity: 0, transition: 'opacity 0.1s',
        zIndex: 10, lineHeight: 1.6, border: '1px solid #EDDDEC', whiteSpace: 'nowrap',
      }} />
    </Box>
  )
}

export default BarChart
