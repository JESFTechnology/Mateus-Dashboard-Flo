/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { IrisFeatures, IrisPredictionResponse, HistoryItem } from './types/iris';
import { classifyIris, checkApiHealth, DEFAULT_API_URL, simulateOfflineClassification } from './services/irisApi';
import { Header } from './components/Header';
import { IrisForm } from './components/IrisForm';
import { PredictionResultCard } from './components/PredictionResultCard';
import { SpeciesGallery } from './components/SpeciesGallery';
import { PredictionHistory } from './components/PredictionHistory';
import { MorphologyVisualizer } from './components/MorphologyVisualizer';
import { ApiDocumentation } from './components/ApiDocumentation';

const STORAGE_KEY = 'iris_prediction_history_v1';

export default function App() {
  // Input parameters (initialized with the specification model sample)
  const [features, setFeatures] = useState<IrisFeatures>({
    sepal_length: 6.7,
    sepal_width: 3.0,
    petal_length: 5.2,
    petal_width: 2.3,
  });

  // State management for API interaction
  const [result, setResult] = useState<IrisPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | undefined>(undefined);
  const [effectiveUrl, setEffectiveUrl] = useState<string | undefined>(undefined);
  const [isSimulatedFallback, setIsSimulatedFallback] = useState<boolean>(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'predictor' | 'species' | 'history' | 'api-docs'>('predictor');

  // API Health status
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | undefined>(undefined);

  // Custom API URL configuration
  const [apiUrl, setApiUrl] = useState<string>(DEFAULT_API_URL);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // storage unavailable or full
    }
  }, [history]);

  // Check API health on mount
  const handleCheckHealth = useCallback(async () => {
    setApiStatus('checking');
    const health = await checkApiHealth();
    setApiStatus(health.online ? 'online' : 'offline');
    setLatencyMs(health.latencyMs);
  }, []);

  useEffect(() => {
    handleCheckHealth();
  }, [handleCheckHealth]);

  // Main prediction execution
  const executePrediction = async (inputFeatures: IrisFeatures = features) => {
    setIsLoading(true);
    setError(null);
    setIsSimulatedFallback(false);

    try {
      const response = await classifyIris(inputFeatures, apiUrl);
      setResult(response.data);
      setDurationMs(response.durationMs);
      setEffectiveUrl(response.effectiveUrl);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        input: { ...inputFeatures },
        prediction: response.data.predicao,
        codigo: response.data.codigo,
        durationMs: response.durationMs,
        endpoint: response.effectiveUrl,
        isSimulatedFallback: false,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao comunicar com a API do modelo.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial prediction on first load so user immediately sees results
  useEffect(() => {
    executePrediction(features);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Offline fallback simulation
  const handleUseFallbackSimulation = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const fallbackResult = simulateOfflineClassification(features);
      setResult(fallbackResult);
      setDurationMs(12);
      setIsSimulatedFallback(true);
      setEffectiveUrl('Local Decision Tree Fallback Engine');

      const newHistoryItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        input: { ...features },
        prediction: fallbackResult.predicao,
        codigo: fallbackResult.codigo,
        durationMs: 12,
        endpoint: 'Offline Engine',
        isSimulatedFallback: true,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
      setIsLoading(false);
    }, 200);
  };

  // Load preset or history values into the form and run classification
  const handleApplyFeatures = (newFeatures: IrisFeatures) => {
    setFeatures(newFeatures);
    setActiveTab('predictor');
    executePrediction(newFeatures);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Header */}
      <Header
        apiStatus={apiStatus}
        latencyMs={latencyMs}
        onRefreshHealth={handleCheckHealth}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section Banner */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <span>Classificador de Machine Learning</span>
              <span>·</span>
              <span>Dataset de Fisher</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              Predição Inteligente de Espécies da Flor Iris
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              Classifique amostras botânicas entre <strong className="font-semibold text-slate-800">Iris Setosa</strong>, <strong className="font-semibold text-slate-800">Iris Versicolor</strong> e <strong className="font-semibold text-slate-800">Iris Virginica</strong> a partir das dimensões métricas de sépalas e pétalas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('predictor')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              Iniciar Previsão
            </button>
            <button
              onClick={() => setActiveTab('api-docs')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Ver API Specs
            </button>
          </div>
        </section>

        {/* Tab 1: Predictor Workspace */}
        {activeTab === 'predictor' && (
          <div className="space-y-8">
            {/* Split Console: Form on Left, Result Spotlight on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form & Steppers */}
              <div className="lg:col-span-5 space-y-6">
                <IrisForm
                  features={features}
                  onChange={setFeatures}
                  onSubmit={() => executePrediction(features)}
                  isLoading={isLoading}
                  apiUrl={apiUrl}
                  onApiUrlChange={setApiUrl}
                  onResetApiUrl={() => setApiUrl(DEFAULT_API_URL)}
                  defaultApiUrl={DEFAULT_API_URL}
                />
              </div>

              {/* Right Column: Prediction Spotlight Card & Visualizer */}
              <div className="lg:col-span-7 space-y-6">
                <PredictionResultCard
                  result={result}
                  isLoading={isLoading}
                  error={error}
                  durationMs={durationMs}
                  effectiveUrl={effectiveUrl}
                  isSimulatedFallback={isSimulatedFallback}
                  onRetry={() => executePrediction(features)}
                  onUseFallbackSimulation={handleUseFallbackSimulation}
                />

                <MorphologyVisualizer
                  features={features}
                  currentPrediction={result?.predicao}
                />
              </div>
            </div>

            {/* Bottom Quick Species Gallery Strip */}
            <div className="pt-4 border-t border-slate-200">
              <SpeciesGallery
                onSelectSpecies={handleApplyFeatures}
                currentPrediction={result?.predicao}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Species Guide */}
        {activeTab === 'species' && (
          <div className="space-y-8">
            <SpeciesGallery
              onSelectSpecies={handleApplyFeatures}
              currentPrediction={result?.predicao}
            />

            <MorphologyVisualizer
              features={features}
              currentPrediction={result?.predicao}
            />
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <PredictionHistory
              history={history}
              onLoadItem={handleApplyFeatures}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}

        {/* Tab 4: API & Architecture Documentation */}
        {activeTab === 'api-docs' && (
          <div className="space-y-6">
            <ApiDocumentation />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Iris ML Dashboard</span>
              <span>·</span>
              <span>Desenvolvido com React, Vite & Tailwind CSS</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
              <span>API: ia-do-mateus.onrender.com</span>
              <span>·</span>
              <span>Vercel Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
