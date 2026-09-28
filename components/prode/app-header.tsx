import Link from "next/link"

// TODO: notificaciones (la campana se sacó en el MVP: no había nada detrás)
export function AppHeader() {
    return (
        <header className="sticky top-0 z-40 flex items-center border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl">
            <Link href="/home" className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">
                F1
                </span>

                <span className="font-heading text-lg font-bold tracking-tight">
                PRODE F1 <span className="text-arg">🇦🇷</span>
                </span>
            </Link>
        </header>
    )
}
