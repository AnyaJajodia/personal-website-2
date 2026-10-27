/**
 * The two research-publication pages — approved copy, verbatim, from
 * handoff/content/work/pmmy-research.md (revised 26 Oct 2026) and
 * teenage-pregnancy-research.md.
 * Their internal notes are not rendered (the PMMY chart caption is the one the
 * notes prescribe). Links are only those the documents supply, checked live:
 * the teenage-pregnancy paper (IJSHRE PDF) and Saksharta's Project Ārogya page.
 * No PMMY paper link was supplied, so none is shown.
 *
 * Not shown, by design: financial trend charts (the published figures need
 * checking), the regression's metric values (only "correlation and error
 * metrics", as the public copy says), invented data of any kind.
 */

export type Link = { label: string; url: string };
export type Step = { n: string; heading: string; paragraphs: string[] };
export type Finding = { heading: string; paragraphs: string[]; note?: string };

export type Publication = {
  id: string;
  heading: string;
  publishedTitle: string;
  authors: string;
  journal: string;
  journalFull: string;
  volume: string;
  issue: string;
  published: string;
  pages: string;
  credit: string;
  paperLink?: Link;
};

export type Paper = {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  year: string;
  facts: { label: string; value: string }[];
  /** at least the exact title and month (the companion link); the full details where the page shows them */
  publication: Pick<Publication, "publishedTitle" | "published"> & Partial<Publication>;
  question: { id: string; heading: string; ask: string; paragraphs: string[] };
  reference: { id: string; heading: string; text: string; links: Link[] };
};

const JOURNAL = "International Journal of Software & Hardware Research in Engineering (IJSHRE)";
const PAPER_TP: Link = { label: "Read the published paper", url: "https://ijournals.in/wp-content/uploads/2022/08/12.IJSHRE-100413-Anya.pdf" };
const AROGYA: Link = { label: "Explore Project Ārogya", url: "https://www.saakshartaa.com/project-%C4%81rogya" };

/* ============================================================== PMMY */
export const pmmy = {
  slug: "pmmy-research",
  name: "PMMY & women’s financial empowerment",
  title: "Policy, data, and lived consequences.",
  subtitle: "Investigating women’s access to enterprise finance through PMMY lending data and public sentiment.",
  year: "2022",
  facts: [
    { label: "Role", value: "Lead Researcher" },
    { label: "Mentor and co-author", value: "Reetu Jain" },
    { label: "Publication", value: JOURNAL },
  ],
  /** the full publication details live in the one reference at the end (no separate metadata section) */
  publication: {
    publishedTitle: "Analyzing The Impact Of Financial Schemes In Boosting The Lives Of Female Rural Population In India",
    published: "September 2022",
  },
  question: {
    id: "the-question",
    heading: "The question",
    ask: "What could lending data and public discussion reveal about an initiative intended to support women’s entrepreneurship?",
    paragraphs: [
      "I examined Pradhan Mantri Mudra Yojana (PMMY), an Indian government initiative supporting access to credit for micro-enterprises. The study combined exploratory analysis of financial-program data with NLP-based sentiment analysis of Twitter discussion.",
      "I led the research, including data preparation, analysis, visualization, and writing, with guidance from my mentor and co-author, Reetu Jain. The work brought programming into a broader investigation of financial inclusion and the barriers surrounding women’s economic independence.",
    ],
  },
  sources: {
    id: "two-sources-of-evidence",
    heading: "Two sources of evidence",
    strands: [
      {
        heading: "Financial-program data",
        paragraphs: [
          "I examined secondary data covering financial years 2015–16 through 2021–22, drawing on PMMY sources and existing research.",
          "The analysis compared loan accounts and sanctioned, disbursed, and outstanding amounts across the scheme’s Shishu, Kishore, and Tarun categories as defined during the study period. These comparisons examined how lending activity varied across categories and years.",
        ],
      },
      {
        heading: "Public discussion",
        paragraphs: [
          "I used Tweepy to collect a sample of 1,000 PMMY-related tweets. The Python workflow used NLTK for text preparation and TF-IDF to represent the relative importance of terms.",
          "A sentiment model trained on movie-review data was then applied to classify the tweets as positive, neutral, or negative. This provided a view of expressed sentiment alongside the financial analysis.",
        ],
      },
    ],
  },
  findings: {
    id: "what-the-study-found",
    heading: "What the study found",
    lending: {
      heading: "Lending activity changed over time",
      paragraphs: [
        "The paper reports an overall increase in disbursement across the study period, with a decline in financial year 2020–21 followed by recovery in 2021–22.",
        "It discusses the pandemic as possible context for the decline, rather than establishing its causal effect.",
      ],
    },
    sentiment: {
      heading: "The sampled discussion was predominantly positive",
      lead: "The paper reports these sentiment classifications within the collected tweet sample:",
      columns: ["Classification", "Share of the 1,000-tweet sample"],
      rows: [
        { label: "Positive", value: 78 },
        { label: "Neutral", value: 12 },
        { label: "Negative", value: 10 },
      ],
      after: "These percentages describe the model’s classifications of the sampled tweets, not population-wide approval or classifier accuracy.",
      /** the caption the notes prescribe */
      caption: "Sentiment classifications reported in the paper for a sample of 1,000 PMMY-related tweets. Results describe the collected sample, not the wider population.",
    },
    access: {
      heading: "Credit was one part of a wider question",
      paragraphs: [
        "Alongside the analysis, the paper discussed barriers identified in the surrounding literature, including education, skills, mobility, household responsibilities, social expectations, and confidence.",
        "These considerations framed the interpretation: access to a financial scheme does not, by itself, explain whether someone can make use of it.",
      ],
    },
  },
  context: {
    id: "reading-the-results-in-context",
    heading: "Reading the results in context",
    paragraphs: [
      "Twitter users did not necessarily represent the rural women the initiative aimed to serve, particularly those without reliable internet access. The sentiment model also crossed domains, moving from movie-review training material to financial-policy discussion.",
      "The two analyses therefore offered partial perspectives. Lending figures described program activity; tweet classifications described sampled discussion. Neither independently established a causal improvement in financial literacy, independence, or wellbeing.",
    ],
  },
  outreach: {
    id: "beyond-the-paper",
    heading: "Beyond the paper",
    paragraphs: [
      "Through a partnership with Saksharta spanning both of my research projects, I helped deliver educational sessions for interested girls and young women in underserved communities in Mumbai.",
      "Alongside classes, we offered assistance, mentoring on request, and practical support for participation and learning. This was related community work, separate from the research datasets and findings.",
    ],
  },
  takeaways: {
    id: "what-i-took-from-it",
    heading: "What I took from it",
    paragraphs: [
      "This was an early opportunity to use programming to investigate a question beyond the software itself.",
      "Working on the analysis alongside community education made me more attentive to who appears in a dataset, who is missing, and what additional understanding comes from speaking with people directly.",
    ],
  },
  tools: {
    id: "tools-and-methods",
    heading: "Tools and methods",
    items: ["Python", "Tweepy", "NLTK", "TF-IDF", "Sentiment classification", "Matplotlib", "Exploratory analysis of secondary financial data"],
  },
  reference: {
    id: "publication-reference",
    heading: "Publication reference",
    text: "Jajodia, A., and Jain, R. (2022). Analyzing The Impact Of Financial Schemes In Boosting The Lives Of Female Rural Population In India. International Journal of Software & Hardware Research in Engineering, 10(9), 93–101.",
    links: [] as Link[],
  },
};

/* ================================================== teenage pregnancy */
export const teen = {
  slug: "teenage-pregnancy-research",
  name: "Teenage pregnancy & fertility",
  title: "Looking beyond the numbers.",
  subtitle: "Studying adolescent pregnancy and fertility in Maharashtra, then taking the research into hospital discussions and community education.",
  year: "2022",
  facts: [
    { label: "Role", value: "Lead Researcher" },
    { label: "Mentor and co-author", value: "Reetu Jain" },
    { label: "Publication", value: JOURNAL },
    { label: "Community partner", value: "Saksharta" },
  ],
  publication: {
    id: "about-the-publication",
    heading: "About the publication",
    publishedTitle: "Projecting Teenage Pregnancy and Motherhood and Fertility Rates: An Analytical and Machine Learning Study of Maharashtra, India",
    authors: "Anya Jajodia and Reetu Jain",
    journal: "IJSHRE",
    journalFull: JOURNAL,
    volume: "10",
    issue: "4",
    published: "April 2022",
    pages: "95–112",
    credit: "I led the research with guidance from my mentor and co-author, Reetu Jain.",
    paperLink: PAPER_TP,
  },
  question: {
    id: "the-question",
    heading: "The question",
    ask: "How do teenage pregnancy, motherhood, and fertility patterns vary across social and demographic contexts?",
    paragraphs: [
      "I investigated this question using Maharashtra data from five rounds of the National Family Health Survey (NFHS), spanning 1992–2021.",
      "The study combined exploratory data analysis with linear regression, examining patterns across age, residence, marital status, schooling, religion, and caste and tribe.",
      "The work continued beyond publication. I presented the research to doctors and gynecologists at Chirayu Hospital in Bhopal and developed a community education program with Saksharta.",
    ],
  },
  study: {
    id: "building-the-study",
    heading: "Building the study",
    steps: [
      {
        n: "01",
        heading: "Gather and integrate",
        paragraphs: [
          "I extracted and brought together Maharashtra data from five NFHS rounds.",
          "The analysis considered changes over time alongside differences between demographic groups. Integrating the survey information provided a way to examine patterns beyond a single year.",
        ],
      },
      {
        n: "02",
        heading: "Clean and explore",
        paragraphs: [
          "I used Python, Pandas, and NumPy to organize and clean the extracted data, and Matplotlib to visualize it.",
          "The exploratory analysis compared patterns by age, urban and rural residence, marital status, schooling, religion, and caste and tribe.",
          "These comparisons helped identify relationships worth examining more closely and informed the interpretation of the results.",
        ],
      },
      {
        n: "03",
        heading: "Examine relationships",
        paragraphs: [
          "Alongside the descriptive analysis, I used linear regression to investigate the relationship between teenage marriage and pregnancy/motherhood.",
          "The paper reports correlation and error metrics for the model. This was an analytical study of survey patterns, rather than a clinical tool for assessing an individual person.",
        ],
      },
      {
        n: "04",
        heading: "Interpret in context",
        paragraphs: [
          "I considered the findings alongside literature on education, early marriage, economic circumstances, and access to information and services.",
          "The purpose was to understand how the observed patterns fit into a wider social context, while recognizing the limits of what the data could establish.",
        ],
      },
    ] satisfies Step[],
  },
  findings: {
    id: "findings",
    heading: "What the analysis showed",
    items: [
      {
        heading: "Declining rates did not mean uniform experiences",
        paragraphs: ["The study reported an overall decline in adolescent fertility across the survey period, alongside continuing differences between urban and rural populations."],
        note: "Looking only at the overall trend would have concealed some of those differences.",
      },
      {
        heading: "Schooling and marriage were important parts of the picture",
        paragraphs: ["The analysis found lower reported pregnancy and motherhood rates among groups with more schooling, and a strong relationship between teenage marriage and pregnancy/motherhood."],
        note: "These were associations in the analyzed data. They did not establish that any single factor independently caused an outcome.",
      },
      {
        heading: "Social context mattered",
        paragraphs: [
          "Comparisons across demographic groups reinforced the importance of considering education, residence, and social circumstances together.",
          "The findings supported a discussion about access to education and information, rather than treating teenage pregnancy as an isolated individual decision.",
        ],
      },
    ] satisfies Finding[],
  },
  contribution: {
    id: "my-contribution",
    heading: "My contribution",
    paragraphs: [
      "I led the research process, including data preparation, analysis, visualization, interpretation, and writing, with mentorship from Reetu Jain.",
      "I also took responsibility for communicating the work beyond the paper: presenting it to medical professionals, developing teaching material, and leading awareness sessions through Project Ārogya.",
    ],
  },
  hospital: {
    id: "hospital-discussion",
    heading: "From the paper to a hospital discussion",
    paragraphs: [
      "In 2022, I presented the research to a panel of doctors and gynecologists at Chirayu Hospital in Bhopal, India.",
      "After the presentation, I led a discussion of the findings with the medical professionals attending.",
      "The paper was also retained in the hospital’s internal database for internal use.",
      "Presenting the study in that setting required me to explain the analysis clearly and discuss its implications with people approaching the subject through clinical experience.",
    ],
  },
  arogya: {
    id: "project-arogya",
    heading: "Project Ārogya",
    subheading: "Turning research into educational material",
    paragraphs: [
      "Through Saksharta, I developed Project Ārogya’s teaching material and was the sole leader of its teenage-pregnancy awareness sessions.",
      "I translated the research into lessons about early pregnancy, motherhood, and the importance of education. The work also included mentoring on request and practical assistance and support.",
      "Saksharta’s project page records 9 September 2022 as the first in a series of awareness sessions.",
    ],
    /** the documented reach, set beside the section as its figure (participation, not a research metric) */
    reach: { value: "200+", text: "The program reached more than 200 girls through sessions in rural communities and centers operated by Saksharta." },
    separate: "The outreach was an extension of my engagement with the subject, separate from the survey analysis. Its documented reach describes participation, rather than a measured change in pregnancy rates or health outcomes.",
    link: AROGYA,
  },
  limits: {
    id: "scope",
    heading: "Understanding the scope",
    paragraphs: [
      "The study used secondary survey data and examined patterns across groups and survey rounds.",
      "Associations between schooling, marriage, residence, and pregnancy do not independently establish causation. The findings also should not be used to characterize every person within a demographic group.",
      "The regression results describe the model used in the paper. They do not establish clinical validity or make the system suitable for individual medical decisions.",
      "Similarly, the hospital presentation and internal retention of the paper should not be confused with adoption into clinical practice.",
    ],
  },
  tools: {
    id: "tools",
    heading: "Tools and methods",
    columns: ["Area", "Tools and approach"],
    rows: [
      ["Programming", "Python"],
      ["Data preparation", "Pandas and NumPy"],
      ["Visualization", "Matplotlib"],
      ["Data source", "Five NFHS rounds, with Maharashtra data spanning 1992–2021"],
      ["Exploratory analysis", "Trend analysis and comparisons across demographic groups"],
      ["Modeling", "Linear regression"],
      ["Research communication", "Published paper, hospital presentation, and discussion"],
      ["Community education", "Original teaching material, session leadership, mentoring, and practical support"],
    ] as [string, string][],
  },
  takeaways: {
    id: "what-i-took-from-it",
    heading: "What I took from it",
    paragraphs: [
      "This project involved several ways of working with the same question.",
      "The analysis required careful handling of data. The hospital discussion required explaining the findings to people with a different kind of expertise. The awareness sessions required making the material accessible and useful to the girls participating.",
      "Moving between those settings made me think more carefully about what it means to communicate research—and about the difference between identifying a pattern, interpreting it, and deciding what to do with it.",
    ],
  },
  reference: {
    id: "publication-reference",
    heading: "Publication reference",
    text: "Jajodia, A., and Jain, R. (2022). Projecting Teenage Pregnancy and Motherhood and Fertility Rates: An Analytical and Machine Learning Study of Maharashtra, India. International Journal of Software & Hardware Research in Engineering, 10(4), 95–112.",
    links: [
      { label: "Read the paper", url: PAPER_TP.url },
      { label: "Visit Project Ārogya", url: AROGYA.url },
    ] as Link[],
  },
};

/** the companion paper, for the contextual link between the two pages */
export const companion = {
  [pmmy.slug]: { slug: teen.slug, name: teen.name, title: teen.publication.publishedTitle, month: teen.publication.published },
  [teen.slug]: { slug: pmmy.slug, name: pmmy.name, title: pmmy.publication.publishedTitle, month: pmmy.publication.published },
};

export const pmmySections = [
  { id: pmmy.question.id, label: "The question" },
  { id: pmmy.sources.id, label: "Two sources of evidence" },
  { id: pmmy.findings.id, label: "What the study found" },
  { id: pmmy.context.id, label: "Reading the results in context" },
  { id: pmmy.outreach.id, label: "Beyond the paper" },
  { id: pmmy.takeaways.id, label: "What I took from it" },
  { id: pmmy.tools.id, label: "Tools and methods" },
  { id: pmmy.reference.id, label: "Publication reference" },
];

export const teenSections = [
  { id: teen.publication.id, label: "About the publication" },
  { id: teen.question.id, label: "The question" },
  { id: teen.study.id, label: "Building the study" },
  { id: teen.findings.id, label: "What the analysis showed" },
  { id: teen.contribution.id, label: "My contribution" },
  { id: teen.hospital.id, label: "From the paper to a hospital discussion" },
  { id: teen.arogya.id, label: "Project Ārogya" },
  { id: teen.limits.id, label: "Understanding the scope" },
  { id: teen.tools.id, label: "Tools and methods" },
  { id: teen.takeaways.id, label: "What I took from it" },
  { id: teen.reference.id, label: "Publication reference" },
];
