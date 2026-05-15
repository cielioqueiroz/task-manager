export default function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-header">🗑️ Confirmar Exclusão</h2>

        <p className="text-white/80 mb-6">
          Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
        </p>

        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10"
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all"
          >
            <i className="fas fa-trash mr-2"></i>
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
