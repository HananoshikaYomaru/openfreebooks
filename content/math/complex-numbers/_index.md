+++
title = "Complex numbers"
description = "Represent complex numbers in Cartesian form and perform operations including conjugates and division."
template = "chapter.html"
weight = 14
[extra]
subject = "math"
chapter_id = "complex-numbers"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    <strong>Complex numbers</strong> extend the real number system so equations like
    \(x^2+1=0\) can be solved. In high school, you usually write a complex number in
    <strong>Cartesian form</strong>:
    \[
    z = a + bi,
    \]
    where \(a,b\in\mathbb{R}\) and \(i^2=-1\).
  </p>

  <h2 id="imaginary-unit" class="book-prose__heading">The imaginary unit \(i\)</h2>
  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Definition</p>
    <p class="book-formula">\[ i^2 = -1 \]</p>
  </div>
  <p>
    Useful cycle:
    \[
    i^1=i,\quad i^2=-1,\quad i^3=-i,\quad i^4=1,
    \]
    and then the pattern repeats every 4 powers.
  </p>

  <h2 id="cartesian-form" class="book-prose__heading">Real and imaginary parts</h2>
  <p>
    For \(z=a+bi\):
  </p>
  <ul>
    <li>\(\Re(z)=a\) (real part)</li>
    <li>\(\Im(z)=b\) (imaginary coefficient)</li>
  </ul>
  <p><strong>Example.</strong> If \(z=3-4i\), then \(\Re(z)=3\), \(\Im(z)=-4\).</p>

  <h2 id="operations" class="book-prose__heading">Basic operations</h2>
  <p>
    Add/subtract by combining like terms:
  </p>
  <p class="book-formula">
    \[
    (a+bi)\pm(c+di)=(a\pm c)+(b\pm d)i.
    \]
  </p>
  <p>
    Multiply using expansion and \(i^2=-1\):
  </p>
  <p class="book-formula">
    \[
    (a+bi)(c+di)=ac+adi+bci+bd\,i^2=(ac-bd)+(ad+bc)i.
    \]
  </p>
  <p><strong>Example.</strong> \((2+3i)(1-4i)=2-8i+3i-12i^2=14-5i.\)</p>

  <h2 id="conjugate" class="book-prose__heading">Conjugate and modulus</h2>
  <p>
    The conjugate of \(z=a+bi\) is
    \[
    \overline{z}=a-bi.
    \]
    Multiplying by conjugates removes imaginary parts:
    \[
    z\overline{z}=(a+bi)(a-bi)=a^2+b^2.
    \]
  </p>
  <p>
    The modulus (distance from origin in Argand plane) is:
    \[
    |z|=\sqrt{a^2+b^2}.
    \]
  </p>
  <p><strong>Example.</strong> For \(z=3-4i\), \(\overline{z}=3+4i\), \(|z|=5\).</p>

  <h2 id="division" class="book-prose__heading">Division in Cartesian form</h2>
  <p>
    To divide by \(c+di\), multiply top and bottom by \(c-di\):
  </p>
  <p class="book-formula">
    \[
    \frac{a+bi}{c+di}
    =\frac{(a+bi)(c-di)}{(c+di)(c-di)}
    =\frac{(a+bi)(c-di)}{c^2+d^2}.
    \]
  </p>
  <p><strong>Example.</strong> \(\dfrac{1+2i}{3-i}\):</p>
  <p>
    \[
    \frac{1+2i}{3-i}\cdot\frac{3+i}{3+i}
    =\frac{(1+2i)(3+i)}{10}
    =\frac{1+7i}{10}
    =\frac{1}{10}+\frac{7}{10}i.
    \]
  </p>

  <h2 id="argand-plane" class="book-prose__heading">Argand plane (graph view)</h2>
  <p>
    Plot \(z=a+bi\) as the point \((a,b)\): horizontal axis is real part, vertical axis is
    imaginary part. This lets you interpret \(|z|\) as geometric distance.
  </p>

  <h2 id="solving-quadratics" class="book-prose__heading">Why this matters: solving quadratics</h2>
  <p>
    If \(x^2+4=0\), then \(x^2=-4\), so
    \[
    x=\pm 2i.
    \]
    Complex numbers ensure every quadratic has two roots (counting multiplicity), and later this
    extends to all polynomial equations.
  </p>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Complex numbers first appeared when mathematicians tried to solve cubic equations in the
    16th century. Algebraic formulas sometimes produced square roots of negative numbers, even when
    final answers were real.
  </p>
  <p>
    Mathematicians like <strong>Cardano</strong>, <strong>Bombelli</strong>, and later
    <strong>Euler</strong> developed rules for these numbers. What began as a formal trick became a
    major mathematical system used in engineering, physics, and signal processing.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation</h2>
  <h3 id="why-conjugate-works" class="book-prose__heading">Why the conjugate removes \(i\) in denominators</h3>
  <p>
    For \(c+di\):
    \[
    (c+di)(c-di)=c^2-d^2i^2=c^2+d^2,
    \]
    which is real and positive (unless \(c=d=0\)). This is why multiplying by conjugates converts
    complex division into standard real-number division.
  </p>

  <h3 id="modulus-link" class="book-prose__heading">Why \(|z|^2=z\overline{z}\)</h3>
  <p>
    For \(z=a+bi\):
    \[
    z\overline{z}=(a+bi)(a-bi)=a^2+b^2=|z|^2.
    \]
    So modulus is directly linked to conjugation and the Pythagorean distance in the Argand plane.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <p>
    Pause and reason before continuing. Discuss with a classmate or write your reasoning in a
    notebook.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Simplify \(i^{23}\) using the 4-step power cycle.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Compute \((4-3i)+(2+5i)\) and \((4-3i)-(2+5i)\).
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Expand and simplify \((1+2i)(3-i)\) into \(a+bi\) form.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Find \(\overline{z}\) and \(|z|\) when \(z=-5+12i\).
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Write \(\dfrac{2-i}{1+3i}\) in \(a+bi\) form.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Solve \(x^2-6x+13=0\). Why are the roots complex?
    </p>
  </div>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <h3 id="ac-circuits" class="book-prose__heading">AC circuits and impedance</h3>
  <p>
    Electrical engineers model alternating-current circuits with complex numbers because amplitude
    and phase are naturally represented together as one complex quantity.
  </p>

  <h3 id="waves-signals" class="book-prose__heading">Waves and signals</h3>
  <p>
    Sound, radio, and image-processing systems use complex numbers to describe oscillations and
    frequency content efficiently (e.g., Fourier methods).
  </p>

  <h3 id="rotation-geometry" class="book-prose__heading">Geometry and rotations</h3>
  <p>
    Multiplying by certain complex numbers corresponds to rotating and scaling points in the plane,
    making complex numbers useful in geometry and computer graphics.
  </p>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Bombelli, R. (1572). <em>L'Algebra</em> (early systematic rules for imaginary numbers).</li>
    <li>Euler, L. (18th century works) connecting complex numbers with trigonometry and exponentials.</li>
    <li>Standard high-school extension algebra curricula on Cartesian form, conjugates, and division.</li>
  </ul>
</div>
