+++
title = "Congruence & similarity"
description = "Apply congruence and similarity criteria to justify properties of triangles and scale figures."
template = "chapter.html"
weight = 22
[extra]
subject = "math"
chapter_id = "congruence-similarity"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    Congruence and similarity compare shapes by size and shape. They are central for triangle proofs,
    scale drawings, and indirect measurement.
  </p>

  <h2 id="congruence" class="book-prose__heading">Congruence</h2>
  <p>
    Congruent figures have exactly the same shape and size. Corresponding sides and angles are equal.
  </p>
  <p>
    For triangles, common criteria:
  </p>
  <ul>
    <li>SSS (three sides equal)</li>
    <li>SAS (two sides and included angle equal)</li>
    <li>ASA / AAS (two angles and one corresponding side equal)</li>
    <li>RHS (right triangle: hypotenuse and one side equal)</li>
  </ul>

  <h2 id="similarity" class="book-prose__heading">Similarity</h2>
  <p>
    Similar figures have the same shape but possibly different sizes.
  </p>
  <ul>
    <li>Corresponding angles are equal.</li>
    <li>Corresponding sides are in one constant ratio (scale factor).</li>
  </ul>
  <p>
    Triangle similarity criteria:
  </p>
  <ul>
    <li>AA (two angles equal)</li>
    <li>SAS in proportion</li>
    <li>SSS in proportion</li>
  </ul>

  <h2 id="scale-factor" class="book-prose__heading">Scale factor relationships</h2>
  <p>
    If linear scale factor from shape A to B is \(k\):
  </p>
  <ul>
    <li>Lengths multiply by \(k\).</li>
    <li>Areas multiply by \(k^2\).</li>
    <li>Volumes multiply by \(k^3\).</li>
  </ul>

  <h2 id="using-similarity" class="book-prose__heading">Using similarity to solve problems</h2>
  <ol>
    <li>Identify corresponding vertices in correct order.</li>
    <li>Write ratio equation using matching sides.</li>
    <li>Solve unknown lengths/areas.</li>
    <li>Check ratio consistency across all pairs.</li>
  </ol>

  <h2 id="proofs" class="book-prose__heading">Congruence and similarity in proofs</h2>
  <p>
    Common proof flow:
  </p>
  <ul>
    <li>Show two triangles are congruent/similar by criteria.</li>
    <li>Conclude equal angles/sides or proportional segments.</li>
    <li>Use result to prove target statement.</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>State criterion explicitly (e.g., “\(\triangle ABC\cong\triangle DEF\) by SAS”).</li>
    <li>Match vertices in correct correspondence order.</li>
    <li>Do not mix congruence and similarity conditions.</li>
    <li>For ratio problems, keep fractions in consistent side order.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Similarity ideas appear in ancient surveying and architecture. Greek geometers formalized triangle
    relationships, enabling rigorous methods for unknown lengths and indirect measurements.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="aa-why" class="book-prose__heading">Why AA implies triangle similarity</h3>
  <p>
    In triangles, angle sum is \(180^\circ\). If two angles match, the third angle must also match.
    Matching angles force proportional corresponding sides, so triangles are similar.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">
      Triangles have side sets \((5,7,9)\) and \((5,7,9)\). Congruent or similar?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Congruent (SSS, identical side lengths).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      Two triangles have angles \(40^\circ,60^\circ,80^\circ\) and \(40^\circ,60^\circ,80^\circ\), but one is larger. What relation?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Similar (AA), not necessarily congruent.</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      Similar triangles have scale factor \(k=3\). If a side is \(4\) in the small triangle, what is matching side in large triangle?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(4\times3=12\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      If two similar figures have area ratio \(25:9\), what is linear scale factor ratio?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(5:3\) (square root of area ratio).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      Right triangles share one acute angle and each has a right angle. What criterion gives similarity?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> AA similarity.</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Scale maps/drawings:</strong> convert plan dimensions to real distances.</li>
    <li><strong>Shadow methods:</strong> estimate object heights using similar triangles.</li>
    <li><strong>Engineering design:</strong> preserve shape while resizing components.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school geometry syllabi on triangle congruence and similarity.</li>
    <li>Geometry textbooks on ratio, scale factor, and proof applications.</li>
  </ul>
</div>
