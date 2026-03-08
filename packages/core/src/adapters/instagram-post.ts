import type { PostCardData } from "../schemas/post-card"

// ─── Instagram Graph API types (subset) ─────────────────────────────────────
// These are intentionally loose — we don't import any Instagram SDK
// so there's no SDK lock-in. Any object with these fields works.

export interface InstagramPost {
  id: string
  caption?: string | null
  timestamp?: string // ISO 8601
  permalink?: string
  media_type?: string // "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url?: string
  thumbnail_url?: string | null // For videos
  username?: string
  owner?: {
    id?: string
    username?: string
    name?: string
    profile_picture_url?: string
  } | null
  like_count?: number
  comments_count?: number
  children?: {
    data?: Array<{
      id: string
      media_type?: string
      media_url?: string
      timestamp?: string
    }>
  } | null
}

/**
 * Transform an Instagram Graph API post object into canonical PostCard data.
 *
 * This is a pure transformation — no API calls, no auth, no side effects.
 * Your app fetches the post; taw-ui normalizes and renders it.
 *
 * @example
 * ```ts
 * // Your app fetches the data
 * const post = await ig.get(`/${postId}`, {
 *   fields: "id,caption,timestamp,permalink,media_type,media_url,username,like_count,comments_count",
 * })
 *
 * // taw-ui normalizes it
 * const postData = fromInstagramPost(post)
 *
 * // taw-ui renders it
 * <PostCard part={{ id: "1", toolName: "getPost", state: "output-available", input: {}, output: postData }} />
 * ```
 */
export function fromInstagramPost(post: InstagramPost): PostCardData {
  const handle = post.owner?.username ?? post.username

  return {
    id: `instagram:${post.id}`,
    provider: "instagram",
    author: {
      name: post.owner?.name ?? handle ?? "Unknown",
      handle: handle ? `@${handle}` : undefined,
      avatarUrl: post.owner?.profile_picture_url,
      url: handle ? `https://instagram.com/${handle}` : undefined,
    },
    body: post.caption ?? "",
    postedAt: post.timestamp ?? "",
    media: buildInstagramMedia(post),
    metrics: (post.like_count != null || post.comments_count != null)
      ? {
          likes: post.like_count,
          comments: post.comments_count,
        }
      : undefined,
    url: post.permalink,
    tags: extractHashtags(post.caption),
    source: {
      label: "Instagram",
      url: post.permalink,
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildInstagramMedia(post: InstagramPost): PostCardData["media"] {
  // Carousel: use children
  if (post.media_type === "CAROUSEL_ALBUM" && post.children?.data?.length) {
    return post.children.data
      .filter((child) => child.media_url)
      .map((child) => ({
        type: child.media_type === "VIDEO" ? "video" as const : "image" as const,
        url: child.media_url!,
      }))
  }

  // Single media
  if (post.media_url) {
    return [{
      type: post.media_type === "VIDEO" ? "video" as const : "image" as const,
      url: post.media_type === "VIDEO" && post.thumbnail_url ? post.thumbnail_url : post.media_url,
    }]
  }

  return undefined
}

function extractHashtags(caption?: string | null): string[] | undefined {
  if (!caption) return undefined
  const matches = caption.match(/#(\w+)/g)
  if (!matches || matches.length === 0) return undefined
  return matches.map((m) => m.slice(1))
}
