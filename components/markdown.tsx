import { MdxComponents, Callout, ImageGrid } from "@/components/mdx-components"

export async function Markdown({ source }: { source: string }) {
  const { MDXRemote } = await import("next-mdx-remote-client/rsc")

  return (
    <div className="prose max-w-none">
      <MDXRemote source={source} components={{ ...MdxComponents, Callout, ImageGrid }} />
    </div>
  )
}
