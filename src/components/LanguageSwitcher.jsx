import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
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
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-[#181b2a] border border-white/10 rounded-lg shadow-2xl z-50 backdrop-blur-xl overflow-hidden">
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg transition-all text-xs ${
                  i18n.language === lang.code
                    ? 'bg-blue-500/30 border border-blue-500/50'
                    : 'hover:bg-white/10'
                }`}
                title={lang.name}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span className={i18n.language === lang.code ? 'text-blue-400 font-medium' : 'text-gray-300'}>
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
