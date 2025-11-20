import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import RecentTasks from "../../components/RecentTasks"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"

const COLORS = ["#FF6384", "#f9cb9c", "#a64d79"]

const Dashboard = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ]

    setPieChartData(taskDistributionData)

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ]

    setBarChartData(priorityLevelData)
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/dashboard-data")

      if (response.data) {
        setDashboardData(response.data) 
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.log("Error fetching dashboard data: ", error)
    }
  }

  useEffect(() => {
    getDashboardData()
    return () => {}
  }, [])

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-6 rounded-lg">
        {/* Welcome Header with Enhanced Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Welcome back, {currentUser?.name}! 
              </h2>
              <p className="text-indigo-100 text-lg font-medium">
                {moment().format("dddd, MMMM Do YYYY")}
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <button
                className="group relative overflow-hidden bg-white text-indigo-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => navigate("/admin/create-task")}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <span className="text-xl">+</span> Create Project
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards with Modern Design */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tasks Card */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-blue-500 rounded-l-2xl"></div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                  Total Tasks
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">📊</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {dashboardData?.charts?.taskDistribution?.All || 0}
              </p>
              <p className="text-xs text-gray-500 font-medium">All task items</p>
            </div>

            {/* Pending Tasks Card */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-yellow-500 rounded-l-2xl"></div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                  Pending
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">⏳</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {dashboardData?.charts?.taskDistribution?.Pending || 0}
              </p>
              <p className="text-xs text-gray-500 font-medium">Awaiting action</p>
            </div>

            {/* In Progress Tasks Card */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-green-500 rounded-l-2xl"></div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                  In Progress
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">🚀</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {dashboardData?.charts?.taskDistribution?.InProgress || 0}
              </p>
              <p className="text-xs text-gray-500 font-medium">Currently active</p>
            </div>

            {/* Completed Tasks Card */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-2xl"></div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                  Completed
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {dashboardData?.charts?.taskDistribution?.Completed || 0}
              </p>
              <p className="text-xs text-gray-500 font-medium">Successfully done</p>
            </div>
          </div>
        )}

        {/* Charts Section with Modern Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">📈</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Task Distribution
                </h3>
                <p className="text-sm text-gray-500">Overview by status</p>
              </div>
            </div>

            <div className="h-64 flex items-center justify-center">
              <CustomPieChart
                data={pieChartData}
                label="Total Balance"
                colors={COLORS}
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Task Priority Levels
                </h3>
                <p className="text-sm text-gray-500">Priority breakdown</p>
              </div>
            </div>

           <div className="h-72 w-full">
  <CustomBarChart data={barChartData} />
</div>

          </div>
        </div>

        {/* Recent Tasks Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
          <RecentTasks tasks={dashboardData?.recentTasks} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard