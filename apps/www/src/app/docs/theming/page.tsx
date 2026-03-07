"use client"

import { CodeBlock, InlineCode } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"
import { PixelIcon } from "@/components/pixel-icon"

// ─── Local layout primitives ─────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
      {children}
    </h2>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13.5px] leading-[1.75] text-(--taw-text-secondary)">
      {children}
    </p>
  )
}

function Callout({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "warning"
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-(--taw-radius-lg) border px-5 py-4 ${
        variant === "warning"
          ? "border-(--taw-warning)/30 bg-(--taw-warning)/5"
          : "border-(--taw-border) bg-(--taw-accent-subtle)"
      }`}
    >
      <p
        className={`text-[13.5px] font-medium leading-relaxed ${
          variant === "warning"
            ? "text-(--taw-warning)"
            : "text-(--taw-text-primary)"
        }`}
      >
        {children}
      </p>
    </div>
  )
}

function Do({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-3.5 py-2.5">
      <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-(--taw-success) text-[9px] font-bold text-white">
        ✓
      </span>
      <span className="text-[12.5px] leading-relaxed text-(--taw-text-secondary)">
        {children}
      </span>
    </div>
  )
}

function Dont({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-3.5 py-2.5">
      <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-(--taw-error) text-[9px] font-bold text-white">
        ✗
      </span>
      <span className="text-[12.5px] leading-relaxed text-(--taw-text-secondary)">
        {children}
      </span>
    </div>
  )
}

function TroubleshootItem({
  problem,
  solution,
}: {
  problem: string
  solution: React.ReactNode
}) {
  return (
    <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-4 shadow-(--taw-shadow-sm)">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--taw-warning)/15 text-[9px] font-bold text-(--taw-warning)">
          ?
        </span>
        <span className="text-[13px] font-semibold text-(--taw-text-primary)">
          {problem}
        </span>
      </div>
      <p className="pl-7 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
        {solution}
      </p>
    </div>
  )
}

// ─── Token swatch ────────────────────────────────────────────────────────────

function TokenRow({
  token,
  purpose,
  hint,
  swatch,
  derived,
}: {
  token: string
  purpose: string
  hint?: string
  swatch?: boolean
  derived?: boolean
}) {
  return (
    <tr className="border-b border-(--taw-border) last:border-0">
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          {swatch && (
            <span
              className="inline-block h-3.5 w-3.5 shrink-0 rounded-sm border border-(--taw-border)"
              style={{ background: `var(${token})` }}
            />
          )}
          <code className="font-mono text-[12px] text-(--taw-accent)">{token}</code>
          {derived && (
            <span className="rounded-sm bg-(--taw-surface-sunken) px-1 py-0.5 font-mono text-[9px] text-(--taw-text-muted)">
              derived
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-2.5 text-[12px] text-(--taw-text-muted)">
        {purpose}
        {hint && (
          <span className="mt-0.5 block font-mono text-[10px] text-(--taw-text-disabled)">
            {hint}
          </span>
        )}
      </td>
    </tr>
  )
}

function TokenTable({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-sm)">
      <div className="border-b border-(--taw-border) bg-(--taw-surface) px-4 py-2">
        <span className="font-mono text-[11px] font-medium text-(--taw-text-muted)">
          {title}
        </span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-(--taw-border) bg-(--taw-surface)">
            <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
              Token
            </th>
            <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
              Purpose
            </th>
          </tr>
        </thead>
        <tbody className="bg-(--taw-surface-raised)">{children}</tbody>
      </table>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ThemingPage() {
  return (
    <div className="space-y-14">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Guide
          </span>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-(--taw-text-primary)">
          Theming
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-(--taw-text-secondary)">
          taw-ui follows the host app{"'"}s theme when possible — and looks good
          out of the box when it can{"'"}t. One CSS import. 22 semantic tokens.
          Full control via <InlineCode>--taw-*</InlineCode> overrides.
        </p>
        <p className="mt-3 max-w-xl text-[14px] font-medium text-(--taw-accent)">
          Import one CSS file, override any <InlineCode>--taw-*</InlineCode>{" "}
          token, and keep full control.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "◎", label: "One import", desc: "@taw-ui/react/styles.css" },
            { icon: "↻", label: "shadcn v2 ready", desc: "Auto-inherits your theme" },
            { icon: "△", label: "22 semantic tokens", desc: "Override only what you need" },
          ].map(({ icon, label, desc }) => (
            <div
              key={label}
              className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)"
            >
              <span className="text-[16px] text-(--taw-accent)">{icon}</span>
              <span className="mt-1 block text-[13px] font-semibold text-(--taw-text-primary)">
                {label}
              </span>
              <span className="block font-mono text-[11px] text-(--taw-text-muted)">
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mental model ──────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>The Mental Model</SectionTitle>
        <div className="space-y-4">
          <Prose>
            taw-ui components never reference palette colors like{" "}
            <InlineCode>zinc-900</InlineCode> or{" "}
            <InlineCode>blue-500</InlineCode> directly. Instead, they use
            semantic CSS custom properties — <InlineCode>--taw-surface</InlineCode>,{" "}
            <InlineCode>--taw-border</InlineCode>,{" "}
            <InlineCode>--taw-accent</InlineCode> — that the browser resolves
            at paint time. This is what makes theming predictable and non-destructive.
          </Prose>
          <Prose>
            You control the tokens. The components follow them.
          </Prose>
        </div>

        {/* Visual mental model */}
        <div className="mt-5 overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) shadow-(--taw-shadow-sm)">
          {/* Row header */}
          <div className="grid grid-cols-3 border-b border-(--taw-border) bg-(--taw-surface-sunken)">
            {["Host App", "CSS Variables", "Component"].map((label) => (
              <div
                key={label}
                className="px-4 py-2 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)"
              >
                {label}
              </div>
            ))}
          </div>
          {/* Rows */}
          {[
            {
              app: ".dark { ... }",
              var: "--taw-surface",
              cls: "bg-(--taw-surface)",
            },
            {
              app: "--primary: #7c3aed",
              var: "--taw-accent",
              cls: "text-(--taw-accent)",
            },
            {
              app: "--border: #e5e7eb",
              var: "--taw-border",
              cls: "border-(--taw-border)",
            },
            {
              app: "--radius: 0.5rem",
              var: "--taw-radius-lg",
              cls: "rounded-(--taw-radius-lg)",
            },
          ].map(({ app, var: v, cls }) => (
            <div
              key={v}
              className="grid grid-cols-3 border-b border-(--taw-border) last:border-0"
            >
              <div className="flex items-center border-r border-(--taw-border) px-4 py-2.5 font-mono text-[11px] text-(--taw-text-muted)">
                {app}
              </div>
              <div className="flex items-center justify-center gap-2 border-r border-(--taw-border) px-4 py-2.5">
                <span className="font-mono text-[11px] font-medium text-(--taw-accent)">
                  {v}
                </span>
              </div>
              <div className="flex items-center px-4 py-2.5 font-mono text-[11px] text-(--taw-text-secondary)">
                {cls}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between bg-(--taw-surface-sunken) px-4 py-2">
            <span className="text-[10px] text-(--taw-text-muted)">
              Your override or shadcn default
            </span>
            <span className="text-[10px] text-(--taw-text-muted)">
              Resolved by the browser at paint time
            </span>
            <span className="text-[10px] text-(--taw-text-muted)">
              Tailwind v4 CSS var syntax
            </span>
          </div>
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          A component doesn{"'"}t know what color <InlineCode>--taw-accent</InlineCode> is.
          It only knows to use it. Changing the token changes the component everywhere,
          instantly, without touching a single component file.
        </p>
      </section>

      {/* ── Quick setup ───────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Quick Setup</SectionTitle>
        <Prose>
          Add one import to your global CSS. That{"'"}s it.
        </Prose>

        <div className="mt-4">
          <CodeBlock label="globals.css">{`@import "@taw-ui/react/styles.css";`}</CodeBlock>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "shadcn v2 detected",
              desc: "taw-ui auto-inherits compatible variables from --background, --primary, --border, and friends. Your existing theme shows through.",
            },
            {
              title: "No shadcn",
              desc: "taw-ui falls back to a clean neutral palette with full light and dark support. Override --taw-* tokens to customize.",
            },
            {
              title: "shadcn v1",
              desc: "Raw HSL channel values (e.g. 240 5% 64%) are not valid CSS colors. Override --taw-* tokens directly instead.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)"
            >
              <span className="block text-[12px] font-semibold text-(--taw-text-primary)">
                {title}
              </span>
              <p className="mt-1 text-[12px] leading-relaxed text-(--taw-text-muted)">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          The import activates defaults for all 22 tokens in both light and
          dark mode. If a shadcn variable exists in scope, the taw-ui token
          inherits it. If not, the fallback value is used. You never need to
          define tokens you{"'"}re happy with.
        </p>
      </section>

      {/* ── shadcn v2 compatibility ───────────────────────────────────────── */}
      <section>
        <SectionTitle>shadcn v2 Compatibility</SectionTitle>
        <Prose>
          taw-ui maps to shadcn v2 variables where the semantics actually align.
          Not every shadcn variable has a taw-ui equivalent — only the ones
          where the meaning is unambiguous.
        </Prose>

        <div className="mt-4 overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-sm)">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-(--taw-border) bg-(--taw-surface)">
                <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
                  taw-ui token
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
                  Maps to shadcn v2
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
                  Fallback (no shadcn)
                </th>
              </tr>
            </thead>
            <tbody className="bg-(--taw-surface-raised)">
              {[
                ["--taw-surface", "--background", "#ffffff / #171717"],
                ["--taw-surface-raised", "--card", "#fafafa / #262626"],
                ["--taw-surface-sunken", "--muted", "#f5f5f5 / #0a0a0a"],
                ["--taw-border", "--border", "#e5e7eb / #2e2e2e"],
                ["--taw-border-strong", "--input", "#d1d5db / #3f3f3f"],
                ["--taw-text-primary", "--foreground", "#0a0a0a / #fafafa"],
                ["--taw-text-secondary", "--secondary-foreground", "#525252 / #a3a3a3"],
                ["--taw-text-muted", "--muted-foreground", "#a3a3a3 / #737373"],
                ["--taw-accent", "--primary", "#7c3aed / #a78bfa"],
                ["--taw-error", "--destructive", "#dc2626 / #ef4444"],
                ["--taw-radius", "--radius", "0.5rem"],
              ].map(([taw, shadcn, fallback]) => (
                <tr key={taw} className="border-b border-(--taw-border) last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-(--taw-accent)">
                    {taw}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-(--taw-text-secondary)">
                    {shadcn}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-(--taw-text-muted)">
                    {fallback}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          Tokens not listed here — <InlineCode>--taw-success</InlineCode>,{" "}
          <InlineCode>--taw-warning</InlineCode>, the derived tokens — have
          no reliable shadcn equivalent and use taw-ui defaults. Override them
          directly if needed.
        </p>

        <Callout variant="warning">
          shadcn v1 (Tailwind v3) uses raw HSL channel values like{" "}
          <InlineCode className="text-(--taw-warning)">240 5% 64%</InlineCode>{" "}
          which are not valid CSS colors and will not cascade. If you{"'"}re on
          shadcn v1, override <InlineCode className="text-(--taw-warning)">--taw-*</InlineCode>{" "}
          tokens directly in your CSS, or upgrade to shadcn v2 + Tailwind v4.
        </Callout>
      </section>

      {/* ── Override examples ─────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Override Examples</SectionTitle>
        <Prose>
          You never need to redefine all 22 tokens. Override only what differs
          from the defaults — one token or twenty, the system handles the rest.
        </Prose>

        <div className="mt-5 space-y-5">
          {/* Brand accent */}
          <div>
            <span className="mb-2 block font-mono text-[11px] font-medium text-(--taw-text-muted)">
              Brand accent override — one token changes everything interactive
            </span>
            <CodeBlock label="globals.css">{`@import "@taw-ui/react/styles.css";

:root {
  --taw-accent: #0066ff;  /* Your brand blue */
}

/* Buttons, badges, focus rings, links — all update automatically */`}</CodeBlock>
          </div>

          {/* Full brand override */}
          <div>
            <span className="mb-2 block font-mono text-[11px] font-medium text-(--taw-text-muted)">
              Full brand override — light and dark
            </span>
            <CodeBlock label="globals.css">{`@import "@taw-ui/react/styles.css";

:root {
  --taw-surface: #ffffff;
  --taw-surface-raised: #f8fafc;
  --taw-surface-sunken: #f1f5f9;
  --taw-border: #e2e8f0;
  --taw-text-primary: #0f172a;
  --taw-text-secondary: #475569;
  --taw-text-muted: #94a3b8;
  --taw-accent: #6366f1;
  --taw-radius: 6px;
}

.dark {
  --taw-surface: #0f172a;
  --taw-surface-raised: #1e293b;
  --taw-surface-sunken: #020617;
  --taw-border: #1e293b;
  --taw-text-primary: #f8fafc;
  --taw-text-secondary: #94a3b8;
  --taw-text-muted: #64748b;
  --taw-accent: #818cf8;
}`}</CodeBlock>
          </div>

          {/* Scoped override */}
          <div>
            <span className="mb-2 block font-mono text-[11px] font-medium text-(--taw-text-muted)">
              Scoped override — change tokens inside a container only
            </span>
            <CodeBlock label="globals.css">{`/* Override tokens for a specific panel or page section */
.ai-panel {
  --taw-accent: #10b981;       /* Teal for this panel's AI */
  --taw-surface: #f0fdf4;      /* Subtle green tint */
  --taw-radius: 4px;           /* Tighter corners */
}

/* Components inside .ai-panel will pick up these overrides */`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* ── Full token reference ───────────────────────────────────────────── */}
      <section>
        <SectionTitle>Token Reference</SectionTitle>
        <Prose>
          22 canonical tokens across 7 categories. Swatches update with your
          current theme — toggle dark mode to see them change.
        </Prose>

        <div className="mt-5 space-y-4">
          <TokenTable title="Surfaces">
            <TokenRow
              token="--taw-surface"
              purpose="Default component background"
              hint="Cards, panels, popover backgrounds"
              swatch
            />
            <TokenRow
              token="--taw-surface-raised"
              purpose="Elevated elements — cards, dropdowns"
              hint="Sits above --taw-surface visually"
              swatch
            />
            <TokenRow
              token="--taw-surface-sunken"
              purpose="Recessed areas — page background, code blocks"
              hint="Sits below --taw-surface visually"
              swatch
            />
          </TokenTable>

          <TokenTable title="Borders">
            <TokenRow
              token="--taw-border"
              purpose="Standard borders and dividers"
              swatch
            />
            <TokenRow
              token="--taw-border-subtle"
              purpose="Very light dividers inside components"
              hint="color-mix(--border, white/black)"
              swatch
              derived
            />
            <TokenRow
              token="--taw-border-strong"
              purpose="Input borders and prominent dividers"
              swatch
            />
          </TokenTable>

          <TokenTable title="Text">
            <TokenRow
              token="--taw-text-primary"
              purpose="Headings and primary content"
              swatch
            />
            <TokenRow
              token="--taw-text-secondary"
              purpose="Body text and descriptions"
              swatch
            />
            <TokenRow
              token="--taw-text-muted"
              purpose="Labels, captions, supporting copy"
              swatch
            />
            <TokenRow
              token="--taw-text-disabled"
              purpose="Disabled UI elements"
              hint="color-mix(--muted-foreground, white/black)"
              swatch
              derived
            />
          </TokenTable>

          <TokenTable title="Accent">
            <TokenRow
              token="--taw-accent"
              purpose="Buttons, links, badges, focus rings, highlights"
              hint="The primary interactive color — change this first"
              swatch
            />
            <TokenRow
              token="--taw-accent-subtle"
              purpose="Tinted backgrounds, hover states, badge fills"
              hint="color-mix(--primary, --background)"
              swatch
              derived
            />
            <TokenRow
              token="--taw-accent-hover"
              purpose="Darkened/lightened accent for hover state"
              hint="color-mix(--primary 85%, black/white)"
              swatch
              derived
            />
          </TokenTable>

          <TokenTable title="Semantic">
            <TokenRow
              token="--taw-success"
              purpose="Positive states — confirmations, receipts, confidence ≥ 0.8"
              swatch
            />
            <TokenRow
              token="--taw-warning"
              purpose="Caution states — amber alerts, confidence 0.5–0.8"
              swatch
            />
            <TokenRow
              token="--taw-error"
              purpose="Error states, destructive actions, confidence < 0.5"
              swatch
            />
          </TokenTable>

          <TokenTable title="Radius">
            <TokenRow
              token="--taw-radius"
              purpose="Standard corner radius — base value"
              hint="Default: 0.5rem"
            />
            <TokenRow
              token="--taw-radius-sm"
              purpose="Smaller radius for tight elements (badges, inner cards)"
              hint="calc(--radius - 2px)"
              derived
            />
            <TokenRow
              token="--taw-radius-lg"
              purpose="Larger radius for cards and modals"
              hint="calc(--radius + 4px)"
              derived
            />
          </TokenTable>

          <TokenTable title="Shadows">
            <TokenRow
              token="--taw-shadow-sm"
              purpose="Subtle elevation — default component shadow"
            />
            <TokenRow
              token="--taw-shadow-md"
              purpose="Card-level elevation — hover states, elevated panels"
            />
            <TokenRow
              token="--taw-shadow-ring"
              purpose="Outline ring — used for focus-adjacent visual anchoring"
            />
          </TokenTable>
        </div>

        <p className="mt-4 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          The docs site itself uses a custom Alucard (light) / Dracula (dark)
          theme and does not use the default styles.css. Component consumers
          use <InlineCode>@taw-ui/react/styles.css</InlineCode>.
        </p>
      </section>

      {/* ── How components use tokens ─────────────────────────────────────── */}
      <section>
        <SectionTitle>How Components Use Tokens</SectionTitle>
        <Prose>
          Components use Tailwind v4{"'"}s CSS variable syntax, which directly
          references custom properties at compile time without generating
          palette-coupled utility classes.
        </Prose>

        <div className="mt-4">
          <CodeBlock label="Example component class usage">{`// A typical card surface
className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface)"

// An accent badge
className="bg-(--taw-accent-subtle) text-(--taw-accent)"

// A muted label
className="text-(--taw-text-muted)"

// An elevated shadow on hover
className="shadow-(--taw-shadow-sm) hover:shadow-(--taw-shadow-md)"`}</CodeBlock>
        </div>

        <div className="mt-4 space-y-2.5">
          <Prose>
            This matters for three reasons:
          </Prose>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {[
              {
                title: "Semantic, not palette-coupled",
                desc: "Changing --taw-accent from purple to green updates every interactive element. No find-and-replace.",
              },
              {
                title: "Integrates into more apps",
                desc: "Because components reference variables, they inherit the host app's color system automatically when the mappings are set.",
              },
              {
                title: "Theming is predictable",
                desc: "There are no hidden hardcoded values. Every visible color in a component traces back to a named, overrideable token.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)"
              >
                <span className="block text-[12px] font-semibold text-(--taw-text-primary)">
                  {title}
                </span>
                <p className="mt-1 text-[12px] leading-relaxed text-(--taw-text-muted)">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Derived tokens ────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Derived Tokens</SectionTitle>
        <Prose>
          Not all 22 tokens are fully independent. Six tokens are derived from
          base tokens using <InlineCode>color-mix()</InlineCode> or{" "}
          <InlineCode>calc()</InlineCode>. This keeps the system small: you
          set the base, the derivatives follow automatically.
        </Prose>

        <div className="mt-4">
          <CodeBlock label="How derived tokens work (from styles.css)">{`/* Base token — you set this */
--taw-accent: var(--primary, #7c3aed);

/* Derived — taw-ui computes these from the base */
--taw-accent-subtle: color-mix(in oklch, var(--primary, #7c3aed) 8%, var(--background, #fff));
--taw-accent-hover:  color-mix(in oklch, var(--primary, #7c3aed) 85%, black);

/* Same pattern for borders, text, and radius */
--taw-border-subtle: color-mix(in oklch, var(--border, #e5e7eb) 60%, white);
--taw-radius-sm: calc(var(--radius, 0.5rem) - 2px);
--taw-radius-lg: calc(var(--radius, 0.5rem) + 4px);`}</CodeBlock>
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          If you override a base token like <InlineCode>--taw-accent</InlineCode>,
          the derived tokens (<InlineCode>--taw-accent-subtle</InlineCode>,{" "}
          <InlineCode>--taw-accent-hover</InlineCode>) will follow — as long
          as you use the <InlineCode>--taw-*</InlineCode> override and not just
          the underlying shadcn variable. If you need precise control over
          derived values, override them explicitly.
        </p>
      </section>

      {/* ── Best practices ────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Best Practices</SectionTitle>

        <div className="grid gap-2 sm:grid-cols-2">
          <Do>Override only the tokens that differ from defaults — the system handles the rest</Do>
          <Dont>Redefine all 22 tokens when changing one aspect of the theme</Dont>

          <Do>Preserve token semantics — use <InlineCode>--taw-error</InlineCode> for errors, <InlineCode>--taw-success</InlineCode> for positive states</Do>
          <Dont>Remap tokens to unrelated meanings (e.g. using <InlineCode>--taw-error</InlineCode> as a brand highlight)</Dont>

          <Do>Test both light and dark mode after overriding tokens</Do>
          <Dont>Override light mode tokens and forget the <InlineCode>.dark</InlineCode> counterpart</Dont>

          <Do>Reach for token overrides first — before editing copied component internals</Do>
          <Dont>Use component editing as a workaround for theming changes that tokens can handle</Dont>

          <Do>Use scoped overrides for components that need a distinct visual context</Do>
          <Dont>Use <InlineCode>!important</InlineCode> to force colors — you{"'"}re fighting the cascade</Dont>
        </div>
      </section>

      {/* ── Troubleshooting ───────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Troubleshooting</SectionTitle>

        <div className="space-y-3">
          <TroubleshootItem
            problem="Components look unstyled or use browser defaults"
            solution={
              <>
                The <InlineCode>@import "@taw-ui/react/styles.css"</InlineCode>{" "}
                line is missing or loading after your overrides. Ensure the
                import appears before any custom <InlineCode>--taw-*</InlineCode>{" "}
                declarations in your globals.css.
              </>
            }
          />

          <TroubleshootItem
            problem="shadcn theme is not being picked up"
            solution={
              <>
                Verify you{"'"}re on shadcn v2 (Tailwind v4). shadcn v1 uses raw
                HSL channel values that are not valid CSS colors. Check that
                your shadcn tokens are defined in <InlineCode>:root</InlineCode>{" "}
                and loaded before <InlineCode>@taw-ui/react/styles.css</InlineCode>.
              </>
            }
          />

          <TroubleshootItem
            problem="Dark mode is not changing component colors"
            solution={
              <>
                taw-ui uses class-based dark mode. The{" "}
                <InlineCode>.dark</InlineCode> class must be on the{" "}
                <InlineCode>{"<html>"}</InlineCode> element. If your app uses{" "}
                <InlineCode>data-theme="dark"</InlineCode> or a media query instead,
                add a manual override:{" "}
                <InlineCode>[data-theme="dark"] {"{"} --taw-surface: ... {"}"}</InlineCode>{" "}
                or wrap your global CSS in the relevant selector.
              </>
            }
          />

          <TroubleshootItem
            problem="Derived tokens are not updating after overriding a base token"
            solution={
              <>
                Derived tokens reference the taw-ui base (e.g.{" "}
                <InlineCode>--taw-accent</InlineCode>), not the original shadcn
                variable. If you override{" "}
                <InlineCode>--primary</InlineCode> directly after the import,
                derived tokens may not update. Override{" "}
                <InlineCode>--taw-accent</InlineCode> instead, or explicitly
                override the derived tokens alongside it.
              </>
            }
          />

          <TroubleshootItem
            problem="I want full visual control — no shadcn inheritance"
            solution={
              <>
                Define all <InlineCode>--taw-*</InlineCode> tokens explicitly
                after the import. Your values will take precedence over both
                the shadcn fallbacks and the taw-ui defaults. You only need
                the 10–12 non-derived tokens; the rest will follow.
              </>
            }
          />
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────── */}
      <section className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-accent-subtle) p-6">
        <p className="mb-1 text-[14px] font-semibold text-(--taw-text-primary)">
          taw-ui should follow the product, not fight it.
        </p>
        <p className="mb-5 text-[13px] leading-relaxed text-(--taw-text-secondary)">
          The token system is designed to stay out of your way. Import once,
          override what you need, and let the components inherit the rest.
          The goal is zero visual friction between taw-ui and your app.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/docs/quick-start", label: "Quick Start", desc: "First component in 10 min" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, part, confidence" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "See tokens in a component" },
            { href: "/docs/components/data-table", label: "DataTable", desc: "Tables with semantic styling" },
          ].map(({ href, label, desc }) => (
            <a
              key={href}
              href={href}
              className="group rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-3.5 py-3 shadow-(--taw-shadow-sm) transition-all hover:border-(--taw-accent)/30 hover:shadow-(--taw-shadow-md)"
            >
              <span className="block text-[12px] font-medium text-(--taw-accent)">
                {label} →
              </span>
              <span className="mt-0.5 block text-[11px] text-(--taw-text-muted)">
                {desc}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
