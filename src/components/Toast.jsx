export default function Toast({ message, type = 'success' }) {
  const iconMap = {
    success: { icon: 'fa-check-circle', color: 'text-emerald-400' },
    error: { icon: 'fa-exclamation-circle', color: 'text-red-400' },
    info: { icon: 'fa-info-circle', color: 'text-blue-400' }
  }

  const iconData = iconMap[type] || iconMap.success

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
