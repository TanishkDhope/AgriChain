"use client"

import React, { createContext, useContext, useId } from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" }

const ChartContext = createContext(null)

function useChart() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

function ChartContainer({ id, className, children, config, ...props }) {
  const uniqueId = useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color)
  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({ active, payload, label, className, config }) {
  if (!active || !payload || payload.length === 0) return null

  const safeItems = payload
    .filter((p) => p && p.dataKey)
    .map((p) => {
      const key = String(p.dataKey)
      const conf = config?.[key] ?? {}
      const safeLabel = conf.label ?? key
      const safeColor = conf.color ?? "hsl(var(--foreground))"
      return { name: safeLabel, value: p.value, color: safeColor, key }
    })

  return (
    <div className={cn("rounded-md border bg-background p-2 text-sm shadow", className)}>
      {label != null && <div className="mb-1 font-medium">{String(label)}</div>}
      <div className="flex flex-col gap-1">
        {safeItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span>{item.name}</span>
            </div>
            <span className="tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({ payload, className, config }) {
  if (!payload || payload.length === 0) return null

  const items = payload
    .filter((p) => p && p.dataKey)
    .map((p) => {
      const key = String(p.dataKey)
      const conf = config?.[key] ?? {}
      return {
        key,
        label: conf.label ?? key,
        color: conf.color ?? "hsl(var(--foreground))",
      }
    })

  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-sm", className)}>
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// Helper to extract item config from a payload
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) return undefined

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key]
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export { ChartContainer, ChartTooltip, ChartLegend, ChartStyle, ChartTooltipContent, ChartLegendContent, useChart }