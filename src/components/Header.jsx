import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import { useTranslation } from 'react-i18next'

export default function Header({ darkMode, onToggleDarkMode, user, onLogout }) {
  const { t } = useTranslation()
  const handleLogout = async () => {
    try {
      logger.action('logout_attempt')
      const { error } = await supabase.auth.signOut()

      if (error) {
        logger.error('logout_failed', error)
        return
      }

      logger.action('logout_success')
      if (onLogout) onLogout()
    } catch (error) {
      logger.error('logout_error', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <i className="fas fa-check-double text-white text-xl"></i>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
              <p className="text-sm text-white/60 font-medium">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {user && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
                <span className="text-sm text-gray-300 hidden sm:inline">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/30"
                  title={t('header.logout')}
                >
                  <i className="fas fa-sign-out-alt mr-1"></i>{t('header.logout')}
                </button>
              </div>
            )}

            <ThemeSwitcher darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
          </div>
        </div>
      </div>
    </header>
  )
}
