import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TaskForm({ onAddTask, isLoading }) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onAddTask(input, priority)
    setInput('')
    setPriority('medium')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <div className="card shadow-lg p-6 mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row sm:items-end">
        {/* Input Principal - Maior */}
        <div className="flex-1 relative group">
          <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wide">
            {t('tasks.addTask')}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('tasks.addTaskPlaceholder')}
            className="input-field w-full text-lg font-medium py-4"
            autoFocus
          />
          <div className="absolute right-4 top-10 text-white/40 pointer-events-none">
            <i className="fas fa-pen-to-square"></i>
          </div>
        </div>

        {/* Seletor de Prioridade - Menor */}
        <div className="flex gap-2 items-end">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input-field px-3 py-3 font-medium text-sm"
          >
            <option value="low">🟢 {t('priority.low')}</option>
            <option value="medium">🟡 {t('priority.medium')}</option>
            <option value="high">🔴 {t('priority.high')}</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary min-w-fit whitespace-nowrap shadow-lg hover:shadow-xl py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-plus'} text-lg`}></i>
            <span className="font-semibold">{isLoading ? t('messages.adding') : t('tasks.addTask')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
