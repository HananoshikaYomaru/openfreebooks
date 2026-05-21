+++
title = "Coordinate geometry foundations"
description = "Plot points, find distances and midpoints, and work with slopes of lines in the Cartesian plane."
template = "chapter.html"
weight = 20
[extra]
subject = "math"
chapter_id = "coordinate-geometry-foundations"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    Coordinate geometry connects algebra and geometry by representing points with ordered pairs
    \((x,y)\) on the Cartesian plane.
  </p>

  <h2 id="cartesian-plane" class="book-prose__heading">The Cartesian plane</h2>
  <p>
    Horizontal axis is \(x\)-axis, vertical axis is \(y\)-axis, and intersection is origin \((0,0)\).
  </p>
  <p>
    Quadrants:
  </p>
  <ul>
    <li>Q1: \((+,+)\)</li>
    <li>Q2: \((-,+)\)</li>
    <li>Q3: \((-,-)\)</li>
    <li>Q4: \((+,-)\)</li>
  </ul>

  <h2 id="plot-points" class="book-prose__heading">Plotting and reading points</h2>
  <p>
    Ordered pair \((a,b)\) means move \(a\) units along \(x\), then \(b\) units along \(y\).
  </p>
  <p><strong>Example:</strong> \((-3,2)\) lies in Quadrant II.</p>

  <h2 id="distance-formula" class="book-prose__heading">Distance between two points</h2>
  <p>
    For \(A(x_1,y_1)\), \(B(x_2,y_2)\):
  </p>
  <p class="book-formula">\[
    AB=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}.
  \]</p>
  <p>
    This comes from Pythagoras' theorem on horizontal and vertical differences.
  </p>

  <h2 id="midpoint-formula" class="book-prose__heading">Midpoint of a segment</h2>
  <p class="book-formula">\[
    M\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right).
  \]</p>
  <p><strong>Example:</strong> Midpoint of \((2,5)\) and \((8,-1)\) is \((5,2)\).</p>

  <h2 id="gradient-slope" class="book-prose__heading">Gradient (slope) of a line</h2>
  <p>
    For points \(A(x_1,y_1)\), \(B(x_2,y_2)\) with \(x_2\ne x_1\):
  </p>
  <p class="book-formula">\[
    m=\frac{y_2-y_1}{x_2-x_1}.
  \]</p>
  <ul>
    <li>\(m&gt;0\): line rises left to right.</li>
    <li>\(m&lt;0\): line falls left to right.</li>
    <li>\(m=0\): horizontal line.</li>
    <li>Vertical line has undefined slope.</li>
  </ul>

  <h2 id="line-equations" class="book-prose__heading">Equations of lines</h2>
  <p>
    Slope-intercept form:
  </p>
  <p class="book-formula">\[
    y=mx+c
  \]</p>
  <p>
    where \(m\) is slope and \(c\) is \(y\)-intercept.
  </p>
  <p>
    Point-slope form:
  </p>
  <p class="book-formula">\[
    y-y_1=m(x-x_1).
  \]</p>

  <h2 id="parallel-perpendicular" class="book-prose__heading">Parallel and perpendicular lines</h2>
  <ul>
    <li>Parallel lines have equal slopes: \(m_1=m_2\).</li>
    <li>Perpendicular lines satisfy \(m_1m_2=-1\) (when both slopes are defined).</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Write coordinates clearly before substituting formulas.</li>
    <li>Keep exact form (roots/fractions) unless decimal is requested.</li>
    <li>Check whether slope is undefined for vertical lines.</li>
    <li>Use diagrams to avoid sign mistakes in differences.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Coordinate geometry was formalized by Rene Descartes and Pierre de Fermat. Their work connected
    algebraic equations to geometric curves, creating a major foundation for modern mathematics.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="distance-derivation" class="book-prose__heading">Why the distance formula works</h3>
  <p>
    Horizontal change is \(\Delta x=x_2-x_1\), vertical change is \(\Delta y=y_2-y_1\). These form
    a right triangle, so distance is \(\sqrt{(\Delta x)^2+(\Delta y)^2}\).
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">State the quadrant of \((-4,-7)\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Quadrant III.</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find distance between \((1,2)\) and \((7,10)\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\sqrt{6^2+8^2}=\sqrt{100}=10\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find midpoint of \((-3,5)\) and \((9,-1)\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\left(3,2\right)\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find slope through \((2,-1)\) and \((6,7)\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(m=\frac{7-(-1)}{6-2}=\frac84=2\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Line with slope \(3\) through \((1,4)\): find equation.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(y-4=3(x-1)\Rightarrow y=3x+1\).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Maps/GPS:</strong> locations represented using coordinate systems.</li>
    <li><strong>Computer graphics:</strong> points and lines placed on pixel coordinate planes.</li>
    <li><strong>Physics:</strong> trajectories and motion graphs depend on coordinates and slope.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school coordinate geometry units.</li>
    <li>Analytic geometry references on points, lines, distance, and midpoint.</li>
  </ul>
</div>
