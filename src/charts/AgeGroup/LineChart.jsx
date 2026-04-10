// src/charts/AgeGroup/LineChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'

const MARGIN = { top: 20, right: 56, bottom: 44, left: 52 }
const COLORS = ['#61196E', '#E99E1C', '#7658B2', '#BF6BA1', '#852501', '#A48ECA']

/**
 * Line chart for age groups over time.
 * Reads filters.ageGroup from store — fades non-selected age groups.
 * Click on a legend item or line to toggle ageGroup filter.
 *
 * @param {Array}    data     - [{ month: "2023-01", "0-16": number, "17-25": number, ... }]
 * @param {function} onReset  - called when user clicks "Reset filters" in empty state
 */
function LineChart({ data = [], onReset }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(0)
  const { filters, setFilter } = useStore()

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

    // Get age groups from data keys (excluding 'month')
    const ageGroups = Object.keys(data[0] || {}).filter(key => key !== 'month')

    // Sort age groups by the starting age number
    ageGroups.sort((a, b) => {
      const aMin = parseInt(a.split('-')[0]) || 0
      const bMin = parseInt(b.split('-')[0]) || 0
      return aMin - bMin
    })

    const selectedAgeGroup = filters.ageGroup
    const hasAgeGroupFilter = selectedAgeGroup !== null

    // Scales
    const x = d3.scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerW])
      .padding(0.35)

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.flatMap(d => ageGroups.map(ag => d[ag] || 0))) * 1.2])
      .nice()
      .range([innerH, 0])

    const color = d3.scaleOrdinal()
      .domain(ageGroups)
      .range(COLORS)

    // Gridlines (from left Y axis)
    g.append('g')
      .call(
        d3.axisLeft(y)
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

    // Draw lines and dots for each age group
    ageGroups.forEach((ag, i) => {
      const isSelected = !hasAgeGroupFilter || ag === selectedAgeGroup
      const lineOpacity = isSelected ? 1 : 0.12
      const dotOpacity = isSelected ? 1 : 0.12

      const lineGen = d3
        .line()
        .x((d) => x(d.month) + x.bandwidth() / 2)
        .y((d) => y(d[ag] || 0))
        .curve(d3.curveMonotoneX)

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color(ag))
        .attr('stroke-width', isSelected ? 3 : 2)
        .attr('opacity', lineOpacity)
        .attr('d', lineGen)
        .style('cursor', 'pointer')
        .on('click', () => {
          if (filters.ageGroup === ag) {
            setFilter('ageGroup', null)
          } else {
            setFilter('ageGroup', ag)
          }
        })

      // Line dots
      g.selectAll(`.dot-${i}`)
        .data(data)
        .join('circle')
        .attr('class', `dot-${i}`)
        .attr('cx', (d) => x(d.month) + x.bandwidth() / 2)
        .attr('cy', (d) => y(d[ag] || 0))
        .attr('r', isSelected ? 3.5 : 2.5)
        .attr('fill', color(ag))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('opacity', dotOpacity)
        .style('cursor', 'pointer')
        .on('click', () => {
          if (filters.ageGroup === ag) {
            setFilter('ageGroup', null)
          } else {
            setFilter('ageGroup', ag)
          }
        })
    })

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

    // Y axis left
    g.append('g')
      .call(
        d3.axisLeft(y)
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

    // Legend (clickable)
    const legend = g.append('g').attr('transform', `translate(0, -14)`)
    let legendX = 0
    ageGroups.forEach((ag) => {
      const isSelected = !hasAgeGroupFilter || ag === selectedAgeGroup
      const legendOpacity = isSelected ? 1 : 0.3

      const legendItem = legend.append('g')
        .attr('transform', `translate(${legendX}, 0)`)
        .style('cursor', 'pointer')
        .attr('opacity', legendOpacity)
        .on('click', () => {
          if (filters.ageGroup === ag) {
            setFilter('ageGroup', null)
          } else {
            setFilter('ageGroup', ag)
          }
        })

      legendItem.append('line')
        .attr('x1', 0).attr('x2', 16).attr('y1', 6).attr('y2', 6)
        .attr('stroke', color(ag)).attr('stroke-width', 2.5)
      legendItem.append('circle')
        .attr('cx', 8).attr('cy', 6).attr('r', 3.5)
        .attr('fill', color(ag))
      legendItem.append('text')
        .attr('x', 20).attr('y', 10)
        .text(ag)
        .style('font-size', '0.68rem').style('fill', '#6B7280')
        .style('font-family', 'Inter, sans-serif')
      legendX += 80
    })

    // Tooltip and hover interaction
    const tooltipEl = d3.select(containerRef.current).select('.chart-tooltip')

    // Build the selected month key from filters
    const selectedMonth = (filters.year !== null && filters.month !== null)
      ? `${filters.year}-${String(filters.month).padStart(2, '0')}`
      : null

    // Draw persistent selection line for selected month
    if (selectedMonth && data.some(d => d.month === selectedMonth)) {
      g.append('rect')
        .attr('class', 'selected-time-highlight')
        .attr('x', x(selectedMonth))
        .attr('width', x.bandwidth())
        .attr('y', 0)
        .attr('height', innerH)
        .attr('fill', '#61196E')
        .attr('opacity', 0.08)
        .attr('rx', 3)

      g.append('line')
        .attr('class', 'selected-time-line')
        .attr('x1', x(selectedMonth) + x.bandwidth() / 2)
        .attr('x2', x(selectedMonth) + x.bandwidth() / 2)
        .attr('y1', 0)
        .attr('y2', innerH)
        .attr('stroke', '#61196E')
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.7)
    }

    // Invisible rect for mouse events
    g.append('rect')
      .attr('width', innerW)
      .attr('height', innerH)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .style('cursor', 'pointer')
      .on('mousemove', function(event) {
        const [mx] = d3.pointer(event)
        const xPos = mx
        const bisect = d3.bisector(d => x(d.month) + x.bandwidth() / 2).left
        const index = bisect(data, xPos)
        const d = data[Math.max(0, Math.min(data.length - 1, index))]

        g.selectAll('.hover-line').remove()

        // Only show hover line if it's not the selected month
        if (d.month !== selectedMonth) {
          g.append('line')
            .attr('class', 'hover-line')
            .attr('x1', x(d.month) + x.bandwidth() / 2)
            .attr('x2', x(d.month) + x.bandwidth() / 2)
            .attr('y1', 0)
            .attr('y2', innerH)
            .attr('stroke', '#9CA3AF')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2')
        }

        const tooltipContent = `<strong>${d3.timeFormat('%B %Y')(new Date(d.month + '-01'))}</strong><br/>` +
          ageGroups.map(ag => `${ag}: <strong>${(d[ag] || 0).toLocaleString()}</strong>`).join('<br/>')

        tooltipEl
          .style('opacity', 1)
          .html(tooltipContent)

        const [mouseX, mouseY] = d3.pointer(event, containerRef.current)
        tooltipEl
          .style('left', `${mouseX + 12}px`)
          .style('top', `${mouseY - 60}px`)
      })
      .on('mouseleave', function() {
        g.selectAll('.hover-line').remove()
        tooltipEl.style('opacity', 0)
      })
      .on('click', function(event) {
        const [mx] = d3.pointer(event)
        const bisect = d3.bisector(d => x(d.month) + x.bandwidth() / 2).left
        const index = bisect(data, mx)
        const d = data[Math.max(0, Math.min(data.length - 1, index))]

        if (d && d.month) {
          const [year, month] = d.month.split('-').map(Number)
          const clickedKey = `${year}-${String(month).padStart(2, '0')}`
          if (selectedMonth === clickedKey) {
            // Deselect
            setFilter('year', null)
            setFilter('month', null)
          } else {
            // Select
            setFilter('year', year)
            setFilter('month', month)
          }
        }
      })
  }, [data, width, filters.ageGroup, filters.year, filters.month])

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

export default LineChart
