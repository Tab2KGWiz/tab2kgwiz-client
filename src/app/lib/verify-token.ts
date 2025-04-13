import type { NextRequest } from "next/server";
import axios from "axios";

export default async function isAuthenticated(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  try {
    const verifyResponse = await fetch(`http://localhost:8080/verify-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (verifyResponse.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}
