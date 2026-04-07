// src/data/mockData.js

const JURISDICTIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT']
const AGE_GROUPS = ['0-16', '17-25', '26-39', '40-64', '65+']
const DETECTION_METHODS = ['Stage 1', 'Stage 2', 'Stage 3']

// Seeded-ish deterministic values based on index to avoid different data each reload
function pseudoRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function between(min, max, seed) {
  return Math.floor(pseudoRandom(seed) * (max - min + 1)) + min
}

let seed = 0

const rows = []

for (let m = 0; m < 24; m++) {
  const year = m < 12 ? 2023 : 2024
  const monthIndex = m % 12
  const monthStr = String(monthIndex + 1).padStart(2, '0')
  const startDate = `${year}-${monthStr}-01`
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  const endDate = `${year}-${monthStr}-${lastDay}`

  for (const jurisdiction of JURISDICTIONS) {
    for (const stage of DETECTION_METHODS) {
      seed++

      // More tests in NSW and VIC, fewer in TAS and ACT
      const baseCount =
        jurisdiction === 'NSW' ? 400 :
        jurisdiction === 'VIC' ? 350 :
        jurisdiction === 'QLD' ? 280 :
        jurisdiction === 'WA'  ? 220 :
        jurisdiction === 'SA'  ? 180 :
        jurisdiction === 'TAS' ? 80  : 60 // ACT

      const count = between(
        Math.floor(baseCount * 0.7),
        Math.floor(baseCount * 1.3),
        seed
      )

      // Positive rate ~2–8%
      const positiveRate = 0.02 + pseudoRandom(seed + 100) * 0.06
      const totalPositives = Math.max(1, Math.floor(count * positiveRate))

      const cannabis           = Math.floor(totalPositives * 0.35)
      const amphetamine        = Math.floor(totalPositives * 0.22)
      const methylamphetamine  = Math.floor(totalPositives * 0.20)
      const ecstasy            = Math.floor(totalPositives * 0.10)
      const cocaine            = Math.floor(totalPositives * 0.06)
      const other              = Math.floor(totalPositives * 0.04)
      const unknown            = totalPositives - cannabis - amphetamine - methylamphetamine - ecstasy - cocaine - other

      const fines    = Math.floor(totalPositives * (0.3 + pseudoRandom(seed + 200) * 0.2))
      const arrests  = Math.floor(totalPositives * (0.15 + pseudoRandom(seed + 300) * 0.15))
      const charges  = Math.floor(totalPositives * (0.08 + pseudoRandom(seed + 400) * 0.10))

      rows.push({
        YEAR: year,
        START_DATE: startDate,
        END_DATE: endDate,
        JURISDICTION: jurisdiction,
        LOCATION: ['NSW', 'VIC', 'QLD'].includes(jurisdiction) ? 'Metropolitan' : 'Regional',
        AGE_GROUP: AGE_GROUPS[between(0, AGE_GROUPS.length - 1, seed + 500)],
        DETECTION_METHOD: stage,
        BEST_DETECTION_METHOD:
          stage === 'Stage 1' ? 'Oral fluid' :
          stage === 'Stage 2' ? 'Blood / urine' : 'Confirmatory analysis',
        AMPHETAMINE:       amphetamine,
        CANNABIS:          cannabis,
        COCAINE:           cocaine,
        ECSTASY:           ecstasy,
        METHYLAMPHETAMINE: methylamphetamine,
        OTHER:             other,
        UNKNOWN:           Math.max(0, unknown),
        COUNT:             count,
        FINES:             fines,
        ARRESTS:           arrests,
        CHARGES:           charges,
        NO_DRUGS_DETECTED: count - totalPositives,
      })
    }
  }
}

export const mockData = rows

// Convenience derived values for filters
export const YEARS       = [2023, 2024]
export const MONTHS      = [
  { value: 1, label: 'January' },  { value: 2,  label: 'February' },
  { value: 3, label: 'March' },    { value: 4,  label: 'April' },
  { value: 5, label: 'May' },      { value: 6,  label: 'June' },
  { value: 7, label: 'July' },     { value: 8,  label: 'August' },
  { value: 9, label: 'September'}, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' },
]
export const JURISDICTIONS_LIST = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT']
export const STAGES        = ['Stage 1', 'Stage 2', 'Stage 3']
