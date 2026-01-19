'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Sidebar({ setActiveSection }: any) {
  const router = useRouter()

  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')

    // Reset navigation state
    router.replace('/login')
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
      {/* Profile */}
      <div className="p-6 border-b border-slate-700">
        <p className="font-semibold">Rushikesh Gaware</p>
        <p className="text-sm text-slate-400">{role}</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button onClick={() => setActiveSection('dashboard')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Dashboard
        </button>

        <button onClick={() => setActiveSection('users')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Users Management
        </button>

        <button onClick={() => setActiveSection('products')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Products 
        </button>

        <button onClick={() => setActiveSection('orders')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Orders
        </button>

        <button onClick={() => setActiveSection('inventory')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Inventary
        </button>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-700">
        <button onClick={handleLogOut} className="w-full text-red-400 hover:text-red-500">
          Logout
        </button>
      </div>
    </aside>
  )
}
