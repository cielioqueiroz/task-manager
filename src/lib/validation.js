/**
 * Validação de entrada de dados
 * Previne XSS, injection, e entradas inválidas
 */

const VALIDATION_RULES = {
  taskText: {
    minLength: 1,
    maxLength: 500,
  },
  priority: {
    allowed: ['low', 'medium', 'high']
  }
}

/**
 * Valida texto da tarefa
 */
export function validateTaskText(text) {
  const errors = []

  if (!text || text.trim().length === 0) {
    errors.push('Tarefa não pode estar vazia')
    return { isValid: false, errors }
  }

  const trimmed = text.trim()

  if (trimmed.length < VALIDATION_RULES.taskText.minLength) {
    errors.push('Tarefa muito curta')
  }

  if (trimmed.length > VALIDATION_RULES.taskText.maxLength) {
    errors.push(`Tarefa não pode ter mais de ${VALIDATION_RULES.taskText.maxLength} caracteres`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: trimmed
  }
}

/**
 * Valida prioridade
 */
export function validatePriority(priority) {
  const errors = []

  if (!priority || typeof priority !== 'string') {
    errors.push('Prioridade deve ser uma string')
    return { isValid: false, errors }
  }

  if (!VALIDATION_RULES.priority.allowed.includes(priority.toLowerCase())) {
    errors.push(`Prioridade deve ser: ${VALIDATION_RULES.priority.allowed.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: priority.toLowerCase()
  }
}

/**
 * Valida ID da tarefa
 */
export function validateTaskId(id) {
  const errors = []

  if (typeof id !== 'number') {
    errors.push('ID deve ser um número')
    return { isValid: false, errors }
  }

  if (!Number.isInteger(id) || id <= 0) {
    errors.push('ID deve ser um número inteiro positivo')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Valida toda entrada de tarefa
 */
export function validateTaskInput(text, priority) {
  const textValidation = validateTaskText(text)
  const priorityValidation = validatePriority(priority)

  const allErrors = [...textValidation.errors, ...priorityValidation.errors]

  return {
    isValid: textValidation.isValid && priorityValidation.isValid,
    errors: allErrors,
    sanitized: {
      text: textValidation.sanitized || '',
      priority: priorityValidation.sanitized || 'medium'
    }
  }
}

/**
 * Sanitiza texto removendo caracteres perigosos
 * (React faz HTML escaping automaticamente, mas é bom ter camada extra)
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return ''

  return text
    .trim()
    .slice(0, VALIDATION_RULES.taskText.maxLength)
    // Remover caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
}
