import matter from "gray-matter"
import { Octokit } from "@octokit/rest"
import { cacheTag } from "next/cache"

if (!process.env.GITHUB_REPO_OWNER) {
  throw new Error("GITHUB_REPO_OWNER environment variable is required")
}

if (!process.env.GITHUB_REPO_NAME) {
  throw new Error("GITHUB_REPO_NAME environment variable is required")
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const owner = process.env.GITHUB_REPO_OWNER
const repo = process.env.GITHUB_REPO_NAME
const contentPath = "content"
const branch = "main"

export interface PostMetadata {
  title: string
  date: string
  description: string
  slug: string
}

export interface Post extends PostMetadata {
  content: string
}

async function getContentFiles(): Promise<Array<{ name: string; path: string }>> {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: contentPath,
    ref: branch,
  })

  if (!Array.isArray(data)) {
    return []
  }

  return data
    .filter((file) => file.type === "file" && file.name.endsWith(".mdx"))
    .map((file) => ({ name: file.name, path: file.path }))
}

async function getFileContent(path: string): Promise<string> {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  })

  if ("content" in data && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8")
  }

  throw new Error(`Failed to fetch content for ${path}`)
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  cacheTag("posts-index")

  const files = await getContentFiles()

  const posts = await Promise.all(
    files.map(async (file) => {
      const fileContent = await getFileContent(file.path)
      const { data } = matter(fileContent)

      return {
        title: data.title,
        date: data.date,
        description: data.description,
        slug: file.name.replace(".mdx", ""),
      } as PostMetadata
    }),
  )

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  cacheTag(`post-${slug}`)

  try {
    const filePath = `${contentPath}/${slug}.mdx`
    const fileContent = await getFileContent(filePath)
    const { data, content } = matter(fileContent)

    return {
      title: data.title,
      date: data.date,
      description: data.description,
      slug,
      content,
    }
  } catch {
    return null
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await getContentFiles()
  return files.map((file) => file.name.replace(".mdx", ""))
}

export async function getNextPost(currentSlug: string): Promise<PostMetadata | null> {
  const posts = await getAllPosts()
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

  if (currentIndex === -1 || currentIndex === posts.length - 1) {
    return null
  }

  return posts[currentIndex + 1]
}
