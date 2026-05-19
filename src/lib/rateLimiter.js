/**
 * Rate Limiter para prevenir spam e DoS
 */

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = []
  }

  /**
   * Verifica se uma requisição pode ser feita
   * @returns {boolean} true se pode fazer requisição, false se excedeu limite
   */
  checkLimit() {
    const now = Date.now()

    // Remove requisições fora da janela de tempo
    this.requests = this.requests.filter(time => now - time < this.windowMs)

    // Verifica se excedeu limite
    if (this.requests.length >= this.maxRequests) {
      return false
    }

    // Registra nova requisição
    this.requests.push(now)
    return true
  }

  /**
   * Retorna quanto tempo o usuário precisa esperar
   * @returns {number} segundos até poder fazer nova requisição
   */
  getResetTime() {
    if (this.requests.length === 0) return 0

    const oldestRequest = this.requests[0]
    const now = Date.now()
    const resetTime = Math.ceil((this.windowMs - (now - oldestRequest)) / 1000)

    return Math.max(0, resetTime)
  }

  /**
   * Retorna o número de requisições restantes
   */
  getRemainingRequests() {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    return Math.max(0, this.maxRequests - this.requests.length)
  }

  /**
   * Reset do rate limiter
   */
  reset() {
    this.requests = []
  }
}

// Instâncias globais para diferentes operações
export const limiters = {
  // Adicionar tarefa: 5 por minuto
  addTask: new RateLimiter(5, 60000),

  // Editar tarefa: 10 por minuto
  editTask: new RateLimiter(10, 60000),

  // Deletar tarefa: 10 por minuto
  deleteTask: new RateLimiter(10, 60000),

  // Toggle tarefa: 20 por minuto
  toggleTask: new RateLimiter(20, 60000),

  // Listar tarefas: 30 por minuto
  getTasks: new RateLimiter(30, 60000),
}

export default RateLimiter
