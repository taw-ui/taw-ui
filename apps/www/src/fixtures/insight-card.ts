import type { TawToolPart } from "@taw-ui/react"

export const insightCardOptions = [
  { key: "recommendation", label: "recommendation", defaultOn: true },
  { key: "confidence", label: "confidence", defaultOn: false },
  { key: "reasoning", label: "reasoning", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

export const insightCardFixtures: Record<string, TawToolPart> = {
  ready: {
    id: "ic-1",
    toolName: "analyzeOrderItem",
    input: { orderNumber: 342 },
    state: "output-available",
    output: {
      id: "analysis-342",
      title: "Roundup Original 20L",
      subtitle: "Porto Nacional · Pedido #342",
      metrics: [
        { label: "Estoque Atual", value: 120, unit: "un", status: "warning" },
        { label: "Venda Mensal", value: 85, unit: "un/mês" },
        { label: "Cobertura", value: 1.4, unit: "meses", status: "critical" },
        { label: "Tendência", value: "Alta", status: "good" },
      ],
      recommendation: "Reduzir para 300 unidades (cobertura de ~5 meses considerando tendência de alta sazonal)",
      sentiment: "caution",
      reasoning: "Estoque atual cobre 1,4 meses. Com 500 unidades, cobrirá 7,3 meses — acima do ideal (3-4 meses). Sugestão: reduzir para 300 unidades.",
      confidence: 0.87,
      caveat: "Baseado em vendas dos últimos 12 meses. Não considera promoções planejadas.",
      source: { label: "Siagri + Sales History", freshness: "live" },
    },
  },
  positive: {
    id: "ic-2",
    toolName: "analyzeOrderItem",
    input: { orderNumber: 501 },
    state: "output-available",
    output: {
      id: "analysis-501",
      title: "Fertilizante NPK 20-05-20",
      subtitle: "Palmas · Pedido #501",
      metrics: [
        { label: "Estoque Atual", value: 45, unit: "un", status: "critical" },
        { label: "Venda Mensal", value: 180, unit: "un/mês" },
        { label: "Cobertura", value: 0.25, unit: "meses", status: "critical" },
        { label: "Tendência", value: "Estável" },
      ],
      recommendation: "Aprovar — estoque crítico com menos de 1 semana de cobertura",
      sentiment: "positive",
      reasoning: "Estoque atual cobre apenas 7 dias de vendas. Quantidade solicitada de 400 unidades fornece 2,5 meses de cobertura, dentro da faixa ideal.",
      confidence: 0.95,
      caveat: "Preço do fornecedor pode variar — cotação válida até sexta-feira",
      source: { label: "Siagri", freshness: "live" },
    },
  },
  negative: {
    id: "ic-3",
    toolName: "analyzeOrderItem",
    input: { orderNumber: 612 },
    state: "output-available",
    output: {
      id: "analysis-612",
      title: "Herbicida Glifosato 5L",
      subtitle: "Gurupi · Pedido #612",
      metrics: [
        { label: "Estoque Atual", value: 580, unit: "un", status: "good" },
        { label: "Venda Mensal", value: 45, unit: "un/mês" },
        { label: "Cobertura", value: 12.9, unit: "meses", status: "warning" },
        { label: "Tendência", value: "Queda", status: "critical" },
      ],
      recommendation: "Rejeitar — estoque já cobre 12,9 meses com tendência de queda nas vendas",
      sentiment: "negative",
      reasoning: "A loja Gurupi já tem excesso de estoque. Considere transferir 200 unidades para Porto Nacional onde há demanda.",
      confidence: 0.91,
      caveat: "Tendência de queda pode ser sazonal — verificar histórico do mesmo período no ano anterior",
      source: { label: "Siagri + Sales History", freshness: "live" },
    },
  },
  loading: {
    id: "ic-4",
    toolName: "analyzeOrderItem",
    input: { orderNumber: 342 },
    state: "input-available",
  },
  error: {
    id: "ic-5",
    toolName: "analyzeOrderItem",
    input: { orderNumber: 999 },
    state: "output-error",
    error: "Pedido #999 não encontrado",
  },
}
