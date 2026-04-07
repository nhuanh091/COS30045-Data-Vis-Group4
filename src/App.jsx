import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/insights"  element={<Insights />} />
        <Route path="/about"     element={<About />} />
      </Routes>
    </Layout>
  )
}

export default App
