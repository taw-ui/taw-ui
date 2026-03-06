import { PixelIcon, type PixelIconName } from "./pixel-icon"

// ─── Schema Table ────────────────────────────────────────────────────────────

export interface SchemaField {
  field: string
  type: string
  req?: boolean
  desc: string
}

export function SchemaTable({
  fields,
  title,
}: {
  fields: SchemaField[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-sm)">
      {title && (
        <div className="border-b border-(--taw-border) bg-(--taw-surface) px-4 py-2">
          <span className="font-mono text-[11px] font-medium text-(--taw-text-muted)">{title}</span>
        </div>
      )}
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-(--taw-border) bg-(--taw-surface)">
            <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Field</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Type</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Description</th>
          </tr>
        </thead>
        <tbody className="bg-(--taw-surface-raised)">
          {fields.map(({ field, type, req, desc }) => (
            <tr key={field} className="border-b border-(--taw-border) last:border-0">
              <td className="px-4 py-2.5 font-mono text-[12px] text-(--taw-accent)">
                {field}
                {req && <span className="ml-1.5 text-[9px] text-(--taw-error)">*</span>}
              </td>
              <td className="px-4 py-2.5 font-mono text-[12px] text-(--taw-text-muted)">{type}</td>
              <td className="px-4 py-2.5 text-[12px] text-(--taw-text-muted)">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Feature Grid ────────────────────────────────────────────────────────────

export interface Feature {
  icon?: PixelIconName
  title: string
  desc: string
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {features.map(({ icon, title, desc }) => (
        <div
          key={title}
          className="flex gap-3 rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)"
        >
          {icon && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--taw-accent-subtle) text-(--taw-accent)">
              <PixelIcon name={icon} size={12} />
            </div>
          )}
          <div>
            <span className="block text-[13px] font-medium text-(--taw-text-primary)">{title}</span>
            <p className="mt-0.5 text-[12px] text-(--taw-text-muted)">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Related Components ──────────────────────────────────────────────────────

export function RelatedComponents({
  items,
}: {
  items: { href: string; label: string; desc: string }[]
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(({ href, label, desc }) => (
        <a
          key={href}
          href={href}
          className="group flex items-center gap-3 rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm) transition-all hover:border-(--taw-accent) hover:shadow-(--taw-shadow-md)"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--taw-accent-subtle) text-(--taw-accent) transition-colors group-hover:bg-(--taw-accent) group-hover:text-white">
            <PixelIcon name="arrow-right" size={10} />
          </div>
          <div>
            <span className="block text-[13px] font-medium text-(--taw-text-primary)">{label}</span>
            <span className="text-[11px] text-(--taw-text-muted)">{desc}</span>
          </div>
        </a>
      ))}
    </div>
  )
}

// ─── Keyboard Shortcut ───────────────────────────────────────────────────────

export function KeyboardTable({
  shortcuts,
}: {
  shortcuts: { key: string; desc: string }[]
}) {
  return (
    <div className="overflow-x-auto rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-sm)">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-(--taw-border) bg-(--taw-surface)">
            <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Key</th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Action</th>
          </tr>
        </thead>
        <tbody className="bg-(--taw-surface-raised)">
          {shortcuts.map(({ key, desc }) => (
            <tr key={key} className="border-b border-(--taw-border) last:border-0">
              <td className="px-4 py-2.5">
                <kbd className="rounded border border-(--taw-border) bg-(--taw-surface) px-1.5 py-0.5 font-mono text-[11px] text-(--taw-text-primary) shadow-(--taw-shadow-sm)">
                  {key}
                </kbd>
              </td>
              <td className="px-4 py-2.5 text-[12px] text-(--taw-text-muted)">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
