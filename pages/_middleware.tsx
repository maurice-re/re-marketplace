import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl;
  if (url.pathname == "/") {
    url.pathname = "/form/location";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
