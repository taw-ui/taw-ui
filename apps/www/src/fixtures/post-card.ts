import type { TawToolPart } from "taw-ui"

export const postCardOptions = [
  { key: "media", label: "media", defaultOn: true },
  { key: "metrics", label: "metrics", defaultOn: true },
  { key: "tags", label: "tags", defaultOn: true },
  { key: "verified", label: "verified", defaultOn: true },
  { key: "confidence", label: "confidence", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

// ─── Example: X post (as returned by fromXPost) ─────────────────────────────

export const xPostFixture: TawToolPart = {
  id: "x-1",
  toolName: "getPost",
  input: { postId: "1893021847102938" },
  state: "output-available",
  output: {
    id: "x:1893021847102938",
    provider: "x",
    author: {
      name: "Guillermo Rauch",
      handle: "@raaborern",
      avatarUrl: "https://pbs.twimg.com/profile_images/1755951086809067520/hOkELmOJ_400x400.jpg",
      url: "https://x.com/raaborern",
      isVerified: true,
    },
    body: "We just shipped Next.js 15.5.\n\nHighlights:\n→ Turbopack is now stable for dev and builds\n→ 50% faster cold starts\n→ React 19 support out of the box\n→ New Middleware APIs\n\nThis is the fastest Next.js has ever been.",
    postedAt: "2026-03-07T18:30:00Z",
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
      comments: 892,
      reposts: 3400,
      views: 1200000,
    },
    url: "https://x.com/raaborern/status/1893021847102938",
    tags: ["nextjs", "vercel", "webdev"],
    source: { label: "X", url: "https://x.com/raaborern/status/1893021847102938" },
  },
}

// ─── Example: Instagram post (as returned by fromInstagramPost) ──────────────

export const instagramPostFixture: TawToolPart = {
  id: "ig-1",
  toolName: "getPost",
  input: { postId: "CxYz1234567" },
  state: "output-available",
  output: {
    id: "instagram:CxYz1234567",
    provider: "instagram",
    author: {
      name: "National Geographic",
      handle: "@natgeo",
      avatarUrl: "https://instagram.com/natgeo/avatar.jpg",
      url: "https://instagram.com/natgeo",
      isVerified: true,
    },
    body: "A rare sighting of a snow leopard at 4,500 meters in the Himalayas. These elusive big cats are estimated at fewer than 7,000 in the wild. Conservation efforts are critical to their survival.\n\nPhotograph by @wildlifephotographer",
    postedAt: "2026-03-06T14:00:00Z",
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
      comments: 1823,
    },
    url: "https://instagram.com/p/CxYz1234567",
    tags: ["snowleopard", "wildlife", "conservation", "himalayas"],
    source: { label: "Instagram", url: "https://instagram.com/p/CxYz1234567" },
  },
}

// ─── LinkedIn post ──────────────────────────────────────────────────────────

export const linkedinPostFixture: TawToolPart = {
  id: "li-1",
  toolName: "getPost",
  input: { postId: "urn:li:share:7012345678901234567" },
  state: "output-available",
  output: {
    id: "linkedin:7012345678901234567",
    provider: "linkedin",
    author: {
      name: "Satya Nadella",
      handle: "@satyanadella",
      avatarUrl: "https://media.licdn.com/satya-nadella.jpg",
      url: "https://linkedin.com/in/satyanadella",
      isVerified: true,
    },
    body: "Excited to share that Microsoft has reached a new milestone in AI infrastructure. Our Azure AI platform now serves over 60,000 organizations worldwide.\n\nThe key insight: the companies seeing the most impact are those treating AI as a platform shift, not just a feature addition.\n\nWhat trends are you seeing in your organization's AI adoption?",
    postedAt: "2026-03-05T16:00:00Z",
    metrics: {
      likes: 45200,
      comments: 2100,
      reposts: 8900,
    },
    url: "https://linkedin.com/posts/satyanadella_ai-azure-7012345678901234567",
    tags: ["AI", "Azure", "Leadership"],
    source: { label: "LinkedIn", url: "https://linkedin.com/posts/satyanadella_ai-azure-7012345678901234567" },
  },
}

// ─── Text-only post (no media) ──────────────────────────────────────────────

export const textOnlyPostFixture: TawToolPart = {
  id: "x-2",
  toolName: "getPost",
  input: { postId: "1893099182734" },
  state: "output-available",
  output: {
    id: "x:1893099182734",
    provider: "x",
    author: {
      name: "Dan Abramov",
      handle: "@dan_abramov",
      url: "https://x.com/dan_abramov",
      isVerified: true,
    },
    body: "Hot take: the best abstractions are the ones you don't notice.\n\nIf your framework requires developers to think about the framework itself more than the problem they're solving, you've lost the plot.",
    postedAt: "2026-03-08T09:15:00Z",
    metrics: {
      likes: 8900,
      comments: 423,
      reposts: 1200,
      views: 890000,
    },
    url: "https://x.com/dan_abramov/status/1893099182734",
    source: { label: "X", url: "https://x.com/dan_abramov/status/1893099182734" },
  },
}

// ─── Minimal post ───────────────────────────────────────────────────────────

export const minimalPostFixture: TawToolPart = {
  id: "min-1",
  toolName: "getPost",
  input: { postId: "abc" },
  state: "output-available",
  output: {
    id: "other:abc",
    provider: "other",
    author: { name: "Anonymous" },
    body: "Just shipped a new feature! 🚀",
    postedAt: "2026-03-08T12:00:00Z",
  },
}

// ─── Post with caveat / confidence ──────────────────────────────────────────

export const postWithCaveatFixture: TawToolPart = {
  id: "cav-1",
  toolName: "getPost",
  input: { postId: "1893044812345" },
  state: "output-available",
  output: {
    id: "x:1893044812345",
    provider: "x",
    author: {
      name: "Tech News",
      handle: "@technews",
      url: "https://x.com/technews",
    },
    body: "BREAKING: Major tech company reportedly planning to acquire AI startup for $2B+. Deal could close within weeks.\n\nSources say the acquisition would be the largest AI-focused deal this year.",
    postedAt: "2026-03-07T22:00:00Z",
    metrics: {
      likes: 3200,
      comments: 890,
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

export const postCardFixtures: Record<string, TawToolPart> = {
  ready: xPostFixture,
  instagram: instagramPostFixture,
  linkedin: linkedinPostFixture,
  "text-only": textOnlyPostFixture,
  minimal: minimalPostFixture,
  caveat: postWithCaveatFixture,
  loading: {
    id: "pc-load",
    toolName: "getPost",
    input: { postId: "loading" },
    state: "input-available",
  },
  error: {
    id: "pc-err",
    toolName: "getPost",
    input: { postId: "999" },
    state: "output-error",
    error: "Post not found or access denied",
  },
}

// ─── Raw provider examples (for adapter documentation) ──────────────────────

/**
 * Example raw X API v2 response shape.
 * Pass this to `fromXPost()` to get canonical PostCardData.
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
 * Pass this to `fromInstagramPost()` to get canonical PostCardData.
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
