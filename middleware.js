import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export async function middleware(request, response) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });
  const url = request.nextUrl.clone();
  if (url.pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && url.pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.next();
  }
}
