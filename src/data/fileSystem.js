// ============================================================
// fileSystem.js — Single source of truth for all portfolio data
// ============================================================
// To add a new talent/folder: push a new object into the `desktop` array.
// To add files to a folder: push into that folder's `files` array.
// The folder icon updates automatically based on files.length.
// Body text supports simple markdown: **bold**, # headings, [links](url),
// and line breaks are preserved.
//
// FILE TYPES — the type is worked out from `youtube`/`src`/the name:
//
//   Text (opens in the reader):
//     { id: "notes", name: "Notes.txt", title: "My notes", body: `# Hello...` }
//
//   Image (opens in the Image Viewer; ←/→ or swipe pages through every
//   image in the same folder). Put the file in /public/media/:
//     { id: "look-1", name: "Look 1.jpg", src: "/media/ss26/look-1.jpg",
//       caption: "Optional caption", alt: "Optional description" }
//
//   Video — YouTube (preferred, keeps the site fast):
//     { id: "recital", name: "Recital", youtube: "https://youtu.be/VIDEO_ID",
//       caption: "Optional caption" }
//
//   Video — small local file (keep it a few MB, .mp4 or .webm):
//     { id: "clip", name: "Clip.mp4", src: "/media/clip.mp4",
//       poster: "/media/clip-poster.jpg" }
//
//   Optional on images/videos: `thumbnail` to use a smaller icon image.
//
// MEDIA INSIDE A WRITE-UP — put this on its own line in `body`:
//     ![Caption](/media/ss26/look-1.jpg)        → image
//     ![Caption](https://youtu.be/VIDEO_ID)    → YouTube player
//     ![Caption](/media/clip.mp4)              → video player
// ============================================================

export const desktop = [
  {
    id: "worldwideadhd",
    name: "worldwideadhd",
    files: [
      {
        id: "campaign-ss26",
        name: "SS26 Campaign.txt",
        title: "worldwideadhd — SS26 Campaign",
        body: `# SS26 Campaign

The SS26 campaign is worldwideadhd's most ambitious drop to date — a collection built around the theme of **sensory overload** in the digital age.

## Concept

We live in an era of infinite tabs, infinite scrolls, infinite noise. SS26 takes that chaos and prints it. Every piece in this collection is a visual representation of a mind that refuses to slow down — bold type clashing with muted palettes, oversized silhouettes layered over skin-tight bases.

## Lookbook

Shot on location in Lagos and London. The lookbook juxtaposes brutalist architecture with organic movement — models caught mid-stride, mid-thought, mid-everything. No posed shots. No studio lights. Just reality with the contrast turned up.

## Key Pieces

- **"Buffer" Oversized Tee** — Front graphic: a loading bar stuck at 99%. Back: "patience is a myth."
- **Distressed Cargo Pants** — Hand-bleached panels with embroidered neural pathway motifs running down each leg.
- **"Hyperfocus" Hoodie** — Heavyweight 450gsm French terry. Single word across the chest in 6pt font — you have to lean in to read it.
- **Signal Cap** — Structured 5-panel with static noise pattern sublimation.

## Impact

- Sold out first run in 72 hours
- Featured in **Pause Magazine** and **Highsnobiety**
- Pop-up installations in Shoreditch (London) and Lekki (Lagos)

[PLACEHOLDER — replace campaign metrics and press links with real data]`,
      },
      {
        id: "brand-story",
        name: "Brand Story.txt",
        title: "The worldwideadhd Story",
        body: `# The worldwideadhd Story

## Origin

worldwideadhd started as a joke — a phrase scribbled on a sticky note during a lecture I wasn't paying attention to. It became a brand because the name resonated with everyone who heard it. Not as a diagnosis, but as a vibe. The way your brain opens 47 thoughts at once. The way creativity doesn't come in straight lines.

## What We Make

Streetwear, but with a philosophy. Every collection tells a story about attention — how we give it, where we lose it, what happens when we find it. The clothes are designed to be conversation starters. You wear worldwideadhd and someone asks about it. That's the point.

## Design Philosophy

- **Authenticity over trends** — We don't chase what's hot. We make what's honest.
- **Community over competition** — Every drop includes pieces co-designed with members of the community.
- **Expression over conformity** — If it makes you uncomfortable, it's probably working.

## Milestones

- **2023**: First drop — 50 tees, hand-printed in a garage. Sold out via Instagram DMs.
- **2024**: Launched full e-commerce. Three collections. First pop-up.
- **2025**: Collaboration with [PLACEHOLDER — brand name]. Featured at Lagos Fashion Week fringe events.
- **2026**: SS26 campaign — biggest collection yet.

## What's Next

Expanding into accessories, exploring sustainable fabrics, and building out the community platform. worldwideadhd isn't just clothes — it's a network of people who think too fast and feel too much.

[PLACEHOLDER — update with real milestones and future plans]`,
      },
    ],
  },
  {
    id: "bug-bounty",
    name: "Bug Bounty",
    files: [
      {
        id: "google-xss",
        name: "Google — XSS Report.txt",
        title: "Bug Bounty — Google XSS",
        body: `# Google — Reflected XSS in Subdomain

## Summary

Discovered a reflected cross-site scripting (XSS) vulnerability in a Google subdomain that allowed arbitrary JavaScript execution in the context of an authenticated user's session.

## Technical Breakdown

- **Type:** Reflected XSS
- **Severity:** Medium (CVSS 6.1)
- **Attack Vector:** Crafted URL with malicious payload in query parameter
- **Root Cause:** User-supplied input in URL parameter was reflected into the page HTML without proper sanitization or output encoding

The vulnerable endpoint accepted a \`callback\` parameter intended for JSONP responses, but failed to validate the value against a whitelist. By injecting a script payload, the response would execute arbitrary JavaScript in the user's browser.

## Proof of Concept

The payload was injected via a URL parameter that was rendered unescaped into a \`<script>\` context. The PoC demonstrated session cookie exfiltration to an attacker-controlled server.

## Disclosure Timeline

| Date | Event |
|------|-------|
| [DATE] | Vulnerability discovered during recon |
| [DATE] | Report submitted via Google VRP |
| [DATE +2d] | Google acknowledges receipt |
| [DATE +14d] | Engineering team confirms the bug |
| [DATE +30d] | Fix deployed to production |
| [DATE +45d] | Bounty awarded |

## Impact

An attacker could have leveraged this vulnerability to:
- Steal session tokens and hijack accounts
- Perform actions on behalf of authenticated users
- Redirect users to credential-harvesting pages
- Exfiltrate sensitive data visible in the authenticated session

## Key Takeaways

- Always check JSONP endpoints — they're a goldmine for reflected XSS
- Subdomain enumeration pays off: the main domain was locked down, but edge services had gaps
- Google's VRP team is responsive and professional — report clearly and they reward fairly

[PLACEHOLDER — replace dates and specific details with real data]`,
      },
    ],
  },
  {
    id: "piano",
    name: "Piano",
    files: [
      // Empty folder — demonstrates the emptyfolder.png icon state
      // Add performances, compositions, and recordings here:
      //
      // Example:
      // {
      //   id: "nocturne-cover",
      //   name: "Chopin Nocturne Cover.txt",
      //   title: "Piano — Chopin Nocturne Op.9 No.2",
      //   body: "A late-night recording of my arrangement of Chopin's Nocturne..."
      // }
    ],
  },
  {
    id: "contact",
    name: "Contact",
    files: [
      {
        id: "email",
        name: "Email.txt",
        title: "Get In Touch",
        body: `# Get In Touch

The best way to reach me is by email. I'm open to freelance work, collaborations, speaking opportunities, and interesting conversations.

📧 **Email:** hello@kolade.dev

I typically respond within 24-48 hours. If it's urgent, mention it in the subject line.

## What I'm Open To

- **Security consulting** — Penetration testing, vulnerability assessments, security audits
- **Brand collaborations** — If you're building something with soul, let's talk
- **Music** — Session work, live performances, composition commissions
- **Speaking** — Conferences, podcasts, workshops on security or creative entrepreneurship

[PLACEHOLDER — replace email and availability with real info]`,
      },
      {
        id: "socials",
        name: "Social Links.txt",
        title: "Social Media",
        body: `# Social Media

Find me across the internet:

- **GitHub:** [github.com/kolade](https://github.com/kolade) — Open source projects, tools, and experiments
- **LinkedIn:** [linkedin.com/in/kolade](https://linkedin.com/in/kolade) — Professional network and career history
- **Twitter / X:** [@kolade](https://twitter.com/kolade) — Thoughts on security, tech, and creative work
- **Instagram:** [@worldwideadhd](https://instagram.com/worldwideadhd) — Brand updates, lookbooks, and behind-the-scenes

## PGP Key

For encrypted communication, my public PGP key is available on my GitHub profile.

[PLACEHOLDER — replace with real social media links]`,
      },
      {
        id: "resume",
        name: "Resume.txt",
        title: "Resume & Background",
        body: `# Resume & Background

## Who I Am

A multidisciplinary creative and security researcher. I break things to understand them, then build things to express what I've learned.

## Skills

**Security & Hacking**
- Web application penetration testing
- Bug bounty hunting (Google, HackerOne, Bugcrowd)
- OWASP Top 10, Burp Suite, custom tooling
- Responsible disclosure and vulnerability research

**Development**
- React, Next.js, Node.js, Python
- Full-stack web development
- API design and integration

**Creative**
- Brand strategy and creative direction (worldwideadhd)
- Classical and contemporary piano performance
- Photography and visual storytelling

## Education

[PLACEHOLDER — add university, degree, and year]

## Certifications

[PLACEHOLDER — add relevant security certifications like OSCP, CEH, etc.]

## Experience

[PLACEHOLDER — add work experience, internships, notable projects]`,
      },
    ],
  },
  {
    id: "other-talents",
    name: "Other Talents",
    files: [
      {
        id: "photography",
        name: "Photography.txt",
        title: "Photography",
        body: `# Photography

## The Lens

I shoot what catches my eye — which, given how my brain works, is everything. Street photography is my primary focus: candid moments, urban geometry, the interplay of light and shadow in cities that never sit still.

## Style

High contrast, slightly desaturated. I want photos that feel like memories — not perfect, but vivid. Leaning into grain and imperfection rather than pixel-perfect clarity.

## Equipment

- Fujifilm X-T4 (primary body)
- 23mm f/1.4 (street)
- 56mm f/1.2 (portraits)
- iPhone 15 Pro (the best camera is the one you have)

## Published Work

[PLACEHOLDER — add notable shots, exhibitions, publications, or Instagram highlights]

## Prints

Selected prints are available on request. Reach out via the Contact folder.`,
      },
    ],
  },
];

// Owner info used in the top panel, boot screen, and terminal
export const owner = {
  name: "Kolade",
  username: "kolade",
  hostname: "portfolio",
  bio: "Security researcher, pianist, creative director, and builder of worldwideadhd.",
  email: "hello@kolade.dev",
};
