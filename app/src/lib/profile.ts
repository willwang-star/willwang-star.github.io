// Single source of truth for personal info shown across the portal.
// Update this file to change name, role, links, etc.

export const profile = {
  name: "Will Wang",
  role: "Designer",
  team: "Intuit",
  bio: "Building tools, prototypes, and AI-driven workflows. Below is a portal of what I'm working on, and ways to reach me.",

  // Contact channels — leave any blank to hide that action.
  // Slack DM: copy your Slack profile URL or "slack://user?team=T...&id=U..." deep link.
  contact: {
    slack: "", // e.g. "https://intuit.enterprise.slack.com/team/U12345"
    email: "will_wang@intuit.com",
    zoom: "", // e.g. "https://intuit.zoom.us/my/willwang"
    calendar: "", // e.g. Calendly / Google booking link
    github: "https://github.com/willwang-star",
  },

  // Profile photo — drop a square image into app/public/avatar.jpg
  // and set this to "avatar.jpg". Leave blank to use initials fallback.
  avatarFile: "",
} as const

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")
}
