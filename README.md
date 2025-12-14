# Minimal MDX Blog

A hyper-minimal blog built with Next.js, MDX, and Incremental Static Regeneration (ISR).

## Features

- 📝 Write posts in MDX with React components
- ⚡ Incremental Static Regeneration for instant updates
- 🎨 Custom MDX components (Callout, ImageGrid, etc.)
- 🚀 Smart deployment (skip builds for content-only changes)
- 🪝 Webhook for triggering revalidation with HMAC verification

## Getting Started

### 1. Add Content

Create MDX files in the `content/` folder:

```mdx
---
title: "My Post Title"
date: "2025-01-15"
description: "A brief description"
---

# Your content here

Use any markdown or custom components!

<Callout type="info">
Custom components work too!
</Callout>
```

### 2. Environment Variables

Add to your Vercel project (or `.env.local` for local development):

```bash
REVALIDATE_SECRET=your-secure-random-string
```

### 3. Deploy to Vercel

The project is configured to:
- Skip full deploys when only content changes
- Use ISR to update content automatically
- Trigger revalidation via webhook with HMAC verification

### Webhook Setup (GitHub)

After deploying, configure a GitHub webhook:

1. Go to your repo → Settings → Webhooks → Add webhook
2. **Payload URL**: `https://your-domain.com/api/revalidate`
3. **Content type**: `application/json`
4. **Secret**: Use the same value as `REVALIDATE_SECRET`
5. **Events**: Select "Just the push event"
6. Save

The webhook will verify the HMAC signature (`X-Hub-Signature-256` header) before revalidating content.

## Custom Components

Add new components in `components/mdx-components.tsx`:

```typescript
export function MyComponent({ children }: { children: React.ReactNode }) {
  return <div className="custom-style">{children}</div>
}
```

Then use in MDX:

```mdx
<MyComponent>Content here</MyComponent>
```

## File Structure

```
├── app/
│   ├── page.tsx              # Homepage (post list)
│   ├── post/[slug]/page.tsx  # Individual post pages
│   └── api/revalidate/       # Webhook endpoint
├── components/
│   └── mdx-components.tsx    # Custom MDX components
├── content/                  # Your MDX blog posts
├── lib/
│   └── mdx.ts               # MDX utilities
└── vercel.json              # Deployment config
```

## ISR Behavior

- Pages regenerate every hour (`revalidate = 3600`)
- Webhook triggers immediate revalidation with HMAC verification
- Content-only changes don't trigger full deploys
