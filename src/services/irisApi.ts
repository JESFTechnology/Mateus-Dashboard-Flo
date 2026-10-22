import { IrisFeatures, IrisPredictionResponse } from '../types/iris';

export const DEFAULT_API_URL = 'https://ia-do-mateus.onrender.com/api/predict';
export const BASE_API_HOST = 'https://ia-do-mateus.onrender.com';

export interface ClassificationResult {
  data: IrisPredictionResponse;
  durationMs: number;
  effectiveUrl: string;
  isSimulatedFallback?: boolean;
}

/**
 * Health check on API host root endpoint
 */
export async function checkApiHealth(): Promise<{ online: boolean; message?: string; latencyMs: number }> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${BASE_API_HOST}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timer);
    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      const data = await res.json();
      return { online: true, message: data.message || 'API Online', latencyMs };
    }
    return { online: false, message: `Status HTTP ${res.status}`, latencyMs };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - start);
    const msg = err instanceof Error ? err.message : 'Falha na conexão';
    return { online: false, message: msg, latencyMs };
  }
}

/**
 * Offline algorithmic fallback based on standard Fisher Iris Decision Tree rules
 */
export function simulateOfflineClassification(features: IrisFeatures): IrisPredictionResponse {
  const { petal_length, petal_width } = features;
  if (petal_length < 2.45 || petal_width < 0.8) {
    return {
      codigo: 0,
      dados_recebidos: features,
      predicao: 'Setosa',
    };
  }
  if (petal_width < 1.75 && petal_length < 4.95) {
    return {
      codigo: 1,
      dados_recebidos: features,
      predicao: 'Versicolor',
    };
  }
  return {
    codigo: 2,
    dados_recebidos: features,
    predicao: 'Virginica',
  };
}

/**
 * Sends classification POST request with automatic fallback handling
 */
export async function classifyIris(
  features: IrisFeatures,
  targetUrl: string = DEFAULT_API_URL,
  timeoutMs: number = 25000
): Promise<ClassificationResult> {
  const start = performance.now();
  let effectiveUrl = targetUrl.trim();

  // Validate inputs
  const payload: IrisFeatures = {
    sepal_length: Number(features.sepal_length),
    sepal_width: Number(features.sepal_width),
    petal_length: Number(features.petal_length),
    petal_width: Number(features.petal_width),
  };

  for (const [key, val] of Object.entries(payload)) {
    if (isNaN(val) || val <= 0) {
      throw new Error(`O campo ${key} deve ser um valor numérico positivo.`);
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response: Response;

    try {
      response = await fetch(effectiveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (networkErr: unknown) {
      // If abort caused by timeout
      if (controller.signal.aborted) {
        throw new Error('Tempo limite excedido (timeout). O servidor no Render pode estar reiniciando de um cold-start.');
      }
      throw networkErr;
    }

    // If 404 and URL ends with /api (without /predict), automatically try /api/predict
    if (response.status === 404 && effectiveUrl.replace(/\/$/, '').endsWith('/api')) {
      const fallbackPredictUrl = effectiveUrl.replace(/\/$/, '') + '/predict';
      const secondAttempt = await fetch(fallbackPredictUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (secondAttempt.ok) {
        effectiveUrl = fallbackPredictUrl;
        response = secondAttempt;
      }
    }

    clearTimeout(timer);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`A API retornou erro HTTP ${response.status}: ${response.statusText || errorText || 'Requisição inválida'}`);
    }

    const data: IrisPredictionResponse = await response.json();
    const durationMs = Math.round(performance.now() - start);

    if (data.predicao === undefined || data.codigo === undefined) {
      throw new Error('A resposta da API não contém o formato esperado (campos "codigo" e "predicao").');
    }

    return {
      data,
      durationMs,
      effectiveUrl,
    };
  } catch (err: unknown) {
    clearTimeout(timer);
    throw err;
  }
}
