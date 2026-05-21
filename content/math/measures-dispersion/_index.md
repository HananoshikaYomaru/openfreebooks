+++
title = "Measures of dispersion"
description = "Interpret range, interquartile range, variance, and standard deviation for comparing data sets."
template = "chapter.html"
weight = 31
[extra]
subject = "math"
chapter_id = "measures-dispersion"
strand = "Data Handling"
+++

<div class="book-prose">
  <p>
    Dispersion describes how spread out data is. Two datasets can have the same average but very
    different variability.
  </p>

  <h2 id="range-iqr" class="book-prose__heading">Range and interquartile range</h2>
  <p class="book-formula">\[
    \text{Range}=\text{max}-\text{min},\qquad
    \text{IQR}=Q_3-Q_1.
  \]</p>
  <p>
    IQR is less affected by outliers than range.
  </p>

  <h2 id="variance-sd" class="book-prose__heading">Variance and standard deviation</h2>
  <p>
    Variance measures average squared distance from mean.
    Standard deviation is square root of variance and has same unit as data.
  </p>
  <p class="book-formula">\[
    \sigma=\sqrt{\frac{\sum (x-\bar{x})^2}{n}}
  \]</p>

  <h2 id="comparing-data" class="book-prose__heading">Comparing datasets</h2>
  <ul>
    <li>Smaller spread statistics \(\Rightarrow\) more consistent data.</li>
    <li>Use median + IQR for skewed data.</li>
    <li>Use mean + standard deviation for roughly symmetric data.</li>
  </ul>

  <h2 id="boxplot-reading" class="book-prose__heading">Box plot interpretation</h2>
  <p>
    Box shows middle 50% (\(Q_1\) to \(Q_3\)); median line marks center.
    Longer whisker/box indicates larger spread.
  </p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>State both center and spread when comparing sets.</li>
    <li>Do not confuse variance with standard deviation.</li>
    <li>Check if grouped-data values are estimates.</li>
    <li>Interpret spread in context (consistency/risk).</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Find range of 12, 9, 15, 20, 13.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(20-9=11\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If \(Q_1=18\), \(Q_3=31\), find IQR.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> 13.</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Dataset A and B have same mean. A has SD 2, B has SD 8. Which is more consistent?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> A (smaller SD).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Why is IQR preferred over range when outliers exist?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> IQR focuses on middle 50% and is less distorted by extreme values.</p>
    </div>
  </details>
</div>
