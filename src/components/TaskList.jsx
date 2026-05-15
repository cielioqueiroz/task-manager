import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="empty-state">
          <div className="empty-state-icon animate-bounce">
            <i className="fas fa-inbox text-gray-300 dark:text-gray-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Nenhuma tarefa nesta categoria
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Crie uma tarefa para começar
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-3 pb-4">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
