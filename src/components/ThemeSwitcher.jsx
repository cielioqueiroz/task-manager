import { useTranslation } from 'react-i18next'

export default function ThemeSwitcher({ darkMode, onToggleDarkMode }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
      <button
        onClick={onToggleDarkMode}
        className={`p-2.5 rounded-full transition-all duration-200 ${
          darkMode
            ? 'bg-white/20 text-yellow-400'
            : 'text-blue-400'
        }`}
        title={t('header.darkMode')}
      >
        <i className="fas fa-moon text-lg"></i>
      </button>
      <button
        onClick={onToggleDarkMode}
        className={`p-2.5 rounded-full transition-all duration-200 ${
          !darkMode
            ? 'bg-white/20 text-yellow-400'
            : 'text-blue-400'
        }`}
        title={t('header.lightMode')}
      >
        <i className="fas fa-sun text-lg"></i>
      </button>
    </div>
  )
}
