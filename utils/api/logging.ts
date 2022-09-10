export function logApi(route: string) {
    fetch("/api/logging/log-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            route: route
        })
    })
}