import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LOCALE_MAP = {
  'pt-BR': 'pt-BR',
  'en': 'en-US',
  'es': 'es-ES',
  'zh': 'zh-CN',
  'ru': 'ru-RU',
  'de': 'de-DE'
}

export default function Footer() {
  const { t, i18n } = useTranslation()
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      const locale = LOCALE_MAP[i18n.language] || 'pt-BR'

      const formatted = now.toLocaleDateString(locale, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
      const time = now.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
      })
      setCurrentDate(`${formatted} • ${time}`)
    }

    updateDate()
    const interval = setInterval(updateDate, 60000)
    return () => clearInterval(interval)
  }, [i18n.language])

  return (
    <footer className="sticky bottom-0 border-t border-white/10 bg-white/5 backdrop-blur-xl py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-white/60 flex items-center justify-center gap-2">
          <span>{t('footer.createdBy')}</span>
          <span className="font-bold text-white">Ciélio Queiroz</span>
          <span className="mx-1">•</span>
          <span className="font-medium">{currentDate}</span>
        </p>
      </div>
    </footer>
  )
}
