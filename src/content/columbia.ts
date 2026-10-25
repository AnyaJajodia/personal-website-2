/**
 * The two Columbia pages — approved copy, verbatim, from
 * handoff/content/work/esp-teaching.md and adi-mentorship.md. Their internal
 * notes are not rendered. Kept from the notes: "Peer Instructor" is a
 * descriptive label (shown as the copy has it, never as an appointment);
 * participation (Spring 2024) is kept apart from the teaching dates; the
 * program's guest conversations, opportunities session and research fair are
 * set apart as program features, not things Anya organized; ADI is the
 * individual mentorship program — six mentees, no outcomes or placements.
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
      "Each week introduces a different area, such as algorithms, computer vision, or UI/UX design. Small classes of around 15 students combine explanations, collaborative activities, and conversations about where those interests could lead.",
      "The atmosphere is informal and exploratory: a place to ask questions, try something unfamiliar, and discover that computer science contains more possibilities than a single introductory course can show.",
    ],
  },
  path: {
    id: "student-to-teacher",
    heading: "From student to teacher",
    stages: [
      {
        semester: "Spring 2024",
        verb: "Exploring",
        role: "Student",
        paragraphs: [
          "I took ESP during my freshman spring while deciding whether to pursue computer science.",
          "It gave me a way to explore different parts of the field before knowing which direction I wanted to take.",
        ],
      },
      {
        semester: "Fall 2024",
        verb: "Supporting",
        role: "Teaching assistant",
        paragraphs: [
          "The following semester, I returned as a teaching assistant, helping support the class and its activities.",
          "Having recently been in the students’ position helped me understand the uncertainty that can come with getting started.",
        ],
      },
      {
        semester: "Spring 2025",
        verb: "Teaching",
        role: "Teaching",
        paragraphs: [
          "I went on to teach the course the next semester.",
          "I adapted slides from the previous year, changing the material and emphasis to reflect the direction I wanted to take the sessions.",
          "The aim was to make unfamiliar areas approachable and give students something they could explore further.",
        ],
      },
    ],
  },
  weekly: {
    id: "each-week",
    heading: "A different part of CS each week",
    sessions: "Sessions paired an introduction to a topic with an activity that let students work through an idea together.",
    /** the one activity example, set as a small note */
    example: {
      area: "Algorithms",
      text: "An algorithms session, for example, could use a chocolate-based logic and strategy game.",
    },
    design: "Design activities asked students to reconsider familiar experiences and work collaboratively on alternatives.",
    after: "We also discussed relevant Columbia classes, professors, and ways to continue exploring each area.",
    /** program-wide offerings, not Anya's to claim */
    program: "The program included guest conversations with students studying different topics, an opportunities-focused session, and an ESP research fair where professors presented their work.",
  },
  values: {
    id: "what-i-value",
    heading: "What I value",
    paragraphs: [
      "I first joined ESP looking for a clearer picture of computer science. Returning to teach meant helping create that opportunity for someone else.",
      "I wanted students to leave with a useful starting point: a concept that made sense, a class they wanted to take, or a question they felt comfortable asking.",
    ],
  },
};

export const adi = {
  slug: "adi-mentorship",
  name: "Application Development Initiative",
  title: "Working through it together.",
  subtitle: "Mentoring six students through classes, projects, recruiting, and finding their own direction in computer science.",
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
      "The Application Development Initiative is Columbia’s student technology community, bringing people together through educational resources, events, projects, and mentorship.",
      "Its mentorship program connects students with more experienced peers for guidance shaped around their individual interests and questions.",
    ],
  },
  how: {
    id: "how-it-worked",
    heading: "How the mentorship worked",
    paragraphs: [
      "I applied to become a mentor and participated in the Spring and Fall 2026 cohorts, with three different mentees each semester.",
      "The program began with short introductory conversations between mentors and prospective mentees. Participants then submitted preferences to help inform the matching process.",
      "Once matched, the conversations followed what each student needed rather than a fixed curriculum.",
    ],
    /** the two cohorts, as the copy states them: three different mentees each */
    cohorts: [
      { name: "Spring 2026", mentees: 3 },
      { name: "Fall 2026", mentees: 3 },
    ],
    steps: ["Introductory conversations", "Preferences submitted", "Matched"],
  },
  themes: {
    id: "worked-through",
    heading: "What we worked through",
    items: [
      { heading: "Finding a place in CS", text: "I helped students explore the transition into computer science, understand different directions within the field, and think through their academic and career interests." },
      { heading: "Navigating Columbia", text: "We discussed classes, professors, course planning, and opportunities, drawing on my experience of studying CS at Columbia." },
      { heading: "Getting projects started", text: "I guided students through choosing an idea, defining a manageable scope, planning the work, and moving toward implementation." },
      { heading: "Preparing for what comes next", text: "Our conversations also covered recruiting, job searches, skill development, and possible career paths." },
    ],
    close: "Sometimes a student needed practical information. Other times, they needed someone to help organize the questions before deciding what to do.",
  },
  beyond: {
    id: "beyond-the-semester",
    heading: "Beyond the semester",
    paragraphs: [
      "I stayed in touch with mentees from the earlier cohort as the year continued.",
      "That continuity mattered: the next question often appeared after the initial decision, once someone had started a class, attempted a project, or begun exploring an opportunity.",
    ],
  },
  values: {
    id: "what-i-value",
    heading: "What I value",
    paragraphs: [
      "I like helping someone reach the point where they can see a useful next step and feel ready to take it.",
      "Mentoring gives me a chance to share what I have learned while paying attention to the fact that someone else’s path may look very different from mine.",
    ],
  },
};

export const espSections = [
  { id: esp.path.id, label: "From student to teacher" },
  { id: esp.what.id, label: "What is ESP?" },
  { id: esp.weekly.id, label: "A different part of CS each week" },
  { id: esp.values.id, label: "What I value" },
];

export const adiSections = [
  { id: adi.what.id, label: "What is ADI?" },
  { id: adi.how.id, label: "How the mentorship worked" },
  { id: adi.themes.id, label: "What we worked through" },
  { id: adi.beyond.id, label: "Beyond the semester" },
  { id: adi.values.id, label: "What I value" },
];

export const COLUMBIA_WORDMARK = { light: "/logos/columbia-wordmark-light.png", dark: "/logos/columbia-wordmark-dark.png", width: 1275, height: 287 };
export const ADI_MARK = { src: "/logos/adi-mark.png", width: 381, height: 183 };
