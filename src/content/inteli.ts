/**
 * Inteli-lens — the public copy of handoff/content/work/inteli-lens.md
 * (revised 26 Oct 2026), verbatim. The file's internal implementation notes
 * (unconfirmed tools, the archival screenshot, design notes) are not copied
 * here and never render.
 *
 * Scope, from those notes: an independent project from 2022; the parking-lot
 * intervention was a proposed application, not a deployed workflow; no claim
 * that it measured blood alcohol concentration or was validated; no invented
 * architecture, accuracy, dataset size or evaluation results.
 */

export const inteli = {
  name: "Inteli-lens",
  title: "Could movement reveal signs of impairment?",
  /** the word the hero frames with a detection box */
  framed: "movement",
  subtitle:
    "An independent computer-vision experiment exploring whether walking patterns and body language could help identify possible intoxication.",
  type: "Independent project",
  year: "2022",
  tools: ["Python", "JupyterLab", "OpenCV", "TensorFlow"],

  idea: {
    id: "the-idea",
    heading: "The idea",
    paragraphs: [
      "I built Inteli-lens to explore computer vision and find out whether it was a field I wanted to pursue. Inspired in part by the case of Kenneka Jenkins and concerns about impaired driving, I became interested in whether a camera could identify visible signs that someone might be intoxicated.",
      "The idea was to analyze walking patterns and body language in video, producing an estimated likelihood of intoxication. I imagined a possible application in parking lots: if the system flagged someone before they entered the driver’s seat, they could be offered a breath alcohol test before leaving.",
    ],
  },

  prototype: {
    id: "building-the-prototype",
    heading: "Building the prototype",
    paragraphs: [
      "Working independently in JupyterLab, I experimented with Python, OpenCV, and TensorFlow to explore video-based detection. The prototype detected people and displayed an estimated likelihood that changed as their movement was analyzed.",
    ],
    /** set apart: its first sentence leads */
    limitation: {
      lead: "The biggest limitation was data.",
      rest: "Footage of people walking with reliable information about whether they were sober or intoxicated was difficult to find, leaving a small dataset to train and evaluate the model. I explored ways to prepare and vary the available data, but the project remained an early experiment rather than a validated tool for assessing impairment.",
    },
  },

  /** a generated illustration, not a screenshot or a result: its own corner
   * disclosure ("Illustrative reconstruction") stays in the frame, uncropped */
  mockup: {
    src: "/assets/inteli-lens/mockup",
    original: "/assets/inteli-lens/mockup.png",
    width: 1597,
    height: 985,
    caption: "Illustrative reconstruction of the early prototype.",
    alt: "Illustration of a Jupyter notebook titled “drunk person detection”: code cells that read video frames with OpenCV, run a model and draw detection boxes, beside a “Video analysis” window where a lavender box labelled “Model output” surrounds a person walking across a parking lot. A note in the corner reads “Illustrative reconstruction”.",
  },

  reflection: {
    id: "looking-back",
    heading: "Looking back",
    paragraphs: [
      "Inteli-lens was an early opportunity to take an idea from a question to a working experiment. It showed me both the possibilities of computer vision and how much a model depends on having the right data.",
    ],
    more: "More details to come as I revisit the original project materials.",
  },
} as const;
