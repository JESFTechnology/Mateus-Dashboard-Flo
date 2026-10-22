export interface IrisFeatures {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
}

export interface IrisPredictionResponse {
  codigo: number;
  dados_recebidos: IrisFeatures;
  predicao: 'Setosa' | 'Versicolor' | 'Virginica' | string;
}

export interface SpeciesDetails {
  id: 'Setosa' | 'Versicolor' | 'Virginica';
  scientificName: string;
  popularName: string;
  codigo: number;
  image: string;
  accentColor: string;
  textColor: string;
  bgLight: string;
  borderLight: string;
  description: string;
  traits: string[];
  referenceAverages: IrisFeatures;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: IrisFeatures;
  prediction: string;
  codigo: number;
  durationMs: number;
  endpoint: string;
  isSimulatedFallback?: boolean;
}
