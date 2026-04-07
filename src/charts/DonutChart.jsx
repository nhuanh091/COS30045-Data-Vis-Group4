import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'

/**
 * Reusable donut chart. Used for Drug Type distribution and Detection Methods.
 *
 * @param {Array}    data   - [{ label: string, value: number }], pre-sorted descending
 * @param {string[]} colors - hex colour array, same length as data
 * @param {string}   title  - chart title shown above
 */
function DonutChart({ data = [], colors = [], title = '' }) {
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

    const size = Math.min(width, 200)
    const cx = size / 2
    const cy = size / 2
    const outerR = size / 2 - 8
    const innerR = outerR * 0.60

    svg.attr('width', size).attr('height', size)

    const total = d3.sum(data, (d) => d.value)
    const pie = d3.pie().value((d) => d.value).sort(null)
    const arc = d3.arc().innerRadius(innerR).outerRadius(outerR).cornerRadius(3)
    const arcHover = d3.arc().innerRadius(innerR).outerRadius(outerR + 4).cornerRadius(3)

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)

    const colorFn = (i) => colors[i % colors.length] || '#A48ECA'

    const tooltipEl = d3.select(containerRef.current).select('.chart-tooltip')

    const paths = g
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('fill', (_, i) => colorFn(i))
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('d', arc)

    paths
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('d', arcHover)
        const pct = ((d.data.value / total) * 100).toFixed(1)
        tooltipEl
          .style('opacity', 1)
          .html(`<strong>${d.data.label}</strong><br/>${d.data.value.toLocaleString()} (${pct}%)`)
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current)
        tooltipEl.style('left', `${mx + 12}px`).style('top', `${my - 40}px`)
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('d', arc)
        tooltipEl.style('opacity', 0)
      })

    // Centre label — dominant segment
    if (data.length > 0) {
      const topPct = ((data[0].value / total) * 100).toFixed(0)
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.2em')
        .style('font-size', `${Math.max(10, innerR * 0.35)}px`)
        .style('font-weight', '800')
        .style('font-family', '"DM Serif Display", serif')
        .style('fill', '#1F2937')
        .text(`${topPct}%`)
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.1em')
        .style('font-size', `${Math.max(8, innerR * 0.22)}px`)
        .style('font-family', 'Inter, sans-serif')
        .style('fill', '#9CA3AF')
        .text(data[0].label)
    }
  }, [data, colors, width])

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          No data
        </Typography>
      </Box>
    )
  }

  const total = data.reduce((s, d) => s + d.value, 0)
  const colorFn = (i) => colors[i % colors.length] || '#A48ECA'

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      {/* Legend */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
        {data.map((item, i) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 10, height: 10, borderRadius: '2px',
                bgcolor: colorFn(i), flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: '0.7rem', color: '#6B7280', fontFamily: 'Inter, sans-serif', flex: 1 }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#1F2937', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
            </Typography>
          </Box>
        ))}
      </Box>
      {/* SVG */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} />
      </Box>
      {/* Tooltip */}
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

export default DonutChart
