import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import Stats from './components/Stats'
import Filters from './components/Filters'
import TaskList from './components/TaskList'
import Footer from './components/Footer'
import Toast from './components/Toast'

const STORAGE_KEY = 'taskManager_tasks'
const DARK_MODE_KEY = 'darkMode'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [toast, setToast] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar dados do localStorage na montagem do componente
  useEffect(() => {
    try {
      // Carregar tarefas
      const savedTasks = localStorage.getItem(STORAGE_KEY)
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks)
        if (Array.isArray(parsed)) {
          setTasks(parsed)
          console.log('✅ Tarefas carregadas do localStorage:', parsed.length)
        }
      } else {
        console.log('📝 Nenhuma tarefa salva no localStorage')
        setTasks([])
      }

      // Carregar preferência de tema
      const savedDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true'
      setDarkMode(savedDarkMode)
      console.log('🌙 Tema carregado:', savedDarkMode ? 'Escuro' : 'Claro')

      setIsLoaded(true)
    } catch (error) {
      console.error('❌ Erro ao carregar dados do localStorage:', error)
      setTasks([])
      setIsLoaded(true)
    }
  }, [])

  // Salvar tarefas no localStorage sempre que mudam
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
        console.log('💾 Tarefas salvas no localStorage:', tasks.length)
      } catch (error) {
        console.error('❌ Erro ao salvar tarefas:', error)
        showToast('Erro ao salvar tarefas!', 'error')
      }
    }
  }, [tasks, isLoaded])

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
      console.error('❌ Erro ao salvar tema:', error)
    }
  }, [darkMode])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const addTask = (text, priority = 'medium') => {
    if (!text.trim()) {
      showToast('Digite uma tarefa!', 'error')
      return
    }

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setTasks([newTask, ...tasks])
    showToast('✅ Tarefa adicionada com sucesso!')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
    const task = tasks.find(t => t.id === id)
    showToast(task?.completed ? '↩️ Tarefa reaberta' : '✓ Tarefa concluída!', 'success')
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    showToast('🗑️ Tarefa removida', 'info')
  }

  const editTask = (id, newText, newPriority) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, text: newText.trim(), priority: newPriority }
        : task
    ))
    showToast('✏️ Tarefa atualizada com sucesso!', 'success')
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
          <TaskForm onAddTask={addTask} />
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
