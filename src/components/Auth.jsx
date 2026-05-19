import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import Toast from './Toast'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef, useCallback } from 'react'

const localizationMap = {
  'pt-BR': {
    sign_up: {
      email_label: 'Endereço de email',
      password_label: 'Crie uma senha',
      email_input_placeholder: 'Digite seu email',
      password_input_placeholder: 'Digite sua senha',
      button_label: 'Criar conta',
      loading_button_label: 'Criando conta...',
      social_provider_text: 'Entrar com {{provider}}',
      link_text: 'Não tem uma conta? Criar agora',
      confirmation_text: 'Verifique seu email para confirmar sua conta',
    },
    sign_in: {
      email_label: 'Endereço de email',
      password_label: 'Sua senha',
      email_input_placeholder: 'Digite seu email',
      password_input_placeholder: 'Digite sua senha',
      button_label: 'Entrar',
      loading_button_label: 'Entrando...',
      social_provider_text: 'Entrar com {{provider}}',
      link_text: 'Já tem uma conta? Entrar',
    },
    magic_link: {
      email_input_label: 'Seu email',
      email_input_placeholder: 'Digite seu email',
      button_label: 'Enviar link mágico',
      loading_button_label: 'Enviando link...',
      link_text: 'Enviar um link mágico por email',
      confirmation_text: 'Verifique seu email para o link mágico',
    },
    forgotten_password: {
      email_label: 'Seu email',
      email_input_placeholder: 'Digite seu email',
      button_label: 'Enviar instruções de redefinição',
      loading_button_label: 'Enviando instruções...',
      link_text: 'Esqueceu sua senha?',
      confirmation_text: 'Verifique seu email para as instruções de redefinição',
    },
    update_password: {
      password_label: 'Nova senha',
      password_input_placeholder: 'Digite sua nova senha',
      password_confirm_label: 'Confirme sua nova senha',
      password_confirm_input_placeholder: 'Confirme sua senha',
      button_label: 'Atualizar senha',
      loading_button_label: 'Atualizando senha...',
    },
    errors: {
      validation_email_required: 'É necessário um email válido',
      validation_password_required: 'É necessário uma senha',
      validation_email_or_phone_required: 'É necessário um email válido',
      invalid_email_or_password: 'Email ou senha inválidos',
      user_already_exists: 'Este email já está registrado',
      invalid_credentials: 'Email ou senha inválidos',
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
    errors: {
      validation_email_required: 'A valid email is required',
      validation_password_required: 'A password is required',
      validation_email_or_phone_required: 'A valid email is required',
      invalid_email_or_password: 'Invalid email or password',
      user_already_exists: 'This email is already registered',
      invalid_credentials: 'Invalid email or password',
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
    errors: {
      validation_email_required: 'Se requiere un correo válido',
      validation_password_required: 'Se requiere una contraseña',
      validation_email_or_phone_required: 'Se requiere un correo válido',
      invalid_email_or_password: 'Correo o contraseña inválidos',
      user_already_exists: 'Este correo ya está registrado',
      invalid_credentials: 'Correo o contraseña inválidos',
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
    errors: {
      validation_email_required: '需要有效的电子邮件',
      validation_password_required: '需要密码',
      validation_email_or_phone_required: '需要有效的电子邮件',
      invalid_email_or_password: '电子邮件或密码无效',
      user_already_exists: '此电子邮件已注册',
      invalid_credentials: '电子邮件或密码无效',
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
    errors: {
      validation_email_required: 'Требуется действительный адрес электронной почты',
      validation_password_required: 'Требуется пароль',
      validation_email_or_phone_required: 'Требуется действительный адрес электронной почты',
      invalid_email_or_password: 'Неверный адрес электронной почты или пароль',
      user_already_exists: 'Этот адрес электронной почты уже зарегистрирован',
      invalid_credentials: 'Неверный адрес электронной почты или пароль',
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
    errors: {
      validation_email_required: 'Eine gültige E-Mail ist erforderlich',
      validation_password_required: 'Ein Passwort ist erforderlich',
      validation_email_or_phone_required: 'Eine gültige E-Mail ist erforderlich',
      invalid_email_or_password: 'Ungültige E-Mail oder Passwort',
      user_already_exists: 'Diese E-Mail ist bereits registriert',
      invalid_credentials: 'Ungültige E-Mail oder Passwort',
    },
  },
}

export default function AuthPage() {
  const { t, i18n } = useTranslation()
  const [darkMode, setDarkMode] = useState(true)
  const [localization, setLocalization] = useState(localizationMap['pt-BR'])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const authContainerRef = useRef(null)
  const toastShownRef = useRef(false)
  const errorElementsRef = useRef([])

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

  const handleToastClose = useCallback(() => {
    setShowToast(false)
  }, [])

  // Resetar flag quando toast fecha para permitir próximos erros
  useEffect(() => {
    if (!showToast) {
      toastShownRef.current = false
      // Restaurar elementos de erro quando toast fecha (para que possam ser detectados novamente)
      errorElementsRef.current.forEach(el => {
        if (el && el.style) {
          el.style.display = ''
        }
      })
      errorElementsRef.current = []
    }
  }, [showToast])

  useEffect(() => {
    const addPasswordToggle = () => {
      if (!authContainerRef.current) return

      const passwordInputs = authContainerRef.current.querySelectorAll('input[type="password"]')

      passwordInputs.forEach(input => {
        if (input.dataset.hasToggle) return

        input.dataset.hasToggle = 'true'

        // Configurar o input
        input.style.paddingRight = '48px'

        // Criar container relativo
        const container = document.createElement('div')
        container.style.position = 'relative'
        container.style.width = '100%'

        // Inserir o container antes do input e mover o input para dentro
        input.parentElement?.insertBefore(container, input)
        container.appendChild(input)

        // Criar botão
        const toggleBtn = document.createElement('button')
        toggleBtn.type = 'button'
        toggleBtn.innerHTML = '<i class="fas fa-eye" style="font-size: 16px;"></i>'
        toggleBtn.style.position = 'absolute'
        toggleBtn.style.right = '12px'
        toggleBtn.style.top = '50%'
        toggleBtn.style.transform = 'translateY(-50%)'
        toggleBtn.style.background = 'none'
        toggleBtn.style.border = 'none'
        toggleBtn.style.color = 'rgba(255, 255, 255, 0.5)'
        toggleBtn.style.cursor = 'pointer'
        toggleBtn.style.padding = '8px'
        toggleBtn.style.display = 'flex'
        toggleBtn.style.alignItems = 'center'
        toggleBtn.style.justifyContent = 'center'
        toggleBtn.style.zIndex = '10'
        toggleBtn.setAttribute('aria-label', 'Mostrar/Esconder senha')

        // Hover effect
        toggleBtn.addEventListener('mouseenter', () => {
          toggleBtn.style.color = 'rgba(255, 255, 255, 0.8)'
        })
        toggleBtn.addEventListener('mouseleave', () => {
          toggleBtn.style.color = 'rgba(255, 255, 255, 0.5)'
        })

        container.appendChild(toggleBtn)

        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault()
          const isPassword = input.type === 'password'
          input.type = isPassword ? 'text' : 'password'
          toggleBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash" style="font-size: 16px;"></i>' : '<i class="fas fa-eye" style="font-size: 16px;"></i>'
        })
      })
    }

    const toggleInterval = setInterval(addPasswordToggle, 300)

    return () => clearInterval(toggleInterval)
  }, [])

  useEffect(() => {
    let rafId = null

    const validateAndShowToast = () => {
      if (!authContainerRef.current || toastShownRef.current) {
        rafId = requestAnimationFrame(validateAndShowToast)
        return
      }

      const allElements = authContainerRef.current.querySelectorAll('*')

      for (let element of allElements) {
        const text = element.textContent?.toLowerCase() || ''
        const isVisible = element.offsetParent !== null

        if (!isVisible) continue

        let errorMessage = null

        // Erros de email não confirmado
        if (text.includes('email not confirmed')) {
          errorMessage = '❌ Email não confirmado.\n\nPor favor, verifique seu email e clique no link de confirmação para ativar sua conta.'
        }
        // Erros de login anônimo desabilitado (campos vazios)
        else if (text.includes('anonymous sign-ins are disabled')) {
          errorMessage = 'Por favor, insira seu email e senha para criar uma conta.'
        }
        // Erros de validação de força de senha
        else if (text.includes('password should be at least')) {
          errorMessage = '❌ Senha fraca.\n\nA senha deve ter no mínimo 6 caracteres.\n\nCrie uma senha mais forte para sua segurança.'
        }
        // Erros de validação (campos vazios)
        else if (text.includes('missing email') || text.includes('missing password') || text.includes('missing email or phone')) {
          errorMessage = 'Por favor, insira seus dados (e-mail e senha) para ter acesso ao sistema.'
        }
        // Erros de email inválido
        else if (text.includes('invalid email') && !text.includes('invalid email or password')) {
          errorMessage = '❌ Email inválido.\n\nPor favor, digite um email válido no formato: seu@email.com'
        }
        // Erros de autenticação (credenciais inválidas)
        else if (text.includes('invalid login') || text.includes('invalid email or password') || text.includes('invalid credentials')) {
          errorMessage = '❌ Email ou senha incorretos.\n\nNão tem conta? Clique em "Criar agora" para se registrar.'
        }
        // Erros de usuário não existe
        else if (text.includes('user not found') || text.includes('user doesn\'t exist')) {
          errorMessage = '❌ Esta conta não existe.\n\nClique em "Criar agora" para criar uma nova conta.'
        }
        // Email já registrado
        else if (text.includes('already registered') || text.includes('user already exists')) {
          errorMessage = '❌ Este email já está registrado.\n\nClique em "Entrar" para fazer login na sua conta.'
        }

        if (errorMessage) {
          // Esconder elemento de erro e rastrear para restaurar depois
          element.style.display = 'none'
          errorElementsRef.current.push(element)

          toastShownRef.current = true
          setToastMessage(errorMessage)
          setShowToast(true)
          break
        }
      }

      rafId = requestAnimationFrame(validateAndShowToast)
    }

    rafId = requestAnimationFrame(validateAndShowToast)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

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

        <div ref={authContainerRef}>
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
        </div>

        {showToast && <Toast message={toastMessage} type="info" variant="modal" onClose={handleToastClose} />}

        <div className={`mt-6 text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>🔒 {t('auth.security')}</p>
        </div>
      </div>
    </div>
  )
}
