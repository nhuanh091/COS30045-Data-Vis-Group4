// src/utils/lineChartUtils.js
import * as d3 from 'd3'

const MARGIN = { top: 20, right: 56, bottom: 44, left: 52 }
const HEIGHT = 300

/**
 * Draw age group trend line chart with D3 styling applied
 * @param {HTMLElement} container - DOM container element
 * @param {Array} data - [{ MONTH: "Jan 2023", value: number, age_group: "0-16" }]
 */
export function drawAgeGroupTrendChart(container, data) {
  if (!container || !data || data.length === 0) return

  d3.select(container).selectAll('*').remove()

  const width = container.clientWidth || 600
  const innerW = width - MARGIN.left - MARGIN.right
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', HEIGHT)
    .attr('style', 'display: block; width: 100%;')

  const g = svg.append('g')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

  // Month order
  const monthOrder = [
    'Jan 2023','Feb 2023','Mar 2023','Apr 2023','May 2023','June 2023',
    'July 2023','Aug 2023','Sept 2023','Oct 2023','Nov 2023','Dec 2023',
    'Jan 2024','Feb 2024','Mar 2024','Apr 2024','May 2024','June 2024',
    'July 2024','Aug 2024','Sept 2024','Oct 2024','Nov 2024','Dec 2024'
  ]

  // Group data by age group
  const grouped = d3.group(data, d => d.age_group)

  // Sort each group by month order
  grouped.forEach(values => {
    values.sort((a, b) => monthOrder.indexOf(a.MONTH) - monthOrder.indexOf(b.MONTH))
  })

  // X scale (point scale for month labels)
  const x = d3.scalePoint()
    .domain(monthOrder)
    .range([0, innerW])
    .padding(0.5)

  // Y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.value)])
    .nice()
    .range([innerH, 0])

  // Color scale for age groups
  const color = d3.scaleOrdinal()
    .domain([...grouped.keys()])
    .range(d3.schemeCategory10)

  // Gridlines
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

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(
      d3.axisBottom(x)
        .tickValues(monthOrder.filter((d, i) => i % 3 === 0))
    )
    .call((sel) => sel.select('.domain').remove())
    .call((sel) =>
      sel.selectAll('.tick text')
        .attr('dy', '1.4em')
        .style('font-size', '0.68rem')
        .style('fill', '#9CA3AF')
        .style('font-family', 'Inter, sans-serif')
    )

  // Y axis
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

  // Line generator
  const line = d3.line()
    .x(d => x(d.MONTH))
    .y(d => y(+d.value))

  // Draw lines
  g.selectAll('.line')
    .data([...grouped])
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', d => color(d[0]))
    .attr('stroke-width', 2.5)
    .attr('d', d => line(d[1]))

  // Draw circles for data points
  g.selectAll('.dots')
    .data([...grouped])
    .enter()
    .append('g')
    .attr('class', 'dots')
    .selectAll('circle')
    .data(d => d[1])
    .enter()
    .append('circle')
    .attr('cx', d => x(d.MONTH))
    .attr('cy', d => y(+d.value))
    .attr('r', 3)
    .attr('fill', d => color(d.age_group))
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)

  // Legend
  const legendData = [...grouped.keys()]
  const legend = g.append('g')
    .attr('transform', `translate(0, -14)`)

  legend.selectAll('g')
    .data(legendData)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(${i * 80}, 0)`)
    .append('rect')
    .attr('width', 12).attr('height', 12).attr('rx', 2)
    .attr('fill', d => color(d))

  legend.selectAll('g')
    .append('text')
    .attr('x', 16).attr('y', 10)
    .text(d => d)
    .style('font-size', '0.68rem').style('fill', '#6B7280')
    .style('font-family', 'Inter, sans-serif')
}
