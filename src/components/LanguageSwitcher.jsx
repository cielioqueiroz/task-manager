import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷', country: 'Brasil' },
    { code: 'en', name: 'English', flag: '🇺🇸', country: 'USA' },
    { code: 'es', name: 'Español', flag: '🇪🇸', country: 'España' },
    { code: 'zh', name: '中文', flag: '🇨🇳', country: '中国' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', country: 'Россия' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', country: 'Deutschland' }
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
        <span className="text-base">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#181b2a] border border-white/10 rounded-lg shadow-2xl z-50 backdrop-blur-xl">
          <div className="p-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  i18n.language === lang.code
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{lang.name}</div>
                  <div className="text-xs text-gray-500">{lang.country}</div>
                </div>
                {i18n.language === lang.code && (
                  <i className="fas fa-check text-blue-400 text-lg"></i>
                )}
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
