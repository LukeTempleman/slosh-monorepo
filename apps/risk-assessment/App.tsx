import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './src/contexts/ThemeContext'
import RiskAssessmentPage from './src/pages/RiskAssessmentPage'
import Login from './src/pages/Login'
import { Toaster } from './components/ui/toaster'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="risk-assessment-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RiskAssessmentPage />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
