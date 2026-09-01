import { Bell } from "lucide-react"

export function AppHeader() {

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl">
            <button
                type="button"
                onClick={() => {
                window.location.href = "/"
                }}
                className="flex items-center gap-2"
            >
                <span className="flex size-7 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">
                F1
                </span>

                <span className="font-heading text-lg font-bold tracking-tight">
                PRODE F1 <span className="text-arg">🇦🇷</span>
                </span>
            </button>

            <button
                type="button"
                className="relative flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                aria-label="Notificaciones"
            >
                <Bell className="size-4" />

                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </button>
        </header>
    )
}