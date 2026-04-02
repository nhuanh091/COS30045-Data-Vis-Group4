import { Link, useLocation } from 'react-router-dom'

const imgUserProfile = "https://www.figma.com/api/mcp/asset/ce2ee24e-1c18-4f1e-951b-126d1d739e25"
const imgBell = "https://www.figma.com/api/mcp/asset/7a61a39d-7b0e-4eed-9759-da6cddc945f8"
const imgSettings = "https://www.figma.com/api/mcp/asset/84d88919-10a3-4cc1-b545-30d839661297"

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Insights', to: '/insights' },
  { label: 'About', to: '/about' },
]

export default function TopNavBar() {
  const location = useLocation()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#081e3e] flex h-16 items-center justify-between px-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)]">
      <div className="flex gap-8 items-center">
        <span className="font-manrope font-bold text-white text-lg tracking-tight">
          Drug Enforcement Analytics
        </span>
        <nav className="flex gap-6 items-center">
          {navLinks.map(({ label, to }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium tracking-[0.35px] transition-colors ${
                  isActive
                    ? 'text-white border-b-2 border-white pb-1.5'
                    : 'text-[#cbd5e1] hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <img src={imgBell} alt="Notifications" className="w-4 h-5 object-contain" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <img src={imgSettings} alt="Settings" className="w-5 h-5 object-contain" />
        </button>
        <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden ml-1">
          <img src={imgUserProfile} alt="User profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
