// Single source of truth for personal info shown across the portal.
// Update this file to change name, role, links, etc.

export const profile = {
  name: "Will Wang",
  role: "Principal Product Designer",
  team: "",
  bio: "Building tools, prototypes, and AI-driven workflows. Below is a portal of what I'm working on, and ways to reach me.",

  // Contact channels — leave any blank to hide that action.
  contact: {
    // Slack DM CTA on the home title row. Two ways to wire this up:
    //  1. Workspace web URL — paste your "View profile" share link from Slack.
    //     Looks like: https://<workspace>.slack.com/team/U01ABC23DEF
    //     Works for everyone (opens Slack in browser → app handoff).
    //  2. Just a member ID — set slackUserId to e.g. "U01ABC23DEF" and
    //     slackTeamDomain to e.g. "intuit-corp" and the site will build the URL.
    // Leave empty to hide the button.
    slack: "https://intuit.enterprise.slack.com/team/U0ATX5LV6UE",
    slackUserId: "", // e.g. "U01ABC23DEF"
    slackTeamDomain: "", // e.g. "intuit-corp" (the bit before .slack.com)
    email: "will_wang@intuit.com",
    zoom: "",
    calendar: "",
    github: "https://github.com/willwang-star",
  },

  // Profile photo — file is in app/public/. Leave blank to fall back to initials.
  avatarFile: "will-profile.png",
} as const

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")
}
