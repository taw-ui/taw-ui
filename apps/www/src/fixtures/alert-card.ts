import type { TawToolPart } from "@taw-ui/react"

export const alertCardOptions = [
  { key: "description", label: "description", defaultOn: true },
  { key: "metrics", label: "metrics", defaultOn: true },
  { key: "reasoning", label: "reasoning", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

export const alertCardFixtures: Record<string, TawToolPart> = {
  warning: {
    id: "ac-1",
    toolName: "checkAlerts",
    input: {},
    state: "output-available",
    output: {
      id: "alert-overdue",
      severity: "warning",
      title: "12 pedidos sem aprova\u00e7\u00e3o",
      description: "H\u00e1 pedidos em aberto h\u00e1 mais de 5 dias nas lojas Palmas e Porto Nacional.",
      metrics: [
        { label: "Em aberto", value: 12 },
        { label: "Valor total", value: "R$ 45.200" },
        { label: "Mais antigo", value: "7 dias" },
      ],
      actions: [
        { id: "review", label: "Ver pedidos", primary: true },
        { id: "dismiss", label: "Dispensar" },
      ],
      reasoning: "Pedidos parados h\u00e1 mais de 5 dias podem impactar o abastecimento das lojas no per\u00edodo de safra.",
      source: { label: "Order Monitor", freshness: "live" },
    },
  },
  critical: {
    id: "ac-2",
    toolName: "checkAlerts",
    input: {},
    state: "output-available",
    output: {
      id: "alert-stockout",
      severity: "critical",
      title: "Risco de ruptura de estoque",
      description: "3 produtos na loja Palmas est\u00e3o com estoque abaixo de 1 semana de cobertura.",
      metrics: [
        { label: "Produtos cr\u00edticos", value: 3 },
        { label: "Loja", value: "Palmas" },
        { label: "Impacto estimado", value: "R$ 28.000" },
      ],
      actions: [
        { id: "create-orders", label: "Criar pedidos", primary: true },
        { id: "view-details", label: "Ver detalhes" },
      ],
      source: { label: "Stock Monitor", freshness: "live" },
    },
  },
  info: {
    id: "ac-3",
    toolName: "checkAlerts",
    input: {},
    state: "output-available",
    output: {
      id: "alert-delivery",
      severity: "info",
      title: "3 entregas previstas para hoje",
      description: "Fornecedores confirmaram entrega de 3 pedidos para as lojas Palmas e Gurupi.",
      metrics: [
        { label: "Pedidos", value: 3 },
        { label: "Itens", value: 47 },
      ],
      actions: [
        { id: "view", label: "Ver entregas", primary: true },
      ],
      source: { label: "Logistics API" },
    },
  },
  loading: {
    id: "ac-4",
    toolName: "checkAlerts",
    input: {},
    state: "input-available",
  },
  error: {
    id: "ac-5",
    toolName: "checkAlerts",
    input: {},
    state: "output-error",
    error: "Falha ao consultar alertas",
  },
}
