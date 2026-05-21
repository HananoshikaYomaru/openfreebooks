+++
title = "Loci"
description = "Describe and construct loci in the plane, linking geometric constraints to algebraic equations."
template = "chapter.html"
weight = 29
[extra]
subject = "math"
chapter_id = "loci"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    A <strong>locus</strong> is the set of all points that satisfy a given condition. Loci connect
    geometric constructions with equations and constraints.
  </p>

  <h2 id="basic-loci" class="book-prose__heading">Basic loci patterns</h2>
  <ul>
    <li>Fixed distance \(r\) from point \(A\): a circle center \(A\), radius \(r\).</li>
    <li>Fixed distance from line \(l\): two parallel lines on each side of \(l\).</li>
    <li>Equidistant from points \(A,B\): perpendicular bisector of \(AB\).</li>
    <li>Equidistant from two intersecting lines: angle bisectors.</li>
  </ul>

  <h2 id="constructing-loci" class="book-prose__heading">Constructing loci</h2>
  <ol>
    <li>Translate condition into known locus type.</li>
    <li>Construct each required locus accurately.</li>
    <li>Find intersection of loci for final solution points/region.</li>
  </ol>

  <h2 id="inequality-regions" class="book-prose__heading">Loci and inequalities</h2>
  <p>
    Conditions like “distance at most 3 cm from line” describe a region, not a single line.
  </p>
  <p>
    Boundary inclusion matters:
  </p>
  <ul>
    <li>\(\le\): boundary included (solid)</li>
    <li>\(&lt;\): boundary excluded</li>
  </ul>

  <h2 id="equation-links" class="book-prose__heading">Algebra links</h2>
  <p>
    Coordinate forms:
  </p>
  <ul>
    <li>Circle: \((x-h)^2+(y-k)^2=r^2\)</li>
    <li>Perpendicular bisector from equal-distance condition \(PA=PB\)</li>
  </ul>

  <h2 id="real-world-models" class="book-prose__heading">Modeling with loci</h2>
  <p>
    Loci are used for coverage regions, safe-distance boundaries, and optimal placement constraints.
  </p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Underline keywords: equidistant, fixed distance, within, at least.</li>
    <li>Draw boundaries first, then shade valid region.</li>
    <li>State whether endpoints/boundaries are included.</li>
    <li>Use intersections of loci to justify final points.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Locus ideas emerged from classical compass-and-straightedge geometry and later became a core part
    of analytic geometry and optimization problems.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Describe the locus of points 5 cm from point \(A\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> A circle center \(A\), radius 5 cm.</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">What is locus of points equidistant from \(A\) and \(B\)?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Perpendicular bisector of segment \(AB\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Points within 2 m of line \(l\): describe region.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Strip between two parallels 2 m from \(l\), including boundaries if “within or equal to”.</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Points equidistant from intersecting lines \(p,q\): what locus?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> The two angle bisectors of lines \(p,q\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Why can a locus answer be a region instead of a curve?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Inequality conditions describe many points satisfying a distance range.</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Cell/Wi-Fi planning:</strong> coverage zones around transmitters.</li>
    <li><strong>Urban design:</strong> buffer distances from roads or facilities.</li>
    <li><strong>Robotics:</strong> safe navigation boundaries and target zones.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school geometry content on loci and construction.</li>
    <li>Analytic geometry materials linking loci to equations.</li>
  </ul>
</div>
