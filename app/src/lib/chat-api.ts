// Bridge between the /chat UI and the Worker backend.
// When VITE_CHAT_API_URL is unset (today's state), we return a local mock reply
// so the UI remains functional with no deploy. When set, we POST to the Worker.

export type ChatMessage = { role: "user" | "assistant"; content: string }

const apiUrl = import.meta.env.VITE_CHAT_API_URL as string | undefined

export const isChatBackendConfigured = Boolean(apiUrl)

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  if (!apiUrl) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    return [
      "Hey — I'm the AI version of Will, but the backend isn't connected yet.",
      lastUser
        ? `You said: "${lastUser.content.slice(0, 200)}". Once the backend is wired, I'll respond in Will's voice using his digital twin spec.`
        : "Once the backend is wired, I'll respond in Will's voice using his digital twin spec.",
    ].join("\n\n")
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`chat backend ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as { reply?: string; error?: string }
  if (data.error) throw new Error(data.error)
  return data.reply ?? ""
}
