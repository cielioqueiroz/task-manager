import { supabase } from './supabase'

export async function testConnection() {
  try {
    console.log('🧪 Testando conexão com Supabase...')
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('Key está definida:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Erro na conexão:', error)
      return { success: false, error }
    }

    console.log('✅ Conexão OK! Dados:', data)
    return { success: true, data }
  } catch (err) {
    console.error('❌ Erro ao testar:', err)
    return { success: false, error: err }
  }
}
