# Crackd.ai

## Can a model learn to be funny?

Building three applications for generating, managing, and experimenting with campus-specific AI humor.

Role: Full-stack development · Conversational AI experimentation · UI and admin tooling
Period: September 2025–May 2026
Context: Coursework with Professor Lydia Chilton and Michael Roger

## What is Crackd?

Crackd.ai generates image-based captions for the communities at Columbia, Barnard, and Stanford. Its humor styles, called “flavors,” combine images with campus terminology, current events, and voices inspired by fictional characters and public figures.

The wider platform draws on regularly updated data, including campus activity and Sidechat discussions. That context helps it generate references its audience can recognize.

My involvement developed in two phases: contributing to the shared platform within a larger team, then independently implementing three deployed applications against an existing live database.

## September–December 2025 · Contributing within a team

I worked across the UI design, admin, and prompt-engineering pods.

I implemented interface changes based on the design team’s work, developed admin features for inspecting platform activity and statistics, and experimented with new humor flavors through the chaining matrix.

We organized work in Linear and collaborated through GitHub branches and pull requests. I coordinated changes with other contributors, reviewed feedback, and resolved merge conflicts within an actively developed codebase.

## January–May 2026 · Building complete applications

In the following semester, I built my own implementations of the user application, admin application, and LLM chaining matrix while a separate team continued developing the main platform.

I implemented each application end to end, including interfaces, authentication and access controls, application logic, integration with the existing database and services, and deployment. These are functioning applications connected to live data.

### User application

An application for uploading images, generating captions, browsing existing submissions, and voting on image-caption pairs.

I built the user journeys around generation and feedback, including upload handling, progress states, caption viewing, voting rounds, personal caption collections, and highlights.

View walkthrough

[Code on GitHub](https://github.com/AnyaJajodia/caption_voting_user_interface)

<!-- USER APPLICATION WALKTHROUGH
Use public/assets/crackd/user-app/.
Render "View walkthrough" above as a button opening the application tour.
Do not leave it as inert text.
-->

### Admin application

An interface for inspecting and managing the records and configuration behind the platform.

I built searchable, filterable views for captions, images, profiles, and humor configuration, alongside permissions management and analytical views. Administrators could examine individual records, inspect prompt-step details, and explore patterns in caption feedback.

View walkthrough

[Code on GitHub](https://github.com/AnyaJajodia/crackd-spring2026-admin-panel)

<!-- ADMIN APPLICATION WALKTHROUGH
Use public/assets/crackd/admin-app/.
Render "View walkthrough" above as a button opening the application tour.
-->

### LLM chaining matrix

A development environment for building and testing multi-step humor-generation workflows.

I implemented flavor browsing, ordered prompt-chain configuration, model and input/output settings, test-set selection, run progress, and caption review. Outputs from earlier steps could be referenced by later prompts, allowing generation to be broken into distinct operations.

View walkthrough

[Code on GitHub](https://github.com/AnyaJajodia/llm_chaining_matrix)

<!-- MATRIX WALKTHROUGH
Use public/assets/crackd/matrix/.
Render "View walkthrough" above as a button opening the application tour.
-->

## Inside the chaining matrix

A flavor is more than a single instruction to “be funny.” A chain can separate image interpretation, contextual information, and caption writing, with intermediate outputs informing later steps.

Building the matrix meant making those workflows configurable and inspectable. Using it for prompt experiments meant considering which examples, instructions, and processing stages helped produce a particular voice or style.

The application walkthrough shows chain configuration and batch testing. A detailed experiment comparison will be added once its prompts, outputs, and observations have been selected.

## What I took from it

Working across all three applications changed how I thought about an AI product. The generation matters, but so do the interfaces for using it, the tools for maintaining its data, and the environment for investigating why an output changed.

Humor adds another complication: technically correct is a fairly low bar for a joke.

## Tools and workflow

Supabase · Live database integration · LLM chaining · Prompt engineering · GitHub · Linear · AI-assisted development

Coursework with Professor Lydia Chilton and Michael Roger.

<!-- INTERNAL IMPLEMENTATION NOTES — DO NOT RENDER

CONTENT AND OWNERSHIP
September–December 2025:
Contributions to the shared platform through UI design, admin, and
prompt-engineering pods.

January–May 2026:
Anya independently implemented all three applications against an existing
database and services, including application security, interfaces, logic,
integration, and deployment.

Do not imply Anya created the existing database, every database record,
all humor flavors, or the wider platform's scraping infrastructure.
Do not treat displayed database totals as personal output metrics.

Do not restore earlier 40% / 35% improvement claims, TensorFlow integration,
or self-critique claims without confirmation.
Do not invent security mechanisms or describe the applications as audited.

WALKTHROUGH ASSETS
Root: public/assets/crackd/
Suggested titles and subtitles: public/assets/crackd/walkthroughs.json

User application:
user-app/01-home.png
user-app/02-voting.png
user-app/03-upload.png
user-app/04-generation-progress.png
user-app/05-caption-results.png
user-app/06-highlights.png

Admin application:
admin-app/01-caption-inspection.png
admin-app/02-image-details.png
admin-app/03-opener-statistics.png
admin-app/04-caption-popularity.png
admin-app/05-flavor-step-details.png

Matrix:
matrix/01-flavor-library.png
matrix/02-prompt-chain.png
matrix/03-test-set.png
matrix/04-run-progress.png
matrix/05-caption-gallery.png

MAIN-PAGE PRESENTATION
Do not display application screenshots or screenshot thumbnails on the main
Crackd page. Keep the three application sections visually cohesive with
the portfolio, using typography, numbering, restrained accents, and clear actions.
Do not invent miniature application interfaces.

Keep one primary "View walkthrough" button and a secondary repository link
beside each application.
Remove the old repetitive "Explore the applications" table.

WALKTHROUGH BEHAVIOR
Each button opens one large accessible dialog containing:
- Application name.
- Step title and concise explanatory subtitle.
- The actual screenshot.
- Previous/Next controls.
- Step count and optional named-step navigation.
- An option to enlarge the screenshot within the same dialog.

Support Escape, focus trapping, focus return, keyboard navigation,
mobile layouts, and reduced motion.
Do not autoplay or open nested dialogs.
Preserve image proportions and original interface colors in both themes.
Keep screenshot text inspectable rather than cropping away relevant controls.

SEQUENCE ACCURACY
Present the tours as selected application features where continuity is unverified.
The user results image is not verified as the outcome of the pictured upload.
The matrix gallery shows a different image from the preceding test-set selection.
Do not imply these are continuous recorded runs.
Do not invent missing steps, outputs, or performance measurements.

ASSET CLEANUP
The supplied pack contains unchanged screenshots.
Some include capture thumbnails, account details, and private-marked records.
Prepare suitable public versions before rendering them.
Remove capture thumbnails through safe cropping or clean recapture.
Obscure account information and private record content where needed.
If cleanup would obscure the feature being explained, flag the asset for replacement.
Do not fabricate replacement records inside documentary screenshots.

ACCESS AND LINKS
User-supplied deployed addresses:
https://crackdspring2026.vercel.app
https://crackd-admin-panel.vercel.app
https://crackdmatrix.vercel.app

Verify availability before rendering live-app links.
The user application restricts signup to Columbia, Barnard, and Stanford emails.
Confirm each other application's access requirements separately.
Walkthroughs are the primary way portfolio visitors can inspect the applications.
Do not weaken access controls, supply credentials, or invent guest access.
Do not show dead links or nonfunctional buttons.

MATRIX EXPERIMENT
The final visible paragraph about adding an experiment is editorial staging copy.
Omit that paragraph from the rendered page until the experiment is ready.
Do not render an empty placeholder in its place.

A later experiment should identify:
- The goal.
- Inputs and actual chain stages.
- What Anya changed or compared.
- Representative outputs.
- How the results were assessed.
- Whether the work belongs to the 2025 or 2026 phase.

Distinguish building the matrix application from authoring a particular flavor.
Do not attribute every displayed prompt or configuration to Anya.

ARCHITECTURE
A relationship diagram is deferred until actual data flows are confirmed.
Do not infer direct app-to-app calls, automatic configuration propagation,
or database relationships from screenshots alone.

TOOLS AND CREDITS
Supabase and the listed workflow tools are established.
Confirm exact languages, frameworks, hosting configuration, and model integrations
before expanding the stack.
Model names visible in current database configurations do not independently
establish which providers Anya integrated during the coursework period.

Use the supplied instructor credit.
Do not add unconfirmed affiliations or repeat the two-phase timeline in credits.
Screenshots show current application/database state; their capture dates do not
change the established coursework dates.

SHARED DESIGN
Retain Crackd's warm light mode, strong dark mode, and restrained yellow/black accents.
Preserve shared navigation, work drawer, typography, and thread motif.
Update on-page navigation to match the revised headings.
Avoid repeating application descriptions in additional tables or decorative lists.

END INTERNAL NOTES -->