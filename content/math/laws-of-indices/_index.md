+++
title = "Laws of indices"
description = "Apply index laws to simplify expressions with integer and rational exponents."
template = "chapter.html"
weight = 12
[extra]
subject = "math"
chapter_id = "laws-of-indices"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    An <strong>index</strong> (or exponent) tells you how many times a base is used as a factor.
    For example, \(2^4 = 2 \times 2 \times 2 \times 2\). The laws of indices let us simplify
    expressions efficiently and work with very large or very small quantities.
  </p>

  <h2 id="basic-meaning" class="book-prose__heading">Meaning of indices</h2>
  <div class="book-table-wrap">
    <table class="book-table">
      <thead>
        <tr>
          <th scope="col">Expression</th>
          <th scope="col">Meaning</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>\(5^3\)</td>
          <td>\(5 \times 5 \times 5\)</td>
          <td>\(125\)</td>
        </tr>
        <tr>
          <td>\(a^2\)</td>
          <td>\(a \times a\)</td>
          <td>depends on \(a\)</td>
        </tr>
        <tr>
          <td>\(10^0\)</td>
          <td>zero index</td>
          <td>\(1\)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 id="core-laws" class="book-prose__heading">Core laws of indices</h2>
  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Index laws (for non-zero base where required)</p>
    <p class="book-formula">
      \[
      a^m \cdot a^n = a^{m+n}, \quad
      \frac{a^m}{a^n} = a^{m-n}, \quad
      (a^m)^n = a^{mn}
      \]
      \[
      (ab)^n = a^n b^n, \quad
      \left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}, \quad
      a^0 = 1
      \]
    </p>
  </div>

  <h2 id="negative-indices" class="book-prose__heading">Negative indices</h2>
  <p>
    A negative index means reciprocal:
    \[
    a^{-n} = \frac{1}{a^n}, \qquad a \neq 0.
    \]
  </p>
  <p><strong>Example.</strong> \(2^{-3} = \frac{1}{2^3} = \frac{1}{8}\).</p>
  <p><strong>Example.</strong> \(x^{-2}y^3 = \frac{y^3}{x^2}\).</p>

  <h2 id="fractional-indices" class="book-prose__heading">Fractional indices</h2>
  <p>
    Fractional indices represent roots:
    \[
    a^{1/n} = \sqrt[n]{a}, \qquad
    a^{m/n} = \sqrt[n]{a^m}.
    \]
  </p>
  <p><strong>Example.</strong> \(27^{1/3} = 3\).</p>
  <p><strong>Example.</strong> \(16^{3/4} = (\sqrt[4]{16})^3 = 2^3 = 8\).</p>

  <h2 id="simplification-examples" class="book-prose__heading">Simplification examples</h2>
  <p><strong>Example 1.</strong> Simplify \(a^5 \cdot a^{-2}\).</p>
  <p>
    \(a^{5+(-2)} = a^3\).
  </p>
  <p><strong>Example 2.</strong> Simplify \(\dfrac{3x^4y^{-1}}{6x^2}\).</p>
  <p>
    \[
    \frac{3x^4y^{-1}}{6x^2}
    = \frac{1}{2}x^{4-2}y^{-1}
    = \frac{x^2}{2y}.
    \]
  </p>
  <p><strong>Example 3.</strong> Simplify \((2a^3b^{-2})^2\).</p>
  <p>
    \(2^2 a^{6} b^{-4} = \dfrac{4a^6}{b^4}\).
  </p>

  <h2 id="scientific-notation" class="book-prose__heading">Scientific notation link</h2>
  <p>
    Indices are central to scientific notation:
    \[
    N = k \times 10^n, \qquad 1 \leq k < 10.
    \]
    Positive \(n\) gives large numbers, negative \(n\) gives small decimals.
  </p>
  <p><strong>Example.</strong> \(0.00045 = 4.5 \times 10^{-4}\).</p>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Exponent ideas developed over centuries as mathematicians searched for compact ways to write
    repeated multiplication. Ancient methods used words or special marks, but a systematic notation
    appeared gradually in early modern Europe.
  </p>
  <p>
    In the 17th century, mathematicians such as <strong>Descartes</strong> helped popularize writing
    powers with superscripts (like \(x^2\), \(x^3\)). Later work by
    <strong>Wallis</strong> and <strong>Newton</strong> expanded these ideas to fractional and
    negative exponents. This notation became a foundation for algebra, calculus, and scientific
    notation.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation</h2>

  <h3 id="why-zero-index" class="book-prose__heading">Why \(a^0 = 1\)</h3>
  <p>
    Using the quotient law with \(a \neq 0\):
    \[
    \frac{a^m}{a^m} = a^{m-m} = a^0.
    \]
    But \(\dfrac{a^m}{a^m} = 1\), so \(a^0 = 1\).
  </p>

  <h3 id="why-negative-index" class="book-prose__heading">Why \(a^{-n} = \dfrac{1}{a^n}\)</h3>
  <p>
    Again from the quotient law:
    \[
    \frac{a^0}{a^n} = a^{0-n} = a^{-n}.
    \]
    Since \(a^0 = 1\), we get \(a^{-n} = \dfrac{1}{a^n}\).
  </p>

  <h3 id="why-fractional-index" class="book-prose__heading">Why \(a^{1/n} = \sqrt[n]{a}\)</h3>
  <p>
    Let \(a^{1/n} = t\). Raise both sides to power \(n\):
    \[
    (a^{1/n})^n = t^n \Rightarrow a = t^n.
    \]
    So \(t\) is an \(n\)-th root of \(a\), giving \(a^{1/n} = \sqrt[n]{a}\).
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <p>
    Pause and reason before continuing. Discuss with a classmate or write your reasoning in a
    notebook.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Simplify \(x^7 \div x^3\). Which index law did you use?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Rewrite \(5^{-2}\) without a negative index, then evaluate.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Simplify \((a^2b^{-1})^3\) and express your final answer with positive indices.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Evaluate \(81^{3/4}\) by rewriting it in root form first.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Write \(0.000072\) in scientific notation and state the index on 10.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      True or false: \((x+y)^2 = x^2 + y^2\). Explain why index laws do or do not support this.
    </p>
  </div>

  <h2 id="applications" class="book-prose__heading">Applications</h2>

  <h3 id="science-scales" class="book-prose__heading">Large and small scales in science</h3>
  <p>
    Distances in astronomy and sizes of atoms are usually written with powers of 10 to keep numbers
    readable. For example, \(1.5 \times 10^{11}\) m is much clearer than writing 150000000000 m.
  </p>

  <h3 id="growth-decay" class="book-prose__heading">Repeated growth and decay</h3>
  <p>
    Compound growth often uses exponent models such as
    \(A = P(1+r)^t\). Exponents track repeated multiplication over equal time steps.
  </p>

  <h3 id="computing-bits" class="book-prose__heading">Computing and binary powers</h3>
  <p>
    Computer memory sizes are tied to powers of 2. For example, \(2^{10} = 1024\), so one kibibyte
    is 1024 bytes and larger units build from further powers.
  </p>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Descartes, R. (1637). <em>La Geometrie</em> (superscript power notation usage).</li>
    <li>Wallis, J. (1685). <em>A Treatise of Algebra</em> (negative and fractional powers).</li>
    <li>Secondary school algebra curricula on laws of indices and scientific notation.</li>
  </ul>
</div>
