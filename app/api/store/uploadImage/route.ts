export async function POST(request: Request) {

    await fetch("https://test.re.company/api/uploadthing", {method: "POST", body: request.body});

    return new Response("Hello world!", { status: 200, headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }});
}