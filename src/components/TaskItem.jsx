import { useState } from 'react'
import EditTaskModal from './EditTaskModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const priorityConfig = {
    high: { color: 'high', icon: 'fa-triangle-exclamation', label: 'Alta' },
    medium: { color: 'medium', icon: 'fa-minus', label: 'Média' },
    low: { color: 'low', icon: 'fa-circle', label: 'Baixa' }
  }

  const config = priorityConfig[task.priority] || priorityConfig.medium

  const handleEdit = (newText, newPriority) => {
    // Valida se o texto está vazio - se inválido, não fecha o modal
    if (!newText.trim()) {
      onEdit(task.id, newText, newPriority)
      return
    }
    // Se válido, edita e fecha o modal
    onEdit(task.id, newText, newPriority)
    setIsEditing(false)
  }

  return (
    <>
      <div className="task-item card p-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            className="checkbox-custom mt-1 accent-blue-500"
          />

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <p className={`text-base font-medium break-words transition-all flex-1 ${
                task.completed
                  ? 'line-through text-white/40'
                  : 'text-white'
              }`}>
                {task.text}
              </p>

              {/* Badge de Prioridade - SEMPRE VISÍVEL */}
              <div className={`badge-priority badge-${config.color} shrink-0 shadow-lg`}>
                <i className={`fas ${config.icon} text-sm`}></i>
                <span className="font-bold">{config.label}</span>
              </div>
            </div>

            {/* Metadados */}
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <i className="fas fa-calendar-alt"></i>
                {task.createdAt}
              </span>
              {task.completed && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <i className="fas fa-check-circle"></i>
                  Concluída
                </span>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 shrink-0">
            {/* Botão Editar */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-3 rounded-xl bg-white/5 hover:bg-blue-500/20 text-blue-400 transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Editar tarefa"
            >
              <i className="fas fa-edit text-base"></i>
            </button>

            {/* Botão Delete */}
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 transition-all duration-200 hover:scale-125 active:scale-95 flex items-center justify-center"
              title="Deletar tarefa"
            >
              <i className="fas fa-trash text-base"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditing && (
        <EditTaskModal
          task={task}
          onSave={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Modal de Confirmação de Delete */}
      {isConfirmingDelete && (
        <ConfirmDeleteModal
          onConfirm={() => {
            onDelete()
            setIsConfirmingDelete(false)
          }}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </>
  )
}
