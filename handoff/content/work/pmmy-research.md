# PMMY & women’s financial empowerment

## Policy, data, and lived consequences.

Investigating women’s access to enterprise finance through PMMY lending data and public sentiment.

Role: Lead Researcher
Year: 2022
Mentor and co-author: Reetu Jain
Publication: International Journal of Software & Hardware Research in Engineering (IJSHRE)

## The question

What can financial-program data and public discussion tell us about an initiative intended to support women’s entrepreneurship?

This research examined Pradhan Mantri Mudra Yojana (PMMY), an Indian government initiative supporting access to credit for micro-enterprises.

I brought together two approaches: exploratory analysis of lending data and NLP-based sentiment analysis of Twitter discussion. The aim was to investigate the scheme’s reach and reception while considering the wider barriers surrounding women’s financial independence.

## About the publication

Published title: Analyzing The Impact Of Financial Schemes In Boosting The Lives Of Female Rural Population In India

Authors: Anya Jajodia and Reetu Jain
Journal: IJSHRE
Volume: 10
Issue: 9
Published: September 2022
Pages: 93–101

I led the research with mentorship from Reetu Jain, who is also credited as a co-author.

## Two sources of evidence

### Financial-program data

I examined secondary data covering financial years 2015–16 through 2021–22, drawing on PMMY sources and existing research.

The analysis considered loan accounts and sanctioned, disbursed, and outstanding amounts across the scheme’s Shishu, Kishore, and Tarun categories as they were defined during the study period.

Looking at the categories separately helped reveal differences that an overall total could obscure.

### Public discussion

I also analyzed a sample of 1,000 recent PMMY-related tweets to explore how the initiative was discussed online.

This provided a different kind of evidence: expressed sentiment in a particular social-media sample, rather than a direct measurement of borrowers’ experiences or policy outcomes.

## My contribution

I led the study, carried out the exploratory data analysis and Python-based sentiment-analysis work, developed visualizations, and wrote the paper with guidance from my mentor.

The project involved working across quantitative program data, text collected from Twitter, and literature on financial inclusion and barriers to women’s entrepreneurship.

## From tweets to sentiment

### 01 · Collect

I used Tweepy to collect PMMY-related tweets for analysis.

The study considered a sample of 1,000 recent tweets rather than a representative survey of the population.

### 02 · Prepare the text

The NLP workflow used Python’s NLTK library. The paper describes preprocessing through segmentation, lemmatization, and chunking to prepare the text for analysis.

### 03 · Represent the language

TF-IDF converted text into numerical features, representing the relative importance of terms within the collection.

### 04 · Classify

A sentiment model trained using movie-review data was applied to the PMMY tweet sample, classifying sentiment as positive, neutral, or negative.

### 05 · Interpret

I examined the resulting distribution alongside the financial-program analysis, considering what each source could contribute to the research question.

## What the study found

### Different lending categories followed different trajectories

The financial analysis showed variation across loan categories and years.

Reported overall disbursement increased across the study period, with a decline in financial year 2020–21 followed by a recovery in 2021–22.

The paper discusses the pandemic as a possible context for the decline. The descriptive analysis does not isolate its causal effect.

### The sampled discussion was predominantly positive

The paper reports the following sentiment classifications:

| Classification | Share of the 1,000-tweet sample |
| --- | --- |
| Positive | 78% |
| Neutral | 12% |
| Negative | 10% |

These figures describe classifications within the collected sample. They are not population-wide approval ratings or model-accuracy scores.

### Access involves more than the availability of credit

The paper also discusses barriers surrounding education, skills, social expectations, mobility, household responsibilities, and confidence.

These considerations helped frame the financial data within a broader question: what conditions allow someone to make use of an opportunity?

The lending analysis and sentiment results offered partial perspectives on that question, rather than a complete measurement of empowerment.

## Beyond the paper
### Community education with Saksharta

Through a partnership with Saksharta spanning both of my research projects, I helped provide educational sessions for interested girls and young women in underserved communities in Mumbai.

Alongside classes, we offered assistance, mentoring sessions on request, and practical support for participation and learning.

This work created another way to engage with the topics behind the research, through conversation, education, and ongoing guidance.

The outreach was related community work, separate from the paper’s datasets and research findings.

## What the evidence could—and couldn’t—tell us

The paper explicitly recognizes that Twitter discussion may not represent the rural population the initiative aims to serve. People without reliable internet access are less likely to appear in the sample.

The sentiment model also moved between domains: it was trained on movie reviews and applied to discussion of a financial policy. That difference matters when interpreting its classifications.

Lending figures describe program activity. Online sentiment describes a sample of public discussion. Neither independently establishes a causal improvement in financial literacy, independence, or long-term wellbeing.

Keeping those distinctions clear is important to understanding the study’s scope.

## Tools and methods

| Area | Tools and approach |
| --- | --- |
| Programming | Python |
| Financial analysis | Exploratory data analysis of secondary data |
| Text collection | Tweepy |
| Language processing | NLTK |
| Text representation | TF-IDF |
| Sentiment analysis | Positive, neutral, and negative classification |
| Training material | Movie-review sentiment dataset |
| Visualization | Matplotlib |

## What I took from it

This project gave me an early opportunity to use programming to investigate a question beyond the software itself.

It also made the limits of a dataset tangible. A large amount of available information can still leave out the people whose experiences matter most to the question.

Working on the analysis alongside community education encouraged me to think more carefully about the relationship between measurable activity, expressed opinion, and lived experience.

## Publication reference

Jajodia, A., and Jain, R. (2022). Analyzing The Impact Of Financial Schemes In Boosting The Lives Of Female Rural Population In India. International Journal of Software & Hardware Research in Engineering, 10(9), 93–101.

---

<!-- INTERNAL IMPLEMENTATION NOTES — DO NOT RENDER

PUBLICATION AND ATTRIBUTION
Preserve the exact published title and both authors.
Anya was lead researcher; Reetu Jain was mentor and co-author.
Do not imply sole authorship or university affiliation for this 2022 work.

PAPER ACCESS
Use a verified publisher URL if supplied or independently verified.
A public PDF link may be added once the paper is placed in the site's assets.
Do not invent a DOI, URL, repository, or download path.
Do not display TODO links or nonfunctional buttons.

VISUALS — NO ADDITIONAL IMAGES REQUIRED
Build the methods diagram and sentiment chart using accessible HTML/SVG
or the site's existing chart tools. Do not use AI-generated images for graphs.

Sentiment data:
Positive: 78%
Neutral: 12%
Negative: 10%
Sample: 1,000 PMMY-related tweets.

Chart caption:
"Sentiment classifications reported in the paper for a sample of 1,000
PMMY-related tweets. Results describe the collected sample, not the wider population."

Use directly labeled horizontal bars and retain an accessible data table.
Do not represent percentages as classifier accuracy.

METHODS DIAGRAM
Show two analysis strands:
1. Secondary PMMY data → exploratory analysis → category/year comparisons.
2. Twitter collection → text preparation → TF-IDF → sentiment classification.
Explain that movie-review data supplied the sentiment model's training material.
Do not invent a classifier algorithm, evaluation score, or data-collection dates.

FINANCIAL FIGURES
Some category values and totals in the published tables appear inconsistent.
Do not redraw a financial trend chart until the figures have been checked.
Do not silently correct or combine inconsistent values.

OUTREACH
Use Saksharta as the community partner across both research projects.
Activities: classes, assistance, mentoring on request, and practical support.
Do not restore the earlier claim of securing loans for 50+ women.
Do not invent participant counts or measured outreach outcomes.

DESIGN
Present a readable research case study, with methods, findings, limitations,
contribution, and publication details.
Preserve the portfolio's typography, thread motif, theme controls, and work drawer.
Use restrained research/publication accents and purposeful figures.
No stock photographs of beneficiaries or fabricated outreach photographs.
Any later supplied community images must be appropriate for public sharing.

END INTERNAL NOTES -->