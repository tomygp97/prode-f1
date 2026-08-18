import { useAuth } from "@/context/auth-context";
import { fetchUserLeagues, UserLeague } from "@/lib/api/leagues";
import { useEffect, useState } from "react";


export function useUserLeagues() {
    const {token} = useAuth();
    const [leagues, setLeagues] = useState<UserLeague[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) {
            setIsLoading(false)
            return;
        }

        let cancelled = false;

        fetchUserLeagues(token)
            .then((data) => {
                if (!cancelled) {
                    setLeagues(data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Error");
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token]);
    return { leagues, isLoading, error }
}