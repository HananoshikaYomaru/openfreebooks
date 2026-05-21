+++
title = "Charts & averages"
description = "Organise data with tables and charts and calculate mean, median, and mode."
template = "chapter.html"
weight = 30
[extra]
subject = "math"
chapter_id = "statistical-charts-averages"
strand = "Data Handling"
+++

<div class="book-prose">
  <p>
    Data handling starts with organizing data clearly, choosing suitable charts, and summarizing a
    dataset with averages.
  </p>

  <h2 id="data-tables" class="book-prose__heading">Frequency tables</h2>
  <p>
    A frequency table records each value (or class interval) and how often it appears.
    For grouped data, use class midpoints for estimation.
  </p>

  <h2 id="common-charts" class="book-prose__heading">Common charts</h2>
  <ul>
    <li><strong>Bar chart:</strong> categorical comparisons.</li>
    <li><strong>Histogram:</strong> continuous grouped data (touching bars).</li>
    <li><strong>Line graph:</strong> change over time.</li>
    <li><strong>Pie chart:</strong> part-to-whole proportions.</li>
    <li><strong>Box plot:</strong> spread via quartiles and median.</li>
  </ul>

  <h2 id="mean-median-mode" class="book-prose__heading">Mean, median, and mode</h2>
  <p class="book-formula">\[
    \text{Mean}=\frac{\text{sum of values}}{\text{number of values}}.
  \]</p>
  <p>
    <strong>Median</strong> is middle value when ordered. <strong>Mode</strong> is most frequent value.
  </p>

  <h2 id="weighted-mean" class="book-prose__heading">Mean from frequency table</h2>
  <p class="book-formula">\[
    \bar{x}=\frac{\sum fx}{\sum f}.
  \]</p>
  <p>
    where \(x\) is value (or midpoint), \(f\) is frequency.
  </p>

  <h2 id="which-average" class="book-prose__heading">Choosing an average</h2>
  <ul>
    <li>Use <strong>mean</strong> when data has no extreme outliers.</li>
    <li>Use <strong>median</strong> when distribution is skewed.</li>
    <li>Use <strong>mode</strong> for most common category/value.</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Label axes and units clearly on charts.</li>
    <li>Check scale intervals before reading values.</li>
    <li>Order data before finding median and quartiles.</li>
    <li>State if an answer is estimated from grouped data.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Find mean of 4, 7, 7, 10, 12.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac{40}{5}=8\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find median of 5, 2, 9, 4, 11, 6.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Order: 2,4,5,6,9,11. Median \(=\frac{5+6}{2}=5.5\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find mode of 3, 5, 5, 5, 8, 8, 9.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> 5.</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">For values 1,2,3 with frequencies 4,5,1, find mean.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\bar{x}=\frac{1(4)+2(5)+3(1)}{10}=\frac{17}{10}=1.7\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Which average is best for house prices with extreme luxury homes?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Median (less affected by outliers).</p>
    </div>
  </details>
</div>
