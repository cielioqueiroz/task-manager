import { useEffect, useState } from 'react'

export default function Footer() {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      const formatted = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
      const time = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
      setCurrentDate(`${formatted} • ${time}`)
    }

    updateDate()
    const interval = setInterval(updateDate, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="sticky bottom-0 border-t border-white/10 bg-white/5 backdrop-blur-xl py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-white/60 flex items-center justify-center gap-2">
          <i className="fas fa-copyright text-white/40"></i>
          <span className="font-bold text-white">Cielio Queiroz</span>
          <span className="mx-1">•</span>
          <span className="font-medium">{currentDate}</span>
        </p>
      </div>
    </footer>
  )
}
