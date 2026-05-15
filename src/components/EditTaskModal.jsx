import { useState } from 'react'

export default function EditTaskModal({ task, onSave, onCancel }) {
  const [text, setText] = useState(task.text)
  const [priority, setPriority] = useState(task.priority)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onSave(text, priority)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-header">✏️ Editar Tarefa</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input de Texto */}
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Descrição da Tarefa
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field w-full text-base font-medium"
              placeholder="Digite a tarefa..."
              autoFocus
            />
          </div>

          {/* Select de Prioridade */}
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-field w-full"
            >
              <option value="low">🟢 Baixa</option>
              <option value="medium">🟡 Média</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>

          {/* Botões */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <i className="fas fa-save"></i>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
