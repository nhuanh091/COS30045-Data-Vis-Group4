// src/charts/StackedBarChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'

const MARGIN = { top: 20, right: 60, bottom: 44, left: 60 }
const DEFAULT_COLORS = ['#E99E1C', '#61196E']
const HEIGHT = 300

/**
 * Reusable stacked bar chart — displays grouped data with stacked segments.
 * Bars are vertical by default, with stacking along the y-axis.
 *
 * @param {Array}    data        - Array of objects with grouping field and stack fields
 * @param {string}   groupField  - Field name to group by (e.g., 'detectionMethod')
 * @param {Array}    stackFields - Array of field names to stack (e.g., ['best', 'notBest'])
 * @param {Array}    stackLabels - Array of display labels for each stack (e.g., ['Best', 'Not Best'])
 * @param {Array}    colors      - Optional color array for each segment (overrides defaults)
 * @param {function} onReset     - called when "Reset filters" is clicked in empty state
 */
function StackedBarChart({
  data = [],
  groupField = 'detectionMethod',
  stackFields = ['best', 'notBest'],
  stackLabels = ['Best', 'Not Best'],
  colors = [],
  onReset,
}) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(0)

  const chartColors = colors.length > 0 ? colors : DEFAULT_COLORS

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
    svg.attr('width', width).attr('height', HEIGHT)

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Compute stacked totals
    const stackedData = data.map((d) => {
      let y0 = 0
      const stacks = stackFields.map((field, i) => {
        const y1 = y0 + (Number(d[field]) || 0)
        const stack = { field, label: stackLabels[i], y0, y1, value: d[field], group: d[groupField] }
        y0 = y1
        return stack
      })
      return { group: d[groupField], total: y0, stacks }
    })

    const yMax = d3.max(stackedData, (d) => d.total) * 1.15

    const x = d3.scaleBand()
      .domain(stackedData.map((d) => d.group))
      .range([0, innerW])
      .padding(0.25)

    const y = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerH, 0])

    // Gridlines
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-innerW).tickFormat(''))
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick line')
          .attr('stroke', '#F3F4F6').attr('stroke-dasharray', '3,3')
      )

    const tooltipEl = d3.select(containerRef.current).select('.chart-tooltip')

    // Draw stacked bars
    g.selectAll('.group')
      .data(stackedData)
      .join('g')
      .attr('class', 'group')
      .attr('transform', (d) => `translate(${x(d.group)},0)`)
      .selectAll('.bar-segment')
      .data((d) => d.stacks)
      .join('rect')
      .attr('class', 'bar-segment')
      .attr('x', 0)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.y1))
      .attr('height', (d) => y(d.y0) - y(d.y1))
      .attr('fill', (d, i) => chartColors[i % chartColors.length])
      .attr('rx', 2)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', 0.8)
        tooltipEl.style('opacity', 1)
          .html(`<strong>${d.group}</strong><br/>${d.label}: <strong>${d.value.toLocaleString()}</strong>`)
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltipEl.style('left', `${mx + 12}px`).style('top', `${my - 40}px`)
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('opacity', 1)
        tooltipEl.style('opacity', 0)
      })

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick text')
          .attr('dy', '1.4em')
          .style('font-size', '0.72rem').style('fill', '#6B7280')
          .style('font-family', 'Inter, sans-serif')
      )

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => (d >= 1000 ? `${d / 1000}k` : d)).tickSize(0))
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick text')
          .style('font-size', '0.68rem').style('fill', '#9CA3AF')
          .style('font-family', 'Inter, sans-serif')
      )

    // Legend
    const legend = g.append('g').attr('transform', `translate(${innerW - 180},-14)`)
    stackLabels.forEach((label, i) => {
      const lx = i * 100
      legend.append('rect').attr('x', lx).attr('y', 0).attr('width', 10).attr('height', 10)
        .attr('rx', 2).attr('fill', chartColors[i % chartColors.length])
      legend.append('text').attr('x', lx + 14).attr('y', 9).text(label)
        .style('font-size', '0.68rem').style('fill', '#6B7280')
        .style('font-family', 'Inter, sans-serif')
    })
  }, [data, width, groupField, stackFields, stackLabels, chartColors])

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: HEIGHT }}>
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

export default StackedBarChart
