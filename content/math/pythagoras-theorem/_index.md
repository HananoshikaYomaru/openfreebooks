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
  <p>Discover, geometrically prove, and apply the Pythagorean Theorem.</p>
  <p>
    Imagine you are helping an architect build a scale model of a sculpture. One triangular frame is
    a right triangle with legs 9 ft and 12 ft. How long is the third side?
  </p>

  <h2 id="theorem" class="book-prose__heading">Pythagorean Theorem</h2>
  <p>In any right triangle with legs \(a\) and \(b\), and hypotenuse \(c\):</p>
  <p class="book-formula">\[
    a^2 + b^2 = c^2
  \]</p>
  <p>
    The hypotenuse is opposite the right angle, so it is always the longest side.
  </p>

  <h2 id="right-triangle-labels" class="book-prose__heading">Right triangle labels</h2>
  <p>We usually name vertices with uppercase letters and opposite sides with matching lowercase letters.</p>
  <p>
    <svg
      viewBox="0 0 320 220"
      width="320"
      height="220"
      role="img"
      aria-label="Right triangle with vertices A, B, C and side labels a, b, c"
    >
      <title>Right triangle with labels</title>
      <line x1="40" y1="180" x2="260" y2="180" stroke="currentColor" stroke-width="3"></line>
      <line x1="40" y1="180" x2="40" y2="40" stroke="currentColor" stroke-width="3"></line>
      <line x1="40" y1="40" x2="260" y2="180" stroke="currentColor" stroke-width="3"></line>
      <rect x="40" y="160" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"></rect>
      <text x="28" y="195" font-size="16" fill="currentColor">A</text>
      <text x="265" y="195" font-size="16" fill="currentColor">B</text>
      <text x="28" y="35" font-size="16" fill="currentColor">C</text>
      <text x="145" y="202" font-size="16" fill="currentColor">a</text>
      <text x="16" y="118" font-size="16" fill="currentColor">b</text>
      <text x="145" y="100" font-size="16" fill="currentColor">c</text>
      <text x="64" y="158" font-size="14" fill="currentColor">90°</text>
    </svg>
  </p>

  <h2 id="finding-side-lengths" class="book-prose__heading">Finding side lengths</h2>
  <h3 id="find-hypotenuse" class="book-prose__heading">Find the hypotenuse</h3>
  <p><strong>Example.</strong> If \(a=9\) and \(b=12\), find \(c\).</p>
  <p class="book-formula">\[
    \begin{aligned}
      c &= \sqrt{9^2 + 12^2} \\
        &= \sqrt{81 + 144} \\
        &= \sqrt{225} \\
        &= 15
    \end{aligned}
  \]</p>
  <p>The third side is 15 ft.</p>

  <h3 id="find-leg" class="book-prose__heading">Find a missing leg</h3>
  <p><strong>Example.</strong> If \(c=13\) and \(a=5\), find \(b\).</p>
  <p class="book-formula">\[
    \begin{aligned}
      b &= \sqrt{c^2 - a^2} \\
        &= \sqrt{13^2 - 5^2} \\
        &= \sqrt{169 - 25} \\
        &= \sqrt{144} \\
        &= 12
    \end{aligned}
  \]</p>

  <h3 id="radical-form" class="book-prose__heading">Leave answers in simplest radical form</h3>
  <p><strong>Example.</strong> If \(c=10\) and \(a=2\), find \(b\).</p>
  <p class="book-formula">\[
    \begin{aligned}
      b &= \sqrt{10^2 - 2^2} \\
        &= \sqrt{100 - 4} \\
        &= \sqrt{96} \\
        &= \sqrt{16 \cdot 6} \\
        &= 4\sqrt{6}
    \end{aligned}
  \]</p>

  <h2 id="common-pitfall" class="book-prose__heading">Common pitfall</h2>
  <p>
    When solving \(c^2=289\), the equation has two numerical roots (\(\pm 17\)), but side lengths in
    geometry are nonnegative. So the triangle side is \(17\), not \(-17\).
  </p>

  <h2 id="converse" class="book-prose__heading">Converse of the theorem</h2>
  <p>
    If three side lengths satisfy \(a^2+b^2=c^2\), then the triangle is right-angled.
  </p>
  <p><strong>Example:</strong> \(7,24,25\) because \(7^2+24^2=49+576=625=25^2\).</p>

  <h2 id="coordinate-geometry" class="book-prose__heading">Coordinate geometry use</h2>
  <p>Distance between points \(A(x_1,y_1)\) and \(B(x_2,y_2)\):</p>
  <p class="book-formula">\[
    AB=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}
  \]</p>
  <p>This is Pythagoras applied to horizontal and vertical change.</p>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li>Diagonal of squares and rectangles.</li>
    <li>Ladders, ramps, and roof braces in construction.</li>
    <li>Map/grid displacement and shortest straight-line paths.</li>
    <li>Checking if a corner is exactly \(90^\circ\).</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    The theorem is associated with Pythagoras, but right-triangle relationships appeared in earlier
    Babylonian, Egyptian, and Indian mathematics. In Euclidean geometry, the theorem became a central
    tool for proof, measurement, and construction.
  </p>

  <h2 id="geometric-proof" class="book-prose__heading">Geometric proof by area</h2>
  <p>
    Build a large square of side length \(a+b\). Place four identical right triangles (legs \(a,b\),
    hypotenuse \(c\)) inside it so the uncovered center is a square of side \(c\).
  </p>
  <div class="math-widget-mount" data-widget="area-proof-demo" data-pagefind-ignore></div>
  <p>
    Area of big square: \((a+b)^2\). Area of the same figure as pieces:
    \(4\left(\frac{1}{2}ab\right)+c^2=2ab+c^2\). Set them equal:
  </p>
  <p class="book-formula">\[
    (a+b)^2 = 2ab + c^2
  \]</p>
  <p class="book-formula">\[
    a^2 + 2ab + b^2 = 2ab + c^2
  \]</p>
  <p class="book-formula">\[
    a^2 + b^2 = c^2
  \]</p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">If the legs are 3 and 4, what is the hypotenuse?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(c=\sqrt{3^2+4^2}=\sqrt{25}=5\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If the legs are 6 and 8, what is the hypotenuse?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(c=\sqrt{6^2+8^2}=\sqrt{100}=10\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If the legs are 5 and 12, what is the hypotenuse?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(c=\sqrt{5^2+12^2}=\sqrt{169}=13\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A square has side length 6. Find its diagonal.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(d=\sqrt{6^2+6^2}=\sqrt{72}=6\sqrt{2}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A square has side length 9. Find its diagonal.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(d=\sqrt{9^2+9^2}=\sqrt{162}=9\sqrt{2}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If one leg is 4 and the hypotenuse is 8, find the other leg.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\sqrt{8^2-4^2}=\sqrt{64-16}=\sqrt{48}=4\sqrt{3}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If one leg is 10 and the hypotenuse is 15, find the other leg.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\sqrt{15^2-10^2}=\sqrt{225-100}=\sqrt{125}=5\sqrt{5}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">For legs \(x\) and \(y\), write the hypotenuse.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(c=\sqrt{x^2+y^2}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Using the proof figure, explain why \((a+b)^2\) and \(2ab+c^2\) must be equal.</summary>
    <div class="book-question__solution">
      <p>
        <strong>Answer:</strong> They are two area expressions for the same large square: one as a full
        square of side \(a+b\), and one as four right triangles plus the center square of side \(c\).
      </p>
    </div>
  </details>

  <h2 id="vocabulary" class="book-prose__heading">Vocabulary</h2>
  <table>
    <thead>
      <tr>
        <th>Term</th>
        <th>Definition</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Right triangle</strong></td>
        <td>A triangle with one angle equal to \(90^\circ\).</td>
      </tr>
      <tr>
        <td><strong>Legs</strong></td>
        <td>The two sides that form the right angle.</td>
      </tr>
      <tr>
        <td><strong>Hypotenuse</strong></td>
        <td>The side opposite the right angle; the longest side in a right triangle.</td>
      </tr>
      <tr>
        <td><strong>Pythagorean Theorem</strong></td>
        <td>The relationship \(a^2+b^2=c^2\) for right triangles.</td>
      </tr>
    </tbody>
  </table>
</div>
