// Dev Portal Chat Worker
// ----------------------
// One backend for the /chat page on the Dev Portal site. Three providers:
//
//   LLM_PROVIDER=mock        → returns a placeholder reply (default until access lands)
//   LLM_PROVIDER=anthropic   → direct Anthropic API call (needs ANTHROPIC_API_KEY)
//   LLM_PROVIDER=genos       → Intuit GenOS / Bedrock gateway (needs GENOS_ENDPOINT + GENOS_AUTH_TOKEN)
//
// The system prompt is fetched from the public digital-twin.md repo and cached per worker isolate.

interface Env {
  ALLOWED_ORIGIN: string
  TWIN_URL: string
  LLM_PROVIDER: "mock" | "anthropic" | "genos"
  MODEL: string
  ANTHROPIC_API_KEY?: string
  GENOS_ENDPOINT?: string
  GENOS_AUTH_TOKEN?: string
}

type ChatMessage = { role: "user" | "assistant"; content: string }

let cachedSystemPrompt: { text: string; fetchedAt: number } | null = null
const SYSTEM_PROMPT_TTL_MS = 60 * 60 * 1000 // 1 hour

async function getSystemPrompt(env: Env): Promise<string> {
  const now = Date.now()
  if (
    cachedSystemPrompt &&
    now - cachedSystemPrompt.fetchedAt < SYSTEM_PROMPT_TTL_MS
  ) {
    return cachedSystemPrompt.text
  }
  const res = await fetch(env.TWIN_URL, { cf: { cacheTtl: 3600 } })
  if (!res.ok) {
    throw new Error(`twin fetch failed: ${res.status}`)
  }
  const text = await res.text()
  cachedSystemPrompt = { text, fetchedAt: now }
  return text
}

function corsHeaders(origin: string): HeadersInit {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  }
}

function jsonResponse(body: unknown, init: ResponseInit, origin: string) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...corsHeaders(origin),
      ...(init.headers ?? {}),
    },
  })
}

async function callMock(messages: ChatMessage[]): Promise<string> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")
  return [
    "Hey — I'm the AI version of Will, but the real model isn't wired up yet.",
    lastUser
      ? `You said: "${lastUser.content.slice(0, 200)}". Once the backend is connected, I'll respond in Will's voice using his digital twin spec.`
      : "Once the backend is connected, I'll respond in Will's voice using his digital twin spec.",
  ].join("\n\n")
}

async function callAnthropic(
  messages: ChatMessage[],
  systemPrompt: string,
  env: Env,
): Promise<string> {
  if (!env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set")
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`anthropic ${res.status}: ${text}`)
  }
  const data = (await res.json()) as {
    content: Array<{ type: string; text?: string }>
  }
  return data.content
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("")
}

async function callGenos(
  messages: ChatMessage[],
  systemPrompt: string,
  env: Env,
): Promise<string> {
  // PLACEHOLDER — concrete shape depends on what GenOS / GenStudio docs specify.
  // When access is granted, fill in the real headers and body below.
  // See Research/genos-backlog.md for the un-park checklist.
  if (!env.GENOS_ENDPOINT || !env.GENOS_AUTH_TOKEN) {
    throw new Error("GENOS_ENDPOINT or GENOS_AUTH_TOKEN not set")
  }
  const res = await fetch(env.GENOS_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.GENOS_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      model: env.MODEL,
      system: systemPrompt,
      messages,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`genos ${res.status}: ${text}`)
  }
  const data = (await res.json()) as { content?: string; output?: string }
  return data.content ?? data.output ?? ""
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method === "GET" && new URL(request.url).pathname === "/") {
      return jsonResponse(
        {
          status: "ok",
          provider: env.LLM_PROVIDER,
          model: env.MODEL,
          message:
            env.LLM_PROVIDER === "mock"
              ? "Mock provider — wire up GENOS or ANTHROPIC to make it real."
              : "Live.",
        },
        { status: 200 },
        origin,
      )
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { error: "method not allowed" },
        { status: 405 },
        origin,
      )
    }

    let body: { messages?: ChatMessage[] }
    try {
      body = (await request.json()) as { messages?: ChatMessage[] }
    } catch {
      return jsonResponse(
        { error: "invalid json" },
        { status: 400 },
        origin,
      )
    }

    const messages = body.messages ?? []
    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse(
        { error: "messages required" },
        { status: 400 },
        origin,
      )
    }

    try {
      let reply: string
      if (env.LLM_PROVIDER === "mock") {
        reply = await callMock(messages)
      } else {
        const systemPrompt = await getSystemPrompt(env)
        if (env.LLM_PROVIDER === "anthropic") {
          reply = await callAnthropic(messages, systemPrompt, env)
        } else if (env.LLM_PROVIDER === "genos") {
          reply = await callGenos(messages, systemPrompt, env)
        } else {
          reply = await callMock(messages)
        }
      }
      return jsonResponse({ reply }, { status: 200 }, origin)
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error"
      return jsonResponse(
        { error: "upstream", detail: message },
        { status: 502 },
        origin,
      )
    }
  },
} satisfies ExportedHandler<Env>
