export default function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <i className="fas fa-check-double text-white text-xl"></i>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Task Manager
              </h1>
              <p className="text-sm text-white/60 font-medium">Organize suas tarefas de forma elegante</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
              <button
                onClick={onToggleDarkMode}
                className={`p-2.5 rounded-full transition-all duration-200 ${
                  darkMode
                    ? 'bg-white/20 text-yellow-400'
                    : 'text-blue-400'
                }`}
                title="Modo escuro"
              >
                <i className="fas fa-moon text-lg"></i>
              </button>
              <button
                onClick={onToggleDarkMode}
                className={`p-2.5 rounded-full transition-all duration-200 ${
                  !darkMode
                    ? 'bg-white/20 text-yellow-400'
                    : 'text-blue-400'
                }`}
                title="Modo claro"
              >
                <i className="fas fa-sun text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
