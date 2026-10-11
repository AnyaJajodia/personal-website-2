# Implementation and milestones
Suggested stack: Next.js App Router, TypeScript, Tailwind or scoped CSS, Motion only if useful. Choose a current supported stable release and document versions. No backend, authentication, CMS or database needed. No MCP servers required; shadcn optional only if a specific control needs it.
Data-driven detail pages and shared templates; central editable data holds copy, dates, metrics, URLs and asset paths. Never embed facts only inside images.
1. Read package, summarize constraints and open items; create project and content model.
2. Implement shared visual system, header/footer, homepage sections and every detail route.
3. Populate all supplied content, restore metrics, use real logo; intentional missing-image placeholders.
4. Implement scribble and hero/sticky behavior after the static design works.
5. Test desktop/mobile, direct routes, browser Back, keyboard navigation, reduced motion, loading/error states; fix defects.
6. Deliver private preview, source repo/commit, setup instructions, screenshots and editing checklist. User reviews before publishing.
Keep credentials out of repo. Network access for dependencies/fonts may need environment configuration; use local assets and resilient font fallbacks. Do not require proprietary animation services.
