import { cn, teamColourStyles } from "@/lib/utils"
import { type Driver } from "@/lib/f1-data"

export function DriverAvatar({
  driver,
  colour = "#666",
  size = "md",
  className,
}: {
  driver: Driver
  colour?: string
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const { colour: display, gradientAlpha, outerRing } = teamColourStyles(colour)
  const dim =
    size === "lg" ? "size-14 text-base" : size === "sm" ? "size-9 text-xs" : "size-11 text-sm"
  const insetShadow = `inset 0 0 0 2px ${display}`
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-heading font-bold text-foreground",
        dim,
        className,
      )}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${display}${gradientAlpha}, transparent 70%), oklch(0.27 0.006 285)`,
        boxShadow: outerRing ? `${insetShadow}, ${outerRing}` : insetShadow,
      }}
      aria-hidden="true"
    >
      {driver.acronym}
      <span
        className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold leading-none"
        style={{ backgroundColor: display, color: "#0a0a0b" }}
      >
        {driver.driverNumber}
      </span>
    </div>
  )
}
