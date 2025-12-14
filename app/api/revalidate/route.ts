import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"

// Function to verify HMAC signature
async function verifySignature(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature) return false

  // GitHub sends signatures as "sha256=<hash>"
  const signatureParts = signature.split("=")
  if (signatureParts.length !== 2) return false

  const [algorithm, hash] = signatureParts
  if (algorithm !== "sha256") return false

  // Compute HMAC of the payload
  const computedHash = createHmac("sha256", secret).update(payload).digest("hex")

  // Use timing-safe comparison to prevent timing attacks
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash))
  } catch {
    return false
  }
}

// Webhook endpoint to trigger ISR revalidation
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET not configured" }, { status: 500 })
  }

  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-hub-signature-256")

    // Verify HMAC signature
    const isValid = await verifySignature(rawBody, signature, secret)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    console.log("[v0] Webhook received:", body)

    // Revalidate homepage and all post pages
    revalidatePath("/")
    revalidatePath("/post/[slug]", "page")
    revalidateTag("posts")

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Revalidation error:", error)
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 })
  }
}
