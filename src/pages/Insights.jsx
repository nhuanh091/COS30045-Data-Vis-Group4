import TopNavBar from '../components/TopNavBar'

// Asset URLs from Figma (node 2-1063)
const imgRegionalMap = "https://www.figma.com/api/mcp/asset/3f5c8bbf-ac9a-4a97-a6a7-9e894c078fdb"
const imgDetectionViz = "https://www.figma.com/api/mcp/asset/023483c2-c6fe-429a-af4b-4e7cc07f3263"
const imgLocationIcon = "https://www.figma.com/api/mcp/asset/408aead2-914c-4838-b8f9-3b1d18bc7a5b"
const imgPriorityIcon = "https://www.figma.com/api/mcp/asset/6bded669-72c2-48c1-90e7-ea5d8d3faa67"
const imgVerdictIcon = "https://www.figma.com/api/mcp/asset/7a61a39d-7b0e-4eed-9759-da6cddc945f8"

const verdictPoints = [
  {
    title: 'Testing Consistency',
    body: 'High detection rates across all regions confirm the necessity of current program scales.',
  },
  {
    title: 'Targeted Prevention',
    body: 'The 17-25 age group remains the highest risk bracket, suggesting a need for youth-focused campaigns.',
  },
  {
    title: 'Validation Criticality',
    body: 'Advanced stage testing remains the benchmark for legal confirmation and data integrity.',
  },
  {
    title: 'Jurisdictional Variance',
    body: 'Resources should be dynamically reallocated to territories with spiking positive detections.',
  },
]

export default function Insights() {
  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <TopNavBar />

      <div className="max-w-[1280px] mx-auto pb-10">
        {/* Header */}
        <div className="absolute left-6 right-6 top-24 flex flex-col gap-4">
          <div className="relative">
            <h1 className="font-manrope font-extrabold text-[#000514] text-5xl tracking-[-1.2px] leading-12 pt-24 px-6">
              Key Insights
            </h1>
            <p className="text-[#44474e] text-lg leading-[29.25px] mt-4 max-w-2xl px-6">
              Strategic overview of narcotics enforcement data and behavioral trends across
              jurisdictions for the current fiscal period.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="pt-[266px] px-6">
          <div className="grid grid-cols-12 gap-8" style={{ gridTemplateRows: '408px 230px' }}>

            {/* Insight 1: Drug Driving (col 1-7, row 1) */}
            <div className="col-span-7 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden relative flex flex-col justify-between p-8 border border-[rgba(197,198,207,0.15)]">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#081e3e]" />
              <div className="ml-3">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#d7e2ff] flex items-center justify-center">
                    <img src={imgPriorityIcon} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <span className="text-[#44474e] text-xs font-semibold tracking-[1.2px] uppercase">Priority Alert</span>
                </div>
                <h2 className="font-manrope font-bold text-[#000514] text-2xl leading-[30px] mb-4 max-w-[560px]">
                  Speeding is not the only concern—drug driving is significant
                </h2>
                <p className="text-[#44474e] text-base leading-[26px] max-w-[585px]">
                  Drug testing data shows a consistent number of positive detections across all
                  jurisdictions, highlighting the importance of continued enforcement efforts.
                </p>
              </div>
              <div className="bg-[#eceef1] rounded-lg h-32 overflow-hidden relative ml-3">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,30,62,0.1)] to-transparent" />
                <img
                  src={imgDetectionViz}
                  alt="Detection visualization"
                  className="w-full h-[500%] object-cover object-center opacity-30 mix-blend-overlay"
                  style={{ marginTop: '-200%' }}
                />
              </div>
            </div>

            {/* Insight 2: Demographics (col 8-12, row 1) */}
            <div className="col-span-5 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[rgba(197,198,207,0.15)] flex flex-col justify-center px-8 py-16">
              <div className="mb-6">
                <div className="inline-flex items-center bg-[#dce2f5] px-3 py-1 rounded-full mb-6">
                  <span className="text-[#404755] text-xs font-semibold tracking-[-0.6px] uppercase">Demographics</span>
                </div>
                <h2 className="font-manrope font-bold text-[#000514] text-xl leading-7 mb-4 max-w-sm">
                  Younger drivers face higher enforcement outcomes
                </h2>
                <p className="text-[#44474e] text-base leading-[26px] max-w-[404px]">
                  Drivers aged 17–25 account for a higher proportion of
                  fines and arrests compared to other age groups.
                </p>
              </div>
              <div className="bg-[#f2f4f7] rounded-xl flex items-center justify-between px-4 py-4 mt-4">
                <div className="flex-1 flex flex-col items-center">
                  <p className="font-manrope font-extrabold text-[#000514] text-3xl leading-9">34%</p>
                  <p className="text-[#75777f] text-[10px] font-semibold uppercase tracking-wide">Age 17-25</p>
                </div>
                <div className="w-px h-10 bg-[rgba(197,198,207,0.3)]" />
                <div className="flex-1 flex flex-col items-center">
                  <p className="font-manrope font-extrabold text-[#081e3e] text-3xl leading-9">12%</p>
                  <p className="text-[#75777f] text-[10px] font-semibold uppercase tracking-wide">Average</p>
                </div>
              </div>
            </div>

            {/* Insight 3: Methods (col 1-5, row 2) */}
            <div className="col-span-5 bg-[#081e3e] rounded-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] flex flex-col justify-between p-8 overflow-hidden relative">
              <div className="absolute bottom-[-48px] right-[-48px] w-48 h-48 rounded-full bg-white/5 blur-8" />
              <div className="relative">
                <h2 className="font-manrope font-bold text-white text-xl leading-7 mb-4">
                  Detection methods vary in effectiveness
                </h2>
                <p className="text-[#cbd5e1] text-sm leading-[22.75px]">
                  While Stage 1 testing is most commonly used, later stages play a
                  critical role in confirming positive drug detections.
                </p>
              </div>
              <div className="relative mt-8">
                <div className="bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#d7e2ff] h-full rounded-full" style={{ width: '82%' }} />
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-[#94a3b8] text-[10px] font-semibold tracking-[1px] uppercase">Stage 1 Utilization</span>
                  <span className="text-white text-[10px] font-semibold tracking-[1px] uppercase">82%</span>
                </div>
              </div>
            </div>

            {/* Insight 4: Regional (col 6-12, row 2) */}
            <div className="col-span-7 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[rgba(197,198,207,0.15)] flex items-center gap-8 p-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <img src={imgLocationIcon} alt="" className="w-4 h-5 object-contain" />
                  <span className="text-[#44474e] text-xs font-semibold tracking-[1.2px] uppercase">Geospatial Trends</span>
                </div>
                <h2 className="font-manrope font-bold text-[#000514] text-2xl leading-[30px] mb-4">
                  Regional differences are evident
                </h2>
                <p className="text-[#44474e] text-base leading-[26px]">
                  Certain jurisdictions consistently report higher numbers of
                  positive drug tests, indicating variations in enforcement
                  intensity or population behavior.
                </p>
              </div>
              <div className="w-40 h-40 rounded-xl overflow-hidden bg-[#eceef1] shrink-0 relative shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]">
                <img
                  src={imgRegionalMap}
                  alt="Regional map"
                  className="w-full h-full object-cover opacity-60 grayscale"
                />
              </div>
            </div>
          </div>
        </div>

        {/* The Verdict */}
        <div className="mx-6 mt-10 bg-white border border-[rgba(197,198,207,0.1)] rounded-3xl px-10 pt-14 pb-10 relative shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.05)]">
          <div className="flex gap-12 items-start">
            {/* Left: header */}
            <div className="w-[367px] shrink-0 flex flex-col gap-4">
              <h2 className="font-manrope font-extrabold text-[#000514] text-3xl leading-[30px]">The Verdict</h2>
              <p className="text-[#44474e] text-sm font-medium leading-5">
                Executive summary of behavioral trends and
                enforcement efficacy for the reporting period.
              </p>
              <div className="flex gap-2 items-center mt-4">
                <div className="w-12 h-1 rounded-full bg-[#000514]" />
                <div className="w-4 h-1 rounded-full bg-[#c5c6cf]" />
                <div className="w-4 h-1 rounded-full bg-[#c5c6cf]" />
              </div>
            </div>
            {/* Right: 2x2 grid */}
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
              {verdictPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-4">
                  <div className="shrink-0 pt-1">
                    <img src={imgVerdictIcon} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#000514] text-base leading-6 mb-1">{point.title}</p>
                    <p className="text-[#44474e] text-sm leading-[17.5px]">{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mx-6 mt-8 border-t border-[rgba(197,198,207,0.15)] flex items-center justify-between py-8">
          <p className="text-[#75777f] text-xs font-semibold tracking-[1.2px] uppercase">
            © 2024 Drug Enforcement Analytics
          </p>
          <div className="flex items-center gap-4">
            <button className="border border-[#75777f] text-[#191c1e] text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
              Download Full Report
            </button>
            <button
              className="text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]"
              style={{ background: 'linear-gradient(168deg, #000514 0%, #081e3e 100%)' }}
            >
              Detailed Data View
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
