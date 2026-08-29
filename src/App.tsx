import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext'
import NavBar from './components/Layout/NavBar'
import Landing from './pages/Landing'
import AnalyzerPage from './pages/AnalyzerPage'
import ResultsPage from './pages/ResultsPage'
import MyAnalyses from './pages/MyAnalyses'

export default function App() {
  return (
    <AnalysisProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F5F0]">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/"            element={<Landing />} />
            <Route path="/analyzer"    element={<AnalyzerPage />} />
            <Route path="/results"     element={<ResultsPage />} />
            <Route path="/my-analyses" element={<MyAnalyses />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AnalysisProvider>
  )
}
