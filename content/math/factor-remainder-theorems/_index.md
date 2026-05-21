+++
title = "Factor & remainder theorems"
description = "Use the factor and remainder theorems to factorise higher-degree polynomials and solve related equations."
template = "chapter.html"
weight = 13
[extra]
subject = "math"
chapter_id = "factor-remainder-theorems"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    This chapter introduces two connected ideas for polynomial division:
    <strong>Remainder Theorem</strong> and <strong>Factor Theorem</strong>.
    They help you test factors quickly, find roots, and break a cubic (or higher) polynomial into
    simpler factors.
  </p>

  <h2 id="recap-polynomials" class="book-prose__heading">Quick recap</h2>
  <p>
    A polynomial in \(x\) is an expression like
    \(P(x)=2x^3-3x^2+5x-7\). If you divide \(P(x)\) by \((x-a)\), you get:
  </p>
  <p class="book-formula">
    \[
    P(x) = (x-a)Q(x) + R,
    \]
  </p>
  <p>
    where \(Q(x)\) is the quotient and \(R\) is a constant remainder.
  </p>

  <h2 id="remainder-theorem" class="book-prose__heading">Remainder Theorem</h2>
  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Remainder Theorem</p>
    <p class="book-formula">
      \[
      \text{When } P(x)\text{ is divided by }(x-a),\ \text{remainder}=P(a).
      \]
    </p>
  </div>

  <p><strong>Example 1.</strong> Find the remainder when \(P(x)=x^3-4x+1\) is divided by \((x-2)\).</p>
  <p>
    By the theorem, remainder \(=P(2)=2^3-4(2)+1=8-8+1=1\).
  </p>

  <p><strong>Example 2.</strong> Find the remainder when \(2x^3+x^2-5\) is divided by \((x+1)\).</p>
  <p>
    \((x+1)=(x-(-1))\), so use \(a=-1\):
    \(P(-1)=2(-1)^3+(-1)^2-5=-2+1-5=-6\).
  </p>

  <h2 id="factor-theorem" class="book-prose__heading">Factor Theorem</h2>
  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Factor Theorem</p>
    <p class="book-formula">
      \[
      (x-a)\text{ is a factor of }P(x)\iff P(a)=0.
      \]
    </p>
  </div>

  <p>
    This is a direct consequence of the Remainder Theorem: factor means remainder \(0\).
  </p>

  <p><strong>Example 3.</strong> Is \((x-3)\) a factor of \(P(x)=x^3-4x^2-3x+18\)?</p>
  <p>
    \(P(3)=27-36-9+18=0\), so yes, \((x-3)\) is a factor.
  </p>

  <h2 id="finding-factors" class="book-prose__heading">Finding factors and roots (high-school workflow)</h2>
  <ol>
    <li>List possible rational roots using factors of constant term (and leading coefficient).</li>
    <li>Test candidates with \(P(a)\).</li>
    <li>When \(P(a)=0\), divide by \((x-a)\) to reduce degree.</li>
    <li>Factor the smaller polynomial and solve for all roots.</li>
  </ol>

  <p><strong>Example 4.</strong> Solve \(x^3-6x^2+11x-6=0\).</p>
  <p>
    Try integer candidates \(\pm1,\pm2,\pm3,\pm6\). We get \(P(1)=0\), so \((x-1)\) is a factor.
    Dividing gives \(x^2-5x+6\), which factorises to \((x-2)(x-3)\).
    Hence:
  </p>
  <p class="book-formula">
    \[
    x^3-6x^2+11x-6=(x-1)(x-2)(x-3),
    \]
  </p>
  <p>so roots are \(x=1,2,3\).</p>

  <h2 id="synthetic-division" class="book-prose__heading">Synthetic division (quick table method)</h2>
  <p>
    Synthetic division is a compact way to divide by \((x-a)\). It is fast for checking many
    candidates in exam settings.
  </p>
  <p><strong>Example 5.</strong> Divide \(x^3-6x^2+11x-6\) by \((x-1)\):</p>
  <p class="book-formula">
    \[
    \begin{array}{r|rrrr}
    1 & 1 & -6 & 11 & -6\\
      &   & 1 & -5 & 6\\ \hline
      & 1 & -5 & 6 & 0
    \end{array}
    \]
  </p>
  <p>Quotient is \(x^2-5x+6\), remainder \(0\).</p>

  <h2 id="exam-tips" class="book-prose__heading">Exam tips</h2>
  <ul>
    <li>Always rewrite \((x+b)\) as \((x-(-b))\) before substituting.</li>
    <li>If remainder is not zero, that candidate is not a factor.</li>
    <li>After finding one factor, reduce degree before continuing.</li>
    <li>Check final roots by substitution when time permits.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Polynomial equations became central in algebra from the Renaissance onward, when mathematicians
    studied systematic methods for solving cubic and quartic equations. As symbolic algebra matured,
    methods for division and factor testing became standard tools.
  </p>
  <p>
    What we now call the factor and remainder theorems are part of the broader
    polynomial division framework developed in 18th–19th century algebra texts.
    They remain important in modern high-school courses because they connect substitution,
    division, and root-finding in one clear structure.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation</h2>
  <h3 id="from-division-algorithm" class="book-prose__heading">From the polynomial division algorithm</h3>
  <p>
    For any polynomial \(P(x)\), dividing by \((x-a)\) gives:
    \[
    P(x)=(x-a)Q(x)+R.
    \]
    Now substitute \(x=a\):
    \[
    P(a)=(a-a)Q(a)+R=R.
    \]
    So the remainder equals \(P(a)\), proving the Remainder Theorem.
  </p>
  <p>
    If \((x-a)\) is a factor, remainder \(R=0\), so \(P(a)=0\). Conversely, if \(P(a)=0\), then
    remainder is zero, so \((x-a)\) divides \(P(x)\). This proves the Factor Theorem.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <p>
    Pause and reason before continuing. Discuss with a classmate or write your reasoning in a
    notebook.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Find the remainder when \(P(x)=3x^3-2x+7\) is divided by \((x-2)\).
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Is \((x+2)\) a factor of \(x^3+4x^2+5x+2\)? Show the one-line test.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Given \(P(x)=2x^3+kx^2-8x-4\), if \((x-2)\) is a factor, find \(k\).
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      A polynomial leaves remainder \(5\) when divided by \((x-1)\). What is \(P(1)\)?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      If \(P(3)=0\) and \(P(-1)=0\) for a cubic \(P(x)\), what two linear factors must appear?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Why is synthetic division especially useful after you already know one root?
    </p>
  </div>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <h3 id="curve-intercepts" class="book-prose__heading">Graph intercepts and curve sketching</h3>
  <p>
    Solving \(P(x)=0\) gives x-intercepts of polynomial graphs. Factor Theorem helps find those
    intercepts quickly, then sketch end behavior and turning points more accurately.
  </p>

  <h3 id="model-constraints" class="book-prose__heading">Constraint values in models</h3>
  <p>
    In applied models, a condition like “output is zero at \(x=a\)” means \(P(a)=0\), so
    \((x-a)\) must be a factor. This appears in physics calibration, optimization constraints, and
    coding of polynomial approximations.
  </p>

  <h3 id="numerical-methods" class="book-prose__heading">Gateway to numerical methods</h3>
  <p>
    Understanding factor tests and polynomial reduction supports later methods such as Newton’s
    method and polynomial interpolation, where roots and remainders are central ideas.
  </p>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school algebra curricula (IB, A-Level, DSE extension) on polynomial theorems.</li>
    <li>Classical algebra texts covering polynomial division and root-factor relationships.</li>
  </ul>
</div>
