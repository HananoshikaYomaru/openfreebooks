+++
title = "Variations"
description = "Model direct, inverse, joint, and partial variation and solve combined variation problems."
template = "chapter.html"
weight = 18
[extra]
subject = "math"
chapter_id = "variations"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    Variation describes how one quantity changes with another. It turns word statements into useful
    algebraic models.
  </p>

  <h2 id="direct-variation" class="book-prose__heading">Direct variation</h2>
  <p>
    \(y\) varies directly as \(x\):
    \[
    y\propto x \quad\Rightarrow\quad y=kx
    \]
    where \(k\) is the constant of variation.
  </p>
  <p><strong>Example:</strong> If \(y=18\) when \(x=6\), then \(k=3\), so \(y=3x\).</p>

  <h2 id="inverse-variation" class="book-prose__heading">Inverse variation</h2>
  <p>
    \(y\) varies inversely as \(x\):
    \[
    y\propto\frac1x \quad\Rightarrow\quad y=\frac{k}{x}.
    \]
  </p>
  <p><strong>Example:</strong> If \(y=5\) when \(x=4\), then \(k=20\), so \(y=\frac{20}{x}\).</p>

  <h2 id="power-variation" class="book-prose__heading">Variation with powers</h2>
  <p>
    You may see statements like:
  </p>
  <ul>
    <li>\(y\propto x^2 \Rightarrow y=kx^2\)</li>
    <li>\(y\propto \sqrt{x} \Rightarrow y=k\sqrt{x}\)</li>
    <li>\(y\propto \frac{1}{x^2} \Rightarrow y=\frac{k}{x^2}\)</li>
  </ul>

  <h2 id="joint-variation" class="book-prose__heading">Joint variation</h2>
  <p>
    If \(y\) varies jointly as \(x\) and \(z\):
    \[
    y\propto xz \Rightarrow y=kxz.
    \]
  </p>
  <p><strong>Example:</strong> \(y=24\) when \(x=2,z=3\Rightarrow k=4\), so \(y=4xz\).</p>

  <h2 id="partial-variation" class="book-prose__heading">Partial variation</h2>
  <p>
    If \(y\) varies partly as \(x\), model has constant and variable part:
    \[
    y=mx+c,\quad c\ne0.
    \]
  </p>
  <p>
    This appears in pricing: fixed fee + per-unit charge.
  </p>

  <h2 id="solving-workflow" class="book-prose__heading">Solving workflow</h2>
  <ol>
    <li>Translate words into proportional equation with \(k\).</li>
    <li>Use given data to find \(k\).</li>
    <li>Substitute required values to answer question.</li>
    <li>Check units and reasonableness.</li>
  </ol>

  <h2 id="word-problems" class="book-prose__heading">Common word-problem forms</h2>
  <ul>
    <li>“\(A\) is directly proportional to \(B\)”</li>
    <li>“\(A\) varies inversely as \(B\)”</li>
    <li>“\(A\) varies jointly as \(B\) and \(C\)”</li>
    <li>“\(A\) varies directly as square/cube of \(B\)”</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Always introduce \(k\) first before substituting numbers.</li>
    <li>Keep symbolic form until \(k\) is found.</li>
    <li>For inverse models, domain often excludes zero.</li>
    <li>State final answer with units when applicable.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Variation models grew from early physics and astronomy, where scientists needed formulas for how
    one quantity depends on another. The language of proportionality became a bridge between algebra
    and real measurements.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="why-constant-k" class="book-prose__heading">Why we use a constant \(k\)</h3>
  <p>
    “Directly proportional” means ratio \(\frac{y}{x}\) stays constant, so \(\frac{y}{x}=k\) and
    \(y=kx\). For inverse variation, product \(xy\) stays constant, so \(xy=k\).
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">If \(y\propto x\) and \(y=15\) when \(x=3\), find \(y\) when \(x=10\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(k=5\Rightarrow y=5x\Rightarrow y=50\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If \(y\propto \frac1x\) and \(y=8\) when \(x=5\), find \(y\) when \(x=20\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(k=40\Rightarrow y=\frac{40}{x}\Rightarrow y=2\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">\(y\) varies as \(x^2\). If \(y=27\) when \(x=3\), find \(y\) when \(x=5\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(y=kx^2,\ k=3\Rightarrow y=3(25)=75\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">\(y\) varies jointly as \(x\) and \(z\). If \(y=30\) when \(x=3,z=2\), find \(y\) when \(x=5,z=4\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(y=kxz,\ k=5\Rightarrow y=5(5)(4)=100\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A taxi fare \(F\) varies partly as distance \(d\): \(F=md+c\). If \(F=26\) at \(d=8\), and \(F=38\) at \(d=14\), find \(m,c\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Solve two equations: \(8m+c=26,\ 14m+c=38\).</p>
      <p>\(6m=12\Rightarrow m=2,\ c=10\). So \(F=2d+10\).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Physics:</strong> pressure, speed, and force models often use direct/inverse variation.</li>
    <li><strong>Business:</strong> cost models combine fixed and variable components.</li>
    <li><strong>Engineering:</strong> scaling laws use power variation relations.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school algebra units on direct and inverse variation.</li>
    <li>Elementary modeling texts for joint and partial variation.</li>
  </ul>
</div>
