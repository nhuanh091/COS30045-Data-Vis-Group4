import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Age_Group from './pages/Age_Group'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/age-group" element={<Age_Group />} />
    </Routes>
  )
}

export default App
