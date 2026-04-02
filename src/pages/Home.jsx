import { Link } from 'react-router-dom'
import TopNavBar from '../components/TopNavBar'

const imgHeroBg = "https://www.figma.com/api/mcp/asset/b7cd2f8e-4893-4983-8035-63f23e3573f9"
const imgDashboardPreview = "https://www.figma.com/api/mcp/asset/bf79894e-d337-41a4-a09e-230cd936566f"
const imgArrow = "https://www.figma.com/api/mcp/asset/1757e82b-67f2-4116-a343-3e3ab4d8d760"
const imgCheckIcon = "https://www.figma.com/api/mcp/asset/98c98dbd-4e3c-48cd-abc1-2aa8e045ed38"
const imgTrendIcon = "https://www.figma.com/api/mcp/asset/16b4ea4c-910b-4726-9c2a-1ab15a9dddf3"
const imgTestingIcon = "https://www.figma.com/api/mcp/asset/5e459b2c-b1fb-42ad-b5ea-c1327f064887"
const imgOutcomesIcon = "https://www.figma.com/api/mcp/asset/9d7a4ce9-45e6-4eb1-913d-f58f73bfc036"
const imgChevronRight = "https://www.figma.com/api/mcp/asset/3307713b-3165-4ade-8ef5-8c6d35af46d3"
const imgLockIcon = "https://www.figma.com/api/mcp/asset/b652a1e7-ae5f-48c1-b469-4209ab655189"

const focusCards = [
  {
    icon: imgTrendIcon,
    borderColor: '#000514',
    title: 'Drug Detection Trends',
    description: 'Long-term analysis of substance prevalence across different metropolitan and regional sectors in Australia.',
  },
  {
    icon: imgTestingIcon,
    borderColor: '#7486ac',
    title: 'Testing Methods',
    description: 'Evaluating the efficacy and frequency of oral fluid tests versus blood analysis in roadside operations.',
  },
  {
    icon: imgOutcomesIcon,
    borderColor: '#75777f',
    title: 'Enforcement Outcomes',
    description: 'Tracking legal consequences, license suspensions, and judicial resolutions resulting from detections.',
  },
]

export default function Home() {
  return (
    <div className="bg-[#f7f9fc] min-h-screen flex flex-col">
      <TopNavBar />

      {/* Hero */}
      <section
        className="relative flex flex-col items-start pl-8 pr-[480px] py-32 overflow-hidden mt-16"
        style={{ background: 'linear-gradient(135deg, #000514 0%, #081e3e 100%)' }}
      >
        <div className="absolute inset-0 flex items-center mix-blend-overlay opacity-20 pointer-events-none">
          <img src={imgHeroBg} alt="" className="w-full h-[204%] object-cover" style={{ marginTop: '-52%' }} />
        </div>
        <div className="relative flex flex-col gap-6 max-w-3xl w-full">
          <div className="flex flex-col">
            <h1 className="font-manrope font-extrabold text-white leading-[60px] tracking-[-1.5px] text-6xl">
              Understanding Drug<br />Driving Enforcement in<br />Australia
            </h1>
          </div>
          <p className="font-inter text-[#cbd5e1] text-xl leading-[32.5px]">
            Explore trends, patterns, and outcomes of roadside drug testing using interactive
            data visualizations.
          </p>
          <div className="flex gap-4 items-center pt-4">
            <Link
              to="/dashboard"
              className="flex gap-2 items-center px-8 py-[17px] rounded-xl text-white text-lg font-semibold shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
              style={{ background: 'linear-gradient(134deg, #000514 0%, #081e3e 100%)' }}
            >
              <span>View Dashboard</span>
              <img src={imgArrow} alt="" className="w-4 h-4 object-contain" />
            </Link>
            <Link
              to="/about"
              className="flex items-center justify-center px-8 py-[17px] rounded-xl text-white text-lg font-semibold border border-white/20 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: Overview */}
      <section className="bg-[#f2f4f7] px-8 py-24">
        <div className="grid grid-cols-12 gap-12 items-center max-w-[1280px] mx-auto">
          <div className="col-span-7 flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-[#d7e2ff] px-4 py-1.5 rounded-full self-start">
              <div className="w-2 h-2 rounded-full bg-[#000514]" />
              <span className="text-[#051b3b] text-xs font-semibold tracking-[1.2px] uppercase">Strategic Insight</span>
            </div>
            <h2 className="font-manrope font-bold text-[#000514] text-5xl leading-[48px]">
              What This Project Shows
            </h2>
            <div className="flex flex-col gap-6 max-w-2xl">
              <p className="font-inter text-[#44474e] text-lg leading-[29.25px]">
                This platform presents insights into roadside drug testing data, focusing on
                detection patterns, demographics, and enforcement outcomes.
              </p>
              <p className="font-inter text-[#44474e] text-lg leading-[29.25px]">
                Users can explore how drug testing varies across jurisdictions, age groups,
                and time, providing a comprehensive narrative of enforcement efficiency and
                public safety trends.
              </p>
            </div>
          </div>
          <div className="col-span-5">
            <div className="bg-white rounded-xl p-8 flex flex-col gap-6 shadow-[0px_32px_64px_-12px_rgba(0,5,20,0.08)]">
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#e0e3e6]" style={{ maxWidth: 415 }}>
                <img
                  src={imgDashboardPreview}
                  alt="Dashboard preview"
                  className="w-full h-full object-cover grayscale mix-blend-multiply"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#dce2f5] flex items-center justify-center shrink-0">
                  <img src={imgCheckIcon} alt="" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <p className="font-semibold text-[#000514] text-base">Peer-Reviewed Data</p>
                  <p className="text-[#44474e] text-sm">Validated by clinical enforcement standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Key Focus Areas */}
      <section className="bg-[#f7f9fc] py-24">
        <div className="flex flex-col gap-16 max-w-[1280px] px-8 mx-auto">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="font-manrope font-bold text-[#000514] text-4xl leading-10">Key Focus Areas</h2>
              <p className="text-[#44474e] text-base">Critical dimensions of roadside drug enforcement analytics</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-12 h-1 rounded-full bg-[#000514]" />
              <div className="w-4 h-1 rounded-full bg-[#c5c6cf]" />
              <div className="w-4 h-1 rounded-full bg-[#c5c6cf]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {focusCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl relative shadow-[0px_32px_64px_-12px_rgba(0,5,20,0.08)] overflow-hidden"
                style={{ borderLeft: `4px solid ${card.borderColor}` }}
              >
                <div className="p-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-xl bg-[#e6e8eb] flex items-center justify-center mb-10">
                    <img src={card.icon} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <h3 className="font-manrope font-bold text-[#000514] text-xl mb-6">{card.title}</h3>
                  <p className="text-[#44474e] text-base leading-[26px] flex-1">{card.description}</p>
                  <div className="border-t border-[rgba(197,198,207,0.15)] pt-8 mt-8 flex items-center justify-between">
                    <span className="font-semibold text-[#000514] text-sm">Explore Data</span>
                    <img src={imgChevronRight} alt="" className="w-2.5 h-2.5 object-contain" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000514] border-t border-white/5 py-16 mt-auto">
        <div className="max-w-[1280px] px-8 mx-auto flex flex-col gap-16">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold text-xl tracking-tight">Drug Enforcement Analytics</p>
              <p className="text-[#94a3b8] text-base leading-6">
                Precision data intelligence for Australian roadside<br />
                enforcement strategies and public safety analysis.
              </p>
            </div>
            <div className="flex gap-8 text-sm text-[#cbd5e1]">
              {['Privacy Policy', 'Accessibility', 'API Documentation', 'Contact Support'].map((link) => (
                <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex items-center justify-between">
            <p className="text-[#64748b] text-xs">© 2024 Enforcement Analytics. All Rights Reserved.</p>
            <div className="flex items-center gap-4 text-[#64748b] text-xs">
              <img src={imgLockIcon} alt="" className="w-2.5 h-3 object-contain" />
              <span>Classified Data Tier III</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
