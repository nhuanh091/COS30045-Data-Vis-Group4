# Jurisdiction Analysis Dashboard — Design Spec

**Date:** 2026-04-09  
**Route:** `/jurisdiction`  
**Nav label:** Jurisdiction Analysis  
**Purpose:** Compare enforcement outcomes (Fines/Charges/Arrests), drug type profiles, and detection method effectiveness across Australian jurisdictions.

---

## Layout

CSS Grid, left-right split — mirrors `src/styles/age_group.css`.

```
┌──────────────────────────────────────────────────┐
│ FilterBar (sticky)                               │
├──────────────────────┬───────────────────────────┤
│                      │                           │
│     HEATMAP          │       RADAR CHART         │
│  Jurisdiction ×      │    Drug Types by Jur.     │
│  Fines/Charges/      │                           │
│  Arrests             ├───────────────────────────┤
│                      │                           │
│                      │     SUNBURST CHART        │
│                      │  Detection Stage → Best   │
└──────────────────────┴───────────────────────────┘
```

---

## Components

### `src/pages/JurisdictionAnalysis.jsx`

Page component. Reads `filteredData` from Zustand store. Passes pre-aggregated data to chart components. Owns no local state except chart `activeFilter` delegation (charts own their own).

### `src/charts/HeatmapChart.jsx`

**Purpose:** Show Fines, Charges, Arrests per jurisdiction as a color-coded grid.

**Props:**
```ts
{ data: Array<{ jurisdiction: string, fines: number, charges: number, arrests: number }> }
```

**D3 approach:**
- `scaleBand` for X (outcomes) and Y (jurisdictions)
- `scaleSequential` with `interpolateRgb('#EDDDEC', '#61196E')` — normalized **per column** so each metric's range fills the full scale independently
- SVG `rect` per cell, `text` for values
- Hover: absolute MUI `Box` tooltip (same pattern as existing charts)
- Click: toggle jurisdiction filter (see Interaction section)

### `src/charts/RadarChart.jsx`

**Purpose:** Show drug type composition per jurisdiction as overlaid spider polygons.

**Props:**
```ts
{
  data: Record<string, { amphetamine: number, cannabis: number, cocaine: number, ecstasy: number, methylamphetamine: number, other: number }>,
  selectedJurisdictions: string[]
}
```

**D3 approach:**
- Axes: 6 drug types, evenly spaced around center (360/6 = 60°)
- Concentric rings at 20/40/60/80/100% of max value (across all jurisdictions in view)
- No filter active → render single "All" polygon (aggregate)
- Filter active → render one polygon per selected jurisdiction
- Colors: `['#61196E', '#E99E1C', '#7658B2', '#BF6BA1', '#852501', '#A48ECA']` (max 6 jurisdictions in Australia)
- Polygon fill at 20% opacity, stroke at full opacity
- Axis labels are clickable → toggle jurisdiction filter
- Legend: one chip per jurisdiction (colored dot + label)

### `src/charts/SunburstChart.jsx`

**Purpose:** Show how tests are distributed by detection stage and whether each stage produced the best detection.

**Props:**
```ts
{ data: { name: string, children: Array<{ name: string, children: Array<{ name: string, value: number }> }> } }
```

**Hierarchy:**
```
root (total tests)
├── Stage 1
│   ├── Best Detection: Yes (count)
│   └── Best Detection: No  (count)
├── Stage 2
│   ├── Best Detection: Yes (count)
│   └── Best Detection: No  (count)
└── Stage 3
    ├── Best Detection: Yes (count)
    └── Best Detection: No  (count)
```

**D3 approach:**
- `d3.hierarchy()` + `d3.partition()` with `d3.arc()`
- Level 1 colors: Stage 1 → `#61196E`, Stage 2 → `#A48ECA`, Stage 3 → `#E99E1C`
- Level 2 (yes/no): Yes → 80% saturation of parent, No → 40% saturation (desaturated tint)
- Center text: total count
- Click on Level 1 arc → toggle `detectionMethod` filter; click root → clear
- Hover tooltip shows stage + yes/no label + count + percentage

---

## Data Aggregation

Add to `src/data/dataUtils.js`:

```js
// Returns array sorted by jurisdiction name
export function aggregateHeatmapData(data) {
  // Group by JURISDICTION, sum FINES, CHARGES, ARRESTS
  // Returns: [{ jurisdiction, fines, charges, arrests }]
}

// Returns object keyed by jurisdiction
export function aggregateRadarData(data) {
  // Group by JURISDICTION, sum AMPHETAMINE, CANNABIS, COCAINE, ECSTASY, METHYLAMPHETAMINE, OTHER
  // Returns: { NSW: { amphetamine, cannabis, ... }, VIC: { ... }, ... }
}

// Returns D3 hierarchy-compatible tree
export function aggregateSunburstData(data) {
  // Group by DETECTION_METHOD (Stage 1/2/3) then BEST_DETECTION_METHOD (Yes/No)
  // Returns: { name: 'root', children: [{ name: 'Stage 1', children: [{ name: 'Yes', value }, { name: 'No', value }] }, ...] }
}
```

---

## State Management

### Store changes (`src/store/useStore.js`)

Add `detectionMethod: null` to filters object.

Add `clearFilter(key)` action:
```js
clearFilter: (key) => set(state => ({
  filters: { ...state.filters, [key]: key === 'jurisdictions' ? [] : null },
  // recompute filteredData same as setFilter
}))
```

Alternatively: `setFilter('detectionMethod', null)` can serve as clear if `applyFilters` treats null as "no filter". Check existing behavior — if so, no new action needed.

---

## Click Interaction Pattern

Each chart component owns:
```js
const [activeItem, setActiveItem] = useState(null);
```

On click handler:
```js
const handleClick = (item, filterKey, filterValue) => {
  if (activeItem === item) {
    setActiveItem(null);
    clearFilter(filterKey);           // or setFilter(filterKey, null/[])
  } else {
    setActiveItem(item);
    setFilter(filterKey, filterValue);
  }
};
```

Visual feedback:
- Active: full opacity, slight scale up or stroke highlight
- Others when active: 40% opacity (not hidden, just dimmed)
- No active selection: all at full opacity

---

## Filter Bar

Reuse existing `FilterBar` component. For Detection Method filter, use the `stage` store key (since `DETECTION_METHOD` column values are Stage 1/2/3).

The page's FilterBar exposes: **Year · Month · Jurisdiction · Detection Method**

---

## CSS Layout (`src/styles/jurisdiction.css`)

```css
.jurisdiction-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 16px;
  height: calc(100vh - 120px); /* account for FilterBar */
}

.heatmap-cell  { grid-area: 1 / 1 / 11 / 5; }  /* Left half */
.radar-cell    { grid-area: 1 / 5 / 6  / 11; } /* Top-right */
.sunburst-cell { grid-area: 6 / 5 / 11 / 11; } /* Bottom-right */
```

Each cell: MUI `Paper` card with `borderRadius: 16px`, `p: 2`, same shadow as existing Dashboard cards.

---

## Routing & Navigation

**`src/App.jsx`:**
```jsx
<Route path="/jurisdiction" element={<JurisdictionAnalysis />} />
```

**`src/components/Sidebar.jsx`:**
Add entry after Dashboard:
```js
{ label: 'Jurisdiction Analysis', icon: <MapIcon />, path: '/jurisdiction' }
```
Use `MapOutlined` or `BarChartOutlined` from `@mui/icons-material`.

---

## File Creation Order

1. `src/data/dataUtils.js` — add 3 aggregation functions
2. `src/store/useStore.js` — add `detectionMethod` filter + `clearFilter` action
3. `src/charts/HeatmapChart.jsx`
4. `src/charts/RadarChart.jsx`
5. `src/charts/SunburstChart.jsx`
6. `src/styles/jurisdiction.css`
7. `src/pages/JurisdictionAnalysis.jsx`
8. `src/App.jsx` — route
9. `src/components/Sidebar.jsx` — nav

---

## Verification

1. Run `npm run dev` — page renders at `/jurisdiction`
2. FilterBar filters propagate to all 3 charts
3. Click a jurisdiction in Heatmap → Radar + Sunburst reflect filter
4. Click same jurisdiction again → all charts reset
5. Click a Stage arc in Sunburst → Detection Method filter updates
6. All existing Dashboard routes still work (no regressions)
7. Resize browser → charts re-render via ResizeObserver
