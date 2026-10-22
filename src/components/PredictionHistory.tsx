import React from 'react';
import { HistoryItem, IrisFeatures } from '../types/iris';
import { Clock, RotateCcw, Trash2, ArrowUpRight } from 'lucide-react';

interface PredictionHistoryProps {
  history: HistoryItem[];
  onLoadItem: (features: IrisFeatures) => void;
  onClearHistory: () => void;
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  history,
  onLoadItem,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 text-center space-y-3">
        <Clock className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-base font-semibold text-slate-900">Nenhum histórico registrado</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          As inferências e previsões executadas durante sua sessão serão salvas aqui para comparação de amostras.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Histórico de Inferências</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {history.length} {history.length === 1 ? 'registro gravado' : 'registros gravados'} nesta sessão
          </p>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
              <th className="py-2.5 px-3">Horário</th>
              <th className="py-2.5 px-3">Predição</th>
              <th className="py-2.5 px-3">Sépala (C x L)</th>
              <th className="py-2.5 px-3">Pétala (C x L)</th>
              <th className="py-2.5 px-3">Latência</th>
              <th className="py-2.5 px-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-slate-500 tabular-nums">{dateStr}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="font-bold text-slate-900">Iris {item.prediction}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                      (código: {item.codigo})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 tabular-nums">
                    {item.input.sepal_length.toFixed(1)} x {item.input.sepal_width.toFixed(1)} cm
                  </td>
                  <td className="py-3 px-3 text-slate-700 tabular-nums">
                    {item.input.petal_length.toFixed(1)} x {item.input.petal_width.toFixed(1)} cm
                  </td>
                  <td className="py-3 px-3 text-slate-500 tabular-nums">
                    {item.durationMs}ms
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onLoadItem(item.input)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded text-xs font-sans font-medium transition-colors cursor-pointer"
                      title="Carregar estas medidas no formulário"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reutilizar</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
