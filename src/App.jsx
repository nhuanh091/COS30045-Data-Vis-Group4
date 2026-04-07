import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Age_Group from './pages/Age_Group'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/insights"  element={<Insights />} />
        <Route path="/about"     element={<About />} />
        <Route path="/age-group" element={<Age_Group />} />
    </Routes>
    </Layout>
  )
}

export default App
