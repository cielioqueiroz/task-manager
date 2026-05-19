import { useTranslation } from 'react-i18next'

export default function Stats({ stats }) {
  const { t } = useTranslation()
  const percentage = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* Total */}
      <div className="card stats-card stats-card-total p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-white/60 uppercase tracking-wider">{t('stats.total')}</span>
          <i className="fas fa-list text-blue-400 text-lg"></i>
        </div>
        <p className="text-4xl font-bold font-heading text-white">{stats.total}</p>
      </div>

      {/* Pendentes */}
      <div className="card stats-card stats-card-pending p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-white/60 uppercase tracking-wider">{t('stats.pending')}</span>
          <i className="fas fa-hourglass-end text-amber-400 text-lg"></i>
        </div>
        <p className="text-4xl font-bold font-heading text-amber-400">{stats.pending}</p>
      </div>

      {/* Concluídas */}
      <div className="card stats-card stats-card-completed p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(52,211,153,0.1)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-white/60 uppercase tracking-wider">{t('stats.completed')}</span>
          <i className="fas fa-check-circle text-emerald-400 text-lg"></i>
        </div>
        <div>
          <p className="text-4xl font-bold font-heading text-emerald-400">{stats.completed}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <div className="flex-1 progress-bar">
              <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="font-bold">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
