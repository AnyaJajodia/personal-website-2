# Toronto Metropolitan University

## Following the footnotes.

Turning a manuscript’s tangled references into in-text citations, organized bibliographies, and reviewable results.

Role: Research Assistant — Ted Rogers School of Management
Period: 2025
Supervisor: Professor Ralph Gil
Tools: Python · Google Colab/Jupyter · python-docx · lxml · Regular expressions · Fuzzy matching · OpenAI API

## A formatting task, until it wasn’t

Preparing a legal manuscript for publication meant changing more than the appearance of its references.

Footnote-based citations needed to become Springer Law-style in-text citations. Each chapter needed its own bibliography, and the book needed a master bibliography. Throughout the conversion, references had to remain connected to the correct sources and their original locations in the text.

As a research assistant working with Professor Ralph Gil at Toronto Metropolitan University’s Ted Rogers School of Management, I built Python tooling to support that transformation and worked directly on the manuscript to review and refine the results.

The work combined document processing, citation resolution, AI-assisted conversion, and editorial judgment.

## The problem with “just replace the footnotes”

Some notes contained complete references. Others pointed back to earlier notes through Id., Ibid., or Supra. A single footnote could contain several sources, additional commentary, or a different pinpoint page.

Replacing the visible number was the easy part. Determining what belonged in its place required understanding the reference behind it.

The workflow also needed to distinguish citations that could move into the text from explanatory notes that should remain, while preserving the manuscript’s headings, numbering, and document structure.

## What I built

I developed a multi-stage pipeline to extract references, resolve dependencies, match sources, generate citations, and write the transformed material back into Word documents.

The system also produced chapter-level bibliographies, a master bibliography, and comparison documents for reviewing the changes.

Across more than 800 legal footnotes, the workflow achieved 92% accuracy and reduced manual review cycles by 30%. Automated processing was paired with targeted review and direct manuscript cleanup.

## 01 · Extract and organize

The first step was turning the manuscript’s reference material into structured data.

I extracted footnote text and bibliography entries from Word documents, preserving reference identifiers so each transformation could be traced back to its source.

Working with DOCX files required both document-level tooling and direct XML processing. The visible text was only part of the structure: footnote references and their positions were represented within the underlying document markup.

## 02 · Follow the reference

Legal citations often depend on something written earlier.

I built multi-stage parsing to resolve Id., Ibid., and Supra references, including nested dependencies and changes to pinpoint pages. The goal was to recover the underlying source before attempting to convert its format.

Source matching combined normalized author, year, and title information with fuzzy matching and AI-assisted interpretation where needed.

Ambiguous references were flagged for review rather than treated as unquestionably correct matches.

## 03 · Convert the citation

Once a reference had been identified, the pipeline generated its in-text citation in the required manuscript style.

The conversion accounted for different source types, including academic publications, books, legal cases, statutes, and online material. It also handled grouped sources and the distinction between a publication’s full page range and the specific pages cited in the text.

AI-assisted generation was supported by explicit formatting instructions, examples, deterministic cleanup, and manual corrections.

Selected explanatory notes were retained instead of being forced into an author-date format.

## 04 · Put it back in place

The generated citation needed to appear at the original reference location.

I used direct DOCX XML manipulation to replace footnote-reference elements with citation text, handling surrounding punctuation, spacing, and formatting.

This connected citation generation to the actual manuscript rather than leaving the result as a separate list of suggested replacements.

Preserving document structure remained part of the task throughout the process.

## 05 · Rebuild the bibliographies

The manuscript required both local and book-wide reference lists.

I associated references with their chapters, standardized bibliography entries, handled duplicates, and sorted the results alphabetically.

The workflow generated chapter-by-chapter bibliographies and a master bibliography for the end of the book. Cleanup covered author initials, capitalization, punctuation, publication details, and page-range formatting.

Entries without a reliable bibliography match were separated for further review.

## 06 · Make the transformation reviewable

A converted document alone was not enough to assess the work.

I generated a review matrix connecting:

- The original reference number.
- The original footnote.
- The converted in-text citation.
- The generated bibliography entry.
- The original bibliography entry.
- The associated chapter.

This made it possible to inspect the relationship between the source material and the proposed output, identify inconsistencies, and make targeted corrections.

Validation checks and diagnostic logging helped surface ambiguous references and trace problems through the workflow.

## Beyond the code

I also worked directly on the manuscript.

That included reviewing citations we were uncertain about, cleaning bibliography entries, correcting formatting and headings, and cross-checking the generated material against the original sources.

I checked the chapter bibliographies and master bibliography for consistency, making sure the references were appropriate in both format and scope.

The final workflow combined automated processing with editorial review. The code handled repeated transformations; direct review addressed the cases that required closer interpretation.

## Engineering the workflow

I organized the processing into modular stages so extraction, matching, citation generation, cleanup, and export could be developed and checked separately.

Parallel processing supported the larger conversion workload, while unit tests covered individual components. Targeted reruns and manual overrides allowed problematic references to be corrected without treating every output as final.

The work involved both building the pipeline and refining it against the manuscript’s exceptions.

## Outputs

| Deliverable | Purpose |
| --- | --- |
| Converted manuscript | In-text citations inserted at the original reference locations, with selected notes retained. |
| Chapter bibliographies | Reference lists organized for the end of each chapter. |
| Master bibliography | A consolidated reference list for the end of the book. |
| Review matrix | A side-by-side record of original references and transformed outputs. |
| Exception records | Ambiguous or unmatched references identified for further review. |

## Tools and methods

| Area | Tools and approach |
| --- | --- |
| Development | Python and Google Colab/Jupyter notebooks |
| Word document processing | python-docx, lxml, ZIP/XML manipulation |
| Citation resolution | Regular expressions, multi-stage parsing, dependency tracing |
| Source matching | Text normalization, fuzzy matching, AI-assisted matching |
| Citation generation | OpenAI API, example-driven prompts, formatting rules |
| Quality checks | Validation, diagnostic logging, unit tests, and human review |
| Processing architecture | Modular stages and parallel processing |
| Editorial work | Citation correction, bibliography cleanup, formatting, headings, and cross-checking |

## What I took from it

Research automation has to preserve relationships as well as transform text.

A citation needs to point to the right source, appear in the right place, and remain consistent with the bibliography. A small formatting change can expose a much larger question about what a reference actually means.

This project taught me to build review into the workflow: preserve the original material, make transformations inspectable, and leave room for judgment when the answer is uncertain.

Sometimes the most useful output is a corrected citation. Sometimes it is a clear indication that someone needs to look again.

---

<!-- INTERNAL IMPLEMENTATION NOTES — DO NOT RENDER

CONFIDENTIAL MATERIAL
Do not link, embed, publish, or offer downloads of the notebook, manuscript,
source documents, review files, or original processing outputs.
Do not imply that these materials are publicly accessible.

The supplied notebook is a development reference, not the final implementation.
The final workflow also included parallel processing, modular unit-tested
components, and editorial work outside the notebook, as confirmed by Anya.

METRICS
Retain the user-confirmed 800+ footnotes, 92% accuracy, and 30% reduction
in manual review cycles.
Do not invent a benchmark methodology, timing result, or additional metric.
Do not treat the development notebook's generated/retained counts as a
final-system accuracy measurement.

DATES
Use 2025 publicly for now.
The exact end month remains to be settled between September and October 2025.
Do not restore the placeholder end year 2027.

DESIGN DIRECTION
Use a notebook-inspired editorial layout:
explanation cells, numbered processing stages, output panels, and margin notes.
Preserve the portfolio typography, thread motif, theme control, and work drawer.
Avoid a fake IDE, executable cells, or nonfunctional Run buttons.

ILLUSTRATIVE EXAMPLES
Synthetic citation transformations and review rows may explain the workflow,
but must be labeled illustrative.
Do not reproduce confidential manuscript passages or present invented examples
as actual project outputs.

END INTERNAL NOTES -->