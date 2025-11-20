import React from "react"
import Progress from "./Progress"
import moment from "moment"
import AvatarGroup from "./AvatarGroup"
import { FaFileLines, FaCircleCheck } from "react-icons/fa6"
import { IoRadioButtonOff } from "react-icons/io5"

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getPriorityTagColor = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div
      onClick={onClick}
      className="
        bg-white rounded-2xl py-4 border border-gray-200/60 
        shadow-md hover:shadow-xl transition-all duration-300 
        hover:-translate-y-1 cursor-pointer
        group relative overflow-hidden
      "
    >
      {/* Glow Animation on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-purple-400 to-blue-400 transition-all duration-500" />

      {/* Status + Priority Tags */}
      <div className="flex items-end gap-3 px-4 animate-fade-in">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded-lg`}
        >
          {status}
        </div>

        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded-lg`}
        >
          {priority} Priority
        </div>
      </div>

      <div
        className={`
          px-4 border-l-[3px] mt-2 transition-colors duration-300
          ${
            status === "In Progress"
              ? "border-cyan-500"
              : status === "Completed"
              ? "border-indigo-500"
              : "border-violet-500"
          }
        `}
      >
        {/* Title */}
        <p
          className="
            text-lg font-semibold text-gray-900 mt-2 line-clamp-2 
            animate-slide-down
          "
        >
          {title}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-[18px] animate-fade-in">
          {description}
        </p>

        {/* Completed Count */}
        <p className="text-[13px] text-gray-700/80 font-medium mt-3 leading-[18px] animate-fade-in">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist?.length || 0}
          </span>
        </p>

        {/* TODO LIST with Fade-in Animation */}
     {/* 🔥 ENHANCED TODO LIST SECTION */}
<div className="mt-4 bg-gray-50/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200 shadow-inner">
  <p className="text-[13px] font-semibold text-gray-700 mb-2">
    Task Checklist
  </p>

  <div className="max-h-28 overflow-y-auto pr-1 space-y-2">
    {todoChecklist?.map((todo, index) => (
      <div
        key={todo._id}
        className={`
          flex items-start justify-between p-2 rounded-lg 
          transition-all duration-300 border 
          ${
            todo.completed
              ? "bg-green-50 border-green-200"
              : "bg-white border-gray-200 hover:border-blue-300"
          }
          animate-fade-in opacity-0
          [animation-delay:0.12s*var(--i)]
        `}
        style={{ "--i": index }}
      >
        {/* LEFT SIDE ICON + TEXT */}
        <div className="flex items-start gap-2">
          {todo.completed ? (
            <FaCircleCheck className="text-green-600 text-[15px] mt-0.5" />
          ) : (
            <IoRadioButtonOff className="text-gray-400 text-[15px] mt-0.5" />
          )}

          <span
            className={`text-[13px] leading-tight ${
              todo.completed ? "text-gray-500" : "text-gray-700"
            }`}
          >
            {todo.text}
          </span>
        </div>

        {/* STATUS CHIP */}
        <span
          className={`
            text-[10px] font-semibold px-2 py-0.5 rounded-full
            ${
              todo.completed
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }
          `}
        >
          {todo.completed ? "Done" : "Pending"}
        </span>
      </div>
    ))}
  </div>
</div>

        {/* Progress Bar */}
        <div className="animate-slide-up mt-2">
          <Progress progress={progress} status={status} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 mt-4 animate-fade-in">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Start</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Due</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg animate-fade-in">
              <FaFileLines className="text-primary" />
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
