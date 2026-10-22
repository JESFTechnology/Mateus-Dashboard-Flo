import React from 'react';
import { Flower2, Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  apiStatus: 'checking' | 'online' | 'offline';
  latencyMs?: number;
  onRefreshHealth: () => void;
  activeTab: 'predictor' | 'species' | 'history' | 'api-docs';
  onSelectTab: (tab: 'predictor' | 'species' | 'history' | 'api-docs') => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  latencyMs,
  onRefreshHealth,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single brand wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Flower2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
                Iris ML Studio
              </span>
              <span className="text-xs text-slate-500 font-mono mt-0.5">
                Fisher Iris Classifier
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('predictor')}
              className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'predictor'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Classificador
            </button>
            <button
              onClick={() => onSelectTab('species')}
              className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'species'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Guia de Espécies
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'history'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => onSelectTab('api-docs')}
              className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'api-docs'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              API & Modelo
            </button>
          </nav>

          {/* Zone 3: Primary action / Real status readout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>API Render:</span>
              <span className={`font-medium ${
                apiStatus === 'online' ? 'text-emerald-700' :
                apiStatus === 'offline' ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Instável' : 'Conectando'}
              </span>
              {latencyMs !== undefined && apiStatus === 'online' && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono tabular-nums text-slate-500">{latencyMs}ms</span>
                </>
              )}
            </div>

            <button
              onClick={onRefreshHealth}
              title="Testar conexão com a API do Render"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Atualizar status da API"
            >
              <RefreshCw className={`w-4 h-4 ${apiStatus === 'checking' ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={() => onSelectTab('predictor')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Prever Amostra
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => onSelectTab('predictor')}
            className={`px-2.5 py-1 rounded ${activeTab === 'predictor' ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600'}`}
          >
            Previsão
          </button>
          <button
            onClick={() => onSelectTab('species')}
            className={`px-2.5 py-1 rounded ${activeTab === 'species' ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600'}`}
          >
            Espécies
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-2.5 py-1 rounded ${activeTab === 'history' ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600'}`}
          >
            Histórico
          </button>
          <button
            onClick={() => onSelectTab('api-docs')}
            className={`px-2.5 py-1 rounded ${activeTab === 'api-docs' ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600'}`}
          >
            Docs
          </button>
        </div>
      </div>
    </header>
  );
};
