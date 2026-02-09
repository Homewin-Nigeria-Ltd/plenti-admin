import { API_URL } from "@/lib/constant";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { success: false, message: "BASE_URL is not configured." },
        { status: 500 }
      );
    }

    const incoming = await request.formData();
    const avatar = incoming.get("avatar");

    if (!(avatar instanceof File)) {
      return NextResponse.json(
        { success: false, message: "The avatar field is required." },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.set("avatar", avatar);

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/api/admin/account-settings/avatar`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { success: false, message: "Avatar upload failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Upload avatar proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
