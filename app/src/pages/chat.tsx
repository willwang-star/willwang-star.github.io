import { useEffect, useRef, useState } from "react"
import { ConstructionIcon, SendIcon, SparklesIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { initials, profile } from "@/lib/profile"
import {
  isChatBackendConfigured,
  sendChat,
  type ChatMessage,
} from "@/lib/chat-api"

const baseUrl = import.meta.env.BASE_URL

type DisplayMessage = { from: "you" | "twin"; text: string }

const seedFor = (backendReady: boolean): DisplayMessage[] => [
  {
    from: "twin",
    text: backendReady
      ? `Hey — I'm the AI version of ${profile.name}. Ask me about projects, design decisions, or how I'd approach a problem.`
      : `Hey — I'm the AI version of ${profile.name}. The real model isn't wired up yet, so I'll reply with placeholders for now. Ask me anything — I'll respond for real once Will connects the backend.`,
  },
]

function toApiMessages(msgs: DisplayMessage[]): ChatMessage[] {
  return msgs.map((m) => ({
    role: m.from === "you" ? "user" : "assistant",
    content: m.text,
  }))
}

export function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>(() =>
    seedFor(isChatBackendConfigured),
  )
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const avatarSrc = profile.avatarFile ? `${baseUrl}${profile.avatarFile}` : ""

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, sending])

  async function send() {
    const text = draft.trim()
    if (!text || sending) return
    const next: DisplayMessage[] = [...messages, { from: "you", text }]
    setMessages(next)
    setDraft("")
    setSending(true)
    try {
      const reply = await sendChat(toApiMessages(next))
      setMessages((m) => [...m, { from: "twin", text: reply }])
    } catch (err) {
      const detail = err instanceof Error ? err.message : "unknown error"
      setMessages((m) => [
        ...m,
        {
          from: "twin",
          text: `Something broke between the chat and the backend: ${detail}`,
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-12rem)] max-w-2xl flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={profile.name} />}
            <AvatarFallback>{initials(profile.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{profile.name}</h1>
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <SparklesIcon className="size-3" />
                AI twin
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Chat with the AI version of me.
            </p>
          </div>
        </div>
      </header>

      <Card className="flex-1 overflow-hidden">
        <CardContent
          ref={scrollRef}
          className="flex h-full flex-col gap-3 overflow-y-auto p-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.from === "you"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2 text-sm whitespace-pre-wrap text-primary-foreground"
                  : "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-secondary px-4 py-2 text-sm whitespace-pre-wrap text-secondary-foreground"
              }
            >
              {msg.text}
            </div>
          ))}
          {sending && (
            <div className="mr-auto flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
              <span
                className="size-1.5 animate-pulse rounded-full bg-muted-foreground"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="size-1.5 animate-pulse rounded-full bg-muted-foreground"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {!isChatBackendConfigured && (
        <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-card/50 px-3 py-2 text-xs text-muted-foreground">
          <ConstructionIcon className="size-3.5" />
          Backend not connected yet — replies are placeholders.
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Ask ${profile.name.split(" ")[0]} anything...`}
          aria-label="Message"
          disabled={sending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim() || sending}
        >
          <SendIcon className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
