import React, { useState } from 'react';
import { IrisFeatures } from '../types/iris';
import { SAMPLE_PRESETS, SamplePreset } from '../data/speciesData';
import { Sparkles, SlidersHorizontal, RotateCcw, Send, Settings2, Info } from 'lucide-react';

interface IrisFormProps {
  features: IrisFeatures;
  onChange: (features: IrisFeatures) => void;
  onSubmit: () => void;
  isLoading: boolean;
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
  onResetApiUrl: () => void;
  defaultApiUrl: string;
}

interface FieldConfig {
  key: keyof IrisFeatures;
  label: string;
  subLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  typicalRange: string;
  description: string;
}

const FIELD_CONFIGS: FieldConfig[] = [
  {
    key: 'sepal_length',
    label: 'Sepal Length',
    subLabel: 'Comprimento da Sépala',
    min: 4.0,
    max: 8.0,
    step: 0.1,
    unit: 'cm',
    typicalRange: '4.3 – 7.9 cm',
    description: 'Extensão longitudinal da sépala externa',
  },
  {
    key: 'sepal_width',
    label: 'Sepal Width',
    subLabel: 'Largura da Sépala',
    min: 2.0,
    max: 4.5,
    step: 0.1,
    unit: 'cm',
    typicalRange: '2.0 – 4.4 cm',
    description: 'Largura máxima no ponto central da sépala',
  },
  {
    key: 'petal_length',
    label: 'Petal Length',
    subLabel: 'Comprimento da Pétala',
    min: 1.0,
    max: 7.0,
    step: 0.1,
    unit: 'cm',
    typicalRange: '1.0 – 6.9 cm',
    description: 'Comprimento da pétala ereta interior',
  },
  {
    key: 'petal_width',
    label: 'Petal Width',
    subLabel: 'Largura da Pétala',
    min: 0.1,
    max: 2.6,
    step: 0.1,
    unit: 'cm',
    typicalRange: '0.1 – 2.5 cm',
    description: 'Largura transversal da pétala',
  },
];

export const IrisForm: React.FC<IrisFormProps> = ({
  features,
  onChange,
  onSubmit,
  isLoading,
  apiUrl,
  onApiUrlChange,
  onResetApiUrl,
  defaultApiUrl,
}) => {
  const [showConfig, setShowConfig] = useState(false);

  const handleFieldChange = (key: keyof IrisFeatures, value: number) => {
    const sanitized = Math.max(0.1, Math.round(value * 10) / 10);
    onChange({
      ...features,
      [key]: sanitized,
    });
  };

  const adjustStep = (key: keyof IrisFeatures, delta: number) => {
    const current = features[key];
    const nextVal = Math.round((current + delta) * 10) / 10;
    if (nextVal >= 0.1) {
      handleFieldChange(key, nextVal);
    }
  };

  const handleApplyPreset = (preset: SamplePreset) => {
    onChange({ ...preset.values });
  };

  const handleRandomize = () => {
    const randomFloat = (min: number, max: number) =>
      Math.round((Math.random() * (max - min) + min) * 10) / 10;

    onChange({
      sepal_length: randomFloat(4.5, 7.5),
      sepal_width: randomFloat(2.2, 4.0),
      petal_length: randomFloat(1.2, 6.5),
      petal_width: randomFloat(0.2, 2.4),
    });
  };

  const handleResetToDefault = () => {
    onChange({
      sepal_length: 6.7,
      sepal_width: 3.0,
      petal_length: 5.2,
      petal_width: 2.3,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Header of Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            Parâmetros Morfológicos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Insira as 4 medidas biométricas em centímetros para alimentar o modelo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
            showConfig
              ? 'bg-slate-100 text-slate-900 border-slate-300'
              : 'text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Configurações de Endpoint da API"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Configurar API</span>
        </button>
      </div>

      {/* Advanced API Config Panel (Collapsible) */}
      {showConfig && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Endpoint do Servidor POST</span>
            <button
              type="button"
              onClick={onResetApiUrl}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar Padrão
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => onApiUrlChange(e.target.value)}
              placeholder="https://ia-do-mateus.onrender.com/api/predict"
              className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="text-[11px] text-slate-500 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
            <span>
              O endpoint padrão testado e funcional do backend é <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200">{defaultApiUrl}</code>. Se você especificar <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200">/api</code>, o sistema tenta a rota e faz fallback transparente para <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200">/api/predict</code> caso ocorra 404.
            </span>
          </div>
        </div>
      )}

      {/* Quick Preset Buttons */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-600">Carregar Amostras Rápidas:</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-2 text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg transition-colors group"
            >
              <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 truncate">
                {preset.species}
              </div>
              <div className="text-[11px] font-mono text-slate-500 truncate tabular-nums">
                {preset.values.sepal_length}/{preset.values.sepal_width}/{preset.values.petal_length}/{preset.values.petal_width}
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={handleRandomize}
            className="px-2.5 py-2 text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Aleatório</span>
          </button>
        </div>
      </div>

      {/* 4 Numeric Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {FIELD_CONFIGS.map((field) => {
          const val = features[field.key];
          return (
            <div
              key={field.key}
              className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3 hover:border-slate-300 transition-colors"
            >
              {/* Field Label & Readout */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-mono font-semibold text-slate-900">
                      {field.key}
                    </span>
                    <span className="text-xs text-slate-500">· {field.subLabel}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Faixa comum: {field.typicalRange}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">
                  <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                    {val.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{field.unit}</span>
                </div>
              </div>

              {/* Slider Sync */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={val}
                  onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{field.min.toFixed(1)} cm</span>
                  <span>{field.max.toFixed(1)} cm</span>
                </div>
              </div>

              {/* Steppers & Direct Input */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => adjustStep(field.key, -0.1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                  aria-label={`Diminuir ${field.key}`}
                >
                  −
                </button>

                <input
                  type="number"
                  step={field.step}
                  min={0.1}
                  max={15.0}
                  value={val}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) {
                      handleFieldChange(field.key, parsed);
                    }
                  }}
                  className="flex-1 text-center font-mono font-medium text-sm py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs tabular-nums"
                />

                <button
                  type="button"
                  onClick={() => adjustStep(field.key, 0.1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                  aria-label={`Aumentar ${field.key}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleResetToDefault}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Valores Padrão</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[200px] px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Consultando IA...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Executar Classificação</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
