# PMMY & women’s financial empowerment

## Policy, data, and lived consequences.

Investigating women’s access to enterprise finance through PMMY lending data and public sentiment.

Role: Lead Researcher
Year: 2022
Mentor and co-author: Reetu Jain
Publication: International Journal of Software & Hardware Research in Engineering (IJSHRE)

## The question

What could lending data and public discussion reveal about an initiative intended to support women’s entrepreneurship?

I examined Pradhan Mantri Mudra Yojana (PMMY), an Indian government initiative supporting access to credit for micro-enterprises. The study combined exploratory analysis of financial-program data with NLP-based sentiment analysis of Twitter discussion.

I led the research, including data preparation, analysis, visualization, and writing, with guidance from my mentor and co-author, Reetu Jain. The work brought programming into a broader investigation of financial inclusion and the barriers surrounding women’s economic independence.

## Two sources of evidence

### Financial-program data

I examined secondary data covering financial years 2015–16 through 2021–22, drawing on PMMY sources and existing research.

The analysis compared loan accounts and sanctioned, disbursed, and outstanding amounts across the scheme’s Shishu, Kishore, and Tarun categories as defined during the study period. These comparisons examined how lending activity varied across categories and years.

### Public discussion

I used Tweepy to collect a sample of 1,000 PMMY-related tweets. The Python workflow used NLTK for text preparation and TF-IDF to represent the relative importance of terms.

A sentiment model trained on movie-review data was then applied to classify the tweets as positive, neutral, or negative. This provided a view of expressed sentiment alongside the financial analysis.

<!-- INSERT TWO-STRAND METHODS DIAGRAM HERE.
Use the specifications in the internal notes. -->

## What the study found

### Lending activity changed over time

The paper reports an overall increase in disbursement across the study period, with a decline in financial year 2020–21 followed by recovery in 2021–22.

It discusses the pandemic as possible context for the decline, rather than establishing its causal effect.

### The sampled discussion was predominantly positive

The paper reports these sentiment classifications within the collected tweet sample:

| Classification | Share of the 1,000-tweet sample |
| --- | --- |
| Positive | 78% |
| Neutral | 12% |
| Negative | 10% |

These percentages describe the model’s classifications of the sampled tweets, not population-wide approval or classifier accuracy.

<!-- RENDER THE SENTIMENT CHART HERE.
Use the table above as its data source; preserve an accessible table equivalent. -->

### Credit was one part of a wider question

Alongside the analysis, the paper discussed barriers identified in the surrounding literature, including education, skills, mobility, household responsibilities, social expectations, and confidence.

These considerations framed the interpretation: access to a financial scheme does not, by itself, explain whether someone can make use of it.

## Reading the results in context

Twitter users did not necessarily represent the rural women the initiative aimed to serve, particularly those without reliable internet access. The sentiment model also crossed domains, moving from movie-review training material to financial-policy discussion.

The two analyses therefore offered partial perspectives. Lending figures described program activity; tweet classifications described sampled discussion. Neither independently established a causal improvement in financial literacy, independence, or wellbeing.

## Beyond the paper

Through a partnership with Saksharta spanning both of my research projects, I helped deliver educational sessions for interested girls and young women in underserved communities in Mumbai.

Alongside classes, we offered assistance, mentoring on request, and practical support for participation and learning. This was related community work, separate from the research datasets and findings.

## What I took from it

This was an early opportunity to use programming to investigate a question beyond the software itself.

Working on the analysis alongside community education made me more attentive to who appears in a dataset, who is missing, and what additional understanding comes from speaking with people directly.

## Tools and methods

Python · Tweepy · NLTK · TF-IDF · Sentiment classification · Matplotlib · Exploratory analysis of secondary financial data

## Publication reference

Jajodia, A., and Jain, R. (2022). Analyzing The Impact Of Financial Schemes In Boosting The Lives Of Female Rural Population In India. International Journal of Software & Hardware Research in Engineering, 10(9), 93–101.

<!-- INTERNAL IMPLEMENTATION NOTES — DO NOT RENDER

PUBLICATION AND ATTRIBUTION
Preserve the exact published title and both authors.
Anya was lead researcher; Reetu Jain was mentor and co-author.
Do not imply sole authorship or a university affiliation for this 2022 work.
Keep one complete publication reference.
Do not restore a separate, repetitive publication-metadata section.

PAPER ACCESS
Add a verified publisher link if available.
A public PDF may be linked once supplied and placed in the site's assets.
Do not invent a DOI, URL, repository, or download path.
Do not render TODO links or nonfunctional buttons.

METHODS DIAGRAM
Retain or refine the existing two-strand diagram:
1. Secondary PMMY data → exploratory analysis → category/year comparisons.
2. Twitter collection → text preparation → TF-IDF → sentiment classification.

Show movie-review data separately as the sentiment model's training material.
Do not imply that PMMY financial records trained the sentiment model.
The strands support interpretation alongside one another; do not depict a
dataset merge, causal inference, or combined predictive model.

Text preparation reported in the paper includes segmentation, lemmatization,
and chunking. Keep detailed labels concise.
Do not invent a classifier algorithm, evaluation score, or collection dates.
The diagram replaces a separate five-subsection methods walkthrough.

SENTIMENT FIGURE
Use accessible HTML/SVG or the site's existing chart tools.
Do not use AI-generated imagery for charts.

Data:
Positive: 78%
Neutral: 12%
Negative: 10%
Sample: 1,000 PMMY-related tweets.

Use directly labeled horizontal bars.

Caption:
"Sentiment classifications reported in the paper for a sample of 1,000
PMMY-related tweets. Results describe the collected sample, not the wider population."

Preserve an accessible table equivalent.
Avoid rendering the chart and table as two equally prominent, repetitive blocks.
Never label these values as model accuracy or population approval.

FINANCIAL FINDINGS
Some category values and totals in the published tables appear inconsistent.
The retained trend is a qualitative summary reported by the paper.
Do not add precise financial values or redraw financial charts until checked.
If verification contradicts the summary, flag it for revision.
Do not silently correct, combine, or extrapolate inconsistent values.

INTERPRETATION
Distinguish analytical findings from barriers discussed through literature.
Do not imply the study directly measured every barrier listed.
Keep qualifications concentrated in the figure caption and scope section.
Do not add repeated disclaimers throughout the page.

OUTREACH
Community partner: Saksharta, spanning both research projects.
Activities: educational sessions, assistance, mentoring on request,
and practical support.
Do not restore claims of securing loans for 50+ women.
Do not import Project Ārogya's participant count or session-leadership claims.
Do not invent measured outreach outcomes.
A concise link to the companion research page may connect the partnership.

DESIGN
Retain the existing research accent palette, shared typography, thread motif,
theme controls, work drawer, and companion-paper navigation