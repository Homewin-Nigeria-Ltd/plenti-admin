import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/constant";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string,
) {
  try {
    // Get the token from HTTP-only cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Build the backend URL
    const path = params.path.join("/");
    const url = `${API_URL}/${path}`;

    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams.toString();
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;

    // Get request body if it exists
    let body = null;
    if (method !== "GET" && method !== "DELETE") {
      try {
        body = await request.json();
      } catch {
        // No body or invalid JSON
      }
    }

    const isExport = path.endsWith("/export");

    // Forward the request to the backend
    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: isExport
          ? "text/csv, application/octet-stream, */*"
          : "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson =
      contentType.includes("application/json") ||
      contentType.includes("text/json") ||
      contentType.includes("+json");

    if (isExport && !isJson) {
      const buffer = await response.arrayBuffer();
      const headers = new Headers();
      headers.set("Content-Type", contentType || "text/csv");
      const disposition = response.headers.get("content-disposition");
      if (disposition) headers.set("Content-Disposition", disposition);
      if (response.status === 401) {
        const res = new NextResponse(buffer, { status: 401, headers });
        res.cookies.delete("token");
        return res;
      }
      return new NextResponse(buffer, { status: response.status, headers });
    }

    const data = await response.json();

    if (response.status === 401 || response.status === 500) {
      const res = NextResponse.json(data, { status: 401 });
      res.cookies.delete("token"); // remove token cookie
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
