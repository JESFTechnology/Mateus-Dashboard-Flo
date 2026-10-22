import React from 'react';
import { Terminal, CheckCircle2, Server, Globe } from 'lucide-react';

export const ApiDocumentation: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-600" />
          Documentação Técnica da API & Modelo Iris
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Especificação formal dos endpoints, modelo de dados, requisitos de compatibilidade e deploy Vercel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Endpoint details */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-xs font-bold rounded">
                POST
              </span>
              <span className="font-mono text-xs text-slate-800 break-all">
                https://ia-do-mateus.onrender.com/api
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                <strong>Host:</strong> Render Cloud (Flask / Gunicorn backend com CORS habilitado: <code className="font-mono text-slate-700">access-control-allow-origin: *</code>).
              </p>
              <p>
                <strong>Endpoint Ativo do Servidor:</strong> <code className="font-mono text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">/api/predict</code> (com fallback automático configurado nesta aplicação).
              </p>
            </div>
          </div>

          {/* Request Payload */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Modelo de Payload Enviado (JSON):</span>
            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner leading-relaxed">
{`{
  "sepal_length": 6.7,
  "sepal_width": 3.0,
  "petal_length": 5.2,
  "petal_width": 2.3
}`}
            </pre>
          </div>
        </div>

        {/* Response Payload */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Modelo de Retorno Esperado (JSON):</span>
            <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto shadow-inner leading-relaxed">
{`{
  "codigo": 2,
  "dados_recebidos": {
    "petal_length": 5.2,
    "petal_width": 2.3,
    "sepal_length": 6.7,
    "sepal_width": 3.0
  },
  "predicao": "Virginica"
}`}
            </pre>
          </div>

          {/* Mapping codes */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-semibold text-slate-800 block">
              Mapeamento de Códigos de Predição:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 bg-white rounded border border-slate-200 text-center">
                <div className="font-bold text-slate-900">0</div>
                <div className="text-[11px] text-emerald-700 font-sans">Setosa</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200 text-center">
                <div className="font-bold text-slate-900">1</div>
                <div className="text-[11px] text-indigo-700 font-sans">Versicolor</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200 text-center">
                <div className="font-bold text-slate-900">2</div>
                <div className="text-[11px] text-violet-700 font-sans">Virginica</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vercel and Build compatibility notes */}
      <div className="p-5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-600" />
          Compatibilidade de Build & Hospedagem na Vercel
        </h3>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>esbuild ^0.28.0</strong> configurado no <code className="font-mono text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">package.json</code>: Garante compatibilidade integral com o <code className="font-mono text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">vite@8.3.0</code> durante o build de produção na infraestrutura da Vercel.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero CORS Block:</strong> O backend do Render fornece os cabeçalhos <code className="font-mono text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">access-control-allow-origin: *</code>, permitindo requisições diretas de qualquer domínio de produção da Vercel.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Server className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Comportamento Cold-Start do Render:</strong> Planos gratuitos entram em suspensão após 15 minutos sem requisições. O aplicativo inclui timeouts resilientes, feedback visual e algoritmo local de emergência para manter a experiência sempre fluida.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
