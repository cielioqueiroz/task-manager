import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export default function AuthPage() {
  const { t } = useTranslation()
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${darkMode ? 'from-[#0f111a] to-[#181b2a]' : 'from-slate-100 to-slate-200'}`}>
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <ThemeSwitcher darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <LanguageSwitcher />
      </div>

      <div className={`w-full max-w-md p-8 backdrop-blur-xl rounded-xl border shadow-2xl ${
        darkMode
          ? 'bg-white/5 border-white/10'
          : 'bg-white/30 border-white/20'
      }`}>
        <div className="mb-6 text-center">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🔐 {t('app.title')}
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {t('app.subtitle')}
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3b82f6',
                  brandAccent: '#1d4ed8',
                  brandButtonText: 'white',
                  defaultButtonBackground: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  defaultButtonBackgroundHover: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  defaultButtonBorder: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  defaultButtonText: darkMode ? '#e5e7eb' : '#1f2937',
                  dividerBackground: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  inputBackground: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                  inputBorder: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  inputBorderHover: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  inputBorderFocus: '#3b82f6',
                  inputText: darkMode ? '#f3f4f6' : '#1f2937',
                  inputLabelText: darkMode ? '#d1d5db' : '#374151',
                  inputPlaceholder: darkMode ? '#9ca3af' : '#9ca3af',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '0.5rem',
                  buttonBorderRadius: '0.5rem',
                  inputBorderRadius: '0.5rem',
                },
              },
            },
            className: {
              container: 'supabase-container',
              button: 'supabase-button',
              input: 'supabase-input',
            },
          }}
          localization={{
            variables: {
              pt: {
                sign_up: {
                  email_label: 'Endereço de email',
                  password_label: 'Crie uma senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Sua senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Não tem uma conta? Criar agora',
                  confirmation_text: 'Verifique seu email para confirmar sua conta',
                },
                sign_in: {
                  email_label: 'Endereço de email',
                  password_label: 'Sua senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Sua senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entrar',
                },
                magic_link: {
                  email_input_label: 'Seu email',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar link mágico',
                  loading_button_label: 'Enviando link...',
                  link_text: 'Enviar um link mágico por email',
                  confirmation_text: 'Verifique seu email para o link mágico',
                },
                forgotten_password: {
                  email_label: 'Seu email',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar instruções de redefinição',
                  loading_button_label: 'Enviando instruções...',
                  link_text: 'Esqueceu sua senha?',
                  confirmation_text: 'Verifique seu email para as instruções de redefinição',
                },
                update_password: {
                  password_label: 'Nova senha',
                  password_input_placeholder: 'Sua nova senha',
                  password_confirm_label: 'Confirme sua nova senha',
                  password_confirm_input_placeholder: 'Confirme sua nova senha',
                  button_label: 'Atualizar senha',
                  loading_button_label: 'Atualizando senha...',
                },
              }
            }
          }}
          theme={darkMode ? 'dark' : 'light'}
          providers={['github', 'google']}
          redirectTo={`${window.location.origin}`}
          onAuthStateChange={(event, session) => {
            if (event === 'SIGNED_IN') {
              logger.action('user_signed_in', {
                email: session?.user?.email,
                provider: session?.user?.app_metadata?.provider
              })
            }
          }}
        />

        <div className={`mt-6 text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>🔒 Sua conta é protegida com segurança de nível empresarial</p>
        </div>
      </div>
    </div>
  )
}
