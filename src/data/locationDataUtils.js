// src/data/locationDataUtils.js
// Specialized aggregation functions for the Location dashboard.
// These replace the AgeGroup-specific variants found in dataUtils.js.

import { LOCATIONS_LIST } from './mockData'

/**
 * Aggregate outcomes by month and location group.
 * Used for the LineChart in Location Analysis.
 * Expects { month: '2023-01', 'Inner Regional Australia': 14, ... }
 */
export function aggregateByMonthAndLocationGroup(data) {
  const map = {}

  data.forEach((row) => {
    const key = `${row.YEAR}-${String(row.MONTH).padStart(2, '0')}`
    if (!map[key]) {
      map[key] = { month: key }
      LOCATIONS_LIST.forEach((loc) => {
        map[key][loc] = 0
      })
    }

    const loc = row.LOCATION
    if (LOCATIONS_LIST.includes(loc)) {
      map[key][loc] +=
        (Number(row.CANNABIS) || 0) +
        (Number(row.AMPHETAMINE) || 0) +
        (Number(row.METHYLAMPHETAMINE) || 0) +
        (Number(row.ECSTASY) || 0) +
        (Number(row.COCAINE) || 0) +
        (Number(row.OTHER) || 0) +
        (Number(row.UNKNOWN) || 0)
    }
  })

  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Aggregate outcomes by location group for the DivergingBarChart.
 * Returns [{ locationGroup, fines, arrests, charges }] in defined location order.
 */
export function aggregateByLocationGroup(data) {
  const map = {}
  data.forEach((row) => {
    const key = row.LOCATION
    if (!map[key]) map[key] = { locationGroup: key, fines: 0, arrests: 0, charges: 0 }
    map[key].fines += (Number(row.FINES) || 0)
    map[key].arrests += (Number(row.ARRESTS) || 0)
    map[key].charges += (Number(row.CHARGES) || 0)
  })

  // Ensure output is strictly ordered to UI specs
  return LOCATIONS_LIST
    .filter((k) => map[k])
    .map((k) => map[k])
}
