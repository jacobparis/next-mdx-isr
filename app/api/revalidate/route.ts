import { revalidateTag } from "next/cache"
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

function getSlugFromPath(path: string): string | null {
  const match = path.match(/^content\/(.+)\.mdx$/)
  return match ? match[1] : null
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

    const ref = body.ref
    if (ref !== "refs/heads/main") {
      console.log("[v0] Ignoring push to branch:", ref)
      return NextResponse.json({
        revalidated: false,
        message: "Only main branch pushes trigger revalidation",
        branch: ref,
      })
    }

    const tagsToRevalidate = new Set<string>()
    let shouldRevalidateIndex = false

    for (const commit of body.commits || []) {
      const allFiles = [...(commit.added || []), ...(commit.removed || []), ...(commit.modified || [])]

      for (const file of allFiles) {
        const slug = getSlugFromPath(file)
        if (!slug) continue

        if ((commit.added || []).includes(file) || (commit.removed || []).includes(file)) {
          shouldRevalidateIndex = true
        }

        if ((commit.added || []).includes(file) || (commit.modified || []).includes(file)) {
          tagsToRevalidate.add(`post-${slug}`)
        }
      }
    }

    if (shouldRevalidateIndex) {
      console.log("[v0] Revalidating index with tag: posts-index")
      revalidateTag("posts-index", "max")
    }

    for (const tag of tagsToRevalidate) {
      console.log("[v0] Revalidating post with tag:", tag)
      revalidateTag(tag, "max")
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      tags: {
        index: shouldRevalidateIndex,
        posts: Array.from(tagsToRevalidate),
      },
    })
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 })
  }
}
