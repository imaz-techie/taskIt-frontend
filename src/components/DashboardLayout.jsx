import React from "react"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"

const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar stays fixed */}
      <div className="flex-none">
        <Navbar activeMenu={activeMenu} />
      </div>

      {currentUser && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar (fixed, no scroll) */}
          <div className="w-64 max-[1080px]:hidden flex-none">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
