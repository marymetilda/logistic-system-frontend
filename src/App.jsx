import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
