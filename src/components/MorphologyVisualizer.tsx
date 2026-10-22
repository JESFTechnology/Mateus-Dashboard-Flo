import React from 'react';
import { IrisFeatures } from '../types/iris';
import { Crosshair } from 'lucide-react';

interface MorphologyVisualizerProps {
  features: IrisFeatures;
  currentPrediction?: string;
}

export const MorphologyVisualizer: React.FC<MorphologyVisualizerProps> = ({
  features,
  currentPrediction,
}) => {
  // Normalize petal coordinates for SVG (petal_length: 0 - 7 cm, petal_width: 0 - 2.8 cm)
  const svgWidth = 400;
  const svgHeight = 220;
  const padding = 35;

  const mapX = (length: number) => padding + (length / 7.5) * (svgWidth - padding * 2);
  const mapY = (width: number) => svgHeight - padding - (width / 3.0) * (svgHeight - padding * 2);

  const currentX = mapX(Math.min(7.5, Math.max(0, features.petal_length)));
  const currentY = mapY(Math.min(3.0, Math.max(0, features.petal_width)));

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-emerald-600" />
            Distribuição Biométrica das Pétalas
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Plano cartesiano morfológico (Comprimento vs. Largura da Pétala) e clusters de decisão.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Setosa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Versicolor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Virginica
          </span>
        </div>
      </div>

      <div className="relative border border-slate-100 bg-slate-50/50 rounded-xl p-3 flex justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[500px] h-auto text-slate-400 font-mono text-[9px] select-none"
        >
          {/* Grid lines */}
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Subdivisions */}
          {[1, 2, 3, 4, 5, 6, 7].map((val) => (
            <g key={`x-${val}`}>
              <line x1={mapX(val)} y1={svgHeight - padding} x2={mapX(val)} y2={padding} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={mapX(val)} y={svgHeight - padding + 14} textAnchor="middle" fill="#64748b">
                {val}cm
              </text>
            </g>
          ))}

          {[0.5, 1.0, 1.5, 2.0, 2.5].map((val) => (
            <g key={`y-${val}`}>
              <line x1={padding} y1={mapY(val)} x2={svgWidth - padding} y2={mapY(val)} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={padding - 8} y={mapY(val) + 3} textAnchor="end" fill="#64748b">
                {val}
              </text>
            </g>
          ))}

          {/* Reference Region Ellipses / Clusters */}
          {/* Setosa Cluster: petal_length 1.0-2.0, petal_width 0.1-0.6 */}
          <ellipse
            cx={mapX(1.46)}
            cy={mapY(0.24)}
            rx={(mapX(1.9) - mapX(1.0)) / 1.8}
            ry={(mapY(0.1) - mapY(0.6)) / 1.8}
            fill="#10b981"
            fillOpacity="0.15"
            stroke="#10b981"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <text x={mapX(1.46)} y={mapY(0.24) - 14} fill="#059669" textAnchor="middle" fontWeight="bold">
            Cluster Setosa
          </text>

          {/* Versicolor Cluster: petal_length 3.0-5.0, petal_width 1.0-1.8 */}
          <ellipse
            cx={mapX(4.26)}
            cy={mapY(1.32)}
            rx={(mapX(5.1) - mapX(3.0)) / 1.8}
            ry={(mapY(1.0) - mapY(1.8)) / 1.8}
            fill="#6366f1"
            fillOpacity="0.15"
            stroke="#6366f1"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <text x={mapX(4.26)} y={mapY(1.32) - 16} fill="#4f46e5" textAnchor="middle" fontWeight="bold">
            Cluster Versicolor
          </text>

          {/* Virginica Cluster: petal_length 4.5-6.9, petal_width 1.5-2.5 */}
          <ellipse
            cx={mapX(5.55)}
            cy={mapY(2.02)}
            rx={(mapX(6.9) - mapX(4.5)) / 1.8}
            ry={(mapY(1.5) - mapY(2.5)) / 1.8}
            fill="#8b5cf6"
            fillOpacity="0.15"
            stroke="#8b5cf6"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <text x={mapX(5.55)} y={mapY(2.02) + 20} fill="#7c3aed" textAnchor="middle" fontWeight="bold">
            Cluster Virginica
          </text>

          {/* Axis Labels */}
          <text x={svgWidth - padding} y={svgHeight - 6} textAnchor="end" fill="#475569" fontWeight="600">
            Comprimento da Pétala (cm) →
          </text>
          <text x={padding} y={20} textAnchor="start" fill="#475569" fontWeight="600">
            ↑ Largura da Pétala (cm)
          </text>

          {/* Current Sample Target Marker */}
          <g>
            <circle cx={currentX} cy={currentY} r="8" fill="#0f172a" fillOpacity="0.2" />
            <circle cx={currentX} cy={currentY} r="5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
            <circle cx={currentX} cy={currentY} r="12" fill="none" stroke="#0f172a" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Amostra Atual:</span>
          <span className="font-mono tabular-nums text-slate-600">
            Pétala: {features.petal_length.toFixed(1)} x {features.petal_width.toFixed(1)} cm
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-mono tabular-nums text-slate-600">
            Sépala: {features.sepal_length.toFixed(1)} x {features.sepal_width.toFixed(1)} cm
          </span>
        </div>
        {currentPrediction && (
          <div className="font-medium text-slate-900">
            Classificado como: <span className="font-bold text-emerald-700">Iris {currentPrediction}</span>
          </div>
        )}
      </div>
    </div>
  );
};
