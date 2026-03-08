import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

const PostAuthorSchema = z.object({
  name: z.string(),
  handle: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  url: z.string().url().optional(),
  isVerified: z.boolean().optional(),
})

const PostMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

const PostMetricsSchema = z.object({
  likes: z.number().int().min(0).optional(),
  comments: z.number().int().min(0).optional(),
  reposts: z.number().int().min(0).optional(),
  views: z.number().int().min(0).optional(),
})

export const PostCardSchema = z.object({
  id: z.string(),
  provider: z.enum(["x", "instagram", "linkedin", "threads", "other"]),
  author: PostAuthorSchema,
  body: z.string(),
  postedAt: z.string(),
  media: z.array(PostMediaSchema).optional(),
  metrics: PostMetricsSchema.optional(),
  url: z.string().url().optional(),
  status: z.enum(["published", "draft", "deleted"]).optional(),
  tags: z.array(z.string()).optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type PostCardData = z.infer<typeof PostCardSchema>
export type PostAuthorData = z.infer<typeof PostAuthorSchema>
export type PostMediaData = z.infer<typeof PostMediaSchema>
export type PostMetricsData = z.infer<typeof PostMetricsSchema>

export function parsePostCard(data: unknown): ParseResult<PostCardData> {
  return tawParse(PostCardSchema, data, "PostCard")
}
