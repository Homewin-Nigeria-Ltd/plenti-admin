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
    const image = incoming.get("image");
    const folder = incoming.get("folder") ?? "product";

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Missing image file." },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.set("image", image);
    body.set("folder", String(folder));

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/api/upload/image`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { success: false, message: "Image upload failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Upload image proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
