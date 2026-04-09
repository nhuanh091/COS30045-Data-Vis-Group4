import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Age_Group from './pages/Age_Group'
import Age_Group2 from './pages/Age_Group2'
import JurisdictionAnalysis from './pages/JurisdictionAnalysis'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/insights"     element={<Insights />} />
        <Route path="/about"        element={<About />} />
        <Route path="/age-group"    element={<Age_Group />} />
        <Route path="/age-group2"   element={<Age_Group2 />} />
        <Route path="/jurisdiction" element={<JurisdictionAnalysis />} />
      </Routes>
    </Layout>
  )
}

export default App
