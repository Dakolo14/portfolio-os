// ============================================================
// fileSystem.js — Single source of truth for all portfolio data
// ============================================================
// To add a new talent/folder: push a new object into the `desktop` array.
// To add files to a folder: push into that folder's `files` array.
// The folder icon updates automatically based on files.length.
// Body text supports simple markdown: **bold**, # headings, [links](url),
// and line breaks are preserved.
// ============================================================

export const desktop = [
  {
    id: "worldwideadhd",
    name: "worldwideadhd",
    files: [
      {
        id: "campaign-ss26",
        name: "SS26 Campaign.txt",
        title: "SS26 Campaign",
        body: `# SS26 Campaign

SS26 is the biggest thing worldwideadhd has put out so far. The whole collection is about sensory overload, that feeling of having way too many tabs open in your head.

## The idea

Everything online is endless now. Endless tabs, endless scrolling, endless noise. With SS26 I wanted to put that feeling on clothes. Loud type on quiet colours, big oversized pieces over fitted ones. Basically what my head feels like most days.

## Lookbook

We shot it in Lagos and London, out on the street around a lot of brutalist buildings. No studio and no lights. Nobody was posing either. We just caught people walking and moving around.

## Key pieces

- **"Buffer" Oversized Tee.** A loading bar stuck at 99% on the front, and "patience is a myth" on the back.
- **Distressed Cargo Pants.** Hand bleached panels, with neural pathways embroidered down each leg.
- **"Hyperfocus" Hoodie.** Heavy 450gsm French terry. The word is printed across the chest in 6pt type, so you have to lean in to read it.
- **Signal Cap.** A structured 5 panel cap with a static noise print.

## How it went

- The first run sold out in 72 hours
- We got featured in **Pause Magazine** and **Highsnobiety**
- We did pop-ups in Shoreditch, London and Lekki, Lagos`,
      },
      {
        id: "brand-story",
        name: "Brand Story.txt",
        title: "The worldwideadhd Story",
        body: `# The worldwideadhd Story

## How it started

worldwideadhd started as a joke. I wrote the name on a sticky note in a lecture I wasn't listening to. People kept asking me about it, so I turned it into a brand. It's not about a diagnosis. It's about how your brain opens 47 thoughts at once, and how good ideas never really come in a straight line.

## What we make

Streetwear. Every collection is about attention in some way: where it goes, how we lose it, and what happens when we finally lock in. I want people to stop you and ask about what you're wearing. When that happens, the piece has done its job.

## What we care about

- **Being honest.** We don't chase trends. We make what feels true to us.
- **The community.** Every drop has pieces designed with people from the community.
- **Standing out.** If a piece makes you a little uncomfortable, it's probably working.

## So far

- **2023:** Our first drop. 50 tees, printed by hand in a garage and sold through Instagram DMs. They all went.
- **2024:** Opened the online store, released three collections and did our first pop-up.
- **2025:** Our first brand collab, and we showed at fringe events during Lagos Fashion Week.
- **2026:** SS26, our biggest collection yet.

## What's next

Accessories, more sustainable fabrics, and a proper home online for the community. At this point worldwideadhd is as much about the people as the clothes. People who think too fast and feel too much.`,
      },
    ],
  },
  {
    id: "bug-bounty",
    name: "Bug Bounty",
    files: [
      {
        id: "google-xss",
        name: "Google XSS Report.txt",
        title: "Google XSS Report",
        body: `# Reflected XSS on a Google subdomain

## Summary

I found a reflected XSS bug on one of Google's subdomains. It let me run JavaScript inside a logged in user's session.

## The details

- **Type:** Reflected XSS
- **Severity:** Medium (CVSS 6.1)
- **How it's triggered:** A crafted URL with the payload in a query parameter
- **Root cause:** Input from the URL went straight into the page HTML without being sanitized or encoded

The endpoint took a \`callback\` parameter meant for JSONP responses, but it never checked the value against an allowlist. So I could inject a script and the response would run it in the victim's browser.

## Proof of concept

The payload went in through a URL parameter that ended up unescaped inside a \`<script>\` block. In my PoC I showed the session cookie being sent off to a server I controlled.

## Disclosure

I reported it through the Google VRP. They got back to me within two days, confirmed the bug about two weeks in, had a fix live after a month, and paid the bounty around day 45.

## Why it mattered

Someone could have used this to:
- Steal session tokens and take over accounts
- Do things as the logged in user
- Send people to fake login pages
- Pull out anything visible in their session

## What I took from it

- Always check JSONP endpoints. They're one of the best places to find reflected XSS.
- Enumerating subdomains was worth it. The main domain was locked down, but the smaller services weren't.
- Google's VRP team was quick and easy to work with. Write a clear report and they'll pay fairly.`,
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
        title: "Get in touch",
        body: `# Get in touch

Email is the best way to reach me. I'm open to freelance work, collabs, speaking, or just a good conversation.

📧 **Email:** hello@kolade.dev

I usually reply within a day or two. If it's urgent, say so in the subject line.

## Things I'm up for

- **Security work:** pen testing, vulnerability assessments and security audits
- **Brand collabs:** if you're building something with soul, let's talk
- **Music:** session work, live shows and commissioned pieces
- **Speaking:** conferences, podcasts and workshops on security or running a creative business`,
      },
      {
        id: "socials",
        name: "Social Links.txt",
        title: "Socials",
        body: `# Socials

Here's where else you can find me:

- **GitHub:** [github.com/kolade](https://github.com/kolade) for projects, tools and experiments
- **LinkedIn:** [linkedin.com/in/kolade](https://linkedin.com/in/kolade) for my work history
- **X:** [@kolade](https://twitter.com/kolade) where I talk about security, tech and creative stuff
- **Instagram:** [@worldwideadhd](https://instagram.com/worldwideadhd) for drops, lookbooks and behind the scenes

## PGP

If you want to send me something encrypted, my public PGP key is on my GitHub.`,
      },
      {
        id: "resume",
        name: "Resume.txt",
        title: "Resume",
        body: `# Resume

## About me

I do a lot of different things, but mostly I'm a security researcher and a creative. I like breaking things to see how they work, then making things with what I learn.

## Skills

**Security**
- Web app penetration testing
- Bug bounties (Google, HackerOne, Bugcrowd)
- OWASP Top 10, Burp Suite and my own tools
- Responsible disclosure and vulnerability research

**Development**
- React, Next.js, Node.js and Python
- Full stack web development
- API design and integrations

**Creative**
- Brand strategy and creative direction for worldwideadhd
- Classical and contemporary piano
- Photography`,
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

## What I shoot

Mostly street photography. I shoot whatever catches my eye, and with how my brain works, that's a lot. Candid moments, shapes in buildings, and the way light and shadow move around a busy city.

## Style

High contrast and a bit desaturated. I want my photos to feel like memories. They don't need to be perfect, just vivid, so I'm happy to leave the grain in.

## Gear

- Fujifilm X-T4 (main body)
- 23mm f/1.4 for street
- 56mm f/1.2 for portraits
- iPhone 15 Pro, because the best camera is the one you have on you

## Prints

Some prints are available if you ask. Reach out through the Contact folder.`,
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
