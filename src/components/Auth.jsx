import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f111a] to-[#181b2a]">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">🔐 Task Manager</h1>
          <p className="text-gray-400">Entre na sua conta para gerenciar suas tarefas</p>
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
                  defaultButtonBackground: 'rgba(255, 255, 255, 0.05)',
                  defaultButtonBackgroundHover: 'rgba(255, 255, 255, 0.1)',
                  defaultButtonBorder: 'rgba(255, 255, 255, 0.1)',
                  defaultButtonText: '#e5e7eb',
                  dividerBackground: 'rgba(255, 255, 255, 0.1)',
                  inputBackground: 'rgba(255, 255, 255, 0.05)',
                  inputBorder: 'rgba(255, 255, 255, 0.1)',
                  inputBorderHover: 'rgba(255, 255, 255, 0.2)',
                  inputBorderFocus: '#3b82f6',
                  inputText: '#f3f4f6',
                  inputLabelText: '#d1d5db',
                  inputPlaceholder: '#9ca3af',
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
          theme="dark"
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

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Sua conta é protegida com segurança de nível empresarial</p>
        </div>
      </div>
    </div>
  )
}
