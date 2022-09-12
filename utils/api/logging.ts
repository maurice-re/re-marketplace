export function logApi(route: string, success?: boolean, message? : string) {
    fetch("/api/logging/log-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            route: route,
            message: message,
            success: success ?? true,
        })
    })
}