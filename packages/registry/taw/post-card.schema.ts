import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./lib/types"

const PostProviderSchema = z.enum([
  "twitter",
  "mastodon",
  "bluesky",
  "linkedin",
  "reddit",
  "threads",
  "facebook",
  "instagram",
])

const PostMediaSchema = z.object({
  type: z.enum(["image", "video", "gif"]),
  url: z.string(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  thumbnail: z.string().optional(),
})

const PostAuthorSchema = z.object({
  name: z.string(),
  handle: z.string().optional(),
  avatar: z.string().optional(),
  verified: z.boolean().optional(),
})

const PostMetricsSchema = z.object({
  likes: z.number().optional(),
  reposts: z.number().optional(),
  replies: z.number().optional(),
  views: z.number().optional(),
  bookmarks: z.number().optional(),
})

const PostLinkPreviewSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  domain: z.string().optional(),
})

export const postCardSchema = z.object({
  id: z.string(),
  provider: PostProviderSchema,
  author: PostAuthorSchema,
  content: z.string(),
  media: z.array(PostMediaSchema).max(4).optional(),
  metrics: PostMetricsSchema.optional(),
  linkPreview: PostLinkPreviewSchema.optional(),
  publishedAt: z.string().optional(),
  url: z.string().optional(),
  isRepost: z.boolean().optional(),
  repostAuthor: PostAuthorSchema.optional(),
  isReply: z.boolean().optional(),
  parentAuthor: z.string().optional(),
  reasoning: z.string().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type PostCardData = z.infer<typeof postCardSchema>
export type PostProvider = z.infer<typeof PostProviderSchema>
export type PostMedia = z.infer<typeof PostMediaSchema>
export type PostAuthor = z.infer<typeof PostAuthorSchema>
export type PostMetrics = z.infer<typeof PostMetricsSchema>
export type PostLinkPreview = z.infer<typeof PostLinkPreviewSchema>
