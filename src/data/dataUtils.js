// src/data/dataUtils.js
// All functions are pure — they take data arrays and return new arrays.
// No D3 imports — plain JS only.

/**
 * Apply user-selected filters to the raw dataset.
 * Called by useStore.setFilter and useStore.resetFilters.
 */
export function applyFilters(data, filters) {
  let result = data
  if (filters.jurisdictions && filters.jurisdictions.length > 0) {
    result = result.filter((d) => filters.jurisdictions.includes(d.JURISDICTION))
  }
  if (filters.year !== null && filters.year !== undefined) {
    result = result.filter((d) => d.YEAR === filters.year)
  }
  if (filters.month !== null && filters.month !== undefined) {
    result = result.filter(
      (d) => parseInt(d.START_DATE.slice(5, 7), 10) === filters.month
    )
  }
  if (filters.stage !== null && filters.stage !== undefined) {
    result = result.filter((d) => d.DETECTION_METHOD === filters.stage)
  }
  return result
}

/**
 * Aggregate filtered data into monthly buckets for LineBarChart.
 * Returns rows sorted chronologically.
 */
export function aggregateByMonth(data) {
  const map = {}
  data.forEach((row) => {
    const key = row.START_DATE.slice(0, 7) // "2023-01"
    if (!map[key]) {
      map[key] = { month: key, totalTests: 0, positives: 0 }
    }
    map[key].totalTests += row.COUNT
    map[key].positives +=
      row.CANNABIS + row.AMPHETAMINE + row.METHYLAMPHETAMINE +
      row.ECSTASY + row.COCAINE + row.OTHER + row.UNKNOWN
  })
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Aggregate drug type totals for DonutChart.
 * Returns [{ label, value }] sorted descending by value.
 */
export function aggregateByDrugType(data) {
  const totals = {
    Cannabis:          0,
    Amphetamine:       0,
    Methylamphetamine: 0,
    Ecstasy:           0,
    Cocaine:           0,
    Other:             0,
    Unknown:           0,
  }
  data.forEach((row) => {
    totals.Cannabis          += row.CANNABIS
    totals.Amphetamine       += row.AMPHETAMINE
    totals.Methylamphetamine += row.METHYLAMPHETAMINE
    totals.Ecstasy           += row.ECSTASY
    totals.Cocaine           += row.COCAINE
    totals.Other             += row.OTHER
    totals.Unknown           += row.UNKNOWN
  })
  return Object.entries(totals)
    .map(([label, value]) => ({ label, value }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
}

/**
 * Aggregate detection stage totals for DonutChart.
 * Returns [{ label, value }].
 */
export function aggregateByDetectionMethod(data) {
  const map = {}
  data.forEach((row) => {
    const key = row.DETECTION_METHOD
    if (!map[key]) map[key] = { label: key, value: 0 }
    map[key].value += row.COUNT
  })
  return Object.values(map).sort((a, b) => b.value - a.value)
}

/**
 * Aggregate positive test counts by jurisdiction for BarChart.
 * Returns [{ jurisdiction, positives }] sorted descending.
 */
export function aggregateByJurisdiction(data) {
  const map = {}
  data.forEach((row) => {
    if (!map[row.JURISDICTION]) {
      map[row.JURISDICTION] = { jurisdiction: row.JURISDICTION, positives: 0 }
    }
    map[row.JURISDICTION].positives +=
      row.CANNABIS + row.AMPHETAMINE + row.METHYLAMPHETAMINE +
      row.ECSTASY + row.COCAINE + row.OTHER + row.UNKNOWN
  })
  return Object.values(map).sort((a, b) => b.positives - a.positives)
}

/**
 * Aggregate outcomes by age group for GroupedBarChart.
 * Returns [{ ageGroup, fines, arrests, charges }] in age order.
 */
export function aggregateByAgeGroup(data) {
  const order = ['0-16', '17-25', '26-39', '40-64', '65+']
  const map = {}
  data.forEach((row) => {
    const key = row.AGE_GROUP
    if (!map[key]) map[key] = { ageGroup: key, fines: 0, arrests: 0, charges: 0 }
    map[key].fines   += row.FINES
    map[key].arrests += row.ARRESTS
    map[key].charges += row.CHARGES
  })
  return order
    .filter((k) => map[k])
    .map((k) => map[k])
}

/**
 * Compute top-level KPI values from filtered data.
 */
export function computeKPIs(data) {
  let totalTests = 0, fines = 0, arrests = 0, charges = 0, noDrugsDetected = 0
  let positives = 0
  data.forEach((row) => {
    totalTests      += row.COUNT
    fines           += row.FINES
    arrests         += row.ARRESTS
    charges         += row.CHARGES
    noDrugsDetected += row.NO_DRUGS_DETECTED
    positives       += row.CANNABIS + row.AMPHETAMINE + row.METHYLAMPHETAMINE +
                       row.ECSTASY + row.COCAINE + row.OTHER + row.UNKNOWN
  })
  const positiveRate = totalTests > 0 ? (positives / totalTests) * 100 : 0
  return { totalTests, positiveRate, fines, arrests, charges, noDrugsDetected, positives }
}
