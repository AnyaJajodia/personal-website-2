/**
 * The three AMNH pages: the overview (/work/amnh) and its two projects
 * (/work/amnh/diode, /work/amnh/behavioral-research).
 * Source: handoff/content/work/amnh.md, amnh-diode.md and
 * amnh-behavioral-research.md. Copy is the factual authority: keep it faithful,
 * add nothing those files don't say (their internal notes list what may not be
 * claimed — Anya did not design the rig or trays, did not develop BugBase, and
 * the behavioral research has not begun).
 *
 * The planned artwork for the DIODE walkthrough lives in amnh-assets.ts.
 */

export type Fact = { label: string; value: string };
export type Prose = { id: string; heading: string; paragraphs: string[] };

export const AMNH_ROUTES = {
  overview: "/work/amnh",
  diode: "/work/amnh/diode",
  behavioral: "/work/amnh/behavioral-research",
} as const;

/** anchors of the old combined page, sent on to the page each now lives on */
export const AMNH_LEGACY_ANCHORS: Record<string, string> = {
  "collections-digitization": AMNH_ROUTES.diode,
  "mantis-research": AMNH_ROUTES.behavioral,
};

/* ------------------------------------------------------------- overview */

export const amnhOverview = {
  name: "American Museum of Natural History",
  title: "Behind the collections. Into new questions.",
  subtitle: "Collections digitization and emerging behavioral research in Invertebrate Zoology at the American Museum of Natural History.",
  facts: [
    { label: "Role", value: "Volunteer" },
    { label: "Period", value: "2026–present" },
    { label: "Lab", value: "Jessica Ware’s lab · Invertebrate Zoology" },
    { label: "Location", value: "New York" },
  ] satisfies Fact[],
  threads: {
    heading: "Two threads at the museum",
    intro:
      "Beyond its public galleries, AMNH is a place of scientific collections and ongoing research. I volunteer in Jessica Ware’s lab, where my work is beginning to span both: helping digitize dragonfly specimens and joining a behavioral research project.",
    projects: [
      {
        key: "diode",
        href: AMNH_ROUTES.diode,
        title: "DIODE · Collections digitization",
        text: "I prepare specimens and their collection labels for imaging, operate the existing capture setup, review the resulting images, and rehouse the specimens afterward. It is a hands-on process connecting physical collections with digital records.",
        cta: "Explore collections digitization",
      },
      {
        key: "behavioral",
        href: AMNH_ROUTES.behavioral,
        title: "Behavioral research",
        text: "I’m joining a project investigating feeding behavior. More on the research and my contribution once the work begins.",
        cta: "Explore behavioral research",
      },
    ],
  },
  further: {
    heading: "Following the questions further",
    paragraphs: [
      "I came to the museum wanting to spend more time with questions about animals and their behavior. Working with the collections has given me another way into those questions—and a closer look at the care and tools behind the records researchers use.",
    ],
  },
  description: "Collections digitization and emerging behavioral research in Invertebrate Zoology at the American Museum of Natural History.",
};

/* ---------------------------------------------------------------- DIODE */

export type Chapter = { id: string; n: string; heading: string; paragraphs: string[]; /** one line set apart */ pull?: string };

export const diode = {
  name: "DIODE · Collections digitization",
  short: "Collections digitization",
  title: "From specimen to record.",
  subtitle: "Preparing, imaging and rehousing dragonfly specimens for the DIODE digitization project at the American Museum of Natural History.",
  facts: [
    { label: "Role", value: "Collections Digitization Volunteer" },
    { label: "Period", value: "2026–present" },
    { label: "Lab", value: "Jessica Ware’s lab · Invertebrate Zoology, AMNH" },
    { label: "Supervisors", value: "Ellie Gamett and Rin Krichilsky" },
  ] satisfies Fact[],
  intro: {
    id: "into-view",
    heading: "Bringing the collection into view",
    paragraphs: [
      "A specimen holds more than its appearance. Its collection labels carry context that needs to remain connected to it as the collection is digitized.",
      "I volunteer for a few hours each week, working through the physical preparation, image capture, review and rehousing involved in that process. The setup combines careful handling with 3D-printed trays, a motorized imaging stage and BugBase, the existing software used to coordinate capture.",
    ],
  } satisfies Prose,
  chapters: [
    {
      id: "preparing",
      n: "01",
      heading: "Preparing the specimens",
      paragraphs: [
        "I retrieve specimens and their associated labels, organize them in the trays, and add unique identifiers. Some specimens have detached parts, which I carefully position for imaging following the lab’s handling procedure. I also brush loose debris from the tray before capture.",
      ],
      pull: "Keeping the specimen, label and identifier associated is part of the preparation—not something to sort out after the photographs are taken.",
    },
    {
      id: "capture",
      n: "02",
      heading: "Running and reviewing the capture",
      paragraphs: [
        "Once the tray is ready, I load it onto the imaging stage and use BugBase to run the capture sequence. The stage positions the tray beneath the camera so specimens and their labels can be photographed.",
        "I then review the captured specimen-and-label pairs, checking the images and approving or rejecting them before continuing. The capture sequence is automated in part; preparation and image review still depend on attention to each specimen.",
      ],
    },
    {
      id: "rehousing",
      n: "03",
      heading: "Rehousing after imaging",
      paragraphs: [
        "After imaging, I rehouse the specimens in new sleeves with their associated collection material. The work ends with both a digital image record and the physical specimen ready to return to the collection.",
      ],
    },
  ] satisfies Chapter[],
  draws: {
    id: "what-draws-me",
    heading: "What draws me to it",
    paragraphs: [
      "Working through the process has made me more attentive to what sits behind a digital collection: careful handling, readable labels, consistent images, and decisions made one specimen at a time.",
      "I’ve also been exploring the existing BugBase code to understand how the software coordinates the workflow. I’m interested in the tools, but equally in learning about the collection and the research those records can support.",
    ],
  } satisfies Prose,
  credits: {
    id: "lab-and-tools",
    heading: "Lab and tools",
    paragraphs: [
      "This work takes place in Dr. Jessica L. Ware’s lab in AMNH’s Division of Invertebrate Zoology, under the supervision of Ellie Gamett and Rin Krichilsky, doctoral researchers affiliated with Columbia University and AMNH.",
      "I use existing tools and procedures developed by the project team and collaborators, including BugBase, the imaging rig and the 3D-printed trays. My contribution is preparing specimens, operating the imaging workflow, reviewing images and rehousing collection material.",
    ],
  } satisfies Prose,
  description: "Preparing, imaging and rehousing dragonfly specimens for the DIODE digitization project at the American Museum of Natural History.",
};

/* ---------------------------------------------------- behavioral research */

export const behavioral = {
  name: "Behavioral research",
  title: "A new set of questions.",
  lead: "I’m joining a behavioral research project in Invertebrate Zoology at the American Museum of Natural History, investigating feeding behavior.",
  note: "More on the research and my contribution soon.",
  back: "Back to my work at AMNH",
  description: "Joining a behavioral research project in Invertebrate Zoology at the American Museum of Natural History, investigating feeding behavior.",
};
