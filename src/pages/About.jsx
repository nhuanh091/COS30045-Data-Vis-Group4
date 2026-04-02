import TopNavBar from '../components/TopNavBar'

// Asset URLs from Figma (node 2-953)
const imgTechBg = "https://www.figma.com/api/mcp/asset/c3cbbba8-103b-4d7d-8588-2a5d8881da3d"
const imgAbstractBg = "https://www.figma.com/api/mcp/asset/e3b2fad6-78b9-42bb-aac2-0f5e37a185aa"
const imgToolsIcon = "https://www.figma.com/api/mcp/asset/0b3a4e05-c8b2-424c-9f7e-6e74f0e18179"
const imgDataIcon = "https://www.figma.com/api/mcp/asset/93381741-6b76-44c4-b827-93c3cc1821b9"
const imgReactIcon = "https://www.figma.com/api/mcp/asset/93381741-6b76-44c4-b827-93c3cc1821b9"
const imgD3Icon = "https://www.figma.com/api/mcp/asset/9fa3feb1-5e89-461d-a998-5818c4a360d2"
const imgMuiIcon = "https://www.figma.com/api/mcp/asset/875379d0-0be8-4d59-8b3b-57c3fab6805e"
const imgDatabaseIcon = "https://www.figma.com/api/mcp/asset/320b3c9a-63b8-4b7a-9985-96c743580543"
const imgExternalIcon = "https://www.figma.com/api/mcp/asset/2fbe1633-78ac-43c7-a5b4-eea8ada69603"

const tools = [
  { icon: imgReactIcon, name: 'React.js', desc: 'Core application framework' },
  { icon: imgD3Icon, name: 'D3.js', desc: 'Precision data visualizations' },
  { icon: imgMuiIcon, name: 'Material UI', desc: 'Component architecture' },
]

const footerLinks = ['Methodology', 'Privacy Policy', 'API Documentation']

export default function About() {
  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <TopNavBar />

      <div className="max-w-[896px] mx-auto pb-4 pt-16">
        {/* Header */}
        <div className="flex flex-col items-center pt-32 pb-16 px-28">
          <div className="bg-[#dce2f5] px-4 py-1.5 rounded-full mb-6">
            <span className="text-[#404755] text-xs font-semibold tracking-wide">PROJECT DOCUMENTATION</span>
          </div>
          <h1 className="font-manrope font-extrabold text-[#000514] text-6xl tracking-[-1.5px] leading-[60px] text-center mb-8">
            About This Project
          </h1>
          <p className="text-[#44474e] text-xl leading-7 text-center max-w-2xl">
            This project explores drug driving enforcement data provided by the
            Bureau of Infrastructure and Transport Research Economics (BITRE).
            The goal is to present key patterns and insights through interactive
            visualizations.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-8 px-6">
          {/* Tools Used */}
          <div
            className="bg-white rounded-xl p-10 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.05)] relative overflow-hidden"
            style={{ borderLeft: '4px solid #000514' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img src={imgToolsIcon} alt="" className="w-6 h-6 object-contain" />
              <h2 className="font-manrope font-bold text-[#000514] text-2xl leading-8">Tools Used</h2>
            </div>
            <div className="flex flex-col gap-4">
              {tools.map((tool) => (
                <div key={tool.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#eceef1] flex items-center justify-center shrink-0">
                    <img src={tool.icon} alt={tool.name} className="w-5 h-4 object-contain" />
                  </div>
                  <div>
                    <p className="text-[#000514] text-base font-semibold">{tool.name}</p>
                    <p className="text-[#44474e] text-sm">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Source */}
          <div className="bg-[#f2f4f7] rounded-xl p-10 relative overflow-hidden">
            <div className="absolute bottom-[-64px] right-[-64px] w-64 h-64 rounded-full bg-[rgba(0,5,20,0.05)] blur-[32px]" />
            <div className="relative flex items-center gap-3 mb-6">
              <img src={imgDatabaseIcon} alt="" className="w-6 h-6 object-contain" />
              <h2 className="font-manrope font-bold text-[#000514] text-2xl leading-8">Data Source</h2>
            </div>
            <div className="relative flex flex-col gap-2">
              <h3 className="text-[#000514] text-lg font-semibold leading-7">BITRE Road Safety Enforcement Data</h3>
              <p className="text-[#44474e] text-sm leading-5 mb-4">
                Annual compiled dataset covering national
                enforcement activities, focusing on chemical
                testing and incident reporting.
              </p>
              <div className="inline-flex bg-[#e0e3e6] px-3 py-1 rounded self-start">
                <span className="text-[#000514] text-xs font-semibold tracking-[1.2px] uppercase">Period: 2023–2024</span>
              </div>
              <div className="mt-8">
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-base"
                  style={{ background: 'linear-gradient(166deg, #000514 0%, #081e3e 100%)' }}
                >
                  <span>External Source</span>
                  <img src={imgExternalIcon} alt="" className="w-2.5 h-2.5 object-contain" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Panel */}
        <div className="px-6 pt-20">
          <div className="bg-[#e6e8eb] rounded-2xl h-64 overflow-hidden relative flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `url('${imgAbstractBg}')`, backgroundSize: '512px 512px' }}
            />
            <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none">
              <img
                src={imgTechBg}
                alt=""
                className="w-full h-[331%] object-cover"
                style={{ marginTop: '-115%' }}
              />
            </div>
            <div className="relative flex flex-col items-center gap-2 px-12">
              <h3 className="font-manrope font-bold text-[#000514] text-xl text-center">
                Precision. Authority. Insight.
              </h3>
              <div className="w-24 h-1 rounded-full bg-[#000514]" />
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col items-center gap-4 pt-20 pb-4 px-6">
          <div className="flex gap-8 text-sm text-[#44474e]">
            {footerLinks.map((link) => (
              <a key={link} href="#" className="hover:text-[#000514] transition-colors">{link}</a>
            ))}
          </div>
          <p className="text-[#44474e] text-sm">
            © 2024 Drug Enforcement Analytics. All data rights reserved by BITRE.
          </p>
        </div>
      </div>
    </div>
  )
}
