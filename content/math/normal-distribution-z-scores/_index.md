+++
title = "Normal distribution & z-scores"
description = "Model continuous data with the normal curve, standardise with z-scores, and read probabilities from tables."
template = "chapter.html"
weight = 34
[extra]
subject = "math"
chapter_id = "normal-distribution-z-scores"
strand = "Data Handling"
+++

<div class="book-prose">
  <p>
    The normal distribution is a symmetric bell-shaped model for many real measurements.
  </p>

  <h2 id="normal-model" class="book-prose__heading">Normal model basics</h2>
  <p>
    A normal variable \(X\sim N(\mu,\sigma^2)\) has mean \(\mu\) and standard deviation \(\sigma\).
  </p>
  <ul>
    <li>About 68% of values lie within \(\mu\pm\sigma\).</li>
    <li>About 95% lie within \(\mu\pm2\sigma\).</li>
    <li>About 99.7% lie within \(\mu\pm3\sigma\).</li>
  </ul>

  <h2 id="z-score" class="book-prose__heading">Standardizing with z-score</h2>
  <p class="book-formula">\[
    z=\frac{x-\mu}{\sigma}.
  \]</p>
  <p>
    This converts values to the standard normal \(Z\sim N(0,1)\).
  </p>

  <h2 id="probabilities" class="book-prose__heading">Finding probabilities</h2>
  <ol>
    <li>Convert boundary value(s) to z-score(s).</li>
    <li>Use normal table/calculator for area.</li>
    <li>Apply complement or subtraction if needed.</li>
  </ol>

  <h2 id="reverse-normal" class="book-prose__heading">Finding values from probabilities</h2>
  <p>
    If \(P(X\le x)=p\), find corresponding \(z_p\), then:
  </p>
  <p class="book-formula">\[
    x=\mu+z_p\sigma.
  \]</p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Draw a quick bell curve and shade required region.</li>
    <li>Label mean, SD marks, and inequality direction.</li>
    <li>Use continuity correction when question requires discrete-to-normal approximation.</li>
    <li>Round only at final step.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">If \(\mu=70,\sigma=10\), find z-score of \(x=85\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(z=\frac{85-70}{10}=1.5\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If \(z=-0.8\), \(\mu=50,\sigma=5\), find \(x\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(x=50+(-0.8)(5)=46\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">In a normal model, what does \(P(Z&gt;2)\) represent?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Area to the right of z=2 (upper-tail probability).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Why do we standardize before using z-tables?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Tables are for \(N(0,1)\), so we convert \(X\) to \(Z\).</p>
    </div>
  </details>
</div>
