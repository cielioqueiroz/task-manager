import { useTranslation } from 'react-i18next'

export default function Filters({ currentFilter, onFilterChange, onSearch, searchTerm }) {
  const { t } = useTranslation()

  return (
    <div className="mb-8 space-y-4">
      {/* Barra de Busca */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('filters.search')}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="input-field w-full pl-4 pr-12"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40">
          <i className="fas fa-search"></i>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        {[
          { value: 'all', labelKey: 'filters.all', icon: 'fa-list' },
          { value: 'pending', labelKey: 'filters.pending', icon: 'fa-hourglass-end' },
          { value: 'completed', labelKey: 'filters.completed', icon: 'fa-check-circle' }
        ].map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`filter-btn group inline-flex items-center gap-2 ${
              currentFilter === f.value ? 'active' : ''
            }`}
          >
            <i className={`fas ${f.icon}`}></i>
            <span>{t(f.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
