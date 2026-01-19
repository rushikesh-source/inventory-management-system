'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CgProfile } from "react-icons/cg";

export default function Sidebar({ setActiveSection }: any) {
  const router = useRouter()

  const [role, setRole] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    const storeName=localStorage.getItem("name")
    console.log("storedRole from sidebar",storedRole);
    console.log("storedRole from sidebar",storeName);
    
    setRole(storedRole)
    setName(storeName)

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
          <CgProfile size="3em"/>
        <p className="font-semibold text-slate-400">{name}</p>
        <p className="text-sm text-slate-400">{role}</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button onClick={() => setActiveSection('dashboard')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Dashboard
        </button>

    

        <button onClick={() => setActiveSection('products')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Products 
        </button>

        <button onClick={() => setActiveSection('addtocart')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
         add to cart 
        </button>

        <button onClick={() => setActiveSection('orders')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
         order
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
