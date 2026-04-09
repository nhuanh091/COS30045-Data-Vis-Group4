# Jurisdiction Analysis Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/jurisdiction` page with three interactive D3 charts (Heatmap, Radar, Sunburst) that filter the global Zustand store on click.

**Architecture:** Pure D3 charts inside React functional components, same ResizeObserver + tooltip pattern as existing charts. Page consumes global `filteredData` from Zustand; clicks call `setFilter` which propagates to all charts. No new store actions needed — `setFilter('jurisdictions', [])` and `setFilter('stage', null)` already clear those filters.

**Tech Stack:** React 18, D3 v7, MUI v5, Zustand, Vite

---

## Key Notes Before Starting

- `DETECTION_METHOD` column values in CSV: `'Stage 1'`, `'Stage 2'`, `'Stage 3'` — same as the `filters.stage` key. The "Detection Method" filter the user requested IS the existing `stage` filter; reuse the existing `FilterBar` component unchanged.
- `BEST_DETECTION_METHOD` column values in CSV: `'Yes'` or `'No'`.
- No existing test infrastructure in the project. Verification is visual: run `npm run dev`, navigate to `/jurisdiction`, and check each chart responds to clicks and filters.
- `setFilter('jurisdictions', [])` clears jurisdictions (existing logic: `filters.jurisdictions.length > 0`).
- `setFilter('stage', null)` clears stage (existing logic: `filters.stage !== null`).

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/data/dataUtils.js` | **Modify** | Add 3 aggregation functions |
| `src/charts/HeatmapChart.jsx` | **Create** | D3 rect heatmap: jurisdiction × outcomes |
| `src/charts/RadarChart.jsx` | **Create** | D3 spider radar: drug types per jurisdiction |
| `src/charts/SunburstChart.jsx` | **Create** | D3 partition sunburst: Stage → Yes/No |
| `src/styles/jurisdiction.css` | **Create** | CSS Grid layout for page cells |
| `src/pages/JurisdictionAnalysis.jsx` | **Create** | Page: aggregates data, composes charts |
| `src/App.jsx` | **Modify** | Add `/jurisdiction` route |
| `src/components/Sidebar.jsx` | **Modify** | Add nav item |

---

## Task 1: Aggregation Functions in dataUtils.js

**Files:**
- Modify: `src/data/dataUtils.js` (append to bottom)

- [ ] **Step 1: Append the three functions**

Add at the bottom of `src/data/dataUtils.js`:

```js
/**
 * Aggregate outcomes by jurisdiction for HeatmapChart.
 * Returns [{ jurisdiction, fines, charges, arrests }] sorted by jurisdiction name.
 */
export function aggregateHeatmapData(data) {
  const map = {}
  data.forEach((row) => {
    const key = row.JURISDICTION
    if (!map[key]) map[key] = { jurisdiction: key, fines: 0, charges: 0, arrests: 0 }
    map[key].fines   += (Number(row.FINES)   || 0)
    map[key].charges += (Number(row.CHARGES) || 0)
    map[key].arrests += (Number(row.ARRESTS) || 0)
  })
  return Object.values(map).sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction))
}

/**
 * Aggregate drug type totals by jurisdiction for RadarChart.
 * Returns { NSW: { amphetamine, cannabis, cocaine, ecstasy, methylamphetamine, other }, … }
 */
export function aggregateRadarData(data) {
  const map = {}
  data.forEach((row) => {
    const key = row.JURISDICTION
    if (!map[key]) {
      map[key] = { amphetamine: 0, cannabis: 0, cocaine: 0, ecstasy: 0, methylamphetamine: 0, other: 0 }
    }
    map[key].amphetamine       += (Number(row.AMPHETAMINE)       || 0)
    map[key].cannabis          += (Number(row.CANNABIS)          || 0)
    map[key].cocaine           += (Number(row.COCAINE)           || 0)
    map[key].ecstasy           += (Number(row.ECSTASY)           || 0)
    map[key].methylamphetamine += (Number(row.METHYLAMPHETAMINE) || 0)
    map[key].other             += (Number(row.OTHER)             || 0)
  })
  return map
}

/**
 * Build D3 hierarchy for SunburstChart.
 * Returns { name: 'root', children: [{ name: 'Stage N', children: [{ name: 'Yes'|'No', value }] }] }
 */
export function aggregateSunburstData(data) {
  // map: stage → { Yes: count, No: count }
  const map = {}
  data.forEach((row) => {
    const stage = row.DETECTION_METHOD
    const best  = row.BEST_DETECTION_METHOD === 'Yes' ? 'Yes' : 'No'
    const count = Number(row.COUNT) || 0
    if (!map[stage]) map[stage] = { Yes: 0, No: 0 }
    map[stage][best] += count
  })

  const children = Object.entries(map)
    .filter(([, v]) => v.Yes + v.No > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([stage, v]) => ({
      name: stage,
      children: [
        { name: 'Yes', value: v.Yes },
        { name: 'No',  value: v.No  },
      ],
    }))

  return { name: 'root', children }
}
```

- [ ] **Step 2: Verify no syntax error**

```bash
cd /home/d0/projects/COS30045-Data-Vis-Group4 && node --input-type=module <<'EOF'
import { aggregateHeatmapData, aggregateRadarData, aggregateSunburstData } from './src/data/dataUtils.js'
console.log('exports ok:', typeof aggregateHeatmapData, typeof aggregateRadarData, typeof aggregateSunburstData)
EOF
```

Expected: `exports ok: function function function`

- [ ] **Step 3: Commit**

```bash
git add src/data/dataUtils.js
git commit -m "feat: add heatmap, radar, sunburst aggregation functions"
```

---

## Task 2: HeatmapChart.jsx

**Files:**
- Create: `src/charts/HeatmapChart.jsx`

The chart renders a jurisdiction × outcomes grid. Rows dim to 40% opacity when another row is selected. Clicking toggles the jurisdiction in `filters.jurisdictions`.

- [ ] **Step 1: Create the file**

```jsx
// src/charts/HeatmapChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../store/useStore'

const METRICS  = ['Fines', 'Charges', 'Arrests']
const DATA_KEY = { Fines: 'fines', Charges: 'charges', Arrests: 'arrests' }
const MARGIN   = { top: 32, right: 24, bottom: 16, left: 56 }

/**
 * HeatmapChart — jurisdiction × outcome grid.
 * @param {{ data: Array<{ jurisdiction: string, fines: number, charges: number, arrests: number }> }} props
 */
function HeatmapChart({ data = [] }) {
  const containerRef = useRef(null)
  const svgRef       = useRef(null)
  const [dims, setDims] = useState({ width: 0, height: 0 })
  const { filters, setFilter } = useStore()

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDims({ width, height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // D3 render
  useEffect(() => {
    const { width, height } = dims
    if (!data.length || width === 0 || height === 0) return

    const innerW = width  - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top  - MARGIN.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const jurisdictions = data.map((d) => d.jurisdiction)

    const xScale = d3.scaleBand().domain(METRICS).range([0, innerW]).padding(0.1)
    const yScale = d3.scaleBand().domain(jurisdictions).range([0, innerH]).padding(0.12)

    // Per-column color scales
    const colorScales = {}
    METRICS.forEach((m) => {
      const key = DATA_KEY[m]
      const ext = d3.extent(data, (d) => d[key])
      colorScales[m] = d3.scaleSequential()
        .domain(ext[0] === ext[1] ? [0, ext[1] || 1] : ext)
        .interpolator(d3.interpolateRgb('#EDDDEC', '#61196E'))
    })

    // X axis labels
    g.append('g')
      .call(d3.axisTop(xScale).tickSize(0))
      .call((ax) => ax.select('.domain').remove())
      .selectAll('text')
      .style('font-size', '0.75rem')
      .style('font-family', 'Inter, sans-serif')
      .style('fill', '#6B7280')
      .style('font-weight', '600')

    // Y axis labels
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

    // Cell rows
    data.forEach((row) => {
      const isSelected = selectedJurs.includes(row.jurisdiction)
      const rowOpacity = hasSelection ? (isSelected ? 1 : 0.4) : 1

      METRICS.forEach((m) => {
        const val = row[DATA_KEY[m]]
        const x   = xScale(m)
        const y   = yScale(row.jurisdiction)
        const w   = xScale.bandwidth()
        const h   = yScale.bandwidth()

        // Cell rect
        g.append('rect')
          .attr('x', x).attr('y', y).attr('width', w).attr('height', h)
          .attr('rx', 6).attr('ry', 6)
          .attr('fill', colorScales[m](val))
          .attr('opacity', rowOpacity)
          .style('cursor', 'pointer')
          .on('mouseover', (event) => {
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

        // Value label inside cell
        const textColor = val > (d3.extent(data, (d) => d[DATA_KEY[m]])[1] * 0.6) ? '#fff' : '#1F2937'
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
```

- [ ] **Step 2: Commit**

```bash
git add src/charts/HeatmapChart.jsx
git commit -m "feat: add HeatmapChart D3 component"
```

---

## Task 3: RadarChart.jsx

**Files:**
- Create: `src/charts/RadarChart.jsx`

Shows drug types as axes. Renders one polygon per jurisdiction in `filters.jurisdictions` (or a single "All" aggregate if no filter). Click a legend label to toggle that jurisdiction in the filter.

- [ ] **Step 1: Create the file**

```jsx
// src/charts/RadarChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../store/useStore'
import { JURISDICTIONS_LIST } from '../data/mockData'

const AXES = ['Amphetamine', 'Cannabis', 'Cocaine', 'Ecstasy', 'Methylamphetamine', 'Other']
const AXIS_KEY = {
  Amphetamine: 'amphetamine', Cannabis: 'cannabis', Cocaine: 'cocaine',
  Ecstasy: 'ecstasy', Methylamphetamine: 'methylamphetamine', Other: 'other',
}
const JUR_COLORS = ['#61196E', '#E99E1C', '#7658B2', '#BF6BA1', '#852501', '#A48ECA', '#10B981']

/**
 * RadarChart — drug type composition per jurisdiction.
 * @param {{ data: Record<string, { amphetamine, cannabis, cocaine, ecstasy, methylamphetamine, other }> }} props
 */
function RadarChart({ data = {} }) {
  const containerRef = useRef(null)
  const svgRef       = useRef(null)
  const [width, setWidth] = useState(0)
  const { filters, setFilter } = useStore()

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!Object.keys(data).length || width === 0) return

    const size    = Math.min(width, 320)
    const radius  = size / 2 - 48          // leave room for labels
    const cx      = size / 2
    const cy      = size / 2
    const numAxes = AXES.length
    const angleOf = (i) => (i * 2 * Math.PI) / numAxes - Math.PI / 2

    // Determine which jurisdictions to draw
    const selectedJurs = filters.jurisdictions.length > 0
      ? filters.jurisdictions.filter((j) => data[j])
      : null  // null = aggregate mode

    // Build datasets: either selected jurs or a single aggregate
    let datasets
    if (selectedJurs && selectedJurs.length > 0) {
      datasets = selectedJurs.map((j, i) => ({ label: j, values: data[j], color: JUR_COLORS[i % JUR_COLORS.length] }))
    } else {
      // Aggregate all jurisdictions
      const agg = { amphetamine: 0, cannabis: 0, cocaine: 0, ecstasy: 0, methylamphetamine: 0, other: 0 }
      Object.values(data).forEach((jur) => {
        Object.keys(agg).forEach((k) => { agg[k] += jur[k] || 0 })
      })
      datasets = [{ label: 'All', values: agg, color: '#61196E' }]
    }

    // Max value across all visible datasets (per axis)
    const maxVal = d3.max(
      datasets.flatMap((ds) => AXES.map((ax) => ds.values[AXIS_KEY[ax]] || 0))
    ) || 1

    const rScale = d3.scaleLinear().domain([0, maxVal]).range([0, radius])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', size).attr('height', size)

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)

    // Concentric rings
    [0.2, 0.4, 0.6, 0.8, 1].forEach((pct) => {
      g.append('circle')
        .attr('r', radius * pct)
        .attr('fill', 'none')
        .attr('stroke', '#F3F4F6')
        .attr('stroke-width', 1)
    })

    // Axis lines + labels
    AXES.forEach((axis, i) => {
      const angle = angleOf(i)
      const x2 = Math.cos(angle) * radius
      const y2 = Math.sin(angle) * radius
      const lx = Math.cos(angle) * (radius + 22)
      const ly = Math.sin(angle) * (radius + 22)

      g.append('line')
        .attr('x1', 0).attr('y1', 0).attr('x2', x2).attr('y2', y2)
        .attr('stroke', '#EDDDEC').attr('stroke-width', 1)

      const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle'
        : Math.cos(angle) > 0 ? 'start' : 'end'

      g.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('dy', '0.35em')
        .attr('text-anchor', anchor)
        .style('font-size', '0.65rem')
        .style('font-family', 'Inter, sans-serif')
        .style('fill', '#6B7280')
        .text(axis)
    })

    // Polygons
    datasets.forEach((ds) => {
      const points = AXES.map((ax, i) => {
        const val   = ds.values[AXIS_KEY[ax]] || 0
        const r     = rScale(val)
        const angle = angleOf(i)
        return [Math.cos(angle) * r, Math.sin(angle) * r]
      })
      const pointsStr = points.map((p) => p.join(',')).join(' ')

      // Fill
      g.append('polygon')
        .attr('points', pointsStr)
        .attr('fill', ds.color)
        .attr('fill-opacity', 0.15)
        .attr('stroke', ds.color)
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.85)
    })
  }, [data, width, filters.jurisdictions])

  // Legend with click-to-filter
  const selectedJurs = filters.jurisdictions
  const hasData = Object.keys(data).length > 0

  const handleLegendClick = (jur) => {
    if (selectedJurs.includes(jur)) {
      setFilter('jurisdictions', selectedJurs.filter((j) => j !== jur))
    } else {
      setFilter('jurisdictions', [...selectedJurs, jur])
    }
  }

  if (!hasData) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          No data
        </Typography>
      </Box>
    )
  }

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      {/* Legend — click to toggle jurisdictions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {JURISDICTIONS_LIST.filter((j) => data[j]).map((jur, i) => {
          const isSelected = selectedJurs.includes(jur)
          const hasAnySelected = selectedJurs.length > 0
          return (
            <Box
              key={jur}
              onClick={() => handleLegendClick(jur)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.5,
                cursor: 'pointer', borderRadius: '6px',
                px: 1, py: 0.3,
                bgcolor: isSelected ? '#FAF7FF' : 'transparent',
                border: isSelected ? '1px solid #EDDDEC' : '1px solid transparent',
                opacity: hasAnySelected && !isSelected ? 0.45 : 1,
                transition: 'all 0.15s',
                '&:hover': { bgcolor: '#FAF7FF' },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: JUR_COLORS[i % JUR_COLORS.length] }} />
              <Typography sx={{ fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', color: '#1F2937', fontWeight: isSelected ? 700 : 400 }}>
                {jur}
              </Typography>
            </Box>
          )
        })}
      </Box>
      {/* SVG */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} />
      </Box>
    </Box>
  )
}

export default RadarChart
```

- [ ] **Step 2: Commit**

```bash
git add src/charts/RadarChart.jsx
git commit -m "feat: add RadarChart D3 component"
```

---

## Task 4: SunburstChart.jsx

**Files:**
- Create: `src/charts/SunburstChart.jsx`

Two-level partition: Stage 1/2/3 (Level 1) → Yes/No best detection (Level 2). Click a Stage arc toggles `filters.stage`.

- [ ] **Step 1: Create the file**

```jsx
// src/charts/SunburstChart.jsx
import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Box, Typography } from '@mui/material'
import { useStore } from '../store/useStore'

const STAGE_COLORS = { 'Stage 1': '#61196E', 'Stage 2': '#A48ECA', 'Stage 3': '#E99E1C' }

/**
 * SunburstChart — detection stage × best detection method.
 * @param {{ data: { name: string, children: Array } }} props  — D3 hierarchy tree
 */
function SunburstChart({ data }) {
  const containerRef = useRef(null)
  const svgRef       = useRef(null)
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

    const size   = Math.min(width, 280)
    const radius = size / 2
    const cx     = size / 2
    const cy     = size / 2

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
      .innerRadius((d) => d.y0 + (d.depth === 0 ? 0 : 8))
      .outerRadius((d) => d.y1 - 2)

    // Mix hex color with white: amount=0 → original, amount=1 → white
    const tintColor = (hex, amount) => {
      const c = d3.rgb(hex)
      return d3.rgb(
        Math.round(c.r + (255 - c.r) * amount),
        Math.round(c.g + (255 - c.g) * amount),
        Math.round(c.b + (255 - c.b) * amount)
      ).formatHex()
    }

    const getColor = (d) => {
      if (d.depth === 0) return 'transparent'
      const stageHex = STAGE_COLORS[d.depth === 1 ? d.data.name : d.parent.data.name] || '#A48ECA'
      if (d.depth === 1) return stageHex
      // Level 2: "Yes" = 35% white tint, "No" = 65% white tint
      return d.data.name === 'Yes' ? tintColor(stageHex, 0.35) : tintColor(stageHex, 0.65)
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', size).attr('height', size)

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)

    const tooltip = d3.select(containerRef.current).select('.chart-tooltip')
    const total   = root.value || 1

    g.selectAll('path')
      .data(root.descendants().filter((d) => d.depth > 0))
      .join('path')
      .attr('d', arc)
      .attr('fill', getColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('opacity', (d) => {
        if (d.depth === 1 && filters.stage !== null) {
          return d.data.name === filters.stage ? 1 : 0.4
        }
        return 1
      })
      .style('cursor', (d) => d.depth === 1 ? 'pointer' : 'default')
      .on('mouseover', (event, d) => {
        const pct = ((d.value / total) * 100).toFixed(1)
        const label = d.depth === 1 ? d.data.name : `${d.parent.data.name} → ${d.data.name}`
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
        const stage = d.data.name
        setFilter('stage', filters.stage === stage ? null : stage)
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
      {/* Stage legend */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
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
              <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: color }} />
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
```

- [ ] **Step 2: Commit**

```bash
git add src/charts/SunburstChart.jsx
git commit -m "feat: add SunburstChart D3 component"
```

---

## Task 5: CSS Grid Layout

**Files:**
- Create: `src/styles/jurisdiction.css`

- [ ] **Step 1: Create the file**

```css
/* src/styles/jurisdiction.css */
.jurisdiction-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  height: calc(100vh - 180px);
  min-height: 540px;
}

.jur-heatmap  { grid-area: 1 / 1 / 11 / 5; }
.jur-radar    { grid-area: 1 / 5 / 6  / 11; }
.jur-sunburst { grid-area: 6 / 5 / 11 / 11; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/jurisdiction.css
git commit -m "feat: add jurisdiction page CSS grid layout"
```

---

## Task 6: JurisdictionAnalysis Page

**Files:**
- Create: `src/pages/JurisdictionAnalysis.jsx`

- [ ] **Step 1: Create the file**

```jsx
// src/pages/JurisdictionAnalysis.jsx
import { Box, Paper, Typography } from '@mui/material'
import { useStore } from '../store/useStore'
import FilterBar from '../components/FilterBar'
import HeatmapChart from '../charts/HeatmapChart'
import RadarChart from '../charts/RadarChart'
import SunburstChart from '../charts/SunburstChart'
import {
  aggregateHeatmapData,
  aggregateRadarData,
  aggregateSunburstData,
} from '../data/dataUtils'
import '../styles/jurisdiction.css'

const CARD_SX = {
  borderRadius: '16px',
  p: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const TITLE_SX = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: '#61196E',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  mb: 1.5,
  fontFamily: 'Inter, sans-serif',
}

function JurisdictionAnalysis() {
  const { filteredData } = useStore()

  const heatmapData  = aggregateHeatmapData(filteredData)
  const radarData    = aggregateRadarData(filteredData)
  const sunburstData = aggregateSunburstData(filteredData)

  return (
    <Box sx={{ px: 3, pt: 3, pb: 2 }}>
      <FilterBar />

      <div className="jurisdiction-grid">
        {/* Heatmap */}
        <Paper elevation={0} className="jur-heatmap" sx={{ ...CARD_SX, boxShadow: '0 2px 12px rgba(97,25,110,0.07)', border: '1px solid #EDDDEC' }}>
          <Typography sx={TITLE_SX}>Outcomes by Jurisdiction</Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <HeatmapChart data={heatmapData} />
          </Box>
        </Paper>

        {/* Radar */}
        <Paper elevation={0} className="jur-radar" sx={{ ...CARD_SX, boxShadow: '0 2px 12px rgba(97,25,110,0.07)', border: '1px solid #EDDDEC' }}>
          <Typography sx={TITLE_SX}>Drug Types by Jurisdiction</Typography>
          <RadarChart data={radarData} />
        </Paper>

        {/* Sunburst */}
        <Paper elevation={0} className="jur-sunburst" sx={{ ...CARD_SX, boxShadow: '0 2px 12px rgba(97,25,110,0.07)', border: '1px solid #EDDDEC' }}>
          <Typography sx={TITLE_SX}>Detection Stage × Best Method</Typography>
          <SunburstChart data={sunburstData} />
        </Paper>
      </div>
    </Box>
  )
}

export default JurisdictionAnalysis
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/JurisdictionAnalysis.jsx
git commit -m "feat: add JurisdictionAnalysis page component"
```

---

## Task 7: Routing and Navigation

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Sidebar.jsx`

- [ ] **Step 1: Add route to App.jsx**

In `src/App.jsx`, add import after existing imports:

```jsx
import JurisdictionAnalysis from './pages/JurisdictionAnalysis'
```

And add route inside `<Routes>`:

```jsx
<Route path="/jurisdiction" element={<JurisdictionAnalysis />} />
```

Full updated file:

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Age_Group from './pages/Age_Group'
import Age_Group2 from './pages/Age_Group2'
import JurisdictionAnalysis from './pages/JurisdictionAnalysis'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/insights"     element={<Insights />} />
        <Route path="/about"        element={<About />} />
        <Route path="/age-group"    element={<Age_Group />} />
        <Route path="/age-group2"   element={<Age_Group2 />} />
        <Route path="/jurisdiction" element={<JurisdictionAnalysis />} />
      </Routes>
    </Layout>
  )
}

export default App
```

- [ ] **Step 2: Add nav item to Sidebar.jsx**

Add import for the icon:

```jsx
import {
  HomeRounded,
  BarChartRounded,
  InfoRounded,
  MenuRounded,
  CloseRounded,
  ScienceRounded,
  MapRounded,           // ← add this
} from '@mui/icons-material'
```

Update `navItems`:

```jsx
const navItems = [
  { label: 'Home',                  icon: <HomeRounded />,     path: '/' },
  { label: 'Dashboard',             icon: <BarChartRounded />, path: '/dashboard' },
  { label: 'Jurisdiction Analysis', icon: <MapRounded />,      path: '/jurisdiction' },
  { label: 'Insights',              icon: <ScienceRounded />,  path: '/insights' },
  { label: 'About',                 icon: <InfoRounded />,     path: '/about' },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/components/Sidebar.jsx
git commit -m "feat: wire /jurisdiction route and sidebar nav entry"
```

---

## Task 8: Verification

- [ ] **Step 1: Start dev server**

```bash
cd /home/d0/projects/COS30045-Data-Vis-Group4 && npm run dev
```

- [ ] **Step 2: Check checklist**

Navigate to `http://localhost:5173/jurisdiction` and verify:

1. ✅ Page renders without console errors
2. ✅ Heatmap shows 7 rows (jurisdictions) × 3 columns (Fines, Charges, Arrests)
3. ✅ Radar shows spider polygon (aggregate or per selected jurisdiction)
4. ✅ Sunburst shows 3 Stage arcs, each with inner Yes/No arcs
5. ✅ Click a heatmap row → row highlights, others dim, FilterBar chip appears
6. ✅ Click same row again → filter clears, all rows return to full opacity
7. ✅ Click a Sunburst Stage arc → arc highlights, FilterBar stage chip appears
8. ✅ Click same arc → stage filter clears
9. ✅ Click Radar legend item → polygon for that jurisdiction appears; others dim
10. ✅ Resize browser → charts re-render via ResizeObserver
11. ✅ Existing `/dashboard` route still works (no regressions)
