import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'pt-BR', name: 'Português - Br', countryCode: 'br' },
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'es', name: 'Español', countryCode: 'es' },
  { code: 'zh', name: '中文', countryCode: 'cn' },
  { code: 'ru', name: 'Русский', countryCode: 'ru' },
  { code: 'de', name: 'Deutsch', countryCode: 'de' }
]

function LanguageOption({ lang, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 w-full focus:outline-none transition-all duration-200 group"
      title={lang.name}
      aria-label={lang.name}
    >
      {/* Circular Flag - Compact */}
      <div
        className={`
          w-10 h-10 aspect-square
          flex items-center justify-center
          rounded-full overflow-hidden
          transition-all duration-300
          cursor-pointer
          ${isSelected
            ? 'ring-2 ring-blue-500 dark:ring-blue-400/70 shadow-sm dark:shadow-md shadow-blue-400/30 dark:shadow-blue-500/20 scale-105'
            : 'ring-1 ring-gray-300 dark:ring-white/15 shadow-xs shadow-gray-300/40 dark:shadow-black/20 group-hover:ring-2 group-hover:ring-blue-400 dark:group-hover:ring-blue-500/60 group-hover:shadow-sm dark:group-hover:shadow-md group-hover:shadow-blue-400/40 dark:group-hover:shadow-blue-500/30 group-hover:scale-105'
          }
        `}
      >
        {/* Flag Icon */}
        <i className={`fi fi-${lang.countryCode} text-3xl leading-none transition-transform duration-300`}></i>
      </div>

      {/* Language Name */}
      <span
        className={`
          text-xs font-medium transition-colors duration-300 text-center
          ${isSelected
            ? 'text-blue-600 dark:text-blue-300 font-semibold'
            : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 font-medium'
          }
        `}
      >
        {lang.name}
      </span>
    </button>
  )
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language)

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Main Button - Light/Dark Mode */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-gray-50 border border-gray-200
          dark:bg-white/5 dark:border-white/12
          hover:bg-gray-100 dark:hover:bg-white/10
          hover:border-gray-300 dark:hover:border-white/20
          active:bg-gray-200 dark:active:bg-white/12
          transition-all duration-200
          text-gray-900 dark:text-gray-200 text-sm font-medium
          shadow-sm dark:shadow-none
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
        `}
        aria-label={`Idioma atual: ${currentLanguage?.name}`}
        aria-expanded={isOpen}
      >
        {/* Flag Badge in Button */}
        <div className="w-4 h-4 flex items-center justify-center rounded-full overflow-hidden ring-0.5 ring-gray-300 dark:ring-white/20">
          <i className={`fi fi-${currentLanguage?.countryCode} text-xl scale-110`}></i>
        </div>

        {/* Language Label - Adaptive */}
        <span className="hidden sm:inline text-gray-800 dark:text-gray-300">{currentLanguage?.name}</span>

        {/* Chevron Icon - Adaptive Color */}
        <i
          className={`fas fa-chevron-down text-xs ml-auto text-gray-500 dark:text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Panel - Light/Dark Mode */}
          <div
            className={`
              absolute right-0 top-full mt-2 z-50
              bg-gray-50 dark:bg-slate-950/95
              border border-gray-200 dark:border-white/10
              rounded-xl shadow-lg dark:shadow-xl dark:shadow-black/50
              dark:backdrop-blur-md dark:backdrop-saturate-150
              overflow-hidden
              animate-in fade-in slide-in-from-top-1 duration-150
            `}
          >
            {/* Grid Layout - 3 Columns Compact */}
            <div className="p-3 grid grid-cols-3 gap-3">
              {LANGUAGES.map(lang => (
                <LanguageOption
                  key={lang.code}
                  lang={lang}
                  isSelected={i18n.language === lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
