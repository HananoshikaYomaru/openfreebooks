+++
title = "Permutations, combinations & probability"
description = "Count outcomes with permutations and combinations, then compute probabilities in finite sample spaces."
template = "chapter.html"
weight = 33
[extra]
subject = "math"
chapter_id = "permutations-combinations-probability"
strand = "Data Handling"
+++

<div class="book-prose">
  <p>
    Counting methods make probability efficient when listing all outcomes is impractical.
  </p>

  <h2 id="factorial" class="book-prose__heading">Factorial</h2>
  <p class="book-formula">\[
    n!=n(n-1)(n-2)\cdots 1,\quad 0!=1.
  \]</p>

  <h2 id="permutations" class="book-prose__heading">Permutations (order matters)</h2>
  <p class="book-formula">\[
    {}_nP_r=\frac{n!}{(n-r)!}.
  \]</p>
  <p>
    Use for arrangements where position/order is important.
  </p>

  <h2 id="combinations" class="book-prose__heading">Combinations (order not important)</h2>
  <p class="book-formula">\[
    {}_nC_r=\frac{n!}{r!(n-r)!}.
  \]</p>
  <p>
    Use for selections/groups.
  </p>

  <h2 id="probability-counting" class="book-prose__heading">Probability with counting</h2>
  <p class="book-formula">\[
    P(E)=\frac{\text{count of favorable outcomes}}{\text{count of all outcomes}}.
  \]</p>

  <h2 id="with-without-replacement" class="book-prose__heading">With/without replacement</h2>
  <ul>
    <li><strong>With replacement:</strong> probabilities stay same each draw.</li>
    <li><strong>Without replacement:</strong> probabilities change each draw.</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>First decide: arrangement or selection?</li>
    <li>Check if repetitions are allowed.</li>
    <li>Use structured counting (tree/cases) for restrictions.</li>
    <li>Simplify probability fractions at end.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Compute \({}_7P_3\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(7\times6\times5=210\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Compute \({}_8C_2\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac{8\cdot7}{2}=28\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">How many 3-letter arrangements from A,B,C,D (no repeats)?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \({}_4P_3=24\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">How many ways to choose 3 students from 10?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \({}_{10}C_3=120\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A 5-card hand from 52 cards: probability all hearts.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac{{}_{13}C_5}{{}_{52}C_5}\).</p>
    </div>
  </details>
</div>
