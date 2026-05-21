+++
title = "Coordinate geometry of circles"
description = "Find equations of circles, tangents, and intersections using coordinate methods and distance."
template = "chapter.html"
weight = 26
[extra]
subject = "math"
chapter_id = "coordinate-circles"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    Coordinate geometry of circles combines algebra with geometric properties such as radius, center,
    tangents, and intersections.
  </p>

  <h2 id="standard-equation" class="book-prose__heading">Standard equation of a circle</h2>
  <p>
    A circle with center \((h,k)\) and radius \(r\) has equation:
  </p>
  <p class="book-formula">\[
    (x-h)^2+(y-k)^2=r^2.
  \]</p>
  <p>
    If center is origin, this simplifies to \(x^2+y^2=r^2\).
  </p>

  <h2 id="from-equation-to-geometry" class="book-prose__heading">Reading center and radius</h2>
  <p><strong>Example:</strong> \((x-3)^2+(y+2)^2=25\)</p>
  <ul>
    <li>Center: \((3,-2)\)</li>
    <li>Radius: \(5\)</li>
  </ul>

  <h2 id="general-form" class="book-prose__heading">General form</h2>
  <p>
    A circle can also appear as:
  </p>
  <p class="book-formula">\[
    x^2+y^2+Dx+Ey+F=0.
  \]</p>
  <p>
    Complete the square in \(x\) and \(y\) to convert to standard form.
  </p>

  <h2 id="tangent-condition" class="book-prose__heading">Tangents and radii</h2>
  <ul>
    <li>A tangent touches a circle at exactly one point.</li>
    <li>Radius to tangent point is perpendicular to the tangent.</li>
  </ul>
  <p>
    If radius slope is \(m\), tangent slope is \(-\frac1m\) (when defined).
  </p>

  <h2 id="point-position" class="book-prose__heading">Point position relative to circle</h2>
  <p>
    For circle center \(C\), radius \(r\), and point \(P\):
  </p>
  <ul>
    <li>\(CP&lt;r\): inside</li>
    <li>\(CP=r\): on circle</li>
    <li>\(CP&gt;r\): outside</li>
  </ul>

  <h2 id="line-circle-intersection" class="book-prose__heading">Line-circle intersections</h2>
  <p>
    Substitute line equation into circle equation.
  </p>
  <ul>
    <li>Two solutions: secant intersects twice.</li>
    <li>One solution: tangent.</li>
    <li>No real solution: no intersection.</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Write center and radius before computation.</li>
    <li>Use exact values first; round at final step.</li>
    <li>For tangents, use radius-perpendicular fact explicitly.</li>
    <li>Check whether solutions satisfy geometric context.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Coordinate methods made circle geometry algebraic: geometric questions about tangency and
    intersection can be solved by equations. This approach grew from analytic geometry.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Find center and radius of \((x+4)^2+(y-1)^2=36\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Center \((-4,1)\), radius \(6\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Write equation of circle with center \((2,-3)\), radius \(7\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((x-2)^2+(y+3)^2=49\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Is point \((5,1)\) on circle \((x-1)^2+(y-1)^2=16\)?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Yes, \((5-1)^2+(1-1)^2=16\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Convert \(x^2+y^2-6x+4y-12=0\) to standard form.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((x-3)^2+(y+2)^2=25\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A line through tangent point has slope 2. What is slope of radius to that point?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(-\frac12\).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Engineering:</strong> circular component alignment and tolerance checks.</li>
    <li><strong>Computer graphics:</strong> collision and boundary detection.</li>
    <li><strong>Robotics:</strong> turning path and sensor range modeling.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school coordinate geometry materials on circles and tangents.</li>
    <li>Analytic geometry references on conic sections (intro level).</li>
  </ul>
</div>
