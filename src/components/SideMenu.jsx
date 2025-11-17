import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data"
import userImage from "/user-image.jpg"

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [SideMenuData, setSideMenuData] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  const handleClick = (route) => {
    console.log(route)

    if (route === "logout") {
      handleLogut()
      return
    }

    navigate(route)
  }

  const handleLogut = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-out")

      if (response.data) {
        dispatch(signOutSuccess())

        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser?.role === "admin" ? SIDE_MENU_DATA : USER_SIDE_MENU_DATA
      )
    }

    return () => {}
  }, [currentUser])

 return (
  <div className="w-64 p-6 h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
    {/* Profile Section */}
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-blue-300 shadow-md transition-all duration-300 hover:scale-105">
        <img
          src={currentUser?.profileImageUrl || userImage}
          alt="Profile Image"
          className="w-full h-full object-cover"
        />
      </div>

      {currentUser?.role === "admin" && (
        <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2 shadow-sm">
          Admin
        </div>
      )}

      <h5 className="text-lg font-semibold text-gray-800 tracking-wide">
        {currentUser?.name || ""}
      </h5>

      <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
    </div>

    {/* Menu Section */}
    <div className="flex-1 overflow-y-auto space-y-2">
      {SideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          onClick={() => handleClick(item.path)}
          className={`
            w-full flex items-center gap-4 text-[15px] font-medium px-5 py-3 rounded-lg
            transition-all duration-300 ease-in-out
            ${
              activeMenu === item.label
                ? "bg-blue-100 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:shadow-sm hover:text-gray-900"
            }
          `}
        >
          <item.icon
            className={`
              text-xl transition-all duration-300
              ${
                activeMenu === item.label
                  ? "text-blue-600"
                  : "text-gray-500 group-hover:text-gray-800"
              }
            `}
          />
          {item.label}
        </button>
      ))}
    </div>
  </div>
)
}

export default SideMenu
