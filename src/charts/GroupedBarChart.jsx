// src/charts/GroupedBarChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'

const MARGIN = { top: 24, right: 24, bottom: 44, left: 52 }
const GROUPS = ['fines', 'arrests', 'charges']
const GROUP_COLORS = { fines: '#E99E1C', arrests: '#61196E', charges: '#BF6BA1' }
const GROUP_LABELS = { fines: 'Fines', arrests: 'Arrests', charges: 'Charges' }
const HEIGHT = 260

/**
 * Grouped bar chart — enforcement outcomes (fines/arrests/charges) by age group.
 *
 * @param {Array}    data    - [{ ageGroup, fines, arrests, charges }]
 * @param {function} onReset - called when "Reset filters" is clicked in empty state
 */
function GroupedBarChart({ data = [], onReset }) {
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

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', HEIGHT)

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const x0 = d3.scaleBand()
      .domain(data.map((d) => d.ageGroup))
      .range([0, innerW])
      .paddingInner(0.25)

    const x1 = d3.scaleBand()
      .domain(GROUPS)
      .range([0, x0.bandwidth()])
      .padding(0.1)

    const yMax = d3.max(data, (d) => Math.max(d.fines, d.arrests, d.charges)) * 1.2
    const y = d3.scaleLinear().domain([0, yMax]).nice().range([innerH, 0])

    // Gridlines
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-innerW).tickFormat(''))
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick line')
          .attr('stroke', '#F3F4F6').attr('stroke-dasharray', '3,3')
      )

    const tooltipEl = d3.select(containerRef.current).select('.chart-tooltip')

    g.selectAll('.age-group')
      .data(data)
      .join('g')
      .attr('class', 'age-group')
      .attr('transform', (d) => `translate(${x0(d.ageGroup)},0)`)
      .selectAll('.bar')
      .data((d) => GROUPS.map((key) => ({ key, value: d[key], ageGroup: d.ageGroup })))
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x1(d.key))
      .attr('width', x1.bandwidth())
      .attr('y', innerH)
      .attr('height', 0)
      .attr('fill', (d) => GROUP_COLORS[d.key])
      .attr('rx', 3)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', 0.8)
        tooltipEl.style('opacity', 1)
          .html(`<strong>${d.ageGroup}</strong><br/>${GROUP_LABELS[d.key]}: <strong>${d.value.toLocaleString()}</strong>`)
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltipEl.style('left', `${mx + 12}px`).style('top', `${my - 40}px`)
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('opacity', 1)
        tooltipEl.style('opacity', 0)
      })
      .transition().duration(300)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => innerH - y(d.value))

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x0).tickSize(0))
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
    const legend = g.append('g').attr('transform', `translate(${innerW - 160},-18)`)
    GROUPS.forEach((key, i) => {
      const lx = i * 58
      legend.append('rect').attr('x', lx).attr('y', 0).attr('width', 10).attr('height', 10)
        .attr('rx', 2).attr('fill', GROUP_COLORS[key])
      legend.append('text').attr('x', lx + 14).attr('y', 9).text(GROUP_LABELS[key])
        .style('font-size', '0.68rem').style('fill', '#6B7280')
        .style('font-family', 'Inter, sans-serif')
    })
  }, [data, width])

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

export default GroupedBarChart
