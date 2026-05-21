+++
title = "Introduction to trigonometry"
description = "Define sine, cosine, and tangent ratios and solve right-angled triangle problems."
template = "chapter.html"
weight = 24
[extra]
subject = "math"
chapter_id = "introduction-trigonometry"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    Trigonometry relates angles and side lengths in right triangles. The three core ratios are sine,
    cosine, and tangent.
  </p>

  <h2 id="right-triangle-ratios" class="book-prose__heading">Right-triangle ratios</h2>
  <p>
    For angle \(\theta\) in a right triangle:
  </p>
  <p class="book-formula">\[
    \sin\theta=\frac{\text{opposite}}{\text{hypotenuse}},\quad
    \cos\theta=\frac{\text{adjacent}}{\text{hypotenuse}},\quad
    \tan\theta=\frac{\text{opposite}}{\text{adjacent}}.
  \]</p>
  <p>
    Remember: opposite/adjacent depend on the chosen angle.
  </p>

  <h2 id="basic-values" class="book-prose__heading">Common exact values</h2>
  <p>
    For \(30^\circ,45^\circ,60^\circ\):
  </p>
  <ul>
    <li>\(\sin30^\circ=\frac12,\ \cos30^\circ=\frac{\sqrt3}{2},\ \tan30^\circ=\frac1{\sqrt3}\)</li>
    <li>\(\sin45^\circ=\cos45^\circ=\frac{\sqrt2}{2},\ \tan45^\circ=1\)</li>
    <li>\(\sin60^\circ=\frac{\sqrt3}{2},\ \cos60^\circ=\frac12,\ \tan60^\circ=\sqrt3\)</li>
  </ul>

  <h2 id="solve-sides" class="book-prose__heading">Finding missing sides</h2>
  <p><strong>Example.</strong> Hypotenuse \(=10\), angle \(=37^\circ\). Find opposite side \(x\):</p>
  <p class="book-formula">\[
    \sin37^\circ=\frac{x}{10}\Rightarrow x=10\sin37^\circ\approx 6.02.
  \]</p>

  <h2 id="solve-angles" class="book-prose__heading">Finding missing angles</h2>
  <p><strong>Example.</strong> Opposite \(=5\), adjacent \(=12\). Find \(\theta\):</p>
  <p class="book-formula">\[
    \tan\theta=\frac{5}{12}\Rightarrow \theta=\tan^{-1}\!\left(\frac{5}{12}\right)\approx 22.6^\circ.
  \]</p>

  <h2 id="elevation-depression" class="book-prose__heading">Angles of elevation and depression</h2>
  <p>
    Angle of elevation looks upward from horizontal; angle of depression looks downward. Draw a clear
    diagram and label horizontal lines before forming trig equations.
  </p>

  <h2 id="pythagoras-link" class="book-prose__heading">Link with Pythagoras</h2>
  <p>
    In right triangles, trigonometry and Pythagoras work together: first find one side/angle, then use
    the other method to complete the triangle.
  </p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Choose ratio from known and required sides (SOH-CAH-TOA).</li>
    <li>Set calculator mode to degrees unless stated otherwise.</li>
    <li>Round only at final step unless instructed.</li>
    <li>Include units and context in word-problem answers.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Trigonometry grew from astronomy, navigation, and surveying. Mathematicians in ancient Greece,
    India, and the Islamic Golden Age developed angle and chord/sine tables for practical measurement.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="similarity-idea" class="book-prose__heading">Why trig ratios depend only on angle</h3>
  <p>
    Any two right triangles with the same acute angle are similar, so corresponding side ratios are
    equal. That is why \(\sin\theta,\cos\theta,\tan\theta\) are functions of \(\theta\) only.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Find \(\sin30^\circ\) and \(\cos60^\circ\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Both are \(\frac12\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">In a right triangle, opposite to \(\theta\) is 9 and hypotenuse is 15. Find \(\sin\theta\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\sin\theta=\frac{9}{15}=\frac35\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Adjacent is 7, hypotenuse is 25. Find \(\cos\theta\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\cos\theta=\frac{7}{25}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">If \(\tan\theta=0.75\), find \(\theta\) (to 1 d.p.).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\theta=\tan^{-1}(0.75)\approx 36.9^\circ\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A ladder leans against a wall. Foot is 4 m from wall and ladder length is 6 m. Find angle with ground.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\cos\theta=\frac{4}{6}=\frac23\Rightarrow \theta\approx 48.2^\circ\).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Surveying:</strong> height and distance estimation without direct measurement.</li>
    <li><strong>Navigation:</strong> direction and angle-based positioning.</li>
    <li><strong>Engineering:</strong> force components and incline analysis.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school trigonometry curricula (right-triangle ratios).</li>
    <li>Geometry and trigonometry texts on SOH-CAH-TOA applications.</li>
  </ul>
</div>
