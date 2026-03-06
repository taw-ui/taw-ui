"use client"

import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useMemo, useId } from "react"
import type { TawToolPart } from "taw-ui"
import { cn } from "../lib/utils"
import { getEnterProps, staggerParent, enterVariants } from "../lib/motion"
import { SourceLabel, TawError, TawSkeleton, ConfidenceBadge, Typewriter } from "../lib/shared"
import {
  parseKpiCard,
  type KpiCardData,
  type StatFormat,
  type StatDiff,
} from "./schema"

type Stat = KpiCardData["stats"][number]

// ─── Spline interpolation ────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toFixed(1)
}

function computePoints(
  data: number[],
  w: number,
  h: number,
  pad = 2,
): { x: number; y: number }[] {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  return data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }))
}

function splinePath(
  pts: { x: number; y: number }[],
  tension = 0.35,
): string {
  if (pts.length < 2) return ""
  if (pts.length === 2) {
    return `M${fmt(pts[0]!.x)},${fmt(pts[0]!.y)}L${fmt(pts[1]!.x)},${fmt(pts[1]!.y)}`
  }

  let d = `M${fmt(pts[0]!.x)},${fmt(pts[0]!.y)}`

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3

    d += `C${fmt(cp1x)},${fmt(cp1y)},${fmt(cp2x)},${fmt(cp2y)},${fmt(p2.x)},${fmt(p2.y)}`
  }

  return d
}

// ─── Value formatting ────────────────────────────────────────────────────────

function formatStatValue(
  value: number | string,
  format?: StatFormat,
  locale?: string,
): string {
  if (typeof value === "string" || !format) return String(value)

  switch (format.kind) {
    case "text":
      return String(value)

    case "number":
      if (format.compact) {
        return value.toLocaleString(locale, {
          notation: "compact",
          maximumFractionDigits: format.decimals ?? 1,
        })
      }
      return format.decimals !== undefined
        ? value.toFixed(format.decimals)
        : value.toLocaleString(locale)

    case "currency":
      return value.toLocaleString(locale, {
        style: "currency",
        currency: format.currency,
        minimumFractionDigits: format.decimals ?? 0,
        maximumFractionDigits: format.decimals ?? 0,
      })

    case "percent": {
      const pct = format.basis === "fraction" ? value * 100 : value
      return `${pct.toFixed(format.decimals ?? 1)}%`
    }
  }
}

// ─── AnimatedValue ───────────────────────────────────────────────────────────

function AnimatedValue({
  value,
  format,
  animate,
  size = "base",
  locale,
}: {
  value: number | string
  format?: StatFormat
  animate: boolean
  size?: "hero" | "base"
  locale?: string
}) {
  const isNumber = typeof value === "number"
  const spring = useSpring(0, { stiffness: 100, damping: 20 })
  const display = useTransform(spring, (v) =>
    formatStatValue(v, format, locale),
  )

  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isNumber && animate && !hasAnimated.current) {
      hasAnimated.current = true
      spring.set(value as number)
    }
  }, [isNumber, animate, value, spring])

  return (
    <span
      className={cn(
        "font-mono font-semibold tabular-nums tracking-tight text-(--taw-text-primary)",
        size === "hero" ? "text-4xl leading-none" : "text-2xl leading-none",
      )}
    >
      {isNumber && animate ? (
        <motion.span>{display}</motion.span>
      ) : (
        formatStatValue(value, format, locale)
      )}
    </span>
  )
}

// ─── DiffIndicator ───────────────────────────────────────────────────────────

function DiffIndicator({ diff }: { diff: StatDiff }) {
  const isPositive = diff.value > 0
  const isNeutral = diff.value === 0
  const upIsPositive = diff.upIsPositive ?? true

  const isGood = isNeutral ? null : isPositive ? upIsPositive : !upIsPositive
  const colorClass =
    isGood === null
      ? "text-(--taw-text-muted) bg-(--taw-text-muted)/10"
      : isGood
        ? "text-(--taw-success) bg-(--taw-success)/10"
        : "text-(--taw-error) bg-(--taw-error)/10"

  const sign = isPositive ? "+" : ""
  const decimals = diff.decimals ?? 1

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2 py-[3px] font-mono text-[11px] font-medium tabular-nums leading-none",
        colorClass,
      )}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="currentColor"
        className={cn(
          "shrink-0",
          diff.value < 0 && "rotate-180",
          isNeutral && "rotate-90",
        )}
      >
        <path d="M4 1.5L7 5.5H1L4 1.5Z" />
      </svg>
      <span>
        {sign}
        {diff.value.toFixed(decimals)}%
      </span>
      {diff.label && (
        <span className="font-sans text-[10px] font-normal text-(--taw-text-muted)">
          {diff.label}
        </span>
      )}
    </span>
  )
}

// ─── Background Sparkline ───────────────────────────────────────────────────

function BgSparkline({
  data,
  color = "var(--taw-accent)",
  animate,
}: {
  data: number[]
  color?: string
  animate: boolean
}) {
  const uid = useId()
  const gid = `bg${uid.replace(/:/g, "")}`
  const fid = `bf${uid.replace(/:/g, "")}`
  const mid = `bm${uid.replace(/:/g, "")}`

  const { line, area } = useMemo(() => {
    if (data.length < 2) return { line: "", area: "" }
    const pts = computePoints(data, 200, 80, 0)
    const l = splinePath(pts)
    const lastPt = pts[pts.length - 1]!
    const firstPt = pts[0]!
    const a = `${l}L${fmt(lastPt.x)},80L${fmt(firstPt.x)},80Z`
    return { line: l, area: a }
  }, [data])

  if (data.length < 2) return null

  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.08} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        {/* Left-to-right fade so chart doesn't clash with text */}
        <linearGradient id={fid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="black" />
          <stop offset="35%" stopColor="white" />
          <stop offset="100%" stopColor="white" />
        </linearGradient>
        <mask id={mid}>
          <rect x="0" y="0" width="200" height="80" fill={`url(#${fid})`} />
          {animate && (
            <motion.rect
              x="0"
              y="0"
              width="200"
              height="80"
              fill="black"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              style={{ originX: 1 }}
            />
          )}
        </mask>
      </defs>
      <g mask={`url(#${mid})`}>
        <path d={area} fill={`url(#${gid})`} />
        <path
          d={line}
          stroke={color}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.2}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}

// ─── StatTile ────────────────────────────────────────────────────────────────

function HeroStat({
  stat,
  animate,
  locale,
}: {
  stat: Stat
  animate: boolean
  locale?: string
}) {
  return (
    <motion.div
      variants={enterVariants}
      className="relative flex flex-col gap-3 overflow-hidden px-6 py-8"
    >
      {stat.sparkline && (
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <BgSparkline
            data={stat.sparkline.data}
            color={stat.sparkline.color}
            animate={animate}
          />
        </div>
      )}

      <span className="relative text-[11px] font-semibold uppercase tracking-[0.12em] text-(--taw-text-muted)">
        {stat.label}
      </span>

      <div className="relative flex flex-col gap-2">
        <AnimatedValue
          value={stat.value}
          format={stat.format}
          animate={animate}
          size="hero"
          locale={locale}
        />
        {stat.diff && <DiffIndicator diff={stat.diff} />}
      </div>
    </motion.div>
  )
}

function GridStat({
  stat,
  animate,
  locale,
  span,
  index,
  count,
}: {
  stat: Stat
  animate: boolean
  locale?: string
  span?: boolean
  index: number
  count: number
}) {
  const isLeft = index % 2 === 0
  const isTop = index < 2

  return (
    <motion.div
      variants={enterVariants}
      whileHover={animate ? { backgroundColor: "var(--taw-surface-raised)" } : undefined}
      transition={{ duration: 0.15 }}
      className={cn(
        "group relative flex flex-col gap-2 overflow-hidden bg-(--taw-surface) p-4",
        span && "col-span-2",
        isLeft && !span && "border-r border-(--taw-border-subtle)",
        isTop && count > 2 && "border-b border-(--taw-border-subtle)",
      )}
    >
      {stat.sparkline && (
        <div className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
          <BgSparkline
            data={stat.sparkline.data}
            color={stat.sparkline.color}
            animate={animate}
          />
        </div>
      )}

      <span className="relative text-[11px] font-semibold uppercase tracking-[0.08em] text-(--taw-text-muted)">
        {stat.label}
      </span>

      <div className="relative flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <AnimatedValue
            value={stat.value}
            format={stat.format}
            animate={animate}
            size="base"
            locale={locale}
          />
          {stat.diff && <DiffIndicator diff={stat.diff} />}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function KpiCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["12px", "80px"],
        ["32px", "120px"],
        ["10px", "56px"],
      ]}
      animate={animate}
    />
  )
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────

export interface KpiCardProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean
  className?: string
  locale?: string
}

export function KpiCard({
  part,
  animate = true,
  className,
  locale,
}: KpiCardProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <KpiCardSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = parseKpiCard(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as KpiCardData
  const count = data.stats.length
  const isHero = count === 1

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) font-sans shadow-(--taw-shadow-sm)",
        className,
      )}
      data-taw-component="kpi-card"
      data-taw-id={data.id}
    >
      {data.confidence !== undefined && (
        <ConfidenceBadge confidence={data.confidence} />
      )}

      {(data.title || data.description) && (
        <motion.div
          variants={enterVariants}
          className="border-b border-(--taw-border) px-4 py-3"
        >
          {data.title && (
            <h3 className="text-[13px] font-semibold text-(--taw-text-primary)">
              {data.title}
            </h3>
          )}
          {data.description && (
            <p className="mt-0.5 text-[11px] text-(--taw-text-muted)">
              {data.description}
            </p>
          )}
        </motion.div>
      )}

      {isHero ? (
        <HeroStat
          stat={data.stats[0]!}
          animate={animate}
          locale={locale}
        />
      ) : (
        <div className="grid grid-cols-2">
          {data.stats.map((stat, i) => (
            <GridStat
              key={stat.key}
              stat={stat}
              animate={animate}
              locale={locale}
              span={count === 3 && i === 2}
              index={i}
              count={count}
            />
          ))}
        </div>
      )}

      {data.caveat && (
        <motion.div
          variants={enterVariants}
          className="mx-4 mb-3 mt-1 flex gap-2 rounded-lg bg-(--taw-accent-subtle) px-3 py-2"
        >
          <span className="mt-0.5 shrink-0 text-[10px] text-(--taw-accent)">
            {"\u2192"}
          </span>
          <Typewriter
            text={data.caveat}
            animate={animate}
            className="text-[11px] leading-relaxed text-(--taw-accent)"
          />
        </motion.div>
      )}

      {data.source && (
        <motion.div
          variants={enterVariants}
          className="border-t border-(--taw-border-subtle) px-4 py-2"
        >
          <SourceLabel source={data.source} />
        </motion.div>
      )}
    </motion.div>
  )
}
