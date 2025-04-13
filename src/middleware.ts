import { NextRequest, NextResponse } from "next/server";
import isAuthenticated from "./app/lib/verify-token";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (request.nextUrl.pathname.startsWith("/home") && !accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (await isAuthenticated(request)) {
    console.log("Authenticated");
  }

  // if (accessToken) {
  //   // try {
  //   const res = await fetch(`http://localhost:8080/verify-token`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });

  //   console.log("!!!");
  //   //   if (res.status !== 200) {
  //   //     return NextResponse.redirect(new URL("/signin", request.url));
  //   //   }
  //   // } catch (error) {
  //   //   return NextResponse.redirect(new URL("/signin", request.url));
  //   // }
  // }

  return NextResponse.next();
}
