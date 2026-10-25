# Anya Jajodia — portfolio (private preview)

Next.js 16 (App Router) + TypeScript, static output. The design and content handoff lives in `handoff/` (unchanged).

```bash
npm install
npm run dev     # http://localhost:3100
npm run check   # typecheck + lint + build
npm run start   # production preview on :3100
node qa/check.mjs   # browser QA suite (server must be running)
```

- Edit copy, dates, metrics, and links in `src/content/site.ts` and `src/content/work.ts`.
- The scroll-linked line: `src/lib/line-geometry.ts`, `src/lib/home-route.ts` (route + scroll schedule), `src/components/HomeScribble.tsx`, `src/components/DetailLine.tsx`.
- Homepage sections: `RigDrawing.tsx` (AMNH plate), `WorkPanels.tsx` (Selected work), `MoreBento.tsx` (More plates; Experiments is an empty reserved plate), `DotField.tsx` (hero/Contact dot field). Avatars: poses + anchors + per-page assignments in `src/content/avatars.ts`, rendered by `Avatar.tsx` and cued by `AvatarStage.tsx`; derived AVIF images in `public/assets/avatar/` come from `node scripts/build-avatars.mjs` (originals stay in `handoff/assets/avatar/`). Line route: `src/lib/home-route.ts`; line visibility audit: `node qa/visible.mjs <WxH>`. Runtime logos live in `public/logos/` (originals in `handoff/assets/`).
- Before publishing, see `EDITING_CHECKLIST.md`. QA evidence is in `QA.md` and `REVIEW.md`.
