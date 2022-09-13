export async function logApi(route: string, success?: boolean, message? : string) {
    await fetch(`${process.env.NEXTAUTH_URL}/api/logging/log-api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            route: route,
            message: message,
            success: success ?? true,
        })
    })
}