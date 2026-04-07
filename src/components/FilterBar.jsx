// src/components/FilterBar.jsx
import {
  Box, Select, MenuItem, FormControl, InputLabel,
  Chip, Button, OutlinedInput,
} from '@mui/material'
import { useStore } from '../store/useStore'
import { JURISDICTIONS_LIST, YEARS, MONTHS, STAGES } from '../data/mockData'

function FilterBar() {
  const { filters, setFilter, resetFilters } = useStore()
  const hasActiveFilters =
    filters.jurisdictions.length > 0 ||
    filters.year !== null ||
    filters.month !== null ||
    filters.stage !== null

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(250,247,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #EDDDEC',
        px: { xs: 2, md: 3 },
        py: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        mb: 3,
        mx: -3,
        mt: -3,
      }}
    >
      {/* Jurisdiction multi-select */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel sx={{ fontSize: '0.8rem' }}>Jurisdiction</InputLabel>
        <Select
          multiple
          value={filters.jurisdictions}
          onChange={(e) => setFilter('jurisdictions', e.target.value)}
          input={<OutlinedInput label="Jurisdiction" />}
          renderValue={(selected) =>
            selected.length === 0 ? 'All' : selected.join(', ')
          }
          sx={{ fontSize: '0.82rem' }}
        >
          {JURISDICTIONS_LIST.map((j) => (
            <MenuItem key={j} value={j} sx={{ fontSize: '0.82rem' }}>
              {j}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Year */}
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel sx={{ fontSize: '0.8rem' }}>Year</InputLabel>
        <Select
          value={filters.year ?? ''}
          onChange={(e) =>
            setFilter('year', e.target.value === '' ? null : e.target.value)
          }
          label="Year"
          sx={{ fontSize: '0.82rem' }}
        >
          <MenuItem value="" sx={{ fontSize: '0.82rem' }}>All</MenuItem>
          {YEARS.map((y) => (
            <MenuItem key={y} value={y} sx={{ fontSize: '0.82rem' }}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Month */}
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel sx={{ fontSize: '0.8rem' }}>Month</InputLabel>
        <Select
          value={filters.month ?? ''}
          onChange={(e) =>
            setFilter('month', e.target.value === '' ? null : e.target.value)
          }
          label="Month"
          sx={{ fontSize: '0.82rem' }}
        >
          <MenuItem value="" sx={{ fontSize: '0.82rem' }}>All</MenuItem>
          {MONTHS.map((m) => (
            <MenuItem key={m.value} value={m.value} sx={{ fontSize: '0.82rem' }}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Testing Stage */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.8rem' }}>Stage</InputLabel>
        <Select
          value={filters.stage ?? ''}
          onChange={(e) =>
            setFilter('stage', e.target.value === '' ? null : e.target.value)
          }
          label="Stage"
          sx={{ fontSize: '0.82rem' }}
        >
          <MenuItem value="" sx={{ fontSize: '0.82rem' }}>All</MenuItem>
          {STAGES.map((s) => (
            <MenuItem key={s} value={s} sx={{ fontSize: '0.82rem' }}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Active filter chips — show user what's active */}
      {filters.jurisdictions.map((j) => (
        <Chip
          key={j}
          label={j}
          size="small"
          onDelete={() =>
            setFilter(
              'jurisdictions',
              filters.jurisdictions.filter((x) => x !== j)
            )
          }
          sx={{ bgcolor: '#EDDDEC', color: '#61196E', fontWeight: 600 }}
        />
      ))}
      {filters.year && (
        <Chip
          label={filters.year}
          size="small"
          onDelete={() => setFilter('year', null)}
          sx={{ bgcolor: '#EDDDEC', color: '#61196E', fontWeight: 600 }}
        />
      )}
      {filters.month && (
        <Chip
          label={MONTHS.find((m) => m.value === filters.month)?.label}
          size="small"
          onDelete={() => setFilter('month', null)}
          sx={{ bgcolor: '#EDDDEC', color: '#61196E', fontWeight: 600 }}
        />
      )}
      {filters.stage && (
        <Chip
          label={filters.stage}
          size="small"
          onDelete={() => setFilter('stage', null)}
          sx={{ bgcolor: '#EDDDEC', color: '#61196E', fontWeight: 600 }}
        />
      )}

      {/* Reset — emergency exit */}
      {hasActiveFilters && (
        <Button
          size="small"
          onClick={resetFilters}
          sx={{
            ml: 'auto',
            color: '#61196E',
            fontWeight: 700,
            fontSize: '0.78rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#EDDDEC' },
          }}
        >
          Reset filters
        </Button>
      )}
    </Box>
  )
}

export default FilterBar
