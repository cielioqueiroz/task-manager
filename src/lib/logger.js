/**
 * Logger - Rastreia ações para auditoria e debugging
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
}

class Logger {
  constructor() {
    this.isDev = process.env.NODE_ENV === 'development'
    this.logs = []
    this.maxLogs = 100 // Manter últimos 100 logs em memória
  }

  /**
   * Log genérico
   */
  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Manter histórico
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output
    const logFunction = {
      [LOG_LEVELS.DEBUG]: console.debug,
      [LOG_LEVELS.INFO]: console.info,
      [LOG_LEVELS.WARN]: console.warn,
      [LOG_LEVELS.ERROR]: console.error,
    }[level] || console.log

    logFunction(`[${level}]`, message, data)

    // TODO: Em produção, enviar para servidor de logging
    // this.sendToServer(logEntry)
  }

  debug(message, data) {
    this.log(LOG_LEVELS.DEBUG, message, data)
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data)
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data)
  }

  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data)
  }

  /**
   * Log de ação do usuário
   */
  action(actionName, details = {}) {
    this.info(`ACTION: ${actionName}`, {
      action: actionName,
      ...details
    })
  }

  /**
   * Log de erro
   */
  logError(errorName, error, context = '') {
    this.error(`ERROR: ${errorName}`, {
      error: errorName,
      message: error?.message,
      code: error?.code,
      context,
      stack: this.isDev ? error?.stack : undefined
    })
  }

  /**
   * Log de requisição
   */
  logRequest(operation, method, details = {}) {
    this.debug(`REQUEST: ${method} ${operation}`, details)
  }

  /**
   * Log de resposta
   */
  logResponse(operation, status, details = {}) {
    const level = status === 'success' ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN
    this.log(level, `RESPONSE: ${operation} - ${status}`, details)
  }

  /**
   * Obter histórico de logs
   */
  getHistory() {
    return this.logs
  }

  /**
   * Exportar logs para análise
   */
  export() {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Limpar logs
   */
  clear() {
    this.logs = []
  }

  /**
   * Enviar logs para servidor (implementar em produção)
   */
  // async sendToServer(logEntry) {
  //   try {
  //     await fetch('/api/logs', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(logEntry)
  //     })
  //   } catch (error) {
  //     console.error('Falha ao enviar log para servidor:', error)
  //   }
  // }
}

export const logger = new Logger()

// Debug helper
if (process.env.NODE_ENV === 'development') {
  window.logger = logger // Acessar no console: window.logger.getHistory()
}

export default logger
