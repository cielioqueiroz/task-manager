import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

const localizationMap = {
  'pt-BR': {
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
  },
  en: {
    sign_up: {
      email_label: 'Email address',
      password_label: 'Create a password',
      email_input_placeholder: 'your@email.com',
      password_input_placeholder: 'Your password',
      button_label: 'Sign up',
      loading_button_label: 'Signing up...',
      social_provider_text: 'Sign in with {{provider}}',
      link_text: "Don't have an account? Sign up",
      confirmation_text: 'Verify the link in your email',
    },
    sign_in: {
      email_label: 'Email address',
      password_label: 'Your password',
      email_input_placeholder: 'your@email.com',
      password_input_placeholder: 'Your password',
      button_label: 'Sign in',
      loading_button_label: 'Signing in...',
      social_provider_text: 'Sign in with {{provider}}',
      link_text: 'Already have an account? Sign in',
    },
    magic_link: {
      email_input_label: 'Your email',
      email_input_placeholder: 'your@email.com',
      button_label: 'Send magic link',
      loading_button_label: 'Sending link...',
      link_text: 'Send a magic link by email',
      confirmation_text: 'Check your email for the magic link',
    },
    forgotten_password: {
      email_label: 'Your email',
      email_input_placeholder: 'your@email.com',
      button_label: 'Send reset instructions',
      loading_button_label: 'Sending instructions...',
      link_text: 'Forgot your password?',
      confirmation_text: 'Check your email for reset instructions',
    },
    update_password: {
      password_label: 'New password',
      password_input_placeholder: 'Your new password',
      password_confirm_label: 'Confirm new password',
      password_confirm_input_placeholder: 'Confirm your password',
      button_label: 'Update password',
      loading_button_label: 'Updating password...',
    },
  },
  es: {
    sign_up: {
      email_label: 'Correo electrónico',
      password_label: 'Crear contraseña',
      email_input_placeholder: 'tu@correo.com',
      password_input_placeholder: 'Tu contraseña',
      button_label: 'Registrarse',
      loading_button_label: 'Registrándose...',
      social_provider_text: 'Entrar con {{provider}}',
      link_text: '¿No tienes cuenta? Registrate',
      confirmation_text: 'Verifica el enlace en tu correo',
    },
    sign_in: {
      email_label: 'Correo electrónico',
      password_label: 'Tu contraseña',
      email_input_placeholder: 'tu@correo.com',
      password_input_placeholder: 'Tu contraseña',
      button_label: 'Entrar',
      loading_button_label: 'Entrando...',
      social_provider_text: 'Entrar con {{provider}}',
      link_text: '¿Ya tienes cuenta? Entrar',
    },
    magic_link: {
      email_input_label: 'Tu correo',
      email_input_placeholder: 'tu@correo.com',
      button_label: 'Enviar enlace mágico',
      loading_button_label: 'Enviando enlace...',
      link_text: 'Enviar un enlace mágico por correo',
      confirmation_text: 'Revisa tu correo para el enlace mágico',
    },
    forgotten_password: {
      email_label: 'Tu correo',
      email_input_placeholder: 'tu@correo.com',
      button_label: 'Enviar instrucciones de reinicio',
      loading_button_label: 'Enviando instrucciones...',
      link_text: '¿Olvidaste tu contraseña?',
      confirmation_text: 'Revisa tu correo para las instrucciones',
    },
    update_password: {
      password_label: 'Nueva contraseña',
      password_input_placeholder: 'Tu nueva contraseña',
      password_confirm_label: 'Confirma tu nueva contraseña',
      password_confirm_input_placeholder: 'Confirma tu contraseña',
      button_label: 'Actualizar contraseña',
      loading_button_label: 'Actualizando contraseña...',
    },
  },
  zh: {
    sign_up: {
      email_label: '电子邮件',
      password_label: '创建密码',
      email_input_placeholder: 'your@email.com',
      password_input_placeholder: '你的密码',
      button_label: '注册',
      loading_button_label: '正在注册...',
      social_provider_text: '使用 {{provider}} 登录',
      link_text: '没有账户？立即注册',
      confirmation_text: '请验证您的电子邮件',
    },
    sign_in: {
      email_label: '电子邮件',
      password_label: '你的密码',
      email_input_placeholder: 'your@email.com',
      password_input_placeholder: '你的密码',
      button_label: '登录',
      loading_button_label: '正在登录...',
      social_provider_text: '使用 {{provider}} 登录',
      link_text: '已有账户？登录',
    },
    magic_link: {
      email_input_label: '您的电子邮件',
      email_input_placeholder: 'your@email.com',
      button_label: '发送魔法链接',
      loading_button_label: '正在发送...',
      link_text: '发送魔法链接',
      confirmation_text: '请检查您的电子邮件',
    },
    forgotten_password: {
      email_label: '您的电子邮件',
      email_input_placeholder: 'your@email.com',
      button_label: '发送重置说明',
      loading_button_label: '正在发送...',
      link_text: '忘记密码？',
      confirmation_text: '请检查您的电子邮件获取重置说明',
    },
    update_password: {
      password_label: '新密码',
      password_input_placeholder: '你的新密码',
      password_confirm_label: '确认新密码',
      password_confirm_input_placeholder: '确认你的密码',
      button_label: '更新密码',
      loading_button_label: '正在更新...',
    },
  },
  ru: {
    sign_up: {
      email_label: 'Адрес электронной почты',
      password_label: 'Создать пароль',
      email_input_placeholder: 'ваша@почта.com',
      password_input_placeholder: 'Ваш пароль',
      button_label: 'Зарегистрироваться',
      loading_button_label: 'Регистрация...',
      social_provider_text: 'Войти через {{provider}}',
      link_text: 'Нет аккаунта? Зарегистрироваться',
      confirmation_text: 'Проверьте свой email',
    },
    sign_in: {
      email_label: 'Адрес электронной почты',
      password_label: 'Ваш пароль',
      email_input_placeholder: 'ваша@почта.com',
      password_input_placeholder: 'Ваш пароль',
      button_label: 'Войти',
      loading_button_label: 'Вход...',
      social_provider_text: 'Войти через {{provider}}',
      link_text: 'Уже есть аккаунт? Войти',
    },
    magic_link: {
      email_input_label: 'Ваша электронная почта',
      email_input_placeholder: 'ваша@почта.com',
      button_label: 'Отправить волшебную ссылку',
      loading_button_label: 'Отправка...',
      link_text: 'Отправить волшебную ссылку',
      confirmation_text: 'Проверьте свой email',
    },
    forgotten_password: {
      email_label: 'Ваша электронная почта',
      email_input_placeholder: 'ваша@почта.com',
      button_label: 'Отправить инструкции',
      loading_button_label: 'Отправка...',
      link_text: 'Забыли пароль?',
      confirmation_text: 'Проверьте свой email',
    },
    update_password: {
      password_label: 'Новый пароль',
      password_input_placeholder: 'Ваш новый пароль',
      password_confirm_label: 'Подтвердите новый пароль',
      password_confirm_input_placeholder: 'Подтвердите пароль',
      button_label: 'Обновить пароль',
      loading_button_label: 'Обновление...',
    },
  },
  de: {
    sign_up: {
      email_label: 'E-Mail-Adresse',
      password_label: 'Passwort erstellen',
      email_input_placeholder: 'deine@email.com',
      password_input_placeholder: 'Dein Passwort',
      button_label: 'Registrieren',
      loading_button_label: 'Wird registriert...',
      social_provider_text: 'Mit {{provider}} anmelden',
      link_text: 'Kein Konto? Jetzt registrieren',
      confirmation_text: 'Bestätige deine E-Mail',
    },
    sign_in: {
      email_label: 'E-Mail-Adresse',
      password_label: 'Dein Passwort',
      email_input_placeholder: 'deine@email.com',
      password_input_placeholder: 'Dein Passwort',
      button_label: 'Anmelden',
      loading_button_label: 'Wird angemeldet...',
      social_provider_text: 'Mit {{provider}} anmelden',
      link_text: 'Hast du ein Konto? Anmelden',
    },
    magic_link: {
      email_input_label: 'Deine E-Mail',
      email_input_placeholder: 'deine@email.com',
      button_label: 'Zauberllink senden',
      loading_button_label: 'Wird gesendet...',
      link_text: 'Zauberllink per E-Mail senden',
      confirmation_text: 'Überprüfe deine E-Mail',
    },
    forgotten_password: {
      email_label: 'Deine E-Mail',
      email_input_placeholder: 'deine@email.com',
      button_label: 'Zurücksetzen senden',
      loading_button_label: 'Wird gesendet...',
      link_text: 'Passwort vergessen?',
      confirmation_text: 'Überprüfe deine E-Mail',
    },
    update_password: {
      password_label: 'Neues Passwort',
      password_input_placeholder: 'Dein neues Passwort',
      password_confirm_label: 'Neues Passwort bestätigen',
      password_confirm_input_placeholder: 'Bestätige dein Passwort',
      button_label: 'Passwort aktualisieren',
      loading_button_label: 'Wird aktualisiert...',
    },
  },
}

export default function AuthPage() {
  const { t, i18n } = useTranslation()
  const [darkMode, setDarkMode] = useState(true)
  const [localization, setLocalization] = useState(localizationMap['pt-BR'])

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

  useEffect(() => {
    const currentLang = i18n.language || 'pt-BR'
    setLocalization(localizationMap[currentLang] || localizationMap['pt-BR'])
  }, [i18n.language])

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
            🔐 Task Manager
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
            variables: localization
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
          <p>🔒 {t('auth.security')}</p>
        </div>
      </div>
    </div>
  )
}
