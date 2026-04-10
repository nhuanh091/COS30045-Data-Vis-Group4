// src/charts/Location/DivergingBarChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'

const MARGIN = { top: 24, right: 24, bottom: 44, left: 160 }
const COLORS = { fines: '#E99E1C', charges: '#61196E' }
const LABELS = { fines: 'Fines', charges: 'Charges' }
const HEIGHT = 260

/**
 * Diverging bar chart — fines (left) vs charges (right) by location.
 * Reads filters.locationGroup from store — fades non-selected location rows.
 * Click on a bar to toggle the locationGroup filter.
 *
 * @param {Array}    data    - [{ locationGroup, fines, charges }]
 * @param {function} onReset - called when "Reset filters" is clicked in empty state
 */
function DivergingBarChart({ data = [], onReset }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(0)
  const { filters, setFilter } = useStore()

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

    const selectedLocationGroup = filters.locationGroup
    const hasLocationGroupFilter = selectedLocationGroup !== null

    const maxValue = d3.max(data, (d) => Math.max(d.fines, d.charges)) * 1.2

    const x = d3.scaleLinear()
      .domain([-maxValue, maxValue])
      .range([0, innerW])

    const y = d3.scaleBand()
      .domain(data.map((d) => d.locationGroup))
      .range([0, innerH])
      .padding(0.25)

    const xCenter = x(0)

    // Gridlines
    g.append('g')
      .call(d3.axisBottom(x).ticks(4).tickSize(-innerH).tickFormat(''))
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick line')
          .attr('stroke', '#F3F4F6').attr('stroke-dasharray', '3,3')
      )

    // Central line at zero
    g.append('line')
      .attr('x1', xCenter).attr('x2', xCenter)
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#D1D5DB').attr('stroke-width', 1)

    const tooltipEl = d3.select(containerRef.current).select('.chart-tooltip')

    // Helper: get opacity for a row
    const getRowOpacity = (d) => {
      if (!hasLocationGroupFilter) return 1
      return d.locationGroup === selectedLocationGroup ? 1 : 0.15
    }

    // Draw fines (left bars)
    g.selectAll('.bar-fines')
      .data(data)
      .join('rect')
      .attr('class', 'bar-fines')
      .attr('x', (d) => x(-d.fines))
      .attr('width', (d) => xCenter - x(-d.fines))
      .attr('y', (d) => y(d.locationGroup))
      .attr('height', y.bandwidth())
      .attr('fill', COLORS.fines)
      .attr('opacity', getRowOpacity)
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', Math.min(1, getRowOpacity(d) + 0.2))
        tooltipEl.style('opacity', 1)
          .html(`<strong>${d.locationGroup}</strong><br/>${LABELS.fines}: <strong>${d.fines.toLocaleString()}</strong>`)
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltipEl.style('left', `${mx + 12}px`).style('top', `${my - 40}px`)
      })
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', getRowOpacity(d))
        tooltipEl.style('opacity', 0)
      })
      .on('click', (event, d) => {
        if (filters.locationGroup === d.locationGroup) {
          setFilter('locationGroup', null)
        } else {
          setFilter('locationGroup', d.locationGroup)
        }
      })

    // Draw charges (right bars)
    g.selectAll('.bar-charges')
      .data(data)
      .join('rect')
      .attr('class', 'bar-charges')
      .attr('x', xCenter)
      .attr('width', (d) => x(d.charges) - xCenter)
      .attr('y', (d) => y(d.locationGroup))
      .attr('height', y.bandwidth())
      .attr('fill', COLORS.charges)
      .attr('opacity', getRowOpacity)
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', Math.min(1, getRowOpacity(d) + 0.2))
        tooltipEl.style('opacity', 1)
          .html(`<strong>${d.locationGroup}</strong><br/>${LABELS.charges}: <strong>${d.charges.toLocaleString()}</strong>`)
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltipEl.style('left', `${mx + 12}px`).style('top', `${my - 40}px`)
      })
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', getRowOpacity(d))
        tooltipEl.style('opacity', 0)
      })
      .on('click', (event, d) => {
        if (filters.locationGroup === d.locationGroup) {
          setFilter('locationGroup', null)
        } else {
          setFilter('locationGroup', d.locationGroup)
        }
      })

    // Y axis (locations) - with fading labels
    const yAxisG = g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call((sel) => sel.select('.domain').remove())

    yAxisG.selectAll('.tick text')
      .style('font-size', '0.72rem').style('fill', '#6B7280')
      .style('font-family', 'Inter, sans-serif')
      .style('cursor', 'pointer')
      .attr('opacity', function () {
        if (!hasLocationGroupFilter) return 1
        const label = d3.select(this).text()
        return label === selectedLocationGroup ? 1 : 0.35
      })
      .on('click', function () {
        const label = d3.select(this).text()
        if (filters.locationGroup === label) {
          setFilter('locationGroup', null)
        } else {
          setFilter('locationGroup', label)
        }
      })

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(4).tickFormat((d) => (d === 0 ? '0' : Math.abs(d) >= 1000 ? `${Math.abs(d) / 1000}k` : Math.abs(d))).tickSize(0))
      .call((sel) => sel.select('.domain').remove())
      .call((sel) =>
        sel.selectAll('.tick text')
          .attr('dy', '1.4em')
          .style('font-size', '0.68rem').style('fill', '#9CA3AF')
          .style('font-family', 'Inter, sans-serif')
      )

    // Legend
    const legend = g.append('g').attr('transform', `translate(${innerW - 140},-18)`)
    
    // Fines legend
    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 10).attr('height', 10)
      .attr('rx', 2).attr('fill', COLORS.fines)
    legend.append('text').attr('x', 14).attr('y', 9).text(LABELS.fines)
      .style('font-size', '0.68rem').style('fill', '#6B7280')
      .style('font-family', 'Inter, sans-serif')

    // Charges legend
    legend.append('rect').attr('x', 70).attr('y', 0).attr('width', 10).attr('height', 10)
      .attr('rx', 2).attr('fill', COLORS.charges)
    legend.append('text').attr('x', 84).attr('y', 9).text(LABELS.charges)
      .style('font-size', '0.68rem').style('fill', '#6B7280')
      .style('font-family', 'Inter, sans-serif')
  }, [data, width, filters.locationGroup])

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

export default DivergingBarChart
