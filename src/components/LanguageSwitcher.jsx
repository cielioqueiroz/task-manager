import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'pt-BR', name: 'Português', countryCode: 'br' },
    { code: 'en', name: 'English', countryCode: 'us' },
    { code: 'es', name: 'Español', countryCode: 'es' },
    { code: 'zh', name: '中文', countryCode: 'cn' },
    { code: 'ru', name: 'Русский', countryCode: 'ru' },
    { code: 'de', name: 'Deutsch', countryCode: 'de' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language)

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-gray-300 hover:text-white text-sm font-medium"
        title="Mudar idioma"
      >
        <i className={`fi fi-${currentLanguage?.countryCode} text-lg`}></i>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 bg-[#181b2a] border border-white/10 rounded-xl shadow-2xl z-50 backdrop-blur-xl overflow-hidden min-w-80">
          <div className="p-8 grid grid-cols-3 gap-6">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex flex-col items-center gap-3 transition-all ${
                  i18n.language === lang.code
                    ? 'opacity-100'
                    : 'opacity-75 hover:opacity-100'
                }`}
                title={lang.name}
              >
                <div className={`flex items-center justify-center w-20 h-20 rounded-full transition-all ${
                  i18n.language === lang.code
                    ? 'bg-blue-500/40 border-2 border-blue-400 shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}>
                  <i className={`fi fi-${lang.countryCode} text-5xl`}></i>
                </div>
                <span className={`text-sm font-medium text-center ${i18n.language === lang.code ? 'text-blue-300' : 'text-gray-400'}`}>
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
