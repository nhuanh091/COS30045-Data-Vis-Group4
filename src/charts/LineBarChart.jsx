// src/charts/LineBarChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'

const MARGIN = { top: 20, right: 56, bottom: 44, left: 52 }

/**
 * Combo chart: bars = monthly positive drug tests, line = total tests.
 *
 * @param {Array}    data     - [{ month: "2023-01", totalTests: number, positives: number }]
 * @param {function} onReset  - called when user clicks "Reset filters" in empty state
 */
function LineBarChart({ data = [], onReset }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(0)

  const HEIGHT = 300

  // Track container width via ResizeObserver
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

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

    const g = svg
      .attr('width', width)
      .attr('height', HEIGHT)
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Scales
    const x = d3.scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerW])
      .padding(0.35)

    const yBar = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.positives) * 1.2])
      .nice()
      .range([innerH, 0])

    const yLine = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.totalTests) * 1.2])
      .nice()
      .range([innerH, 0])

    // Gridlines (from left Y axis)
    g.append('g')
      .call(
        d3.axisLeft(yBar)
          .ticks(4)
          .tickSize(-innerW)
          .tickFormat('')
      )
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick line')
          .attr('stroke', '#F3F4F6')
          .attr('stroke-dasharray', '3,3')
      )

    // Bars
    const bars = g
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.month))
      .attr('width', x.bandwidth())
      .attr('y', innerH)
      .attr('height', 0)
      .attr('fill', '#61196E')
      .attr('opacity', 0.72)
      .attr('rx', 3)

    bars
      .transition()
      .duration(300)
      .attr('y', (d) => yBar(d.positives))
      .attr('height', (d) => innerH - yBar(d.positives))

    // Line path
    const lineGen = d3
      .line()
      .x((d) => x(d.month) + x.bandwidth() / 2)
      .y((d) => yLine(d.totalTests))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#E99E1C')
      .attr('stroke-width', 2.5)
      .attr('d', lineGen)

    // Line dots
    g.selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => x(d.month) + x.bandwidth() / 2)
      .attr('cy', (d) => yLine(d.totalTests))
      .attr('r', 3.5)
      .attr('fill', '#E99E1C')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)

    // X axis — show every other label when many months
    const tickEvery = data.length > 12 ? 2 : 1
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(
        d3.axisBottom(x)
          .tickValues(data.filter((_, i) => i % tickEvery === 0).map((d) => d.month))
          .tickFormat((d) => d3.timeFormat('%b %y')(new Date(d + '-01')))
          .tickSize(0)
      )
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick text')
          .attr('dy', '1.4em')
          .style('font-size', '0.68rem')
          .style('fill', '#9CA3AF')
          .style('font-family', 'Inter, sans-serif')
      )

    // Y axis left (bars)
    g.append('g')
      .call(
        d3.axisLeft(yBar)
          .ticks(4)
          .tickFormat((d) => (d >= 1000 ? `${d / 1000}k` : d))
          .tickSize(0)
      )
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick text')
          .style('font-size', '0.68rem')
          .style('fill', '#9CA3AF')
          .style('font-family', 'Inter, sans-serif')
      )

    // Y axis right (line)
    g.append('g')
      .attr('transform', `translate(${innerW},0)`)
      .call(
        d3.axisRight(yLine)
          .ticks(4)
          .tickFormat((d) => (d >= 1000 ? `${d / 1000}k` : d))
          .tickSize(0)
      )
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick text')
          .style('font-size', '0.68rem')
          .style('fill', '#9CA3AF')
          .style('font-family', 'Inter, sans-serif')
      )

    // Legend
    const legend = g.append('g').attr('transform', `translate(0, -14)`)
    legend.append('rect')
      .attr('width', 12).attr('height', 12).attr('rx', 2)
      .attr('fill', '#61196E').attr('opacity', 0.72)
    legend.append('text')
      .attr('x', 16).attr('y', 10)
      .text('Positive tests')
      .style('font-size', '0.68rem').style('fill', '#6B7280')
      .style('font-family', 'Inter, sans-serif')
    legend.append('line')
      .attr('x1', 110).attr('x2', 126).attr('y1', 6).attr('y2', 6)
      .attr('stroke', '#E99E1C').attr('stroke-width', 2.5)
    legend.append('circle')
      .attr('cx', 118).attr('cy', 6).attr('r', 3.5)
      .attr('fill', '#E99E1C')
    legend.append('text')
      .attr('x', 130).attr('y', 10)
      .text('Total tests')
      .style('font-size', '0.68rem').style('fill', '#6B7280')
      .style('font-family', 'Inter, sans-serif')

    // Tooltip
    const tooltipEl = d3.select(containerRef.current).select('.chart-tooltip')

    bars
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', 1)
        const rate = d.totalTests > 0
          ? ((d.positives / d.totalTests) * 100).toFixed(1)
          : '0.0'
        tooltipEl
          .style('opacity', 1)
          .html(
            `<strong>${d3.timeFormat('%B %Y')(new Date(d.month + '-01'))}</strong><br/>` +
            `Positives: <strong>${d.positives.toLocaleString()}</strong><br/>` +
            `Total tests: <strong>${d.totalTests.toLocaleString()}</strong><br/>` +
            `Rate: <strong>${rate}%</strong>`
          )
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltipEl.style('left', `${mx + 12}px`).style('top', `${my - 60}px`)
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('opacity', 0.72)
        tooltipEl.style('opacity', 0)
      })
  }, [data, width])

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: HEIGHT }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          No data matches the current filters.{' '}
          <Box
            component="span"
            onClick={onReset}
            sx={{ color: '#61196E', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Reset filters
          </Box>
        </Typography>
      </Box>
    )
  }

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
      <Box
        className="chart-tooltip"
        sx={{
          position: 'absolute',
          background: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          fontSize: '0.75rem',
          fontFamily: 'Inter, sans-serif',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.1s',
          zIndex: 10,
          lineHeight: 1.6,
          minWidth: 160,
          border: '1px solid #EDDDEC',
        }}
      />
    </Box>
  )
}

export default LineBarChart
