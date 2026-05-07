import { useState } from "react"
import { ConstructionIcon, SendIcon, SparklesIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { initials, profile } from "@/lib/profile"

const baseUrl = import.meta.env.BASE_URL

type Message = { from: "you" | "twin"; text: string }

const seed: Message[] = [
  {
    from: "twin",
    text: `Hey — I'm the AI version of ${profile.name}. Ask me about projects, design decisions, or how I'd approach a problem. (Heads up: I'm not connected to a real model yet — this is a UI preview.)`,
  },
]

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(seed)
  const [draft, setDraft] = useState("")
  const avatarSrc = profile.avatarFile ? `${baseUrl}${profile.avatarFile}` : ""

  function send() {
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [
      ...m,
      { from: "you", text },
      {
        from: "twin",
        text: "Thanks — I haven't been wired up to a real model yet. Once Will plugs in the API, I'll respond here for real.",
      },
    ])
    setDraft("")
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
        <CardContent className="flex h-full flex-col gap-3 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.from === "you"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                  : "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-secondary px-4 py-2 text-sm text-secondary-foreground"
              }
            >
              {msg.text}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-card/50 px-3 py-2 text-xs text-muted-foreground">
        <ConstructionIcon className="size-3.5" />
        Backend not connected yet — replies are placeholders.
      </div>

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
        />
        <Button type="submit" size="icon" disabled={!draft.trim()}>
          <SendIcon className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
