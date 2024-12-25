import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const encrypt = (text: string, secret: string) => {
  // Create a 32-byte key using SHA-256
  const key = crypto.createHash('sha256').update(secret).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { provider, apiKey }: { provider: string; apiKey: string } = body;

  if (!provider || !apiKey) {
    return NextResponse.json(
      { error: "provider and apiKey are required" },
      { status: 400 }
    );
  }

  try {
    const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
    if (!SECRET_KEY) {
      throw new Error("Encryption secret key not configured");
    }

    const encryptedKey = encrypt(apiKey, SECRET_KEY);
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Set cookie with encrypted API key
    response.cookies.set(`${provider.toLowerCase()}-api-key`, encryptedKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date("2100-01-01"), // Set a very far future date
    });

    return response;
  } catch (error) {
    console.error("Encryption error:", error);
    return NextResponse.json(
      { error: "Failed to encrypt API key" },
      { status: 500 }
    );
  }
}
