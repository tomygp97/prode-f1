"use client"

import { cn } from "@/lib/utils"
import { useState } from "react";
import Image from "next/image"

interface TrackedDriverPredictionProps {
    driverId: string;
}

export const TrackedDriverPrediction = ({ driverId }: TrackedDriverPredictionProps) => {
    const [franco, setFranco] = useState<number | null>(null);
    return (
        <section className="overflow-hidden rounded-2xl border border-arg/40 bg-card">
            <div
            className="h-1.5 w-full"
            style={{ background: "linear-gradient(90deg, #74ACDF, #fff, #74ACDF)" }}
            />
            <div className="flex items-center gap-3 p-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-arg/50">
                    <Image
                        src="/colapinto.png"
                        alt="Franco Colapinto"
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                </div>
            <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-arg/15 px-2 py-0.5 text-[10px] font-semibold text-arg">
                🇦🇷 El Argentino
                </span>
                <h2 className="mt-1 font-heading text-xl font-bold uppercase leading-none">
                Franco Colapinto
                </h2>
                <p className="text-xs text-muted-foreground">Alpine · #43 · +10 pts si acertás</p>
            </div>
            </div>
            <div className="px-4 pb-4">
            <p className="mb-2 text-sm font-medium">¿En qué posición terminará Franco?</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
                {Array.from({ length: 20 }).map((_, i) => {
                const pos = i + 1
                return (
                    <button
                    key={pos}
                    type="button"
                    onClick={() => setFranco(pos)}
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg border font-heading text-sm font-bold transition-colors",
                        franco === pos
                        ? "border-arg bg-arg text-arg-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary",
                    )}
                    >
                    P{pos}
                    </button>
                )
                })}
            </div>
            </div>
        </section>
    )
}