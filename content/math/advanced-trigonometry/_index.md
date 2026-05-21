+++
title = "Advanced trigonometry"
description = "Use sine and cosine rules, radians, and trigonometric graphs in 2D and 3D applications."
template = "chapter.html"
weight = 27
[extra]
subject = "math"
chapter_id = "advanced-trigonometry"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    Advanced trigonometry extends right-triangle work to non-right triangles, radians, and trig
    graphs used in periodic modeling.
  </p>

  <h2 id="radian-measure" class="book-prose__heading">Radians and arc length</h2>
  <p>
    Convert degrees/radians:
  </p>
  <p class="book-formula">\[
    180^\circ=\pi\ \text{rad}.
  \]</p>
  <p>
    Arc length and sector area:
  </p>
  <p class="book-formula">\[
    s=r\theta,\qquad A=\frac12r^2\theta
  \]</p>
  <p>with \(\theta\) in radians.</p>

  <h2 id="sine-cosine-rules" class="book-prose__heading">Sine and cosine rules</h2>
  <p class="book-formula">\[
    \frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}
  \]</p>
  <p class="book-formula">\[
    c^2=a^2+b^2-2ab\cos C.
  \]</p>
  <p>
    Use sine rule for side-angle opposite pairs; cosine rule for SAS or SSS cases.
  </p>

  <h2 id="area-triangle" class="book-prose__heading">Triangle area formula</h2>
  <p class="book-formula">\[
    \text{Area}=\frac12ab\sin C.
  \]</p>
  <p>
    Useful when two sides and included angle are known.
  </p>

  <h2 id="identities" class="book-prose__heading">Core identities</h2>
  <p class="book-formula">\[
    \sin^2x+\cos^2x=1,\qquad
    \tan x=\frac{\sin x}{\cos x}.
  \]</p>

  <h2 id="trig-equations" class="book-prose__heading">Solving basic trig equations</h2>
  <p>
    Solve in interval (e.g., \(0^\circ\le x&lt;360^\circ\)) using unit-circle symmetry.
  </p>
  <p><strong>Example:</strong> \(\sin x=\frac12\Rightarrow x=30^\circ,150^\circ\).</p>

  <h2 id="graphs" class="book-prose__heading">Trigonometric graphs</h2>
  <p>
    For \(y=a\sin(bx)+d\) (similarly cosine):
  </p>
  <ul>
    <li>Amplitude \(=|a|\)</li>
    <li>Period \(=\frac{2\pi}{|b|}\) (or \(\frac{360^\circ}{|b|}\) in degrees mode)</li>
    <li>Vertical shift \(=d\)</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Check calculator mode (degree/radian) before solving.</li>
    <li>State interval when listing trig equation solutions.</li>
    <li>Draw quick triangle sketch for sine/cosine rule setup.</li>
    <li>Keep exact radian forms when possible.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Advanced trigonometric methods were developed for astronomy, navigation, and surveying. Sine and
    cosine rule tables were essential long before modern calculators.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Convert \(150^\circ\) to radians.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac{5\pi}{6}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find arc length for \(r=8\), \(\theta=\frac{\pi}{3}\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(s=r\theta=\frac{8\pi}{3}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">In triangle, \(a=10,b=7,C=60^\circ\). Find \(c\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(c^2=10^2+7^2-2(10)(7)\cos60^\circ=79\), so \(c=\sqrt{79}\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Solve \(2\sin x=1\) for \(0^\circ\le x&lt;360^\circ\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(x=30^\circ,150^\circ\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">For \(y=3\cos(2x)-1\), state amplitude and period.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Amplitude \(3\), period \(\pi\) radians (or \(180^\circ\)).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Wave modeling:</strong> sound, light, and AC signals.</li>
    <li><strong>Navigation:</strong> triangulation in maps and GPS support calculations.</li>
    <li><strong>Engineering:</strong> periodic motion and oscillation analysis.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school advanced trigonometry syllabi (IB, A-Level, DSE extension).</li>
    <li>Precalculus texts on trig identities, equations, and graphs.</li>
  </ul>
</div>
