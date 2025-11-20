import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import { FaFileLines } from "react-icons/fa6"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [loading, setLoading] = useState(true)


  const navigate = useNavigate()

 const getAllTasks = async () => {
  try {
    setLoading(true)

    const response = await axiosInstance.get("/tasks", {
      params: {
        status: filterStatus === "All" ? "" : filterStatus,
      },
    })

    if (response?.data) {
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])
    }

    const statusSummary = response.data?.statusSummary || {}

    const statusArray = [
      { label: "All", count: statusSummary.all || 0 },
      { label: "Pending", count: statusSummary.pendingTasks || 0 },
      { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
      { label: "Completed", count: statusSummary.completedTasks || 0 },
    ]

    setTabs(statusArray)
  } catch (error) {
    console.log("Error fetching tasks: ", error)
  } finally {
    setLoading(false)
  }
}

  const handleClick = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } })
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob",
      })

      // create a url for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")

      link.href = url

      link.setAttribute("download", "tasks_details.xlsx")
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log("Error downloading task-details report: ", error)
      toast.error("Error downloading task-details report. Please try again!")
    }
  }

  useEffect(() => {
    getAllTasks(filterStatus)

    return () => {}
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"Project"}>
      <div className="my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto ">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Projects
            </h2>

            <button
              className="md:hidden px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
              onClick={handleDownloadReport}
              type="button"
            >
              Download
            </button>
          </div>

          {allTasks?.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                onClick={handleDownloadReport}
                type="button"
              >
                <FaFileLines className="text-lg" />
                <span>Download Report</span>
              </button>
            </div>
          )}
        </div>

{loading ? (
  <div className="flex justify-center items-center py-20">
    <div className="w-10 h-10 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
) : allTasks.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
    
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
      alt="no-tasks"
      className="w-24 h-24 opacity-60"
    />

    <p className="text-lg font-semibold mt-4">No tasks found</p>
    <p className="text-sm mt-1 mb-6">Try selecting a different filter.</p>

    {/* 🔙 Back Button */}
    <button
      onClick={() => setFilterStatus("All")}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                 rounded-lg shadow-md hover:bg-indigo-700 transition-all 
                 duration-200 active:scale-95"
    >
      ← Back to Tasks
    </button>

  </div>
) : (

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
    {allTasks.map((item) => (
      <TaskCard
        key={item._id}
        title={item.title}
        description={item.description}
        priority={item.priority}
        status={item.status}
        progress={
          item.todoChecklist?.length > 0
            ? Math.round((item.completedCount / item.todoChecklist.length) * 100)
            : 0
        }
        createdAt={item.createdAt}
        dueDate={item.dueDate}
        assignedTo={item.assignedTo?.map((i) => i.profileImageUrl)}
        attachmentCount={item.attachments?.length || 0}
        completedTodoCount={item.completedCount || 0}
        todoChecklist={item.todoChecklist || []}
        onClick={() => handleClick(item)}
      />
    ))}
  </div>
)}

      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
