import TopNavBar from '../components/TopNavBar'

// Asset URLs from Figma (node 2-567: Interactive Dashboard)
const imgTrendUp = "https://www.figma.com/api/mcp/asset/cdc55aca-9d7a-4a87-99c3-c6626163ee33"
const imgTrendDown = "https://www.figma.com/api/mcp/asset/28b7eb0c-50d2-4071-9de9-86de5739e14b"
const imgTrendUpOrange = "https://www.figma.com/api/mcp/asset/bde1cda7-25f4-4d19-92c3-7f86225b3f27"
const imgTrendUpGreen = "https://www.figma.com/api/mcp/asset/c3ef2926-712a-4ad8-9527-ea4be5aa2491"
const imgDash = "https://www.figma.com/api/mcp/asset/3307713b-3165-4ade-8ef5-8c6d35af46d3"
const imgFilterIcon = "https://www.figma.com/api/mcp/asset/cdc55aca-9d7a-4a87-99c3-c6626163ee33"
const imgChevron = "https://www.figma.com/api/mcp/asset/16ab6b2e-3cca-4a06-8c98-9aa7ada42ae2"
const imgInsightIcon = "https://www.figma.com/api/mcp/asset/62c5ee70-4984-4cd1-8084-f928f3d37410"
const imgTrendChart = "https://www.figma.com/api/mcp/asset/16261373-8ac8-4caf-a155-00df9c9a0bda"
const imgCloseIcon = "https://www.figma.com/api/mcp/asset/0a5482f8-f311-4a68-84eb-97404796ab0a"

const kpiCards = [
  { label: 'Total Drug Tests', value: '120,000', trend: '4.2% vs prev. period', trendColor: '#16a34a', trendIcon: imgTrendUp, accentColor: '#081e3e' },
  { label: '% Positive Tests', value: '8.5%', trend: '0.8% increase', trendColor: '#ba1a1a', trendIcon: imgTrendUpOrange, accentColor: '#ba1a1a' },
  { label: 'Total Fines', value: '15,200', trend: '2.1% reduction', trendColor: '#16a34a', trendIcon: imgTrendUpGreen, accentColor: '#081e3e' },
  { label: 'Total Arrests', value: '4,300', trend: 'Stable', trendColor: '#44474e', trendIcon: imgDash, accentColor: '#081e3e' },
  { label: 'Total Charges', value: '2,100', trend: '1.4% increase', trendColor: '#16a34a', trendIcon: imgTrendUp, accentColor: '#081e3e' },
]

const drugTypes = [
  { name: 'Methylamphetamine', pct: 35, color: '#081e3e' },
  { name: 'Cannabis', pct: 20, color: '#585e6e' },
  { name: 'Cocaine', pct: 20, color: '#b4c7ef' },
  { name: 'Amphetamine', pct: 10, color: '#f5ba93' },
  { name: 'Ecstasy', pct: 10, color: '#ffdcc6' },
]

const detectionMethods = [
  { name: 'Stage 1 (Oral Fluid)', pct: 60, color: '#081e3e' },
  { name: 'Stage 2 (Confirmatory)', pct: 25, color: '#585e6e' },
  { name: 'Stage 3 (Lab Testing)', pct: 15, color: '#b4c7ef' },
]

const jurisdictions = [
  { name: 'NSW', value: 18240, opacity: 0.8 },
  { name: 'VIC', value: 15100, opacity: 0.8 },
  { name: 'QLD', value: 12450, opacity: 0.6 },
  { name: 'WA', value: 9120, opacity: 0.6 },
  { name: 'SA', value: 7800, opacity: 0.4 },
]

const ageGroups = [
  { label: '17–25', fines: 80, arrests: 60, charges: 40 },
  { label: '26–39', fines: 95, arrests: 75, charges: 55 },
  { label: '40–64', fines: 65, arrests: 45, charges: 30 },
  { label: '65+', fines: 30, arrests: 15, charges: 10 },
]

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL']

function FilterDropdown({ label, value }) {
  return (
    <div className="bg-white border border-[rgba(197,198,207,0.15)] rounded-lg px-4 py-2.5 flex items-center gap-2 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
      <span className="text-[#44474e] text-xs font-semibold tracking-[0.6px] uppercase">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-[#191c1e] text-sm font-medium">{value}</span>
        <img src={imgChevron} alt="" className="w-3 h-3 object-contain opacity-60" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="bg-[#f7f9fc] min-h-screen relative">
      <TopNavBar />

      <div className="flex flex-col gap-8 max-w-[1600px] pb-12 pt-24 px-8 mx-auto">
        {/* Filter Bar */}
        <div className="bg-[#f2f4f7] flex items-center gap-4 p-4 rounded-xl">
          <FilterDropdown label="Jurisdiction" value="All Jurisdictions (7)" />
          <FilterDropdown label="Year" value="2024" />
          <FilterDropdown label="Month" value="All Months" />
          <FilterDropdown label="Testing Stage" value="All Stages" />
          <div className="flex-1 flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-2 rounded-full text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(167deg, #000514 0%, #081e3e 100%)' }}
            >
              <img src={imgFilterIcon} alt="" className="w-2.5 h-1.5 object-contain" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-6">
          {kpiCards.map((card) => (
            <div key={card.label} className="bg-white border border-[rgba(197,198,207,0.1)] rounded-xl p-6 relative overflow-hidden shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)] flex flex-col gap-1">
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-tl rounded-bl"
                style={{ backgroundColor: card.accentColor }}
              />
              <p className="text-[#44474e] text-xs font-semibold tracking-[1.2px] uppercase">{card.label}</p>
              <p className="font-manrope font-extrabold text-[#000514] text-3xl leading-9">{card.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <img src={card.trendIcon} alt="" className="w-3 h-2 object-contain" />
                <span className="text-xs font-medium" style={{ color: card.trendColor }}>{card.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Section 1: Trends */}
        <div className="grid grid-cols-4 gap-8 mt-4">
          {/* Trends Chart */}
          <div className="col-span-3 bg-white border border-[rgba(197,198,207,0.1)] rounded-xl p-8 flex flex-col gap-10 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-manrope font-extrabold text-[#000514] text-xl leading-7">Drug Testing Trends</h2>
                <p className="text-[#44474e] text-sm mt-0.5">Comparative analysis of test volume (bars) and positive results (line) (2023–2024)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[rgba(8,30,62,0.4)]" />
                  <span className="text-[#44474e] text-xs font-medium">Total Tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f5ba93]" />
                  <span className="text-[#44474e] text-xs font-medium">Positive Cases</span>
                </div>
              </div>
            </div>
            {/* Chart area */}
            <div className="relative h-80">
              <img src={imgTrendChart} alt="Drug Testing Trends chart" className="absolute inset-0 w-full h-full object-fill" />
              <div className="absolute bottom-0 left-4 right-4 flex justify-between">
                {months.map((m) => (
                  <span key={m} className="text-[10px] font-semibold text-[#44474e]">{m}</span>
                ))}
              </div>
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-20 pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-[#75777f] w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Insight */}
          <div className="bg-[#081e3e] rounded-xl relative overflow-hidden shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
            <div className="absolute inset-0">
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-[32px]" />
            </div>
            <div className="relative p-8 flex flex-col h-full">
              <div className="mb-4">
                <img src={imgInsightIcon} alt="" className="w-8 h-8 object-contain" />
              </div>
              <h3 className="text-white font-semibold text-lg leading-7 mb-4">Strategic Insight</h3>
              <p className="text-[#cbd5e1] text-sm leading-[22.75px] flex-1">
                Peak testing volume in May correlates with multi-jurisdictional enforcement operations.
                Positive test ratios have increased by 0.5% in the last 60 days.
              </p>
              <div className="border-t border-white/10 mt-6 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#94a3b8] text-xs">Target Resolution</span>
                  <span className="text-white text-xs font-semibold">85%</span>
                </div>
                <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#d7e2ff] h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Distribution */}
        <div className="grid grid-cols-2 gap-8 mt-4">
          {/* Drug Type Distribution */}
          <div className="bg-white border border-[rgba(197,198,207,0.1)] rounded-xl p-8 flex flex-col gap-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
            <h2 className="font-manrope font-extrabold text-[#000514] text-xl leading-7">Drug Type Distribution</h2>
            <div className="flex items-center gap-16 px-8">
              {/* Donut placeholder */}
              <div className="w-48 h-48 rounded-full border-[20px] border-[#eceef1] flex items-center justify-center shrink-0 relative">
                <div className="text-center">
                  <p className="font-semibold text-[#000514] text-2xl leading-8">6</p>
                  <p className="text-[#44474e] text-[10px] font-semibold uppercase tracking-wider">Categories</p>
                </div>
                {/* Colorful donut overlay */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#081e3e" strokeWidth="10" strokeDasharray="87.96 251.33" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#585e6e" strokeWidth="10" strokeDasharray="50.27 251.33" strokeDashoffset="-87.96" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#b4c7ef" strokeWidth="10" strokeDasharray="50.27 251.33" strokeDashoffset="-138.23" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f5ba93" strokeWidth="10" strokeDasharray="25.13 251.33" strokeDashoffset="-188.50" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ffdcc6" strokeWidth="10" strokeDasharray="25.13 251.33" strokeDashoffset="-213.63" />
                </svg>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-3 flex-1">
                {drugTypes.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[#191c1e] text-sm font-medium flex-1">{d.name}</span>
                    <span className="text-[#191c1e] text-sm font-semibold">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detection Methods */}
          <div className="bg-white border border-[rgba(197,198,207,0.1)] rounded-xl p-8 flex flex-col gap-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
            <h2 className="font-manrope font-extrabold text-[#000514] text-xl leading-7">Detection Methods</h2>
            <div className="flex items-center gap-[71px] px-9">
              {/* Donut placeholder */}
              <div className="w-48 h-48 rounded-full border-[20px] border-[#eceef1] flex items-center justify-center shrink-0 relative">
                <div className="text-center">
                  <p className="font-semibold text-[#000514] text-2xl leading-8">Stage</p>
                  <p className="text-[#44474e] text-[10px] font-semibold uppercase tracking-wider">Efficiency</p>
                </div>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#081e3e" strokeWidth="10" strokeDasharray="150.8 251.33" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#585e6e" strokeWidth="10" strokeDasharray="62.83 251.33" strokeDashoffset="-150.8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#b4c7ef" strokeWidth="10" strokeDasharray="37.7 251.33" strokeDashoffset="-213.63" />
                </svg>
              </div>
              {/* Progress bars */}
              <div className="flex flex-col gap-6 flex-1">
                {detectionMethods.map((m) => (
                  <div key={m.name} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-[#191c1e] text-sm font-semibold">{m.name}</span>
                      <span className="text-[#191c1e] text-sm font-semibold">{m.pct}%</span>
                    </div>
                    <div className="bg-[#e6e8eb] h-2 rounded-full overflow-hidden w-48">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Regional & Demographic */}
        <div className="grid grid-cols-2 gap-8 mt-4">
          {/* Jurisdiction Bars */}
          <div className="bg-white border border-[rgba(197,198,207,0.1)] rounded-xl p-8 flex flex-col gap-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
            <h2 className="font-manrope font-extrabold text-[#000514] text-xl leading-7">Positive Tests by Jurisdiction</h2>
            <div className="flex flex-col gap-5">
              {jurisdictions.map((j) => {
                const maxVal = 18240
                const widthPct = (j.value / maxVal) * 100
                return (
                  <div key={j.name} className="flex items-center gap-4">
                    <span className="text-[#44474e] text-xs font-semibold w-10">{j.name}</span>
                    <div className="flex-1 bg-[#f2f4f7] h-8 rounded-lg overflow-hidden">
                      <div
                        className="h-full flex items-center px-4"
                        style={{ width: `${widthPct}%`, backgroundColor: `rgba(8,30,62,${j.opacity})` }}
                      >
                        <span className="text-white text-xs font-semibold">{j.value.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Age Group Bars */}
          <div className="bg-white border border-[rgba(197,198,207,0.1)] rounded-xl p-8 flex flex-col gap-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="font-manrope font-extrabold text-[#000514] text-xl leading-7">Enforcement Outcomes by Age</h2>
              <div className="flex items-center gap-2">
                {[{ label: 'Fines', color: '#081e3e' }, { label: 'Arrests', color: '#585e6e' }, { label: 'Charges', color: '#b4c7ef' }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-[#44474e] text-[10px] font-semibold uppercase tracking-wide">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-64 flex items-end justify-between px-2">
              {ageGroups.map((g) => (
                <div key={g.label} className="flex-1 flex flex-col items-center">
                  <div className="flex gap-1 h-48 items-end justify-center">
                    <div className="w-2.5 rounded-t-sm bg-[#081e3e]" style={{ height: `${g.fines}%` }} />
                    <div className="w-2.5 rounded-t-sm bg-[#585e6e]" style={{ height: `${g.arrests}%` }} />
                    <div className="w-2.5 rounded-t-sm bg-[#b4c7ef]" style={{ height: `${g.charges}%` }} />
                  </div>
                  <div className="mt-4">
                    <span className="text-[#44474e] text-[11px] font-semibold">{g.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Toast */}
      <div className="fixed bottom-6 right-6 bg-[#081e3e] border border-white/10 rounded-xl flex items-center gap-4 px-6 py-4 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.04)]">
        <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
        <div>
          <p className="text-white text-xs font-semibold tracking-[0.6px] uppercase opacity-60">System Status</p>
          <p className="text-white text-sm font-medium">Analytics Engine: Online</p>
        </div>
        <button className="pl-4 opacity-50 hover:opacity-100 transition-opacity">
          <img src={imgCloseIcon} alt="Close" className="w-2 h-2 object-contain" />
        </button>
      </div>
    </div>
  )
}
