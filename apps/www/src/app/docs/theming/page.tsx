"use client"

import { CodeBlock, InlineCode } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"

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
          Zero custom tokens. shadcn theming, out of the box.
        </p>
        <p className="mt-3 max-w-xl text-[14px] font-medium text-(--taw-accent)">
          taw-ui components use the same CSS variables as your shadcn components.
          If your theme works with shadcn, it works with taw-ui. No extra configuration.
        </p>
      </div>

      {/* ── Mental model ──────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>The Mental Model</SectionTitle>
        <div className="space-y-4">
          <Prose>
            taw-ui doesn{"'"}t introduce its own design token system. Components
            use standard shadcn/Tailwind classes:{" "}
            <InlineCode>bg-card</InlineCode>,{" "}
            <InlineCode>text-foreground</InlineCode>,{" "}
            <InlineCode>text-muted-foreground</InlineCode>,{" "}
            <InlineCode>border</InlineCode>,{" "}
            <InlineCode>bg-destructive</InlineCode>,{" "}
            <InlineCode>text-primary</InlineCode>, and so on.
            Your existing theme cascade handles everything.
          </Prose>
        </div>

        {/* Visual mental model */}
        <div className="mt-5 overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) shadow-(--taw-shadow-sm)">
          {/* Row header */}
          <div className="grid grid-cols-3 border-b border-(--taw-border) bg-(--taw-surface-sunken)">
            {["Your Theme", "CSS Variable", "taw-ui Component"].map((label) => (
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
              app: "--card: 0 0% 100%",
              var: "--card",
              cls: "bg-card",
            },
            {
              app: "--foreground: 222 84% 5%",
              var: "--foreground",
              cls: "text-foreground",
            },
            {
              app: "--border: 214 32% 91%",
              var: "--border",
              cls: "border",
            },
            {
              app: "--primary: 222 47% 11%",
              var: "--primary",
              cls: "text-primary",
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
              Your globals.css
            </span>
            <span className="text-[10px] text-(--taw-text-muted)">
              Standard shadcn variables
            </span>
            <span className="text-[10px] text-(--taw-text-muted)">
              Tailwind utility class
            </span>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>How It Works</SectionTitle>
        <Prose>
          taw-ui components just work with your existing shadcn setup. Here{"'"}s
          what your globals.css already looks like:
        </Prose>

        <div className="mt-4">
          <CodeBlock label="globals.css">{`/* globals.css — your existing shadcn theme */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --primary: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}`}</CodeBlock>
        </div>

        <p className="mt-4 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          That{"'"}s it. No taw-ui-specific setup. Components read from these
          standard variables.
        </p>
      </section>

      {/* ── Token mapping ──────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Token Mapping</SectionTitle>
        <Prose>
          Here{"'"}s which shadcn tokens taw-ui components use, and where:
        </Prose>

        <div className="mt-4 overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-sm)">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-(--taw-border) bg-(--taw-surface)">
                <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
                  Component Area
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
                  Token Used
                </th>
              </tr>
            </thead>
            <tbody className="bg-(--taw-surface-raised)">
              {[
                ["Card backgrounds", "bg-card"],
                ["Primary text", "text-foreground"],
                ["Secondary text", "text-muted-foreground"],
                ["Borders", "border"],
                ["Accents / CTAs", "text-primary, bg-primary"],
                ["Error states", "text-destructive, bg-destructive"],
                ["Success indicators", "text-emerald-600 dark:text-emerald-400"],
                ["Warning indicators", "text-amber-600 dark:text-amber-400"],
              ].map(([area, token]) => (
                <tr key={area} className="border-b border-(--taw-border) last:border-0">
                  <td className="px-4 py-2.5 text-[12px] text-(--taw-text-secondary)">
                    {area}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-(--taw-accent)">
                    {token}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          For semantic colors like success and warning, components use Tailwind{"'"}s
          built-in color utilities with <InlineCode>dark:</InlineCode> modifiers
          rather than shadcn tokens, since shadcn doesn{"'"}t define these.
        </p>
      </section>

      {/* ── Dark mode ──────────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Dark Mode</SectionTitle>
        <Prose>
          Dark mode works the same way it does with shadcn — add the{" "}
          <InlineCode>dark</InlineCode> class to your{" "}
          <InlineCode>{"<html>"}</InlineCode> element. taw-ui components
          respond to the same <InlineCode>.dark</InlineCode> cascade.
          For semantic colors like success and warning, components use
          Tailwind{"'"}s <InlineCode>dark:</InlineCode> modifier.
        </Prose>

        <div className="mt-4">
          <CodeBlock>{`<!-- Dark mode toggle — same as any shadcn app -->
<html class="dark">
  <!-- All taw-ui components automatically use dark theme values -->
</html>`}</CodeBlock>
        </div>
      </section>

      {/* ── Customization ──────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Customization</SectionTitle>
        <Prose>
          To customize taw-ui components, you have two paths:
        </Prose>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)">
            <span className="block text-[12px] font-semibold text-(--taw-text-primary)">
              1. Change your shadcn theme
            </span>
            <p className="mt-1 text-[12px] leading-relaxed text-(--taw-text-muted)">
              Update the CSS variables in globals.css. All components — both
              shadcn and taw-ui — update automatically.
            </p>
          </div>
          <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)">
            <span className="block text-[12px] font-semibold text-(--taw-text-primary)">
              2. Edit the component
            </span>
            <p className="mt-1 text-[12px] leading-relaxed text-(--taw-text-muted)">
              The component lives in your project. Open the file and change
              classes, layout, or behavior directly.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <span className="mb-2 block font-mono text-[11px] font-medium text-(--taw-text-muted)">
            Example: warmer card backgrounds
          </span>
          <CodeBlock label="globals.css">{`/* Want a warmer card background? Change the shadcn token */
:root {
  --card: 30 20% 99%;
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Best practices ────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Best Practices</SectionTitle>

        <div className="grid gap-2 sm:grid-cols-2">
          <Do>Use shadcn tokens for theme-aware colors that respond to dark mode automatically</Do>
          <Dont>Hardcode hex values in component classes — they won{"'"}t respond to theme changes</Dont>

          <Do>Use Tailwind utilities for fixed colors (<InlineCode>emerald</InlineCode>, <InlineCode>amber</InlineCode>, <InlineCode>red</InlineCode>) with <InlineCode>dark:</InlineCode> modifiers</Do>
          <Dont>Rely on shadcn tokens for semantic colors (success, warning) that shadcn doesn{"'"}t define</Dont>

          <Do>Test both light and dark mode after theme changes</Do>
          <Dont>Override light mode variables and forget the <InlineCode>.dark</InlineCode> counterpart</Dont>
        </div>

        <p className="mt-4 text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          taw-ui uses Tailwind v4{"'"}s <InlineCode>{"(--var)"}</InlineCode> syntax
          for CSS variable references in utility classes. This is the standard
          approach in Tailwind v4 projects.
        </p>
      </section>

      {/* ── Troubleshooting ───────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Troubleshooting</SectionTitle>

        <div className="space-y-3">
          <TroubleshootItem
            problem="Components look unstyled"
            solution={
              <>
                Make sure your shadcn setup is complete. Run{" "}
                <InlineCode>npx shadcn@latest init</InlineCode> if you
                haven{"'"}t.
              </>
            }
          />

          <TroubleshootItem
            problem="Colors don't match my theme"
            solution={
              <>
                taw-ui uses standard shadcn tokens. Check that your
                globals.css defines <InlineCode>--card</InlineCode>,{" "}
                <InlineCode>--foreground</InlineCode>,{" "}
                <InlineCode>--muted-foreground</InlineCode>,{" "}
                <InlineCode>--primary</InlineCode>,{" "}
                <InlineCode>--border</InlineCode>, and{" "}
                <InlineCode>--destructive</InlineCode>.
              </>
            }
          />
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────── */}
      <section className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-accent-subtle) p-6">
        <p className="mb-1 text-[14px] font-semibold text-(--taw-text-primary)">
          Theming is simple because it{"'"}s not ours.
        </p>
        <p className="mb-5 text-[13px] leading-relaxed text-(--taw-text-secondary)">
          taw-ui follows your shadcn theme. No custom tokens to learn, no extra
          CSS to import. Change your theme and every component updates with it.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/docs/quick-start", label: "Quick Start", desc: "First component in 10 min" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, part, confidence" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "See theming in a component" },
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
