import { API_URL } from "@/lib/constant";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { success: false, message: "BASE_URL is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(`${API_URL}/api/categories`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // categories are public, but keep this route non-cachey by default
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { success: false, message: "Failed to fetch categories" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Categories proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

