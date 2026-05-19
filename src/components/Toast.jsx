import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'success', variant = 'modal', onClose, autoCloseDuration = 4500 }) {
  const [timeoutId, setTimeoutId] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  const iconMap = {
    success: { icon: 'fa-check-circle', color: 'text-emerald-400' },
    error: { icon: 'fa-exclamation-circle', color: 'text-red-400' },
    info: { icon: 'fa-info-circle', color: 'text-blue-400' }
  }

  const iconData = iconMap[type] || iconMap.success

  useEffect(() => {
    if (variant !== 'modal') return

    if (isHovered && timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    } else if (!isHovered && !timeoutId) {
      const id = setTimeout(onClose, autoCloseDuration)
      setTimeoutId(id)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isHovered, variant])

  if (variant === 'modal') {
    const colorConfig = {
      success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
      error: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400' },
      info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400' }
    }[type] || { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400' }

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-200"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className={`bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300 relative`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* Icon Circle */}
            <div className="flex justify-center mb-8">
              <div className={`w-20 h-20 rounded-full ${colorConfig.bg} flex items-center justify-center border ${colorConfig.border}`}>
                <i className={`fas ${iconData.icon} ${colorConfig.icon} text-5xl`}></i>
              </div>
            </div>

            {/* Message */}
            <div className="text-white text-lg font-semibold leading-relaxed tracking-wide whitespace-pre-line">
              {message}
            </div>

            {/* Footer hint */}
            <p className="text-white/40 text-sm mt-8 font-medium">
              Clique no X para fechar
            </p>
          </div>
        </div>
      </>
    )
  }

  const toastClass = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info'
  }[type] || 'toast-success'

  return (
    <div className={`toast ${toastClass}`}>
      <div className="flex items-center gap-3">
        <i className={`fas ${iconData.icon} ${iconData.color}`}></i>
        <span>{message}</span>
      </div>
    </div>
  )
}
