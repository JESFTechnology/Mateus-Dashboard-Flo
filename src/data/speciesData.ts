import { SpeciesDetails, IrisFeatures } from '../types/iris';
import setosaImg from '../assets/images/iris_setosa_specimen_1792667787823.jpg';
import versicolorImg from '../assets/images/iris_versicolor_specimen_1792667788991.jpg';
import virginicaImg from '../assets/images/iris_virginica_specimen_1792667788603.jpg';

export const IRIS_SPECIES: Record<string, SpeciesDetails> = {
  Setosa: {
    id: 'Setosa',
    scientificName: 'Iris setosa',
    popularName: 'Íris-do-Ártico',
    codigo: 0,
    image: setosaImg,
    accentColor: 'emerald',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    description: 'Pétalas notavelmente curtas e estreitas em relação às sépalas. Fácil separação linear das demais espécies.',
    traits: [
      'Pétalas muito pequenas (< 2.0 cm)',
      'Largura de pétala reduzida (< 0.6 cm)',
      'Sépalas relativamente largas',
      'Nativa de regiões subárticas e temperadas frias'
    ],
    referenceAverages: {
      sepal_length: 5.0,
      sepal_width: 3.4,
      petal_length: 1.5,
      petal_width: 0.2,
    },
  },
  Versicolor: {
    id: 'Versicolor',
    scientificName: 'Iris versicolor',
    popularName: 'Íris-azul-bandeira',
    codigo: 1,
    image: versicolorImg,
    accentColor: 'indigo',
    textColor: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-200',
    description: 'Dimensões intermediárias de pétala e sépala. Espécie híbrida ancestral com venação roxa vibrante.',
    traits: [
      'Pétalas de comprimento médio (3.0 – 5.0 cm)',
      'Largura de pétala intermediária (1.0 – 1.8 cm)',
      'Sépalas moderadas (5.0 – 7.0 cm)',
      'Padrão de veios brancos e dourados na garganta'
    ],
    referenceAverages: {
      sepal_length: 5.9,
      sepal_width: 2.8,
      petal_length: 4.3,
      petal_width: 1.3,
    },
  },
  Virginica: {
    id: 'Virginica',
    scientificName: 'Iris virginica',
    popularName: 'Íris-da-Virgínia',
    codigo: 2,
    image: virginicaImg,
    accentColor: 'violet',
    textColor: 'text-violet-700',
    bgLight: 'bg-violet-50',
    borderLight: 'border-violet-200',
    description: 'A maior das três espécies com pétalas longas e espessas. Flores de tom violeta profundo a púrpura.',
    traits: [
      'Pétalas longas (> 4.8 cm)',
      'Pétalas largas (> 1.8 cm)',
      'Sépalas compridas e robustas',
      'Nativa de pântanos e áreas úmidas do leste norte-americano'
    ],
    referenceAverages: {
      sepal_length: 6.6,
      sepal_width: 3.0,
      petal_length: 5.6,
      petal_width: 2.0,
    },
  },
};

export interface SamplePreset {
  name: string;
  species: string;
  description: string;
  values: IrisFeatures;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    name: 'Amostra do Modelo (Virginica)',
    species: 'Virginica',
    description: 'Exemplo oficial fornecido nos requisitos (6.7, 3.0, 5.2, 2.3)',
    values: {
      sepal_length: 6.7,
      sepal_width: 3.0,
      petal_length: 5.2,
      petal_width: 2.3,
    },
  },
  {
    name: 'Típica Iris Setosa',
    species: 'Setosa',
    description: 'Pétalas diminutas características da espécie Setosa',
    values: {
      sepal_length: 5.1,
      sepal_width: 3.5,
      petal_length: 1.4,
      petal_width: 0.2,
    },
  },
  {
    name: 'Típica Iris Versicolor',
    species: 'Versicolor',
    description: 'Medidas intermediárias com pétalas de ~4.2cm',
    values: {
      sepal_length: 5.9,
      sepal_width: 3.0,
      petal_length: 4.2,
      petal_width: 1.5,
    },
  },
];
