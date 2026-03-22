'use client'

import { useState, useEffect } from 'react'
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const types = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: FiCheckCircle,
      iconColor: 'text-green-500',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: FiAlertCircle,
      iconColor: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: FiAlertTriangle,
      iconColor: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: FiInfo,
      iconColor: 'text-blue-500',
    },
  }

  const config = types[type]
  const Icon = config.icon

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`border rounded-lg shadow-lg p-4 ${config.bg}`}>
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
          <p className={`flex-1 text-sm font-medium ${config.text}`}>
            {message}
          </p>
          <button
            onClick={handleClose}
            className={`${config.text} hover:opacity-70 transition-opacity`}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast Container for managing multiple toasts
export function ToastContainer({ toasts = [], removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id || index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id || index)}
        />
      ))}
    </div>
  )
}
