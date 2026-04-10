# BITRE Drug Driving Analytics Dashboard

Interactive web dashboard for exploring Australian roadside drug testing data (2023-2024), sourced from BITRE (Bureau of Infrastructure and Transport Research Economics). Built for COS30045 Data Visualisation.

## Overview

In 2023, BITRE restructured its data collection for roadside drug enforcement across Australia. This project transforms those complex records into actionable visual insights, enabling exploration of testing trends across jurisdictions, demographics, geographic regions, and drug types.

### What you can explore

- **Jurisdiction trends** -- testing volumes, positive detection rates, and enforcement outcomes across NSW, VIC, QLD, WA, SA, TAS, and ACT
- **Age group analysis** -- demographic breakdowns (0-16, 17-25, 26-39, 40-64, 65+) with detection patterns and enforcement comparisons
- **Location analysis** -- geographic patterns across Major Cities, Inner Regional, Outer Regional, and Remote Australia
- **Drug types** -- distribution of Cannabis, Amphetamine, Methylamphetamine, Ecstasy, Cocaine, and other substances
- **Detection stages** -- three-stage oral fluid and lab testing pipeline

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Visualisation | D3.js 7 |
| Components | Material-UI 6 |
| State | Zustand 4 |
| Routing | React Router 6 |
| Styling | Emotion (CSS-in-JS) + CSS Custom Properties |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Other scripts

```bash
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Project Structure

```
src/
+-- main.jsx                  # Entry point (React + Router + MUI Theme)
+-- App.jsx                   # Route definitions
+-- pages/
|   +-- Home.jsx              # Landing page with hero, dashboard cards, insights
|   +-- JurisdictionAnalysis  # Jurisdiction overview (heatmap, sunburst, radar)
|   +-- AgeGroup.jsx          # Demographic analysis dashboard
|   +-- Location.jsx          # Geographic analysis dashboard
|   +-- Insights.jsx          # Key findings summary
|   +-- About.jsx             # Project info, team, tech stack
+-- charts/
|   +-- Overview/             # LineBarChart, HeatmapChart, RadarChart, SunburstChart
|   +-- AgeGroup/             # LineChart, DonutChart, DivergingBarChart, StackedBarChart
|   +-- Location/             # LineChart, DonutChart, DivergingBarChart, StackedBarChart
+-- components/
|   +-- Layout.jsx            # Sidebar + main content wrapper
|   +-- Sidebar.jsx           # Navigation (desktop + mobile drawer)
|   +-- FilterBar.jsx         # Configurable filter controls
|   +-- KPICard.jsx           # Metric display cards
|   +-- InsightsBox.jsx       # Reusable findings container
+-- store/
|   +-- useStore.js           # Zustand store (filters, raw/filtered data)
+-- data/
|   +-- dataUtils.js          # Aggregation and transformation functions
|   +-- locationDataUtils.js  # Location-specific aggregations
|   +-- mockData.js           # Filter option constants
+-- styles/
|   +-- theme.js              # MUI theme (palette, typography, components)
|   +-- tokens.css            # CSS design tokens
|   +-- index.css             # Global styles
public/
+-- data/
    +-- positive_drug_cleaned.csv           # Main dataset (7,337 rows)
    +-- location_positive_drug_cleaned.csv  # Location-focused dataset (6,187 rows)
    +-- drug_statistics.csv                 # Aggregated KPI statistics (131 rows)
```

## Data Sources

All data is loaded from static CSV files in `public/data/` via D3's `d3.csv()`. No backend API is required.

| File | Rows | Purpose |
|---|---|---|
| `positive_drug_cleaned.csv` | 7,337 | Granular records by jurisdiction, month, age, location, detection stage |
| `location_positive_drug_cleaned.csv` | 6,187 | Location-specific analysis |
| `drug_statistics.csv` | 131 | Aggregated test counts for KPI calculations |

Key columns include: `YEAR`, `MONTH`, `JURISDICTION`, `LOCATION`, `AGE_GROUP`, `DETECTION_METHOD`, drug type flags (`CANNABIS`, `AMPHETAMINE`, etc.), and enforcement outcomes (`FINES`, `ARRESTS`, `CHARGES`).

## Features

**Interactive filtering** -- multi-select jurisdictions, year, month, detection stage, age group, and location remoteness. Filters propagate across all charts in real time via Zustand.

**D3.js visualisations** -- line charts, heatmaps, diverging bar charts, stacked bar charts, donut charts, sunburst charts, radar charts, and combined line-bar charts. All charts are responsive via ResizeObserver.

**KPI cards** -- total tests, positive detection rate, and positive count with formatted numerals.

**Responsive layout** -- desktop sidebar collapses to a mobile drawer. Grid layouts adapt across breakpoints.

## Design System

- **Primary palette**: Deep Purple `#61196E`, Royal Purple `#7658B2`, African Violet `#A48ECA`
- **Accent**: Gamboge `#E99E1C`
- **Typography**: DM Serif Display (headings), Inter (body)
- **Border radius**: 16-32px depending on surface level

## Deployment

The production build (`npm run build`) outputs static files to `dist/`. Deploy to any static hosting provider -- Netlify, Vercel, GitHub Pages, AWS S3, etc.

## Team -- Group 4

| Name | Role |
|---|---|
| Nhu Anh | Leader |
| Nam Anh | Team Member |
| Tung Duong | Team Member |
