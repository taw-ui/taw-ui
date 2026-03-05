import type { TawToolPart } from "@taw-ui/core"

export const dataTableFixtures: Record<string, TawToolPart> = {
  loading: {
    id: "dt-1",
    toolName: "showTable",
    input: { query: "top customers" },
    state: "input-available",
  },
  ready: {
    id: "dt-2",
    toolName: "showTable",
    input: { query: "top customers" },
    state: "output-available",
    output: {
      id: "top-customers",
      title: "Top Customers by Revenue",
      columns: [
        { key: "name", label: "Customer", type: "text" },
        { key: "revenue", label: "Revenue", type: "currency", align: "right", sortable: true, format: { currency: "USD" } },
        { key: "growth", label: "Growth", type: "percent", align: "right", sortable: true },
        { key: "plan", label: "Plan", type: "badge" },
        { key: "since", label: "Since", type: "date" },
      ],
      rows: [
        { name: "Acme Corp", revenue: 48200, growth: 23.5, plan: "Enterprise", since: "2023-01-15" },
        { name: "Globex Inc", revenue: 35800, growth: -4.2, plan: "Business", since: "2022-06-01" },
        { name: "Initech", revenue: 29100, growth: 12.8, plan: "Enterprise", since: "2023-08-22" },
        { name: "Umbrella Co", revenue: 22400, growth: 45.1, plan: "Business", since: "2024-02-10" },
        { name: "Soylent Corp", revenue: 18900, growth: 8.3, plan: "Starter", since: "2024-05-30" },
      ],
      total: 5,
      defaultSort: { key: "revenue", direction: "desc" },
      confidence: 0.95,
      source: { label: "Billing API", freshness: "5 min ago" },
    },
  },
  error: {
    id: "dt-3",
    toolName: "showTable",
    input: { query: "top customers" },
    state: "output-error",
    error: "Query timed out after 30s",
  },
}
