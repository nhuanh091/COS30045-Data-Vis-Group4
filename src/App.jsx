import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Insights from './pages/Insights'
import AgeGroup from './pages/AgeGroup'
import Location from './pages/Location'
import JurisdictionAnalysis from './pages/JurisdictionAnalysis'
import { useStore } from './store/useStore'

function App() {
  const loadData = useStore((s) => s.loadData)
  useEffect(() => { loadData() }, [loadData])

  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/insights"     element={<Insights />} />
        <Route path="/about"        element={<About />} />
        <Route path="/age-group"   element={<AgeGroup />} />
        <Route path="/location"   element={<Location />} />
        <Route path="/jurisdiction" element={<JurisdictionAnalysis />} />
      </Routes>
    </Layout>
  )
}

export default App
