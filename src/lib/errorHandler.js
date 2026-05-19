/**
 * Error Handler - Sanitiza erros antes de mostrar ao usuário
 * Evita exposição de informações sensíveis
 */

const ERROR_MESSAGES = {
  // Erros Supabase
  'PGRST116': 'Sua sessão expirou. Faça login novamente.',
  'PGRST000': 'Erro ao conectar ao banco de dados',
  'PGRST001': 'Erro ao processar requisição',
  'PGRST002': 'Erro de permissão',
  'PGRST003': 'Recurso não encontrado',

  // Erros de rede
  'network': 'Erro de conexão. Verifique sua internet.',
  'timeout': 'A requisição demorou muito. Tente novamente.',
  'offline': 'Você está offline',

  // Erros de validação
  'validation': 'Dados inválidos. Verifique sua entrada.',
  'invalid_input': 'Entrada inválida',

  // Erros genéricos
  'unknown': 'Algo deu errado. Tente novamente.',
  'error': 'Erro desconhecido'
}

/**
 * Obtém mensagem de erro segura para mostrar ao usuário
 * Em desenvolvimento: mostra erro completo no console
 * Em produção: mostra mensagem genérica ao usuário
 */
export function getSafeErrorMessage(error, context = '') {
  const isDev = process.env.NODE_ENV === 'development'

  // Log completo apenas em desenvolvimento
  if (isDev && error) {
    console.error(`[ERROR - ${context}]`, {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      details: error?.details,
      fullError: error
    })
  }

  // Retornar mensagem segura
  if (!error) {
    return ERROR_MESSAGES.unknown
  }

  const code = error?.code || error?.status || 'unknown'
  const message = ERROR_MESSAGES[code]

  // Se temos mensagem mapeada, usar
  if (message) {
    return message
  }

  // Fallback para mensagem genérica
  if (isDev) {
    // Em dev, mostrar mais detalhes
    return error?.message || ERROR_MESSAGES.unknown
  }

  // Em produção, nunca expor detalhes técnicos
  return ERROR_MESSAGES.unknown
}

/**
 * Classifica tipo de erro para logging
 */
export function getErrorType(error) {
  if (!error) return 'unknown'

  if (error?.code === 'PGRST116') return 'auth_expired'
  if (error?.status === 401) return 'unauthorized'
  if (error?.status === 403) return 'forbidden'
  if (error?.status === 404) return 'not_found'
  if (error?.status === 429) return 'rate_limited'
  if (error?.message?.includes('network')) return 'network_error'
  if (error?.message?.includes('offline')) return 'offline'
  if (error?.code?.startsWith('PGRST')) return 'database_error'

  return 'unknown_error'
}

/**
 * Wrapper para operações assíncronas com error handling
 */
export async function safeAsyncOperation(operation, context = '') {
  try {
    return {
      success: true,
      data: await operation()
    }
  } catch (error) {
    const type = getErrorType(error)
    const message = getSafeErrorMessage(error, context)

    return {
      success: false,
      error: {
        type,
        message,
        details: process.env.NODE_ENV === 'development' ? error : null
      }
    }
  }
}
