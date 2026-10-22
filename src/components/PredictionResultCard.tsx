import React, { useState } from 'react';
import { IrisPredictionResponse } from '../types/iris';
import { IRIS_SPECIES } from '../data/speciesData';
import { CheckCircle2, Copy, Check, Clock, Code, AlertTriangle, RefreshCw } from 'lucide-react';

interface PredictionResultCardProps {
  result: IrisPredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  durationMs?: number;
  effectiveUrl?: string;
  isSimulatedFallback?: boolean;
  onRetry: () => void;
  onUseFallbackSimulation?: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  isLoading,
  error,
  durationMs,
  effectiveUrl,
  isSimulatedFallback,
  onRetry,
  onUseFallbackSimulation,
}) => {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="h-5 bg-slate-200 rounded w-36 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-12 bg-emerald-100/60 rounded-xl w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="space-y-2 pt-4">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
            </div>
          </div>

          <div className="w-full h-56 bg-slate-100 rounded-xl animate-pulse" />
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 flex items-center justify-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Aguardando resposta da rede neural do modelo...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    const isColdStart = error.toLowerCase().includes('timeout') || error.toLowerCase().includes('tempo limite');
    return (
      <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-base font-semibold text-slate-900">Falha na Predição</h3>
            <p className="text-sm text-rose-700 font-medium">{error}</p>
            {isColdStart && (
              <p className="text-xs text-slate-500 pt-1">
                Serviços no plano gratuito do Render hibernam após inatividade. O primeiro despertar pode demorar de 30 a 50 segundos.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tentar Novamente
          </button>

          {onUseFallbackSimulation && (
            <button
              type="button"
              onClick={onUseFallbackSimulation}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-medium rounded-lg transition-colors"
            >
              Calcular Localmente (Algoritmo Fisher Offline)
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty / Initial State
  if (!result) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
          <CheckCircle2 className="w-8 h-8 text-slate-300" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Nenhuma predição executada ainda</h3>
          <p className="text-xs text-slate-500">
            Ajuste os parâmetros morfológicos no formulário ao lado e clique em &quot;Executar Classificação&quot; para enviar a requisição POST para a API de Machine Learning.
          </p>
        </div>
      </div>
    );
  }

  // Active Prediction Result State
  const speciesKey = Object.keys(IRIS_SPECIES).find(
    (key) => key.toLowerCase() === result.predicao.toLowerCase()
  ) || 'Virginica';

  const speciesInfo = IRIS_SPECIES[speciesKey];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Top Header Strip */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Resultado da Inferência
          </span>
          {isSimulatedFallback ? (
            <span className="text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Modo Offline / Fallback
            </span>
          ) : (
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              API Render 200 OK
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          {durationMs !== undefined && (
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {durationMs}ms
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowJson(!showJson)}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 hover:underline"
          >
            <Code className="w-3.5 h-3.5" />
            {showJson ? 'Ocultar JSON' : 'Ver JSON'}
          </button>
        </div>
      </div>

      {/* Main Spotlight Body */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Big Predicao Highlight */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="text-xs text-slate-500">Espécie Identificada pelo Modelo:</div>

              {/* HIGHLIGHTED PREDICAO BADGE */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-3 top-3 text-[10px] font-mono text-slate-400 bg-white/10 px-2 py-1 rounded">
                  codigo: {result.codigo}
                </div>

                <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  {speciesInfo?.scientificName || 'Iris Specimen'}
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                  Iris {result.predicao}
                </div>

                <div className="text-xs text-slate-300 mt-2 font-normal">
                  {speciesInfo?.popularName || 'Espécie do Gênero Iris'} · {speciesInfo?.description}
                </div>
              </div>
            </div>

            {/* Received Data Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-600">
                Dados Processados pela API (<span className="font-mono text-slate-500">dados_recebidos</span>):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">sepal_length</div>
                  <div className="text-base font-bold font-mono text-slate-800 tabular-nums">
                    {result.dados_recebidos.sepal_length} <span className="text-xs font-normal text-slate-400">cm</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">sepal_width</div>
                  <div className="text-base font-bold font-mono text-slate-800 tabular-nums">
                    {result.dados_recebidos.sepal_width} <span className="text-xs font-normal text-slate-400">cm</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">petal_length</div>
                  <div className="text-base font-bold font-mono text-slate-800 tabular-nums">
                    {result.dados_recebidos.petal_length} <span className="text-xs font-normal text-slate-400">cm</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">petal_width</div>
                  <div className="text-base font-bold font-mono text-slate-800 tabular-nums">
                    {result.dados_recebidos.petal_width} <span className="text-xs font-normal text-slate-400">cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botanical Traits Checklist */}
            {speciesInfo && (
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-medium text-slate-600">Padrões Botânicos Diagnósticos:</div>
                <div className="space-y-1">
                  {speciesInfo.traits.map((trait, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Specimen Image Asset */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex-1 min-h-[260px]">
              {speciesInfo?.image ? (
                <img
                  src={speciesInfo.image}
                  alt={`Espécime botânico de Iris ${result.predicao}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                  Foto do espécime não disponível
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent text-white">
                <div className="text-xs font-semibold">Fotografia Macro Botânica</div>
                <div className="text-[11px] text-slate-300 font-mono">
                  {speciesInfo?.scientificName} · Espécime catalogado
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* JSON Inspector Collapsible */}
        {showJson && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-600">
                Payload JSON retornado pela API:
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
            {effectiveUrl && (
              <div className="text-[11px] font-mono text-slate-400">
                Endpoint requisitado: {effectiveUrl}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
