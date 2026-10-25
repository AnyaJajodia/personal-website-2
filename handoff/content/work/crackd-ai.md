# Crackd.ai

## Can a model learn to be funny?

Three applications, a prompt experimentation platform, and the surprisingly complicated business of campus humor.

Role: Software development · UI implementation · Admin tooling · Prompt engineering
Period: September 2025–May 2026
Context: Two semesters of coursework with Professor Lydia Chilton and Michael Roger

## What is Crackd?

A joke needs context. Campus humor needs quite a lot of it.

Crackd.ai generates image-based humor grounded in the communities at Columbia, Barnard, and Stanford. It combines images with campus terminology, conversations, and current events to produce captions in different humor styles, called “flavors.”

Behind the captions are extensive data archives and regularly updated pipelines. Daily updates draw on campus activity and Sidechat communities, helping the platform work with references that are current and recognizable to its audience.

Flavors explore different approaches to humor, including voices inspired by fictional characters and public figures. The challenge goes beyond generating a plausible sentence: the output needs to fit the image, understand the reference, and actually land.

My work on Crackd developed in two phases: contributing to the existing platform within a larger team, then building my own implementations of its three applications.

## September–December 2025
### Contributing to the platform

I worked across the admin, prompt engineering, and UI design pods, contributing to existing applications while learning how the different parts of the platform fit together.

### Interfaces people could use

I implemented UI changes based on the design team’s work and helped improve the main application. This meant translating designs into working interfaces and making changes within an established codebase.

### Tools behind the scenes

On the admin application, I worked on features for reviewing platform statistics and analyzing data, helping make the system’s activity easier to inspect.

### Finding new flavors

Within the prompt engineering pod, I developed new humor flavors and ran experiments in the chaining matrix. The work involved trying different instructions, examples, and context to understand how they affected the generated humor.

### Working within a larger team

We used Linear to organize work and GitHub to collaborate on the code. I worked through branches, pull requests, and merge conflicts while coordinating changes with other contributors.

The experience taught me how to make a useful contribution to a system that other people were actively building, too.

## January–May 2026
### Building three connected applications

The course format changed in the following semester. Rather than contributing through pods, I built my own versions of the user application, admin application, and LLM chaining matrix from scratch. A separate team continued developing the main platform.

That expanded my responsibility from individual features to the applications around them: user-facing interfaces, administrative tools, database integration, and the workflows used to develop and test humor.

### The user application

https://github.com/AnyaJajodia/caption_voting_user_interface
crackdspring2026.vercel.app

The audience-facing part of the system: an application for interacting with Crackd’s AI-generated humor.

I built my own implementation of the user-facing experience, connecting the interface to the data and generation workflows behind it.

### The admin application

https://github.com/AnyaJajodia/crackd-spring2026-admin-panel
crackd-admin-panel.vercel.app

The tools needed to manage and understand the platform.

My implementation included interfaces for inspecting database records, managing permissions, and reviewing statistics. Building it meant thinking about the people maintaining the system as well as the people using the main application.

### The LLM chaining matrix

https://github.com/AnyaJajodia/llm_chaining_matrix
crackdmatrix.vercel.app

The development environment for experimenting with how humor gets generated.

I built an application for working with multi-step LLM workflows, where outputs from one step could become inputs to another. It provided a place to develop flavors, experiment with prompts, and investigate how context and intermediate processing shaped the final result.

Together, the three applications gave me experience building both the visible product and the tools needed to support and improve it.

## Inside the chaining matrix
### A caption has a workflow behind it

The matrix was where I could look beyond a single prompt and experiment with the process around it.

Campus context, examples, instructions, and intermediate model outputs could all influence the result. Chaining made it possible to break generation into stages and investigate what each stage contributed.

The questions were practical: What context does the model need? Which examples help? What should happen in a separate step? And how do you tell whether a change made the humor better?

This work combined software development with prompt-engineering research. I was building the environment for experimentation while also using it to explore new flavors and approaches.

## What I took from it

The model’s response is only one part of the product. The data it receives, the workflow around it, and the tools used to inspect its behavior all shape what people eventually see.

Working across the user application, admin tools, and matrix made those connections tangible. A useful product needs more than a good generation: it needs interfaces people can use, data people can manage, and a way to keep improving the system.

Humor adds another complication: technically correct is a fairly low bar for a joke.

## Explore the applications

| Application | What it does |
| --- | --- |
| User application | The audience-facing experience for interacting with AI-generated humor. |
| Admin application | Tools for inspecting data, managing permissions, and reviewing platform statistics. |
| LLM chaining matrix | An environment for developing humor flavors and experimenting with multi-step generation workflows. |

## Tools and workflow

- Application development: Full-stack development across three applications.
- Data and infrastructure: Supabase and integration with live databases.
- Models and experimentation: LLM chaining, prompt engineering, and humor-flavor experiments.
- Collaboration: GitHub, pull requests, and Linear.
- Development workflow: AI-assisted development using skills and MCP integrations.

## Credits

Coursework with Professor Lydia Chilton and Michael Roger.

September–December 2025: Contributions to the shared platform through the admin, prompt engineering, and UI design pods.

January–May 2026: My own implementations of the three applications, developed as coursework while a separate team continued work on the main platform.

---

<!-- IMPLEMENTATION NOTES — DO NOT RENDER

CONTENT STATUS
This copy distinguishes the wider Crackd platform from my individual contributions.
Do not attribute all platform scraping or daily-update infrastructure to me.
Do not restore the old 40% / 35% claims or TensorFlow/self-critique claims without confirmation.

LINKS
There are THREE repositories, one per application.
Their final URLs and demo status still need confirmation.
Do not use the matrix repository as a link for the entire platform.
Do not show dead buttons, invented URLs, or visible placeholder links.

TOOLS
The precise frameworks, languages, model providers, hosting, and MCP tools will be supplied later.
The current tools section describes confirmed capabilities and workflow.
Do not infer specific technologies from common implementations.

VISUAL EVIDENCE
Real screenshots and pipeline examples will be supplied later.
Do not fabricate application screenshots, outputs, metrics, or evaluations.
A system architecture map is planned, but its connections must be grounded in the actual implementations.
Do not assume direct app-to-app calls or a shared configuration flow.

FUTURE APPLICATION WALKTHROUGHS
Later, each application preview will open a large, accessible dialog containing a screenshot-based walkthrough with Next/Previous controls.
Do not build these dialogs yet.
Do not substitute videos or live iframes.

CREDITS
Confirm Michael Roger’s preferred name and affiliation before adding the Stanford PhD / Columbia alumnus biography.
Use the supplied short credit in the meantime.

END IMPLEMENTATION NOTES -->