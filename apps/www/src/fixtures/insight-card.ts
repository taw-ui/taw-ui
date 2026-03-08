import type { ToolPart } from "@/components/taw/lib/types"

export const insightCardOptions = [
  { key: "recommendation", label: "recommendation", defaultOn: true },
  { key: "confidence", label: "confidence", defaultOn: false },
  { key: "reasoning", label: "reasoning", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

export const insightCardFixtures: Record<string, ToolPart> = {
  ready: {
    toolCallId: "ic-1",
    toolName: "analyzeProduct",
    input: { sku: "HOODIE-BLK-L" },
    state: "output-available",
    output: {
      id: "analysis-hoodie",
      title: "Oversized Logo Hoodie — Restock Analysis",
      subtitle: "SKU HOODIE-BLK-L · Black / Large",
      metrics: [
        { label: "Stock Left", value: 34, unit: "units", status: "warning" },
        { label: "Weekly Sales", value: 89, unit: "units/wk", status: "good" },
        { label: "Days of Stock", value: 2.7, unit: "days", status: "critical" },
        { label: "Sell-Through", value: "94%", status: "good" },
      ],
      recommendation:
        "Reorder 500 units immediately — this SKU will sell out in under 3 days at current velocity. Black/Large is your #1 size and losing sales to stockouts.",
      sentiment: "positive",
      reasoning:
        "This hoodie has a 94% sell-through rate since the last drop 3 weeks ago. Black/Large consistently outsells other variants by 2.3x. The last stockout in November cost an estimated $12K in missed revenue over 5 days.",
      confidence: 0.92,
      caveat:
        "Sales velocity may slow after the initial hype period. Consider a smaller follow-up order if this is a limited edition.",
      source: { label: "Shopify + Inventory API", freshness: "live" },
    },
  },
  positive: {
    toolCallId: "ic-2",
    toolName: "analyzeProduct",
    input: { sku: "TEE-COLLAB-M" },
    state: "output-available",
    output: {
      id: "analysis-collab-tee",
      title: "Artist Collab Tee — Launch Performance",
      subtitle: "Summer '25 Collection · 48h post-drop",
      metrics: [
        { label: "Units Sold", value: 1247, unit: "units", status: "good" },
        { label: "Revenue", value: "$49.9K", status: "good" },
        { label: "Conv. Rate", value: "8.4%", status: "good" },
        { label: "Returns", value: "1.2%", status: "good" },
      ],
      recommendation:
        "Strong launch — outperforming your last 3 collabs by 40%. Consider extending the drop window by 48 hours to capture late demand.",
      sentiment: "positive",
      reasoning:
        "The 8.4% conversion rate is 3x your store average. Social mentions peaked at 2.1K in the first 12 hours. Return rate of 1.2% suggests accurate sizing and satisfied customers.",
      confidence: 0.95,
      source: { label: "Shopify Analytics", freshness: "2 hours ago" },
    },
  },
  negative: {
    toolCallId: "ic-3",
    toolName: "analyzeProduct",
    input: { sku: "JOGGER-GRY-S" },
    state: "output-available",
    output: {
      id: "analysis-jogger",
      title: "Utility Jogger — Return Rate Alert",
      subtitle: "SKU JOGGER-GRY-S · Grey / Small",
      metrics: [
        { label: "Return Rate", value: "18.5%", status: "critical" },
        { label: "Avg Return Rate", value: "4.2%", status: "good" },
        { label: "Complaints", value: 23, unit: "tickets", status: "critical" },
        { label: "NPS Impact", value: "-12", status: "warning" },
      ],
      recommendation:
        "Pause advertising on this SKU and investigate sizing. Return rate is 4.4x your store average — most complaints mention the Small running too tight.",
      sentiment: "negative",
      reasoning:
        "23 support tickets in 2 weeks, 19 of which mention sizing issues specifically for Small. The Grey/Small variant has a 18.5% return rate vs 3.8% for Grey/Medium. This suggests a manufacturing defect in this size run, not a design issue.",
      confidence: 0.89,
      caveat:
        "Returns are still within the 30-day window. Final return rate may be higher once all eligible returns are processed.",
      source: { label: "Shopify + Zendesk", freshness: "live" },
    },
  },
  loading: {
    toolCallId: "ic-4",
    toolName: "analyzeProduct",
    input: { sku: "HOODIE-BLK-L" },
    state: "input-available",
  },
  error: {
    toolCallId: "ic-5",
    toolName: "analyzeProduct",
    input: { sku: "UNKNOWN-999" },
    state: "output-error",
    errorText: "Product SKU not found in catalog",
  },
}
