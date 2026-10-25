/**
 * The GVI conservation page — approved copy from
 * handoff/content/work/gvi-conservation.md, verbatim. Its internal notes are not
 * rendered. The story is grouped (fieldwork, data, practical and community
 * work, what followed); "Conservation involves decisions" sits with the
 * fieldwork it was observed during. Wording is unchanged.
 *
 * Boundaries kept from the notes: an early working AI model, not a deployed
 * system; the lion relocation observed, not performed; a 50 km event helped
 * organize and participated in, with no distance or fundraising claim for her.
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
    id: "threads",
    heading: "Where the threads started meeting",
    paragraphs: [
      "Before South Africa, I wasn’t sure how my interest in animals and my interest in technology would fit together.",
      "During a wildlife research internship with GVI, I worked with field observations, camera-trap imagery, movement data, and conservation teams. I began to see how much those interests could inform each other—and how many questions I wanted to keep exploring.",
      "The experience influenced the classes I chose afterward, the research I became interested in, and eventually the work I pursued at the American Museum of Natural History.",
    ],
    turn: "It opened a direction I hadn’t previously known how to follow.",
  },

  placement: {
    id: "placement",
    heading: "The placement",
    paragraphs: [
      "My internship took place at Karongwe Private Game Reserve in Limpopo, South Africa.",
      "Through GVI’s wildlife research program, I participated in biological surveys, wildlife monitoring, data processing, practical reserve work, and community teaching.",
      "The placement brought together several parts of conservation: observing animals, understanding the information collected about them, maintaining the environment in which the work happens, and engaging with people beyond the reserve.",
    ],
  },

  field: {
    id: "in-the-field",
    heading: "In the field",
    subheading: "An observation becomes useful when you record it carefully",
    paragraphs: [
      "I helped collect data on wildlife behavior and movement, including cheetah monitoring, bird surveys, vegetation surveys, and prey counts.",
      "Camera traps and radio tracking added other ways to observe animals beyond a single sighting. Each method offered a different piece of information, and each required attention to how that information was collected and interpreted.",
      "The work encouraged me to look beyond the most immediately noticeable animal or event. Patterns also depended on the surrounding habitat, other species, and observations accumulated over time.",
    ],
    /** the surveys and methods the paragraphs name, as a field log */
    surveys: ["cheetah monitoring", "bird surveys", "vegetation surveys", "prey counts"],
    methods: ["Camera traps", "radio tracking"],
  },

  decisions: {
    id: "decisions",
    heading: "Conservation involves decisions",
    paragraphs: [
      "Some of the most memorable experiences exposed me to the active management behind a reserve.",
      "I observed the darting and relocation process for a female lion. Staff explained that moving her was connected to breeding management: she had reached sexual maturity, and the resident male was her father.",
      "Seeing that process made questions about animal movement, breeding, and reserve boundaries much more concrete.",
      "I also attended a talk at Kruger National Park on elephant and rhino conservation, including issues surrounding ivory, tusks, and horns.",
      "These experiences gave me more to think about than a simple distinction between protecting animals and leaving them alone. Conservation involved decisions, constraints, and consequences that I wanted to understand more deeply.",
    ],
  },

  data: {
    id: "conservation-data",
    heading: "Working with conservation data",
    subheading: "Different formats, connected questions",
    paragraphs: [
      "I worked with information from field surveys, camera traps, movement records, heat maps, and GIS-based analysis.",
      "Processing those different formats helped me understand the relationship between an observation in the field and the patterns someone could investigate afterward.",
      "I contributed to data analysis, visualizations, and reporting, learning to consider both the individual record and the wider ecological context.",
      "This was also where I started noticing connections across disciplines. A technical question about organizing data could lead to questions about animal behavior, habitat, monitoring practices, or the decisions that information supported.",
    ],
    formats: ["field surveys", "camera traps", "movement records", "heat maps", "GIS-based analysis"],
  },

  ai: {
    id: "ai-identification",
    heading: "Exploring AI-assisted identification",
    paragraphs: [
      "Camera-trap imagery made the connection between conservation and computing particularly tangible.",
      "Identifying animals and reviewing imagery involved substantial manual work. I explored AI-driven wildlife identification and worked on an early working model, using the field experience to think about where computer vision could be useful.",
      "The scope was exploratory. It gave me practical experience with a possible conservation application and a clearer understanding of the questions that would matter beyond a demonstration: variation in images, distinguishing animals, and knowing when an identification needs closer review.",
    ],
    /** the later ideas — kept distinct from the internship's model work */
    after: "That interest continued after the internship, including ideas for identifying individual animals through distinctive markings and making camera-trap records easier to work with.",
    questions: ["variation in images", "distinguishing animals", "knowing when an identification needs closer review"],
  },

  roads: {
    id: "around-the-research",
    heading: "The work around the research",
    paragraphs: [
      "Conservation also involved practical work that did not end in a dataset.",
      "As part of the internship, I organized a road-clearing activity on the reserve. We removed overhanging branches and vegetation encroaching on access routes, using hand tools to clear the roads.",
      "It was a different kind of contribution, but part of the same environment that supported monitoring and daily reserve work.",
    ],
  },

  beyond: {
    id: "beyond-the-reserve",
    heading: "Beyond the reserve",
    teaching: {
      heading: "Teaching and community involvement",
      paragraphs: [
        "Every two weeks, we visited a local village to work with children.",
        "With older pupils, we taught short conservation lessons, including topics such as arachnids and camera-trapping technology. With preschoolers, we worked on English through simple lessons and activities.",
        "Teaching required another way of understanding the material: deciding what would be meaningful to the group, explaining it clearly, and adapting to the people in front of us.",
        "The community work became an important part of the placement alongside the field research.",
      ],
    },
    antiPoaching: {
      id: "anti-poaching",
      heading: "Supporting anti-poaching work",
      paragraphs: [
        "I also helped organize and participated in a 50 km running event supporting anti-poaching resources.",
        "It added another perspective on conservation: the organization, fundraising, and collective effort needed to support the work on the ground.",
      ],
    },
  },

  training: {
    id: "training",
    heading: "Training and completion",
    lead: "I completed GVI’s four-week program, with a certificate issued in July 2024 covering:",
    items: ["GVI South African Wildlife Research Expedition Internship.", "GVI Leading Teams for Impact.", "GVI Biological Survey Techniques Certificate."],
  },

  stayed: {
    id: "what-stayed-with-me",
    heading: "What stayed with me",
    paragraphs: [
      "The biggest change was in what I could imagine doing next.",
      "Working with animals, field observations, and conservation data showed me a direction in which my technical interests could become useful to questions I cared deeply about.",
      "I returned to college wanting to explore that connection further. It helped lead me toward Conservation Biology, further questions about animals and their behavior, and museum-based digitization and research.",
      "I still work on software in very different settings. This experience expanded the kinds of problems I wanted to spend time on—and gave me a reason to keep following them.",
    ],
  },
};

/** the story's four parts (navigation markers, not headings) */
export const gviChapters = {
  field: { n: "I", label: "Fieldwork" },
  data: { n: "II", label: "Data" },
  practical: { n: "III", label: "Practical and community work" },
  followed: { n: "IV", label: "What followed" },
};

export const gviSections = [
  { id: gvi.threads.id, label: "Where the threads started meeting" },
  { id: gvi.placement.id, label: "The placement" },
  { id: gvi.field.id, label: "In the field" },
  { id: gvi.decisions.id, label: "Conservation involves decisions" },
  { id: gvi.data.id, label: "Working with conservation data" },
  { id: gvi.ai.id, label: "Exploring AI-assisted identification" },
  { id: gvi.roads.id, label: "The work around the research" },
  { id: gvi.beyond.id, label: "Beyond the reserve" },
  { id: gvi.training.id, label: "Training and completion" },
  { id: gvi.stayed.id, label: "What stayed with me" },
];
