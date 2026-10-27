/**
 * The two Columbia pages — approved copy, verbatim, from
 * handoff/content/work/esp-teaching.md and adi-mentorship.md (revised 26 Oct
 * 2026). Their internal notes are not rendered. Kept from the notes: "Peer
 * Instructor" is a descriptive label (shown as the copy has it, never as an
 * appointment); participation (Spring 2024) is kept apart from the teaching
 * dates; the program's guest conversations, opportunities session and research
 * fair are set apart as program features, not things Anya organized; ADI is the
 * individual peer mentorship program — six anonymous mentees, no outcomes,
 * placements or testimonials.
 */

export const esp = {
  slug: "esp-teaching",
  name: "Emerging Scholars Program",
  title: "A different side of computer science.",
  subtitle: "From exploring computer science to helping others find their way into it.",
  facts: [
    { label: "Roles", value: "Teaching Assistant · Peer Instructor" },
    { label: "Teaching period", value: "Fall 2024–Spring 2025" },
    { label: "Institution", value: "Columbia University" },
  ],
  what: {
    id: "what-is-esp",
    heading: "What is ESP?",
    paragraphs: [
      "The Emerging Scholars Program is a one-credit, student-taught introduction to the breadth of computer science at Columbia.",
      "In weekly, hour-long sessions, classes of around 15 students explore areas such as algorithms, computer vision, and UI/UX design through explanations, collaborative activities, and conversations about where to go next.",
    ],
  },
  path: {
    id: "student-to-teacher",
    heading: "From student to teacher",
    stages: [
      { semester: "Spring 2024", role: "Student", text: "I took ESP during my freshman spring while deciding whether to pursue computer science. It helped me see the different directions the field could take." },
      { semester: "Fall 2024", role: "Teaching assistant", text: "I returned the following semester to support the class and its activities, with a recent student’s perspective on what could feel unfamiliar or intimidating." },
      { semester: "Spring 2025", role: "Teaching", text: "I went on to teach the course, adapting the previous year’s slides and changing the material and emphasis to reflect the direction I wanted to take the sessions." },
    ],
  },
  session: {
    id: "inside-a-session",
    heading: "Inside a session",
    /** the first paragraph, split: its opening sentence, then its one example (set as a note) */
    intro: "Each session paired an introduction to an area of CS with an activity students could work through together.",
    example: "An algorithms session, for example, used a chocolate-based logic and strategy game to make the ideas tangible.",
    after: "Alongside the concepts, we discussed relevant Columbia classes, professors, and opportunities so students had somewhere to take a new interest.",
    /** program-wide offerings, not Anya's to claim */
    program: "The wider program included guest conversations with students studying different areas, an opportunities-focused session, and an ESP research fair where professors presented their work.",
  },
  values: {
    id: "what-i-value",
    heading: "What I value",
    paragraphs: [
      "I joined ESP looking for a clearer picture of computer science. Returning to teach meant helping create that opportunity for someone else.",
      "I wanted students to leave with something they could act on: a concept that made sense, a class they wanted to take, or a question they felt comfortable asking.",
    ],
  },
};

export const adi = {
  slug: "adi-mentorship",
  name: "Application Development Initiative",
  title: "Working through it together.",
  subtitle: "Mentoring students through classes, projects, recruiting, and finding their own direction in computer science.",
  facts: [
    { label: "Role", value: "Mentor" },
    { label: "Period", value: "Spring–Fall 2026" },
    { label: "Community", value: "Columbia University" },
    { label: "Cohorts", value: "Two · Six mentees" },
  ],
  what: {
    id: "what-is-adi",
    heading: "What is ADI?",
    paragraphs: [
      "The Application Development Initiative is Columbia’s student technology community. Its peer mentorship program connects students with more experienced peers for guidance around their interests, questions, and goals.",
      "I mentored three different students in each of the Spring and Fall 2026 cohorts. After introductory conversations and preference-based matching, we shaped the mentorship around what each student needed.",
    ],
    /** the two cohorts the copy names: three different mentees each, kept anonymous */
    cohorts: [
      { name: "Spring 2026", mentees: 3 },
      { name: "Fall 2026", mentees: 3 },
    ],
  },
  themes: {
    id: "what-we-worked-through",
    heading: "What we worked through",
    items: [
      { heading: "Finding a direction", text: "For students exploring or transitioning into computer science, I helped them consider different areas of the field and how those might connect to their academic and career interests." },
      { heading: "Classes and opportunities", text: "We worked through course planning, choosing professors, finding opportunities, and approaching recruiting—drawing on what I had learned navigating CS at Columbia." },
      { heading: "Moving an idea forward", text: "I helped mentees choose project ideas, define a manageable scope, plan the work, and figure out how to begin building. Sometimes that meant technical guidance; other times, it meant breaking an overwhelming idea into a useful next step." },
    ],
  },
  beyond: {
    id: "beyond-the-semester",
    heading: "Beyond the semester",
    paragraphs: [
      "I stayed in touch with earlier mentees as the year continued, following up as they started classes, developed projects, and encountered new questions.",
      "What I enjoy is helping someone find their footing while leaving room for their direction to be different from mine.",
    ],
  },
};

export const espSections = [
  { id: esp.what.id, label: "What is ESP?" },
  { id: esp.path.id, label: "From student to teacher" },
  { id: esp.session.id, label: "Inside a session" },
  { id: esp.values.id, label: "What I value" },
];

export const adiSections = [
  { id: adi.what.id, label: "What is ADI?" },
  { id: adi.themes.id, label: "What we worked through" },
  { id: adi.beyond.id, label: "Beyond the semester" },
];

export const COLUMBIA_WORDMARK = { light: "/logos/columbia-wordmark-light.png", dark: "/logos/columbia-wordmark-dark.png", width: 1275, height: 287 };
export const ADI_MARK = { src: "/logos/adi-mark.png", width: 381, height: 183 };
