import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <span
        className="text-xl font-semibold tracking-tight text-[#1A1A1A] cursor-pointer"
        onClick={() => navigate('/')}
      >
        Bob<span className="text-[#E8501A]">TheBuilder</span>
      </span>
      <div className="flex items-center gap-6">
        <NavLink to="/" className={({ isActive }) =>
          `text-sm font-medium ${isActive ? 'text-[#E8501A]' : 'text-gray-500 hover:text-[#1A1A1A]'}`
        }>Analyze</NavLink>
        <NavLink to="/my-analyses" className={({ isActive }) =>
          `text-sm font-medium ${isActive ? 'text-[#E8501A]' : 'text-gray-500 hover:text-[#1A1A1A]'}`
        }>My Analyses</NavLink>
        <button
          onClick={() => navigate('/analyzer')}
          className="text-sm bg-[#1A1A1A] text-white px-4 py-2 rounded-sm hover:bg-[#333] transition-colors"
        >
          + New Analysis
        </button>
      </div>
    </nav>
  )
}

