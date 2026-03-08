import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

/**
 * Post author — minimal identity for display.
 * No auth-related fields; taw-ui doesn't handle identity.
 */
const PostAuthorSchema = z.object({
  /** Display name */
  name: z.string(),
  /** Username / handle (e.g. "@elonmusk") */
  handle: z.string().optional(),
  /** Avatar image URL */
  avatarUrl: z.string().url().optional(),
  /** Profile URL */
  url: z.string().url().optional(),
  /** Whether the author is verified */
  isVerified: z.boolean().optional(),
})

/**
 * Post media attachment — images, videos, or other visual content.
 */
const PostMediaSchema = z.object({
  /** Media type */
  type: z.enum(["image", "video"]),
  /** Media URL */
  url: z.string().url(),
  /** Alt text for accessibility */
  alt: z.string().optional(),
  /** Intrinsic width in pixels */
  width: z.number().int().positive().optional(),
  /** Intrinsic height in pixels */
  height: z.number().int().positive().optional(),
})

/**
 * Post engagement metrics — provider-agnostic.
 * All fields optional so the card degrades gracefully.
 */
const PostMetricsSchema = z.object({
  /** Like / favorite count */
  likes: z.number().int().min(0).optional(),
  /** Comment / reply count */
  comments: z.number().int().min(0).optional(),
  /** Repost / share / retweet count */
  reposts: z.number().int().min(0).optional(),
  /** View / impression count */
  views: z.number().int().min(0).optional(),
})

/**
 * Canonical post surface schema.
 *
 * Represents a social or content post from any provider
 * (X, Instagram, LinkedIn, Threads, etc.) in a normalized shape.
 *
 * Design principles:
 * - Provider-aware, not provider-dependent
 * - All display-only — no mutation, no auth
 * - Optional fields degrade gracefully in the UI
 */
export const PostCardSchema = z.object({
  /** Stable identifier (e.g. "x:1234567890", "instagram:CxYz...") */
  id: z.string(),

  /** Source provider */
  provider: z.enum(["x", "instagram", "linkedin", "threads", "other"]),

  /** Post author */
  author: PostAuthorSchema,

  /** Post text / caption / body */
  body: z.string(),

  /** When the post was published (ISO 8601) */
  postedAt: z.string(),

  /** Media attachments */
  media: z.array(PostMediaSchema).optional(),

  /** Engagement metrics */
  metrics: PostMetricsSchema.optional(),

  /** URL back to the post in the provider */
  url: z.string().url().optional(),

  /** Post status */
  status: z.enum(["published", "draft", "deleted"]).optional(),

  /** Hashtags or topic tags */
  tags: z.array(z.string()).optional(),

  /** AI confidence in this data (0–1) */
  confidence: ConfidenceSchema,

  /** Human-readable uncertainty note */
  caveat: CaveatSchema,

  /** Data provenance */
  source: SourceSchema,
})

export const PostCard = defineTawContract("PostCard", PostCardSchema)

export type PostCardData = typeof PostCard.type
export type PostAuthorData = z.infer<typeof PostAuthorSchema>
export type PostMediaData = z.infer<typeof PostMediaSchema>
export type PostMetricsData = z.infer<typeof PostMetricsSchema>
