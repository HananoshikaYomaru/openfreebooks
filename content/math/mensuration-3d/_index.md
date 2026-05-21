+++
title = "Mensuration in 3D"
description = "Find volumes and surface areas of prisms, cylinders, pyramids, cones, and spheres."
template = "chapter.html"
weight = 25
[extra]
subject = "math"
chapter_id = "mensuration-3d"
strand = "Measures, Shape & Space"
+++

<div class="book-prose">
  <p>
    Mensuration in 3D focuses on volume (space inside solids) and surface area (total outer area).
  </p>

  <h2 id="units" class="book-prose__heading">Units and interpretation</h2>
  <ul>
    <li>Length: cm, m</li>
    <li>Area: cm\(^2\), m\(^2\)</li>
    <li>Volume: cm\(^3\), m\(^3\)</li>
  </ul>
  <p>
    Always keep units consistent before substituting values.
  </p>

  <h2 id="prisms-cylinders" class="book-prose__heading">Prisms and cylinders</h2>
  <p>
    For any prism/cylinder:
  </p>
  <p class="book-formula">\[
    \text{Volume}=\text{base area}\times\text{height}.
  \]</p>
  <p>
    Cylinder formulas:
  </p>
  <p class="book-formula">\[
    V=\pi r^2h,\qquad
    \text{TSA}=2\pi r^2+2\pi rh.
  \]</p>

  <h2 id="pyramids-cones" class="book-prose__heading">Pyramids and cones</h2>
  <p class="book-formula">\[
    V_{\text{pyramid}}=\frac13(\text{base area})h,\qquad
    V_{\text{cone}}=\frac13\pi r^2h.
  \]</p>
  <p>
    Cone curved surface area:
  </p>
  <p class="book-formula">\[
    \text{CSA}_{\text{cone}}=\pi rl
  \]</p>
  <p>
    where \(l\) is slant height. Total surface area adds base area \(\pi r^2\).
  </p>

  <h2 id="spheres" class="book-prose__heading">Spheres</h2>
  <p class="book-formula">\[
    V=\frac43\pi r^3,\qquad
    \text{Surface area}=4\pi r^2.
  \]</p>

  <h2 id="composite-solids" class="book-prose__heading">Composite solids</h2>
  <p>
    Split complex shapes into known solids, then add/subtract volumes or areas appropriately.
  </p>
  <ul>
    <li>Add volumes when parts are joined.</li>
    <li>Subtract volumes for holes/cut-outs.</li>
    <li>For surface area, remove hidden contact faces.</li>
  </ul>

  <h2 id="density-context" class="book-prose__heading">Volume in context</h2>
  <p>
    Common contexts include capacity, material usage, and mass:
  </p>
  <p class="book-formula">\[
    \text{mass}=\text{density}\times\text{volume}.
  \]</p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Sketch and label all dimensions before formula use.</li>
    <li>Choose exact \(\pi\) form first; round at final step if required.</li>
    <li>Convert units early (e.g., cm to m).</li>
    <li>For composite shapes, explain add/subtract logic briefly.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Mensuration developed from practical needs in architecture, agriculture, and trade. Ancient
    mathematicians studied area and volume formulas, with later refinement by Archimedes and others.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="why-one-third" class="book-prose__heading">Why pyramid and cone have one-third factor</h3>
  <p>
    A pyramid (or cone) with same base area and height as a prism (or cylinder) has one-third the
    volume. This can be shown by dissection arguments or calculus in advanced courses.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Find volume of a cylinder with \(r=3\) cm, \(h=10\) cm.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(V=\pi r^2h=90\pi\) cm\(^3\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find total surface area of a closed cylinder with \(r=2\) cm, \(h=7\) cm.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(2\pi r^2+2\pi rh=8\pi+28\pi=36\pi\) cm\(^2\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find volume of a cone with \(r=6\) cm, \(h=9\) cm.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac13\pi r^2h=\frac13\pi(36)(9)=108\pi\) cm\(^3\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Sphere has radius 5 cm. Find its volume.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(V=\frac43\pi(5^3)=\frac{500}{3}\pi\) cm\(^3\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A block is \(4\times3\times2\) m. Density is \(2500\) kg/m\(^3\). Find mass.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Volume \(=24\) m\(^3\). Mass \(=2500\times24=60000\) kg.</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Construction:</strong> concrete volume and paint area estimation.</li>
    <li><strong>Packaging:</strong> minimizing material for fixed volume containers.</li>
    <li><strong>Engineering:</strong> tank capacity and material mass calculations.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school mensuration units on 3D solids.</li>
    <li>Geometry texts on prism, cylinder, cone, pyramid, and sphere formulas.</li>
  </ul>
</div>
