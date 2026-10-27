/**
 * The TMU citation-tooling page — approved copy from
 * handoff/content/work/tmu-citation-tooling.md, verbatim. Its internal notes
 * are not rendered. Nothing here links to, quotes or reproduces the notebook,
 * the manuscript, its sources or its outputs: they are confidential, and the
 * notebook was a development reference, not the final system.
 *
 * The walkthrough, review rows and bibliography lines below are FICTIONAL,
 * written to explain the workflow, and every place they appear is labelled
 * illustrative. They follow one invented reference consistently: note 14
 * ("Id. at 212.") resolves through note 13 to an invented 2016 book.
 */

export const tmu = {
  name: "Toronto Metropolitan University",
  title: "Following the footnotes.",
  subtitle: "Turning a manuscript’s tangled references into in-text citations, organized bibliographies, and reviewable results.",
  meta: [
    { label: "Role", value: "Research Assistant — Ted Rogers School of Management" },
    { label: "Period", value: "2025" },
    { label: "Supervisor", value: "Professor Ralph Gil" },
    { label: "Tools", value: "Python · Google Colab/Jupyter · python-docx · lxml · Regular expressions · Fuzzy matching · OpenAI API" },
  ],

  intro: {
    id: "formatting-task",
    heading: "A formatting task, until it wasn’t",
    paragraphs: [
      "Preparing a legal manuscript for publication meant changing more than the appearance of its references.",
      "Footnote-based citations needed to become Springer Law-style in-text citations. Each chapter needed its own bibliography, and the book needed a master bibliography. Throughout the conversion, references had to remain connected to the correct sources and their original locations in the text.",
      "As a research assistant working with Professor Ralph Gil at Toronto Metropolitan University’s Ted Rogers School of Management, I built Python tooling to support that transformation and worked directly on the manuscript to review and refine the results.",
      "The work combined document processing, citation resolution, AI-assisted conversion, and editorial judgment.",
    ],
  },

  problem: {
    id: "the-problem",
    heading: "The problem with “just replace the footnotes”",
    paragraphs: [
      "Some notes contained complete references. Others pointed back to earlier notes through Id., Ibid., or Supra. A single footnote could contain several sources, additional commentary, or a different pinpoint page.",
      "Replacing the visible number was the easy part. Determining what belonged in its place required understanding the reference behind it.",
      "The workflow also needed to distinguish citations that could move into the text from explanatory notes that should remain, while preserving the manuscript’s headings, numbering, and document structure.",
    ],
  },

  built: {
    id: "what-i-built",
    heading: "What I built",
    paragraphs: [
      "I developed a multi-stage pipeline to extract references, resolve dependencies, match sources, generate citations, and write the transformed material back into Word documents.",
      "The system also produced chapter-level bibliographies, a master bibliography, and comparison documents for reviewing the changes.",
    ],
    results: "Across more than 800 legal footnotes, the workflow achieved 92% accuracy and reduced manual review cycles by 30%. Automated processing was paired with targeted review and direct manuscript cleanup.",
    /** the three confirmed figures, each with words from the sentence above */
    figures: [
      { value: "800+", label: "legal footnotes" },
      { value: "92%", label: "accuracy" },
      { value: "30%", label: "fewer manual review cycles" },
    ],
  },

  stages: [
    {
      id: "extract",
      n: "01",
      heading: "Extract and organize",
      paragraphs: [
        "The first step was turning the manuscript’s reference material into structured data.",
        "I extracted footnote text and bibliography entries from Word documents, preserving reference identifiers so each transformation could be traced back to its source.",
        "Working with DOCX files required both document-level tooling and direct XML processing. The visible text was only part of the structure: footnote references and their positions were represented within the underlying document markup.",
      ],
    },
    {
      id: "follow",
      n: "02",
      heading: "Follow the reference",
      paragraphs: [
        "Legal citations often depend on something written earlier.",
        "I built multi-stage parsing to resolve Id., Ibid., and Supra references, including nested dependencies and changes to pinpoint pages. The goal was to recover the underlying source before attempting to convert its format.",
        "Source matching combined normalized author, year, and title information with fuzzy matching and AI-assisted interpretation where needed.",
      ],
      note: "Ambiguous references were flagged for review rather than treated as unquestionably correct matches.",
    },
    {
      id: "convert",
      n: "03",
      heading: "Convert the citation",
      paragraphs: [
        "Once a reference had been identified, the pipeline generated its in-text citation in the required manuscript style.",
        "The conversion accounted for different source types, including academic publications, books, legal cases, statutes, and online material. It also handled grouped sources and the distinction between a publication’s full page range and the specific pages cited in the text.",
        "AI-assisted generation was supported by explicit formatting instructions, examples, deterministic cleanup, and manual corrections.",
      ],
      note: "Selected explanatory notes were retained instead of being forced into an author-date format.",
      /** the source types the paragraph names */
    },
    {
      id: "replace",
      n: "04",
      heading: "Put it back in place",
      paragraphs: [
        "The generated citation needed to appear at the original reference location.",
        "I used direct DOCX XML manipulation to replace footnote-reference elements with citation text, handling surrounding punctuation, spacing, and formatting.",
        "This connected citation generation to the actual manuscript rather than leaving the result as a separate list of suggested replacements.",
      ],
      note: "Preserving document structure remained part of the task throughout the process.",
    },
    {
      id: "bibliographies",
      n: "05",
      heading: "Rebuild the bibliographies",
      paragraphs: [
        "The manuscript required both local and book-wide reference lists.",
        "I associated references with their chapters, standardized bibliography entries, handled duplicates, and sorted the results alphabetically.",
        "The workflow generated chapter-by-chapter bibliographies and a master bibliography for the end of the book. Cleanup covered author initials, capitalization, punctuation, publication details, and page-range formatting.",
      ],
      note: "Entries without a reliable bibliography match were separated for further review.",
    },
    {
      id: "review",
      n: "06",
      heading: "Make the transformation reviewable",
      paragraphs: ["A converted document alone was not enough to assess the work."],
      matrixLead: "I generated a review matrix connecting:",
      matrix: [
        "The original reference number.",
        "The original footnote.",
        "The converted in-text citation.",
        "The generated bibliography entry.",
        "The original bibliography entry.",
        "The associated chapter.",
      ],
      after: [
        "This made it possible to inspect the relationship between the source material and the proposed output, identify inconsistencies, and make targeted corrections.",
      ],
      note: "Validation checks and diagnostic logging helped surface ambiguous references and trace problems through the workflow.",
    },
  ],

  editorial: {
    id: "beyond-the-code",
    heading: "Beyond the code",
    paragraphs: [
      "I also worked directly on the manuscript.",
      "That included reviewing citations we were uncertain about, cleaning bibliography entries, correcting formatting and headings, and cross-checking the generated material against the original sources.",
      "I checked the chapter bibliographies and master bibliography for consistency, making sure the references were appropriate in both format and scope.",
      "The final workflow combined automated processing with editorial review. The code handled repeated transformations; direct review addressed the cases that required closer interpretation.",
    ],
  },

  engineering: {
    id: "engineering",
    heading: "Engineering the workflow",
    paragraphs: [
      "I organized the processing into modular stages so extraction, matching, citation generation, cleanup, and export could be developed and checked separately.",
      "Parallel processing supported the larger conversion workload, while unit tests covered individual components. Targeted reruns and manual overrides allowed problematic references to be corrected without treating every output as final.",
      "The work involved both building the pipeline and refining it against the manuscript’s exceptions.",
    ],
  },

  outputs: {
    id: "outputs",
    heading: "Outputs",
    columns: ["Deliverable", "Purpose"],
    rows: [
      ["Converted manuscript", "In-text citations inserted at the original reference locations, with selected notes retained."],
      ["Chapter bibliographies", "Reference lists organized for the end of each chapter."],
      ["Master bibliography", "A consolidated reference list for the end of the book."],
      ["Review matrix", "A side-by-side record of original references and transformed outputs."],
      ["Exception records", "Ambiguous or unmatched references identified for further review."],
    ] as [string, string][],
  },

  tools: {
    id: "tools",
    heading: "Tools and methods",
    columns: ["Area", "Tools and approach"],
    rows: [
      ["Development", "Python and Google Colab/Jupyter notebooks"],
      ["Word document processing", "python-docx, lxml, ZIP/XML manipulation"],
      ["Citation resolution", "Regular expressions, multi-stage parsing, dependency tracing"],
      ["Source matching", "Text normalization, fuzzy matching, AI-assisted matching"],
      ["Citation generation", "OpenAI API, example-driven prompts, formatting rules"],
      ["Quality checks", "Validation, diagnostic logging, unit tests, and human review"],
      ["Processing architecture", "Modular stages and parallel processing"],
      ["Editorial work", "Citation correction, bibliography cleanup, formatting, headings, and cross-checking"],
    ] as [string, string][],
  },

  takeaways: {
    id: "what-i-took-from-it",
    heading: "What I took from it",
    paragraphs: [
      "Research automation has to preserve relationships as well as transform text.",
      "A citation needs to point to the right source, appear in the right place, and remain consistent with the bibliography. A small formatting change can expose a much larger question about what a reference actually means.",
      "This project taught me to build review into the workflow: preserve the original material, make transformations inspectable, and leave room for judgment when the answer is uncertain.",
    ],
    punchline: "Sometimes the most useful output is a corrected citation. Sometimes it is a clear indication that someone needs to look again.",
  },
};

/* ------------------------------------------------------------------------
   Illustrative material — fictional throughout, labelled wherever shown.
   One invented reference, followed consistently: note 14 ("Id. at 212.")
   points back to note 13, which cites an invented 2016 book.
   ------------------------------------------------------------------------ */

export const ILLUSTRATIVE_LABEL = "Illustrative example — a fictional reference, not material from the manuscript.";

export type WalkStage = {
  id: string;
  name: string;
  /** what happens at this stage (built from the page's own descriptions) */
  explain: string;
};

export const walkthrough = {
  id: "walkthrough",
  heading: "One reference, followed through",
  stages: [
    { id: "w-footnote", name: "Original footnote", explain: "Note 14 points back to an earlier note through Id., with a different pinpoint page. On its own it names no source." },
    { id: "w-match", name: "Source match", explain: "Id. resolves to note 13. Normalized author, year and title are matched against the original bibliography; the pinpoint changes from the full range to page 212." },
    { id: "w-citation", name: "In-text citation", explain: "The citation is generated in the manuscript style and written back at the original reference location, with the surrounding punctuation handled." },
    { id: "w-bibliography", name: "Bibliography entry", explain: "The source is standardized for the chapter bibliography and appears once in the master bibliography, whichever chapters cite it." },
    { id: "w-review", name: "Review row", explain: "One row connects the original reference number, footnote, converted citation, generated and original bibliography entries, and chapter, so the change can be checked." },
  ] satisfies WalkStage[],
};

/** the fictional material each walkthrough stage shows */
export const example = {
  note13: "M. Hale, The Ledger and the Law: Accounting Rules in Commercial Courts (Northfield University Press, 2016) at 198–240.",
  note14: "Id. at 212.",
  sentenceBefore: "Several courts treated the ledger itself as evidence",
  originalBib: "Hale, Margaret. The Ledger and the Law: Accounting Rules in Commercial Courts. Northfield: Northfield University Press, 2016.",
  citation: "(Hale 2016, p. 212)",
  generatedBib: "Hale M (2016) The ledger and the law: accounting rules in commercial courts. Northfield University Press, Northfield",
  chapter: "Chapter 3",
};

export type ReviewRow = {
  ref: string;
  footnote: string;
  citation: string;
  generated: string;
  original: string;
  chapter: string;
  /** an exception or a retained note, shown as such */
  status?: "flagged" | "retained";
  statusNote?: string;
};

/** a synthetic slice of a review matrix: the documented columns, fictional rows */
export const reviewRows: ReviewRow[] = [
  { ref: "13", footnote: example.note13, citation: "(Hale 2016, pp. 198–240)", generated: example.generatedBib, original: example.originalBib, chapter: example.chapter },
  { ref: "14", footnote: example.note14, citation: example.citation, generated: example.generatedBib, original: example.originalBib, chapter: example.chapter },
  {
    ref: "15",
    footnote: "See R. Okafor & L. Brandt, “Audit Trails as Evidence” (2019) 41 Halden Law Review 77.",
    citation: "(Okafor and Brandt 2019)",
    generated: "Okafor R, Brandt L (2019) Audit trails as evidence. Halden Law Rev 41:77–102",
    original: "Okafor, R., and L. Brandt. “Audit Trails as Evidence.” Halden Law Review 41 (2019): 77–102.",
    chapter: example.chapter,
  },
  {
    ref: "16",
    footnote: "Supra note 9.",
    citation: "—",
    generated: "—",
    original: "—",
    chapter: example.chapter,
    status: "flagged",
    statusNote: "Note 9 cites two sources; flagged for review",
  },
  {
    ref: "17",
    footnote: "This distinction is developed further in Chapter 5.",
    citation: "—",
    generated: "—",
    original: "—",
    chapter: example.chapter,
    status: "retained",
    statusNote: "Explanatory note retained",
  },
];

/** fictional bibliography output for stage 05 */
export const bibliographyExample = {
  chapter: {
    title: "Chapter 3 · References",
    entries: [
      "Hale M (2016) The ledger and the law: accounting rules in commercial courts. Northfield University Press, Northfield",
      "Okafor R, Brandt L (2019) Audit trails as evidence. Halden Law Rev 41:77–102",
      "Vance T (2021) Records, receipts and reasonable doubt. Marlow Academic, London",
    ],
  },
  master: {
    title: "Master bibliography",
    entries: [
      { text: "Hale M (2016) The ledger and the law: accounting rules in commercial courts. Northfield University Press, Northfield", note: "cited in chapters 3 and 5 · listed once" },
      { text: "Okafor R, Brandt L (2019) Audit trails as evidence. Halden Law Rev 41:77–102" },
      { text: "Vance T (2021) Records, receipts and reasonable doubt. Marlow Academic, London" },
    ],
  },
};

export const tmuSections = [
  { id: tmu.intro.id, label: "A formatting task, until it wasn’t" },
  { id: tmu.problem.id, label: "The problem with “just replace the footnotes”" },
  { id: tmu.built.id, label: "What I built" },
  { id: walkthrough.id, label: "One reference, followed through" },
  { id: "stages", label: "The six stages" },
  { id: tmu.editorial.id, label: "Beyond the code" },
  { id: tmu.engineering.id, label: "Engineering the workflow" },
  { id: tmu.outputs.id, label: "Outputs" },
  { id: tmu.tools.id, label: "Tools and methods" },
  { id: tmu.takeaways.id, label: "What I took from it" },
];
