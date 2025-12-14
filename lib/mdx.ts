import matter from "gray-matter"
import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const owner = process.env.GITHUB_REPO_OWNER!
const repo = process.env.GITHUB_REPO_NAME!
const contentPath = "content"

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
  })

  if ("content" in data && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8")
  }

  throw new Error(`Failed to fetch content for ${path}`)
}

export async function getAllPosts(): Promise<PostMetadata[]> {
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
