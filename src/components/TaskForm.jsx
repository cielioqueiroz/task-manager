import { useState } from 'react'

export default function TaskForm({ onAddTask }) {
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTask(input, priority)
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
            Nova Tarefa
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="O que você precisa fazer?"
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
            <option value="low">🟢 Baixa</option>
            <option value="medium">🟡 Média</option>
            <option value="high">🔴 Alta</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary min-w-fit whitespace-nowrap shadow-lg hover:shadow-xl py-3 px-6"
          >
            <i className="fas fa-plus text-lg"></i>
            <span className="font-semibold">Adicionar</span>
          </button>
        </div>
      </form>
    </div>
  )
}
