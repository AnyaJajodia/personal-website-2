/**
 * The GVI conservation page — approved copy from
 * handoff/content/work/gvi-conservation.md (revised 26 Oct 2026), verbatim.
 * Its internal notes are not rendered. The three photographs (content/
 * gvi-photos.ts) sit where the copy's photo comments place them.
 *
 * Boundaries kept from the notes: an early functioning AI model, not a
 * deployed system; the lioness's relocation observed, not performed; a 50 km
 * event helped organize and participated in, with no distance or fundraising
 * claim for her; fortnightly visits; the road-clearing activity she organized.
 */

export const gvi = {
  name: "GVI · South Africa",
  title: "Learning to look more closely.",
  subtitle: "Wildlife monitoring, conservation data, and four weeks in the bushveld that opened a new direction.",
  meta: [
    { label: "Role", value: "Wildlife Research Intern" },
    { label: "Period", value: "Summer 2024 · Four-week program" },
    { label: "Location", value: "Karongwe Private Game Reserve, Limpopo, South Africa" },
  ],

  threads: {
    id: "where-the-threads-started-meeting",
    heading: "Where the threads started meeting",
    paragraphs: [
      "Through GVI’s wildlife research program at Karongwe, I participated in wildlife monitoring, biological surveys, conservation data work, and community teaching.",
      "Before the placement, I wasn’t sure how my interests in animals and technology could fit together. Working between field observations and the information collected about them gave me a way to start exploring that connection.",
    ],
  },

  field: {
    id: "field-observations-and-conservation-data",
    heading: "Field observations and conservation data",
    collecting: {
      heading: "Collecting the observations",
      paragraphs: [
        "I helped collect wildlife behavior and movement data through cheetah monitoring, bird surveys, vegetation surveys, and prey counts. Camera traps and radio tracking provided additional ways to follow animals beyond a single sighting.",
        "The work required attention to the animal, its surroundings, and how an observation was recorded. A sighting became part of a longer record that could be compared with observations from other days and locations.",
      ],
    },
    formats: {
      heading: "Working across formats",
      paragraphs: [
        "I processed information from field surveys, camera traps, movement records, heat maps, and GIS-based analysis, contributing to data analysis, visualizations, and reporting.",
        "Working across those formats helped me connect individual observations with wider patterns. It also made the relationship between computing and conservation tangible: organizing and interpreting information was part of understanding what was happening on the reserve.",
      ],
    },
  },

  ai: {
    id: "exploring-ai-assisted-identification",
    heading: "Exploring AI-assisted identification",
    paragraphs: [
      "I also worked on an early functioning model for AI-driven wildlife identification, exploring how computer vision could support the review of wildlife imagery.",
      "The work was exploratory, rather than a deployed monitoring system. It gave me a practical starting point for thinking about conservation applications of AI and questions I continued exploring afterward, including identifying individual animals through distinctive markings.",
    ],
  },

  practice: {
    id: "conservation-in-practice",
    heading: "Conservation in practice",
    /** observed, then attended: kept apart from her own contributions */
    observed: [
      "I observed the darting and relocation process for a female lioness. Staff explained that she had reached sexual maturity and that the resident male was her father; moving her to another reserve was connected to breeding management.",
      "Seeing the process brought questions about breeding, animal movement, and reserve boundaries into focus. Conservation involved active decisions about animals’ lives, alongside the monitoring work that helped inform them.",
    ],
    attended: "I also attended a talk at Kruger National Park on elephant and rhino conservation, including issues surrounding ivory and horn.",
  },

  community: {
    id: "supporting-the-reserve-and-community",
    heading: "Supporting the reserve and community",
    reserve: {
      heading: "Practical reserve work",
      text: "I organized a road-clearing activity, working with the team to remove overhanging branches and vegetation encroaching on access routes using hand tools.",
    },
    teaching: {
      heading: "Teaching beyond the reserve",
      paragraphs: [
        "Every two weeks, our team visited a local village to work with children. With older pupils, we taught conservation lessons covering topics such as arachnids and camera-trapping technology. With preschoolers, we worked on English through simple lessons and activities.",
        "These visits were a regular part of the placement alongside the field research.",
      ],
    },
    antiPoaching: {
      heading: "Supporting anti-poaching resources",
      text: "I helped organize and participated in a 50 km running event supporting anti-poaching resources, contributing to the collective effort behind conservation work on the ground.",
    },
  },

  stayed: {
    id: "what-stayed-with-me",
    heading: "What stayed with me",
    /** the first paragraph's opening sentence is set as the turn; the rest follows as prose */
    turn: "The biggest change was in what I could imagine doing next.",
    paragraphs: [
      "I had treated animals and technology as interests I might eventually have to choose between. This experience showed me that I could pursue both—and that the connections between them were worth investigating.",
      "I returned to college wanting to follow that direction. It influenced my decision to take Conservation Biology and helped lead me toward museum-based digitization and research at the American Museum of Natural History.",
      "I still enjoy building software in very different settings. South Africa expanded the kinds of questions I wanted to bring those skills to.",
    ],
  },

  training: {
    id: "training-and-completion",
    heading: "Training and completion",
    lead: "I completed the four-week program, with a certificate issued in July 2024 covering:",
    items: ["GVI South African Wildlife Research Expedition Internship.", "GVI Leading Teams for Impact.", "GVI Biological Survey Techniques Certificate."],
  },
};

export const gviSections = [
  { id: gvi.threads.id, label: "Where the threads started meeting" },
  { id: gvi.field.id, label: "Field observations and conservation data" },
  { id: gvi.ai.id, label: "Exploring AI-assisted identification" },
  { id: gvi.practice.id, label: "Conservation in practice" },
  { id: gvi.community.id, label: "Supporting the reserve and community" },
  { id: gvi.stayed.id, label: "What stayed with me" },
  { id: gvi.training.id, label: "Training and completion" },
];
