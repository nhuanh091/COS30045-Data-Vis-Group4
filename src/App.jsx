import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Placeholder routes for Overview sub-pages */}
        <Route path="/overview/locations" element={<PlaceholderPage title="Overview — Locations" />} />
        <Route path="/overview/age-group" element={<PlaceholderPage title="Overview — Age Group" />} />
      </Routes>
    </Layout>
  )
}

/* Temporary placeholder for pages not yet built */
function PlaceholderPage({ title }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#2D1B4E', fontWeight: 700 }}>{title}</h2>
      <p style={{ color: '#6B7280' }}>This page is under construction.</p>
    </div>
  )
}

export default App
