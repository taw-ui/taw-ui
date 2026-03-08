import type { ToolPart } from "@/components/taw/lib/types"

export const postCardOptions = [
  { key: "media", label: "media", defaultOn: true },
  { key: "metrics", label: "metrics", defaultOn: true },
  { key: "verified", label: "verified", defaultOn: true },
  { key: "confidence", label: "confidence", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

// ─── Example: X (Twitter) post ──────────────────────────────────────────────

export const xPostFixture: ToolPart = {
  toolCallId: "x-1",
  toolName: "getPost",
  input: { postId: "1893021847102938" },
  state: "output-available",
  output: {
    id: "twitter:1893021847102938",
    provider: "twitter",
    author: {
      name: "Guillermo Rauch",
      handle: "raaborern",
      avatar: "https://pbs.twimg.com/profile_images/1755951086809067520/hOkELmOJ_400x400.jpg",
      verified: true,
    },
    content: "We just shipped Next.js 15.5.\n\nHighlights:\n→ Turbopack is now stable for dev and builds\n→ 50% faster cold starts\n→ React 19 support out of the box\n→ New Middleware APIs\n\nThis is the fastest Next.js has ever been.",
    publishedAt: "2026-03-07T18:30:00Z",
    media: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/nextjs-15-5-banner.jpg",
        alt: "Next.js 15.5 release banner showing performance improvements",
        width: 1200,
        height: 675,
      },
    ],
    metrics: {
      likes: 14200,
      replies: 892,
      reposts: 3400,
      views: 1200000,
    },
    url: "https://x.com/raaborern/status/1893021847102938",
    source: { label: "X", url: "https://x.com/raaborern/status/1893021847102938" },
  },
}

// ─── Example: Instagram post ────────────────────────────────────────────────

export const instagramPostFixture: ToolPart = {
  toolCallId: "ig-1",
  toolName: "getPost",
  input: { postId: "CxYz1234567" },
  state: "output-available",
  output: {
    id: "instagram:CxYz1234567",
    provider: "instagram",
    author: {
      name: "National Geographic",
      handle: "natgeo",
      avatar: "https://instagram.com/natgeo/avatar.jpg",
      verified: true,
    },
    content: "A rare sighting of a snow leopard at 4,500 meters in the Himalayas. These elusive big cats are estimated at fewer than 7,000 in the wild. Conservation efforts are critical to their survival.\n\nPhotograph by @wildlifephotographer",
    publishedAt: "2026-03-06T14:00:00Z",
    media: [
      {
        type: "image",
        url: "https://instagram.com/p/CxYz1234567/media.jpg",
        alt: "Snow leopard on a rocky Himalayan cliff face",
        width: 1080,
        height: 1080,
      },
    ],
    metrics: {
      likes: 284000,
      replies: 1823,
    },
    url: "https://instagram.com/p/CxYz1234567",
    source: { label: "Instagram", url: "https://instagram.com/p/CxYz1234567" },
  },
}

// ─── LinkedIn post ──────────────────────────────────────────────────────────

export const linkedinPostFixture: ToolPart = {
  toolCallId: "li-1",
  toolName: "getPost",
  input: { postId: "urn:li:share:7012345678901234567" },
  state: "output-available",
  output: {
    id: "linkedin:7012345678901234567",
    provider: "linkedin",
    author: {
      name: "Satya Nadella",
      handle: "satyanadella",
      avatar: "https://media.licdn.com/satya-nadella.jpg",
      verified: true,
    },
    content: "Excited to share that Microsoft has reached a new milestone in AI infrastructure. Our Azure AI platform now serves over 60,000 organizations worldwide.\n\nThe key insight: the companies seeing the most impact are those treating AI as a platform shift, not just a feature addition.\n\nWhat trends are you seeing in your organization's AI adoption?",
    publishedAt: "2026-03-05T16:00:00Z",
    metrics: {
      likes: 45200,
      replies: 2100,
      reposts: 8900,
    },
    url: "https://linkedin.com/posts/satyanadella_ai-azure-7012345678901234567",
    source: { label: "LinkedIn", url: "https://linkedin.com/posts/satyanadella_ai-azure-7012345678901234567" },
  },
}

// ─── Text-only post (no media) ──────────────────────────────────────────────

export const textOnlyPostFixture: ToolPart = {
  toolCallId: "x-2",
  toolName: "getPost",
  input: { postId: "1893099182734" },
  state: "output-available",
  output: {
    id: "twitter:1893099182734",
    provider: "twitter",
    author: {
      name: "Dan Abramov",
      handle: "dan_abramov",
      verified: true,
    },
    content: "Hot take: the best abstractions are the ones you don't notice.\n\nIf your framework requires developers to think about the framework itself more than the problem they're solving, you've lost the plot.",
    publishedAt: "2026-03-08T09:15:00Z",
    metrics: {
      likes: 8900,
      replies: 423,
      reposts: 1200,
      views: 890000,
    },
    url: "https://x.com/dan_abramov/status/1893099182734",
    source: { label: "X", url: "https://x.com/dan_abramov/status/1893099182734" },
  },
}

// ─── Minimal post ───────────────────────────────────────────────────────────

export const minimalPostFixture: ToolPart = {
  toolCallId: "min-1",
  toolName: "getPost",
  input: { postId: "abc" },
  state: "output-available",
  output: {
    id: "mastodon:abc",
    provider: "mastodon",
    author: { name: "Anonymous" },
    content: "Just shipped a new feature! 🚀",
    publishedAt: "2026-03-08T12:00:00Z",
  },
}

// ─── Post with caveat / confidence ──────────────────────────────────────────

export const postWithCaveatFixture: ToolPart = {
  toolCallId: "cav-1",
  toolName: "getPost",
  input: { postId: "1893044812345" },
  state: "output-available",
  output: {
    id: "twitter:1893044812345",
    provider: "twitter",
    author: {
      name: "Tech News",
      handle: "technews",
    },
    content: "BREAKING: Major tech company reportedly planning to acquire AI startup for $2B+. Deal could close within weeks.\n\nSources say the acquisition would be the largest AI-focused deal this year.",
    publishedAt: "2026-03-07T22:00:00Z",
    metrics: {
      likes: 3200,
      replies: 890,
      reposts: 1500,
      views: 2400000,
    },
    url: "https://x.com/technews/status/1893044812345",
    confidence: 0.55,
    caveat: "This post references unconfirmed rumors — the acquisition has not been officially announced.",
    source: { label: "X", url: "https://x.com/technews/status/1893044812345" },
  },
}

// ─── All fixtures for ComponentPreview ───────────────────────────────────────

export const postCardFixtures: Record<string, ToolPart> = {
  ready: xPostFixture,
  instagram: instagramPostFixture,
  linkedin: linkedinPostFixture,
  "text-only": textOnlyPostFixture,
  minimal: minimalPostFixture,
  caveat: postWithCaveatFixture,
  loading: {
    toolCallId: "pc-load",
    toolName: "getPost",
    input: { postId: "loading" },
    state: "input-available",
  },
  error: {
    toolCallId: "pc-err",
    toolName: "getPost",
    input: { postId: "999" },
    state: "output-error",
    errorText: "Post not found or access denied",
  },
}

// ─── Raw provider examples (for adapter documentation) ──────────────────────

/**
 * Example raw X API v2 response shape.
 */
export const rawXPostExample = {
  id: "1893021847102938",
  text: "We just shipped Next.js 15.5.\n\nHighlights:\n→ Turbopack is now stable for dev and builds\n→ 50% faster cold starts\n→ React 19 support out of the box\n→ New Middleware APIs\n\nThis is the fastest Next.js has ever been.",
  created_at: "2026-03-07T18:30:00.000Z",
  author_id: "12345678",
  author: {
    id: "12345678",
    name: "Guillermo Rauch",
    username: "raaborern",
    profile_image_url: "https://pbs.twimg.com/profile_images/1755951086809067520/hOkELmOJ_400x400.jpg",
    verified: true,
  },
  public_metrics: {
    like_count: 14200,
    reply_count: 892,
    retweet_count: 2800,
    impression_count: 1200000,
    quote_count: 600,
  },
  attachments: {
    media: [
      {
        type: "photo",
        url: "https://pbs.twimg.com/media/nextjs-15-5-banner.jpg",
        alt_text: "Next.js 15.5 release banner showing performance improvements",
        width: 1200,
        height: 675,
      },
    ],
  },
  entities: {
    hashtags: [
      { tag: "nextjs" },
      { tag: "vercel" },
      { tag: "webdev" },
    ],
  },
}

/**
 * Example raw Instagram Graph API response shape.
 */
export const rawInstagramPostExample = {
  id: "CxYz1234567",
  caption: "A rare sighting of a snow leopard at 4,500 meters in the Himalayas. #snowleopard #wildlife #conservation #himalayas",
  timestamp: "2026-03-06T14:00:00+0000",
  permalink: "https://instagram.com/p/CxYz1234567",
  media_type: "IMAGE",
  media_url: "https://instagram.com/p/CxYz1234567/media.jpg",
  username: "natgeo",
  owner: {
    id: "987654321",
    username: "natgeo",
    name: "National Geographic",
    profile_picture_url: "https://instagram.com/natgeo/avatar.jpg",
  },
  like_count: 284000,
  comments_count: 1823,
}
