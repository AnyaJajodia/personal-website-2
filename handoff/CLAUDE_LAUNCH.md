# Claude Code launch — macOS
## Setup
Create/clone your portfolio repository. Extract this ZIP and put its folder at `handoff/` in the repository. Copy `handoff/CLAUDE.md` to repository root if no CLAUDE.md exists; otherwise merge its instructions without overwriting existing rules.
Update Claude Code with `claude update`. Sign in using `/login` with your Claude Max account. Keep Chrome and terminal open and Mac awake. In `/model`, verify latest Opus available to your plan. Fable may require separate usage credits; do not assume Max includes it.
Launch inside repo: `claude --model opus --effort high --permission-mode auto --chrome`
Finish initial workspace trust / Chrome setup prompts. Run `/chrome` and verify the extension is connected. Use `/mcp` to check existing Motion or other tools; extra MCPs are not prerequisites.
If auto mode is unavailable, use `/permissions` to permit the actual project build/test commands and localhost browser work. Do not assume a prompt can override permission controls.
## One goal prompt
Paste the full line below into the Claude Code prompt. `/goal` starts work immediately and evaluates completion across turns.

/goal Build a polished first version of Anya Jajodia’s portfolio from every instruction and asset in handoff/START_HERE.md and the handoff folder. Read the design, copy, routes, motion specification and open items before implementing. Work autonomously through implementation, browser inspection, critique, fixes and rechecking. Completion requires: homepage and all 11 detail routes implemented; Lynxster, AMNH and shared detail layouts match the approved visual direction; one scroll-linked scribble becomes the About career trajectory and continues afterward; all supplied copy/metrics present with editable 2027 end-date placeholders; intentional missing-asset placeholders and no fabricated claims; production build and available type/lint checks pass; actual browser screenshots captured and viewed at desktop and mobile sizes; anchor navigation, detail links, reverse scrolling, browser Back and reduced motion checked; material visual/functional defects found during review fixed and affected checks rerun; QA.md, REVIEW.md, PROGRESS.md and EDITING_CHECKLIST.md written with results and remaining limitations. Keep development within this repository. Do not publish or push. Make routine decisions yourself. Missing photos, dates, URLs or résumé do not block the preview. If browser access fails use available local browser testing; never claim unperformed verification. Stop when these conditions are met, or after 90 minutes or 25 evaluated turns, reporting honest progress and blockers rather than claiming completion. Surface check results in the conversation so the goal evaluator can assess them. Begin implementation, not only a plan.

## Resume / stop
`/goal` shows status. `/goal clear` clears the goal. Ctrl+C interrupts work. `claude --continue` resumes the latest session; check goal status and resend if it was cleared. Rate limits, authentication, unavailable tools or models can interrupt the run. The goal’s time/turn clause is model-evaluated, not a hard process timer.
## Existing MCPs
Motion/shadcn may help but are optional. Leave relevant tools connected; avoid adding unrelated integrations. Browser inspection is the essential capability.
## Sources checked 11 October 2026
https://code.claude.com/docs/en/goal
https://code.claude.com/docs/en/model-config
https://code.claude.com/docs/en/permissions
https://code.claude.com/docs/en/chrome
https://code.claude.com/docs/en/cli-reference
