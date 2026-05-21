+++
title = "Pythagoras' theorem"
description = "Use Pythagoras' theorem and its converse in 2D problems and coordinate settings."
template = "chapter.html"
weight = 23
[extra]
subject = "math"
chapter_id = "pythagoras-theorem"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    Pythagoras' theorem links the side lengths of a right-angled triangle. It is one of the most
    useful tools in geometry and coordinate problems.
  </p>

  <h2 id="theorem" class="book-prose__heading">Pythagoras' theorem</h2>
  <p>
    In a right triangle with legs \(a,b\) and hypotenuse \(c\):
  </p>
  <p class="book-formula">\[
    a^2+b^2=c^2.
  \]</p>
  <p>
    The hypotenuse is always the side opposite the right angle and is the longest side.
  </p>

  <h2 id="finding-missing-side" class="book-prose__heading">Finding a missing side</h2>
  <p><strong>Example 1.</strong> If \(a=6\), \(b=8\), then:</p>
  <p class="book-formula">\[
    c=\sqrt{6^2+8^2}=\sqrt{36+64}=\sqrt{100}=10.
  \]</p>
  <p><strong>Example 2.</strong> If \(c=13\), \(a=5\), then:</p>
  <p class="book-formula">\[
    b=\sqrt{13^2-5^2}=\sqrt{169-25}=\sqrt{144}=12.
  \]</p>

  <h2 id="converse" class="book-prose__heading">Converse of Pythagoras</h2>
  <p>
    If side lengths satisfy \(a^2+b^2=c^2\), the triangle is right-angled.
  </p>
  <p>
    Example: \(7,24,25\) gives \(7^2+24^2=49+576=625=25^2\), so right-angled.
  </p>

  <h2 id="classify-triangle" class="book-prose__heading">Classifying triangle type</h2>
  <p>
    For largest side \(c\):
  </p>
  <ul>
    <li>\(a^2+b^2=c^2\): right triangle.</li>
    <li>\(a^2+b^2&gt;c^2\): acute triangle.</li>
    <li>\(a^2+b^2&lt;c^2\): obtuse triangle.</li>
  </ul>

  <h2 id="coordinate-use" class="book-prose__heading">Using in coordinate geometry</h2>
  <p>
    Distance between \(A(x_1,y_1)\) and \(B(x_2,y_2)\):
  </p>
  <p class="book-formula">\[
    AB=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}.
  \]</p>
  <p>
    This is Pythagoras applied to horizontal and vertical changes.
  </p>

  <h2 id="word-problems" class="book-prose__heading">Typical applications</h2>
  <ul>
    <li>Diagonal of rectangles/squares.</li>
    <li>Ladders against walls.</li>
    <li>Shortest straight-line distances on maps/grids.</li>
    <li>Checking whether corners are right angles in construction.</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Identify the right angle first.</li>
    <li>Label hypotenuse clearly before substitution.</li>
    <li>Keep exact surd form unless decimal is requested.</li>
    <li>Check answer size: hypotenuse must be longest.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    The theorem is named after Pythagoras, but knowledge of right-triangle relationships existed in
    earlier Babylonian and Indian mathematics. It became central in Euclidean geometry and later in
    coordinate methods.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="area-idea" class="book-prose__heading">Area-based proof idea</h3>
  <p>
    A classic proof rearranges four identical right triangles inside a square in two different ways.
    Equating uncovered areas leads to \(a^2+b^2=c^2\).
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Find hypotenuse if legs are 9 and 12.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(c=\sqrt{9^2+12^2}=\sqrt{225}=15\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A right triangle has hypotenuse 17 and one leg 8. Find the other leg.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\sqrt{17^2-8^2}=\sqrt{225}=15\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Are sides 10, 24, 26 right-angled?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Yes, \(10^2+24^2=100+576=676=26^2\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Distance between \((-2,1)\) and \((4,9)\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\sqrt{6^2+8^2}=10\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Rectangle has side lengths 7 and 24. Find diagonal.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\sqrt{7^2+24^2}=25\).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Architecture:</strong> checking right angles and structural diagonals.</li>
    <li><strong>Navigation:</strong> shortest displacement calculations on grid maps.</li>
    <li><strong>Computer graphics:</strong> pixel distance and vector magnitude.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school geometry curricula on Pythagoras and its converse.</li>
    <li>Classical Euclidean geometry references.</li>
  </ul>
</div>
