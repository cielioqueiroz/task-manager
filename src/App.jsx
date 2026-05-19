import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import Stats from './components/Stats'
import Filters from './components/Filters'
import TaskList from './components/TaskList'
import Footer from './components/Footer'
import Toast from './components/Toast'
import { taskService } from './lib/taskService'
import { testConnection } from './lib/testConnection'

const DARK_MODE_KEY = 'darkMode'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [toast, setToast] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados do Supabase na montagem do componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Teste de conexão
        const connTest = await testConnection()
        if (!connTest.success) {
          console.error('❌ Falha na conexão:', connTest.error)
        }

        const tasksData = await taskService.getTasks()
        setTasks(tasksData)
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error)
        showToast('Erro ao carregar tarefas do servidor', 'error')
      } finally {
        // Carregar preferência de tema
        const savedDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true'
        setDarkMode(savedDarkMode)
        setIsLoaded(true)
      }
    }

    loadData()
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
    if (!text.trim()) {
      showToast('📝 Para adicionar uma tarefa, digite algo no campo!', 'error')
      return
    }

    setIsLoading(true)
    try {
      const newTask = await taskService.addTask(text, priority)
      setTasks([newTask, ...tasks])
      showToast('✅ Tarefa adicionada com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
      showToast('❌ Erro ao adicionar tarefa!', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    const newCompleted = !task?.completed

    try {
      await taskService.toggleTask(id, newCompleted)
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: newCompleted } : t
      ))
      showToast(newCompleted ? '✓ Tarefa concluída!' : '↩️ Tarefa reaberta', 'success')
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      showToast('❌ Erro ao atualizar tarefa!', 'error')
    }
  }

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id)
      setTasks(tasks.filter(task => task.id !== id))
      showToast('🗑️ Tarefa removida', 'info')
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      showToast('❌ Erro ao deletar tarefa!', 'error')
    }
  }

  const editTask = async (id, newText, newPriority) => {
    if (!newText.trim()) {
      showToast('✏️ Digite algo para salvar a tarefa!', 'error')
      return
    }

    try {
      await taskService.editTask(id, newText, newPriority)
      setTasks(tasks.map(task =>
        task.id === id
          ? { ...task, text: newText.trim(), priority: newPriority }
          : task
      ))
      showToast('✏️ Tarefa atualizada com sucesso!', 'success')
    } catch (error) {
      console.error('Erro ao editar tarefa:', error)
      showToast('❌ Erro ao editar tarefa!', 'error')
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
          <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carregando suas tarefas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br ${darkMode ? 'from-[#0f111a] to-[#181b2a]' : 'from-slate-100 to-slate-200'}`}>
      {/* Header - Sticky no topo */}
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

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
