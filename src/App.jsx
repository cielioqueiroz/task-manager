import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import Stats from './components/Stats'
import Filters from './components/Filters'
import TaskList from './components/TaskList'
import Footer from './components/Footer'
import Toast from './components/Toast'
import AuthPage from './components/Auth'
import { taskService } from './lib/taskService'
import { testConnection } from './lib/testConnection'
import { supabase } from './lib/supabase'
import { logger } from './lib/logger'
import { validateTaskInput } from './lib/validation'
import { limiters } from './lib/rateLimiter'
import { getSafeErrorMessage } from './lib/errorHandler'

const DARK_MODE_KEY = 'darkMode'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [toast, setToast] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Carregar dados do Supabase na montagem do componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Teste de conexão
        const connTest = await testConnection()
        if (!connTest.success) {
          console.error('❌ Falha na conexão:', connTest.error)
        }

        // ✅ Verificar se há usuário autenticado
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (authUser) {
          setUser(authUser)
          logger.action('session_loaded', { email: authUser.email })

          // ✅ Carregar tarefas do usuário autenticado
          const tasksData = await taskService.getTasks(authUser.id)
          setTasks(tasksData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        if (user) {
          showToast('Erro ao carregar tarefas do servidor', 'error')
        }
      } finally {
        // Carregar preferência de tema
        const savedDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true'
        setDarkMode(savedDarkMode)
        setIsLoaded(true)
      }
    }

    loadData()

    // ✅ Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
          logger.action('user_signed_in', { email: session.user.email })
        } else {
          setUser(null)
          setTasks([])
          logger.action('user_signed_out')
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Salvar preferência de tema
  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_KEY, darkMode.toString())
      const html = document.documentElement
      if (darkMode) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    } catch (error) {
      console.error('Erro ao salvar tema:', error)
    }
  }, [darkMode])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const addTask = async (text, priority = 'medium') => {
    // ✅ 1. Log de tentativa
    logger.action('task_add_attempt', { text: text.slice(0, 20), priority })

    // ✅ 2. Verificar rate limit
    if (!limiters.addTask.checkLimit()) {
      const waitTime = limiters.addTask.getResetTime()
      showToast(`⏱️ Você adicionou muitas tarefas! Aguarde ${waitTime}s.`, 'error')
      logger.warn('rate_limit_exceeded', { operation: 'addTask' })
      return
    }

    // ✅ 3. Validar entrada
    const validation = validateTaskInput(text, priority)
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        showToast(`❌ ${error}`, 'error')
        logger.warn('validation_failed', { error })
      })
      return
    }

    if (!user) {
      showToast('❌ Você precisa estar autenticado!', 'error')
      return
    }

    setIsLoading(true)
    try {
      // ✅ 4. Usar dados sanitizados
      const newTask = await taskService.addTask(
        validation.sanitized.text,
        validation.sanitized.priority,
        user.id
      )
      setTasks([newTask, ...tasks])

      // ✅ 5. Log de sucesso
      logger.action('task_created', { id: newTask.id })
      showToast('✅ Tarefa adicionada com sucesso!')
    } catch (error) {
      // ✅ 6. Error handling seguro
      const safeMessage = getSafeErrorMessage(error, 'addTask')
      logger.logError('task_create_failed', error, 'addTask')
      showToast(`❌ ${safeMessage}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTask = async (id) => {
    // ✅ 1. Rate limiting
    if (!limiters.toggleTask.checkLimit()) {
      const waitTime = limiters.toggleTask.getResetTime()
      showToast(`⏱️ Aguarde ${waitTime}s`, 'error')
      return
    }

    const task = tasks.find(t => t.id === id)
    const newCompleted = !task?.completed

    // ✅ 2. Log de tentativa
    logger.action('task_toggle_attempt', { id, completed: newCompleted })

    try {
      await taskService.toggleTask(id, newCompleted)
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: newCompleted } : t
      ))
      logger.action('task_toggled', { id, completed: newCompleted })
      showToast(newCompleted ? '✓ Tarefa concluída!' : '↩️ Tarefa reaberta', 'success')
    } catch (error) {
      // ✅ 3. Error handling seguro
      const safeMessage = getSafeErrorMessage(error, 'toggleTask')
      logger.logError('task_toggle_failed', error, 'toggleTask')
      showToast(`❌ ${safeMessage}`, 'error')
    }
  }

  const deleteTask = async (id) => {
    // ✅ 1. Validar ID
    const { validateTaskId } = await import('./lib/validation')
    const idValidation = validateTaskId(id)
    if (!idValidation.isValid) {
      showToast('❌ ID da tarefa inválido', 'error')
      logger.warn('invalid_task_id', { id })
      return
    }

    // ✅ 2. Rate limiting
    if (!limiters.deleteTask.checkLimit()) {
      const waitTime = limiters.deleteTask.getResetTime()
      showToast(`⏱️ Aguarde ${waitTime}s antes de deletar outra tarefa`, 'error')
      return
    }

    // ✅ 3. Log de tentativa
    logger.action('task_delete_attempt', { id })

    try {
      await taskService.deleteTask(id)
      setTasks(tasks.filter(task => task.id !== id))
      logger.action('task_deleted', { id })
      showToast('🗑️ Tarefa removida', 'info')
    } catch (error) {
      // ✅ 4. Error handling seguro
      const safeMessage = getSafeErrorMessage(error, 'deleteTask')
      logger.logError('task_delete_failed', error, 'deleteTask')
      showToast(`❌ ${safeMessage}`, 'error')
    }
  }

  const editTask = async (id, newText, newPriority) => {
    // ✅ 1. Validar entrada
    const validation = validateTaskInput(newText, newPriority)
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        showToast(`❌ ${error}`, 'error')
        logger.warn('validation_failed_edit', { error })
      })
      return
    }

    // ✅ 2. Rate limiting
    if (!limiters.editTask.checkLimit()) {
      const waitTime = limiters.editTask.getResetTime()
      showToast(`⏱️ Aguarde ${waitTime}s antes de editar outra tarefa`, 'error')
      return
    }

    if (!user) {
      showToast('❌ Você precisa estar autenticado!', 'error')
      return
    }

    // ✅ 3. Log de tentativa
    logger.action('task_edit_attempt', { id, text: newText.slice(0, 20), priority: newPriority })

    try {
      await taskService.editTask(id, validation.sanitized.text, validation.sanitized.priority, user.id)
      setTasks(tasks.map(task =>
        task.id === id
          ? { ...task, text: validation.sanitized.text, priority: validation.sanitized.priority }
          : task
      ))
      logger.action('task_updated', { id })
      showToast('✏️ Tarefa atualizada com sucesso!', 'success')
    } catch (error) {
      // ✅ 4. Error handling seguro
      const safeMessage = getSafeErrorMessage(error, 'editTask')
      logger.logError('task_edit_failed', error, 'editTask')
      showToast(`❌ ${safeMessage}`, 'error')
    }
  }

  // Filtrar por status
  const getFilteredTasks = () => {
    let filtered = tasks

    if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed)
    } else if (filter === 'pending') {
      filtered = filtered.filter(t => !t.completed)
    }

    // Filtrar por busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const filteredTasks = getFilteredTasks()
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  }

  // Mostrar loading enquanto carrega dados
  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center h-screen bg-gradient-to-br ${darkMode ? 'from-[#0f111a] to-[#181b2a]' : 'from-slate-100 to-slate-200'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carregando...</p>
        </div>
      </div>
    )
  }

  // ✅ Se não autenticado, mostrar página de login
  if (!user) {
    return <AuthPage />
  }

  const handleLogout = () => {
    setUser(null)
    setTasks([])
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br ${darkMode ? 'from-[#0f111a] to-[#181b2a]' : 'from-slate-100 to-slate-200'}`}>
      {/* Header - Sticky no topo */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content - Scroll natural da página */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <TaskForm onAddTask={addTask} isLoading={isLoading} />
          <Stats stats={stats} />
          <Filters
            currentFilter={filter}
            onFilterChange={setFilter}
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
          />
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>
      </main>

      {/* Footer - Sticky no rodapé */}
      <Footer />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
