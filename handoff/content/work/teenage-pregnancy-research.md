# Teenage pregnancy & fertility

## Looking beyond the numbers.

Studying adolescent pregnancy and fertility in Maharashtra, then taking the research into hospital discussions and community education.

Role: Lead Researcher
Year: 2022
Mentor and co-author: Reetu Jain
Publication: International Journal of Software & Hardware Research in Engineering (IJSHRE)
Community partner: Saksharta

## The question

How do teenage pregnancy, motherhood, and fertility patterns vary across social and demographic contexts?

I investigated this question using Maharashtra data from five rounds of the National Family Health Survey (NFHS), spanning 1992–2021.

The study combined exploratory data analysis with linear regression, examining patterns across age, residence, marital status, schooling, religion, and caste and tribe.

The work continued beyond publication. I presented the research to doctors and gynecologists at Chirayu Hospital in Bhopal and developed a community education program with Saksharta.

## About the publication

Published title: Projecting Teenage Pregnancy and Motherhood and Fertility Rates: An Analytical and Machine Learning Study of Maharashtra, India

Authors: Anya Jajodia and Reetu Jain
Journal: IJSHRE
Volume: 10
Issue: 4
Published: April 2022
Pages: 95–112

I led the research with guidance from my mentor and co-author, Reetu Jain.

[Read the published paper](https://ijournals.in/wp-content/uploads/2022/08/12.IJSHRE-100413-Anya.pdf)

## Building the study

### 01 · Gather and integrate

I extracted and brought together Maharashtra data from five NFHS rounds.

The analysis considered changes over time alongside differences between demographic groups. Integrating the survey information provided a way to examine patterns beyond a single year.

### 02 · Clean and explore

I used Python, Pandas, and NumPy to organize and clean the extracted data, and Matplotlib to visualize it.

The exploratory analysis compared patterns by age, urban and rural residence, marital status, schooling, religion, and caste and tribe.

These comparisons helped identify relationships worth examining more closely and informed the interpretation of the results.

### 03 · Examine relationships

Alongside the descriptive analysis, I used linear regression to investigate the relationship between teenage marriage and pregnancy/motherhood.

The paper reports correlation and error metrics for the model. This was an analytical study of survey patterns, rather than a clinical tool for assessing an individual person.

### 04 · Interpret in context

I considered the findings alongside literature on education, early marriage, economic circumstances, and access to information and services.

The purpose was to understand how the observed patterns fit into a wider social context, while recognizing the limits of what the data could establish.

## What the analysis showed

### Declining rates did not mean uniform experiences

The study reported an overall decline in adolescent fertility across the survey period, alongside continuing differences between urban and rural populations.

Looking only at the overall trend would have concealed some of those differences.

### Schooling and marriage were important parts of the picture

The analysis found lower reported pregnancy and motherhood rates among groups with more schooling, and a strong relationship between teenage marriage and pregnancy/motherhood.

These were associations in the analyzed data. They did not establish that any single factor independently caused an outcome.

### Social context mattered

Comparisons across demographic groups reinforced the importance of considering education, residence, and social circumstances together.

The findings supported a discussion about access to education and information, rather than treating teenage pregnancy as an isolated individual decision.

## My contribution

I led the research process, including data preparation, analysis, visualization, interpretation, and writing, with mentorship from Reetu Jain.

I also took responsibility for communicating the work beyond the paper: presenting it to medical professionals, developing teaching material, and leading awareness sessions through Project Ārogya.

## From the paper to a hospital discussion

In 2022, I presented the research to a panel of doctors and gynecologists at Chirayu Hospital in Bhopal, India.

After the presentation, I led a discussion of the findings with the medical professionals attending.

The paper was also retained in the hospital’s internal database for internal use.

Presenting the study in that setting required me to explain the analysis clearly and discuss its implications with people approaching the subject through clinical experience.

## Project Ārogya
### Turning research into educational material

Through Saksharta, I developed Project Ārogya’s teaching material and was the sole leader of its teenage-pregnancy awareness sessions.

The program reached more than 200 girls through sessions in rural communities and centers operated by Saksharta.

I translated the research into lessons about early pregnancy, motherhood, and the importance of education. The work also included mentoring on request and practical assistance and support.

Saksharta’s project page records 9 September 2022 as the first in a series of awareness sessions.

The outreach was an extension of my engagement with the subject, separate from the survey analysis. Its documented reach describes participation, rather than a measured change in pregnancy rates or health outcomes.

[Explore Project Ārogya](https://www.saakshartaa.com/project-%C4%81rogya)

## Understanding the scope

The study used secondary survey data and examined patterns across groups and survey rounds.

Associations between schooling, marriage, residence, and pregnancy do not independently establish causation. The findings also should not be used to characterize every person within a demographic group.

The regression results describe the model used in the paper. They do not establish clinical validity or make the system suitable for individual medical decisions.

Similarly, the hospital presentation and internal retention of the paper should not be confused with adoption into clinical practice.

## Tools and methods

| Area | Tools and approach |
| --- | --- |
| Programming | Python |
| Data preparation | Pandas and NumPy |
| Visualization | Matplotlib |
| Data source | Five NFHS rounds, with Maharashtra data spanning 1992–2021 |
| Exploratory analysis | Trend analysis and comparisons across demographic groups |
| Modeling | Linear regression |
| Research communication | Published paper, hospital presentation, and discussion |
| Community education | Original teaching material, session leadership, mentoring, and practical support |

## What I took from it

This project involved several ways of working with the same question.

The analysis required careful handling of data. The hospital discussion required explaining the findings to people with a different kind of expertise. The awareness sessions required making the material accessible and useful to the girls participating.

Moving between those settings made me think more carefully about what it means to communicate research—and about the difference between identifying a pattern, interpreting it, and deciding what to do with it.

## Publication reference

Jajodia, A., and Jain, R. (2022). Projecting Teenage Pregnancy and Motherhood and Fertility Rates: An Analytical and Machine Learning Study of Maharashtra, India. International Journal of Software & Hardware Research in Engineering, 10(4), 95–112.

[Read the paper](https://ijournals.in/wp-content/uploads/2022/08/12.IJSHRE-100413-Anya.pdf)
[Visit Project Ārogya](https://www.saakshartaa.com/project-%C4%81rogya)

---

<!-- INTERNAL IMPLEMENTATION NOTES — DO NOT RENDER

ATTRIBUTION
Anya was lead researcher.
Reetu Jain was mentor and co-author.
Preserve both published authors.

HOSPITAL
One event in 2022: presentation followed by a discussion led by Anya.
Audience included doctors and gynecologists at Chirayu Hospital, Bhopal.
The paper was retained in the hospital's internal database for internal use.
Do not call it an annual event, a separate organized conference,
clinical validation, or adoption into treatment protocols.

PROJECT ĀROGYA
User-confirmed reach: 200+ girls.
Locations: rural communities and Saksharta-operated centers.
Anya personally developed teaching material and solely led the sessions.
Mentoring on request and practical support were also part of the program.
Do not invent measured health outcomes, participant testimonials,
session counts, or additional locations.

FIGURES
No supplied photographs are required to build the page.
Use accessible, code-rendered diagrams and charts where appropriate.
A methods diagram can show:
NFHS data → preparation → exploratory analysis / regression → interpretation.

Do not invent numerical chart data.
Before redrawing published figures, verify their values, age ranges,
denominators, and units against the paper and source data.
Do not conflate adolescent fertility measures with total fertility rate.

MODEL METRICS
The paper reports correlation coefficient 0.8537
(expressed as 85.37% in the publication), MAE 2.19, RMSE 2.72,
relative absolute error 49.442%, and root relative squared error 51.4241%.
These are different metrics, not interchangeable accuracy percentages.
Do not headline the work as "85.37% accurate."
Do not invent validation methodology or outcome units.

VISUAL DIRECTION
Use a research-editorial treatment related to the PMMY page, with its own
clear research-to-community narrative.
Preserve portfolio typography, thread motif, theme controls, and work drawer.
Hospital and outreach photography can be added later if supplied and suitable
for public sharing. Do not fabricate documentary images.

END INTERNAL NOTES -->