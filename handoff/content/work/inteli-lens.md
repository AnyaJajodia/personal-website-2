# Inteli-lens

## Could movement reveal signs of impairment?

An independent computer-vision experiment exploring whether walking patterns
and body language could help identify possible intoxication.

**Type:** Independent project  
**Year:** 2022  
**Tools:** Python · JupyterLab · OpenCV · TensorFlow

## The idea

I built Inteli-lens to explore computer vision and find out whether it was a
field I wanted to pursue. Inspired in part by the case of Kenneka Jenkins and
concerns about impaired driving, I became interested in whether a camera could
identify visible signs that someone might be intoxicated.

The idea was to analyze walking patterns and body language in video, producing
an estimated likelihood of intoxication. I imagined a possible application in
parking lots: if the system flagged someone before they entered the driver’s
seat, they could be offered a breath alcohol test before leaving.

## Building the prototype

Working independently in JupyterLab, I experimented with Python, OpenCV, and
TensorFlow to explore video-based detection. The prototype detected people and
displayed an estimated likelihood that changed as their movement was analyzed.

The biggest limitation was data. Footage of people walking with reliable
information about whether they were sober or intoxicated was difficult to find,
leaving a small dataset to train and evaluate the model. I explored ways to
prepare and vary the available data, but the project remained an early
experiment rather than a validated tool for assessing impairment.

## Looking back

Inteli-lens was an early opportunity to take an idea from a question to a
working experiment. It showed me both the possibilities of computer vision
and how much a model depends on having the right data.

*More details to come as I revisit the original project materials.*

---

<!-- INTERNAL IMPLEMENTATION NOTES — DO NOT RENDER

PROJECT SCOPE
Independent project from 2022. The parking-lot intervention was a proposed
application, not a deployed workflow. Do not claim the model measured blood
alcohol concentration or was validated for use in assessing impairment.

TECHNICAL DETAILS
Older résumé versions mention Python, OpenCV, TensorFlow, data preprocessing
and augmentation, as well as PyQt5, FFmpeg, and SQLite. The latter tools and
their exact roles have not yet been confirmed against the original project.
Keep the public technical description brief; do not invent an architecture,
numerical accuracy, dataset size, or evaluation results.

IMAGE
The available archival screenshot shows a Jupyter notebook and object-detection
labels, but it is blurry and does not clearly show an intoxication result.
The page may launch without an image. If the screenshot is used later, crop
the black border and caption it "An early video-detection experiment in
Jupyter." Do not portray the visible labels as intoxication classifications
or evidence of model accuracy.

DESIGN
Keep the page compact and intentional, with a brief "more details to come"
note. Preserve the shared portfolio navigation, typography, thread motif,
and theme controls.

Use restrained Inteli-lens lavender and plum accents:
Light accent: #8B78A2
Light deep accent: #51415E
Dark accent: #C4AFD4

Use the portfolio's existing cream and dark backgrounds. Accent labels,
thread, borders, or a subtle detection-box motif. No elaborate architecture
diagram or long table of contents.

END INTERNAL NOTES -->