import type { PostCardData } from "../schemas/post-card"

// ─── X API v2 types (subset) ────────────────────────────────────────────────
// These are intentionally loose — we don't import any X/Twitter SDK
// so there's no SDK lock-in. Any object with these fields works.

export interface XPost {
  id: string
  text: string
  created_at?: string // ISO 8601
  author_id?: string
  author?: {
    id?: string
    name?: string
    username?: string
    profile_image_url?: string
    verified?: boolean
    url?: string
  } | null
  public_metrics?: {
    like_count?: number
    reply_count?: number
    retweet_count?: number
    impression_count?: number
    quote_count?: number
  } | null
  attachments?: {
    media?: Array<{
      type?: string // "photo" | "video" | "animated_gif"
      url?: string
      preview_image_url?: string
      alt_text?: string
      width?: number
      height?: number
    }>
  } | null
  entities?: {
    hashtags?: Array<{
      tag: string
    }>
    urls?: Array<{
      expanded_url?: string
    }>
  } | null
}

/**
 * Transform an X API v2 post object into canonical PostCard data.
 *
 * This is a pure transformation — no API calls, no auth, no side effects.
 * Your app fetches the post; taw-ui normalizes and renders it.
 *
 * Uses `fromXPost` (not `fromTweet`) to match X's current branding.
 *
 * @example
 * ```ts
 * // Your app fetches the data
 * const { data } = await xClient.tweets.findTweetById("1234567890", {
 *   expansions: ["author_id", "attachments.media_keys"],
 *   "tweet.fields": ["created_at", "public_metrics"],
 *   "user.fields": ["name", "username", "profile_image_url", "verified"],
 * })
 *
 * // taw-ui normalizes it
 * const postData = fromXPost(data)
 *
 * // taw-ui renders it
 * <PostCard part={{ id: "1", toolName: "getPost", state: "output-available", input: {}, output: postData }} />
 * ```
 */
export function fromXPost(post: XPost): PostCardData {
  const author = post.author
  const handle = author?.username

  return {
    id: `x:${post.id}`,
    provider: "x",
    author: {
      name: author?.name ?? handle ?? "Unknown",
      handle: handle ? `@${handle}` : undefined,
      avatarUrl: author?.profile_image_url,
      url: handle ? `https://x.com/${handle}` : author?.url,
      isVerified: author?.verified,
    },
    body: post.text,
    postedAt: post.created_at ?? "",
    media: post.attachments?.media
      ?.filter((m) => m.url || m.preview_image_url)
      .map((m) => ({
        type: m.type === "video" || m.type === "animated_gif" ? "video" as const : "image" as const,
        url: m.url ?? m.preview_image_url!,
        alt: m.alt_text,
        width: m.width,
        height: m.height,
      })),
    metrics: post.public_metrics
      ? {
          likes: post.public_metrics.like_count,
          comments: post.public_metrics.reply_count,
          reposts: (post.public_metrics.retweet_count ?? 0) + (post.public_metrics.quote_count ?? 0) || undefined,
          views: post.public_metrics.impression_count,
        }
      : undefined,
    url: handle ? `https://x.com/${handle}/status/${post.id}` : undefined,
    tags: post.entities?.hashtags?.map((h) => h.tag),
    source: {
      label: "X",
      url: handle ? `https://x.com/${handle}/status/${post.id}` : undefined,
    },
  }
}
