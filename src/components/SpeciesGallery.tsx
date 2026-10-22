import React from 'react';
import { IRIS_SPECIES } from '../data/speciesData';
import { IrisFeatures, SpeciesDetails } from '../types/iris';
import { ArrowRight, Ruler } from 'lucide-react';

interface SpeciesGalleryProps {
  onSelectSpecies: (features: IrisFeatures) => void;
  currentPrediction?: string;
}

export const SpeciesGallery: React.FC<SpeciesGalleryProps> = ({
  onSelectSpecies,
  currentPrediction,
}) => {
  const speciesList: SpeciesDetails[] = Object.values(IRIS_SPECIES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Espécies do Gênero Iris (Taxonomia Fisher)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare os espécimes botânicos e as médias morfológicas de cada classe.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {speciesList.map((species) => {
          const isSelected = currentPrediction?.toLowerCase() === species.id.toLowerCase();
          const avg = species.referenceAverages;

          return (
            <div
              key={species.id}
              className={`bg-white rounded-xl border transition-all overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow'
              }`}
            >
              {/* Specimen Image */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={species.image}
                  alt={`Fotografia de espécime de Iris ${species.id}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  codigo: {species.codigo}
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
                    Predição Ativa
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      Iris {species.id}
                    </h3>
                    <span className="text-xs italic text-slate-500">
                      {species.scientificName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {species.description}
                  </p>
                </div>

                {/* Average biometric metrics */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Ruler className="w-3.5 h-3.5 text-slate-400" />
                    <span>Médias de Referência (Dataset Fisher):</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Sépala (C x L)</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {avg.sepal_length} x {avg.sepal_width} cm
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Pétala (C x L)</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {avg.petal_length} x {avg.petal_width} cm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apply button */}
                <button
                  type="button"
                  onClick={() => onSelectSpecies(avg)}
                  className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Testar com esta espécie</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
