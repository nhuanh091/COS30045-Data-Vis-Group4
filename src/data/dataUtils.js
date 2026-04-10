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
    result = result.filter((d) =>
      filters.jurisdictions.includes(d.JURISDICTION)
    )
  }

  if (filters.year !== null && filters.year !== undefined) {
    result = result.filter((d) => Number(d.YEAR) === filters.year)
  }

  if (filters.month !== null && filters.month !== undefined) {
    result = result.filter((d) => Number(d.MONTH) === filters.month)
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
    const key = `${row.YEAR}-${String(row.MONTH).padStart(2, '0')}`

    if (!map[key]) {
      map[key] = { month: key, totalTests: 0, positives: 0 }
    }

    map[key].totalTests += (Number(row.COUNT) || 0)

    map[key].positives +=
      (Number(row.CANNABIS) || 0) +
      (Number(row.AMPHETAMINE) || 0) +
      (Number(row.METHYLAMPHETAMINE) || 0) +
      (Number(row.ECSTASY) || 0) +
      (Number(row.COCAINE) || 0) +
      (Number(row.OTHER) || 0) +
      (Number(row.UNKNOWN) || 0)
  })

  return Object.values(map).sort((a, b) =>
    a.month.localeCompare(b.month)
  )
}

// src/data/dataUtils.js

/**
 * Updated to use YYYY-MM format for consistency with aggregateByMonth.
 */
export function aggregateByMonthAndAgeGroup(data) {
  const monthMap = {}

  data.forEach((row) => {
    const monthKey = `${row.YEAR}-${String(row.MONTH).padStart(2, '0')}`
    const ageGroup = row.AGE_GROUP || 'Unknown'
    const positives = (Number(row.CANNABIS) || 0) +
                      (Number(row.AMPHETAMINE) || 0) +
                      (Number(row.METHYLAMPHETAMINE) || 0) +
                      (Number(row.ECSTASY) || 0) +
                      (Number(row.COCAINE) || 0) +
                      (Number(row.OTHER) || 0) +
                      (Number(row.UNKNOWN) || 0)

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { month: monthKey }
    }
    
    // Sum positives for this age group in this month
    monthMap[monthKey][ageGroup] = (monthMap[monthKey][ageGroup] || 0) + positives
  })

  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month))
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
    totals.Cannabis          += (Number(row.CANNABIS) || 0)
    totals.Amphetamine       += (Number(row.AMPHETAMINE) || 0)
    totals.Methylamphetamine += (Number(row.METHYLAMPHETAMINE) || 0)
    totals.Ecstasy           += (Number(row.ECSTASY) || 0)
    totals.Cocaine           += (Number(row.COCAINE) || 0)
    totals.Other             += (Number(row.OTHER) || 0)
    totals.Unknown           += (Number(row.UNKNOWN) || 0)
  })
  return Object.entries(totals)
    .map(([label, value]) => ({ label, value: Number(value) || 0 }))
    .filter((d) => d.value > 0 && !isNaN(d.value))
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
    map[key].value += (Number(row.COUNT) || 0)
  })
  return Object.values(map)
    .filter((d) => d.value > 0 && !isNaN(d.value))
    .sort((a, b) => b.value - a.value)
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
      (Number(row.CANNABIS) || 0) + (Number(row.AMPHETAMINE) || 0) + (Number(row.METHYLAMPHETAMINE) || 0) +
      (Number(row.ECSTASY) || 0) + (Number(row.COCAINE) || 0) + (Number(row.OTHER) || 0) + (Number(row.UNKNOWN) || 0)
  })
  return Object.values(map).sort((a, b) => b.positives - a.positives)
}

/**
 * Aggregate outcomes by age group for GroupedBarChart.
 * Returns [{ ageGroup, fines, arrests, charges }] in age order.
 */
/**
 * Aggregate by age group with outcomes (fines, arrests, charges).
 * Returns [{ ageGroup, fines, arrests, charges }] in age order.
 */
export function aggregateByAgeGroup(data) {
  const order = ['0-16', '17-25', '26-39', '40-64', '65+']
  const map = {}
  data.forEach((row) => {
    const key = row.AGE_GROUP
    if (!map[key]) map[key] = { ageGroup: key, fines: 0, arrests: 0, charges: 0 }
    map[key].fines   += (Number(row.FINES) || 0)
    map[key].arrests += (Number(row.ARRESTS) || 0)
    map[key].charges += (Number(row.CHARGES) || 0)
  })
  return order
    .filter((k) => map[k])
    .map((k) => map[k])
}

/**
 * Aggregate detection methods with best detection flag stacking.
 * Returns [{ detectionMethod, best: number, notBest: number }] sorted desc by total.
 */
export function aggregateByDetectionMethodWithBest(data) {
  const map = {}
  data.forEach((row) => {
    const key = row.DETECTION_METHOD
    const isBest = row.BEST_DETECTION_METHOD === 'Yes' ? 1 : 0
    if (!map[key]) map[key] = { detectionMethod: key, best: 0, notBest: 0 }
    if (isBest) {
      map[key].best += (Number(row.COUNT) || 0)
    } else {
      map[key].notBest += (Number(row.COUNT) || 0)
    }
  })
  return Object.values(map)
    .filter((d) => d.best + d.notBest > 0)
    .sort((a, b) => (b.best + b.notBest) - (a.best + a.notBest))
}

/**
 * Compute top-level KPI values from filtered data.
 */
export function computeKPIs(data) {
  let totalTests = 0, fines = 0, arrests = 0, charges = 0, noDrugsDetected = 0
  let positives = 0
  data.forEach((row) => {
    totalTests      += (Number(row.COUNT) || 0)
    fines           += (Number(row.FINES) || 0)
    arrests         += (Number(row.ARRESTS) || 0)
    charges         += (Number(row.CHARGES) || 0)
    noDrugsDetected += (Number(row.NO_DRUGS_DETECTED) || 0)
    positives       += (Number(row.CANNABIS) || 0) + (Number(row.AMPHETAMINE) || 0) + (Number(row.METHYLAMPHETAMINE) || 0) +
                       (Number(row.ECSTASY) || 0) + (Number(row.COCAINE) || 0) + (Number(row.OTHER) || 0) + (Number(row.UNKNOWN) || 0)
  })
  const positiveRate = totalTests > 0 ? (positives / totalTests) * 100 : 0
  return { totalTests, positiveRate, fines, arrests, charges, noDrugsDetected, positives }
}

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

/**
 * Aggregate monthly tests and positive results for LineBarChart.
 * Returns [{ month: "2023-01", totalTests: number, positives: number }] sorted chronologically.
 */
export function aggregateMonthlyStatistics(data) {
  const map = {}
  data.forEach((row) => {
    const monthKey = `${row.YEAR}-${String(row.MONTH).padStart(2, '0')}`
    if (!map[monthKey]) {
      map[monthKey] = { month: monthKey, totalTests: 0, positives: 0, fines: 0, arrests: 0, charges: 0 }
    }
    map[monthKey].totalTests  += (Number(row.TESTS_CONDUCTED) || 0)
    map[monthKey].positives   += (Number(row.POSITIVE_RESULTS) || 0)
    map[monthKey].fines       += (Number(row.FINES) || 0)
    map[monthKey].arrests     += (Number(row.ARRESTS) || 0)
    map[monthKey].charges     += (Number(row.CHARGES) || 0)
  })
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Compute KPI values from drug statistics data.
 * Returns { totalTests, positiveTests, positiveRate, fines, arrests, charges }
 */
export function computeStatisticsKPIs(data) {
  let totalTests = 0, positiveTests = 0, fines = 0, arrests = 0, charges = 0
  data.forEach((row) => {
    totalTests     += (Number(row.TESTS_CONDUCTED) || 0)
    positiveTests  += (Number(row.POSITIVE_RESULTS) || 0)
    fines          += (Number(row.FINES) || 0)
    arrests        += (Number(row.ARRESTS) || 0)
    charges        += (Number(row.CHARGES) || 0)
  })
  const positiveRate = totalTests > 0 ? (positiveTests / totalTests) * 100 : 0
  return { totalTests, positiveTests, positiveRate, fines, arrests, charges }
}
