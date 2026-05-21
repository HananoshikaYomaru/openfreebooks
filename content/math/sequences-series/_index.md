+++
title = "Sequences & series"
description = "Work with arithmetic and geometric sequences, sigma notation, and finite summation formulas."
template = "chapter.html"
weight = 17
[extra]
subject = "math"
chapter_id = "sequences-series"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    A <strong>sequence</strong> is an ordered list of numbers. A <strong>series</strong> is the sum of
    terms in a sequence. These ideas are key in algebra, finance, and modeling.
  </p>

  <h2 id="sequence-notation" class="book-prose__heading">Sequence notation</h2>
  <p>
    Terms are often written \(u_1,u_2,u_3,\dots\) where \(u_n\) is the \(n\)-th term.
  </p>
  <p><strong>Example:</strong> \(2,5,8,11,\dots\) has \(u_1=2\), \(u_2=5\), \(u_3=8\).</p>

  <h2 id="arithmetic-sequences" class="book-prose__heading">Arithmetic sequences</h2>
  <p>
    Difference between consecutive terms is constant \(d\).
  </p>
  <p class="book-formula">\[
    u_n=a+(n-1)d
  \]</p>
  <p>
    where \(a\) is first term.
  </p>
  <p><strong>Example:</strong> \(a=4,d=3\Rightarrow u_n=4+3(n-1)=3n+1\).</p>

  <h2 id="arithmetic-series" class="book-prose__heading">Arithmetic series</h2>
  <p>
    Sum of first \(n\) terms:
  </p>
  <p class="book-formula">\[
    S_n=\frac{n}{2}\big(2a+(n-1)d\big)=\frac{n}{2}(a+l)
  \]</p>
  <p>
    where \(l\) is the \(n\)-th term.
  </p>

  <h2 id="geometric-sequences" class="book-prose__heading">Geometric sequences</h2>
  <p>
    Ratio between consecutive terms is constant \(r\).
  </p>
  <p class="book-formula">\[
    u_n=ar^{n-1}
  \]</p>
  <p><strong>Example:</strong> \(3,6,12,24,\dots\) has \(a=3,r=2\).</p>

  <h2 id="geometric-series" class="book-prose__heading">Geometric series</h2>
  <p>
    For \(r\ne1\), sum of first \(n\) terms:
  </p>
  <p class="book-formula">\[
    S_n=a\frac{1-r^n}{1-r}
  \]</p>
  <p>
    Equivalent form: \(S_n=a\frac{r^n-1}{r-1}\).
  </p>

  <h2 id="infinite-geometric" class="book-prose__heading">Infinite geometric series</h2>
  <p>
    If \(|r|&lt;1\), the sum to infinity exists:
  </p>
  <p class="book-formula">\[
    S_\infty=\frac{a}{1-r}.
  \]</p>
  <p>
    If \(|r|\ge1\), no finite sum to infinity.
  </p>

  <h2 id="sigma-notation" class="book-prose__heading">Sigma notation</h2>
  <p>
    \[
    \sum_{k=1}^{n} f(k)
    \]
    means add values of \(f(k)\) from \(k=1\) to \(k=n\).
  </p>
  <p><strong>Example:</strong> \(\sum_{k=1}^{4}(2k+1)=3+5+7+9=24.\)</p>

  <h2 id="problem-solving" class="book-prose__heading">Typical problem-solving workflow</h2>
  <ol>
    <li>Identify arithmetic or geometric behavior.</li>
    <li>Find key parameters (\(a,d\) or \(a,r\)).</li>
    <li>Use \(u_n\) for term questions, \(S_n\) for sum questions.</li>
    <li>Check reasonableness (growth/decay, sign, size).</li>
  </ol>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Do not mix \(u_n\) and \(S_n\) formulas.</li>
    <li>For geometric sums, check \(r\ne1\) before applying formula.</li>
    <li>For infinity sums, always test \(|r|&lt;1\).</li>
    <li>Define variables clearly before solving word problems.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Sequences and sums appear in ancient mathematics, including arithmetic progressions used for
    counting and trade. Later, geometric series became central in finance and calculus.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="derive-arithmetic-sum" class="book-prose__heading">Why the arithmetic sum formula works</h3>
  <p>
    Write \(S_n=a+(a+d)+\dots+l\) and reverse it. Adding line-by-line gives \(2S_n=n(a+l)\), so
    \(S_n=\frac{n}{2}(a+l)\).
  </p>
  <h3 id="derive-geometric-sum" class="book-prose__heading">Why the geometric sum formula works</h3>
  <p>
    Let \(S_n=a+ar+\dots+ar^{n-1}\). Multiply by \(r\), subtract, and simplify:
    \[
    (1-r)S_n=a(1-r^n).
    \]
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">Find the 20th term of \(5,8,11,\dots\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(u_{20}=5+19(3)=62\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Find \(S_{30}\) for \(2,5,8,\dots\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(a=2,d=3\Rightarrow S_{30}=\frac{30}{2}[2(2)+29(3)]=1365\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">For \(3,6,12,\dots\), find the 8th term.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(u_8=3\cdot2^7=384\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Compute \(1+\frac12+\frac14+\frac18+\dots\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(a=1,r=\frac12\Rightarrow S_\infty=\frac{1}{1-1/2}=2\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">Evaluate \(\sum_{k=1}^{5}(k+2)\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(3+4+5+6+7=25\).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Savings plans:</strong> recurring deposits form sequences and cumulative sums.</li>
    <li><strong>Population models:</strong> repeated growth can be modeled geometrically.</li>
    <li><strong>Computer science:</strong> loops and algorithm costs often use summation notation.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school algebra curricula on arithmetic and geometric progressions.</li>
    <li>Precalculus texts on sigma notation and finite/infinite geometric series.</li>
  </ul>
</div>
