+++
title = "Exponential & logarithmic functions"
description = "Use exponential and logarithmic models, apply log laws, and solve growth and decay equations."
template = "chapter.html"
weight = 16
[extra]
subject = "math"
chapter_id = "exponential-logarithmic"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    Exponential and logarithmic functions are inverse ideas. They model fast growth, rapid decay,
    and scale changes that linear models cannot describe well.
  </p>

  <h2 id="exponential-basics" class="book-prose__heading">Exponential basics</h2>
  <p>
    An exponential function has variable in the exponent:
    \[
    y=a^x,\quad a&gt;0,\ a\ne1.
    \]
  </p>
  <p>
    If \(a&gt;1\), the function grows as \(x\) increases. If \(0&lt;a&lt;1\), it decays.
  </p>
  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Example</p>
    <p class="book-formula">\[
      2^x \text{ grows},\qquad \left(\frac12\right)^x \text{ decays}.
    \]</p>
  </div>

  <h2 id="logarithm-meaning" class="book-prose__heading">What is a logarithm?</h2>
  <p>
    A logarithm asks for the exponent:
    \[
    \log_a b = c \iff a^c=b.
    \]
  </p>
  <p>
    So \(\log_2 8=3\) because \(2^3=8\). Also, \(\log_{10}100=2\).
  </p>

  <h2 id="domain-and-range" class="book-prose__heading">Domain and range</h2>
  <ul>
    <li>\(y=a^x\): domain all real \(x\), range \(y&gt;0\), horizontal asymptote \(y=0\).</li>
    <li>\(y=\log_a x\): domain \(x&gt;0\), range all real numbers, vertical asymptote \(x=0\).</li>
  </ul>
  <p>
    These two graphs are reflections of each other in the line \(y=x\).
  </p>

  <h2 id="laws-indices" class="book-prose__heading">Index laws review</h2>
  <p>
    Exponential solving often uses:
  </p>
  <p class="book-formula">
    \[
    a^m a^n=a^{m+n},\quad
    \frac{a^m}{a^n}=a^{m-n},\quad
    (a^m)^n=a^{mn}.
    \]
  </p>

  <h2 id="laws-logs" class="book-prose__heading">Logarithm laws</h2>
  <p>
    For \(M,N&gt;0\):
  </p>
  <p class="book-formula">
    \[
    \log_a(MN)=\log_a M+\log_a N,
    \]
    \[
    \log_a\!\left(\frac{M}{N}\right)=\log_a M-\log_a N,
    \]
    \[
    \log_a(M^k)=k\log_a M.
    \]
  </p>
  <p><strong>Common mistakes:</strong> \(\log(M+N)\ne \log M+\log N\).</p>

  <h2 id="change-of-base" class="book-prose__heading">Change of base</h2>
  <p>
    To evaluate logs with calculator:
    \[
    \log_a b = \frac{\log b}{\log a} = \frac{\ln b}{\ln a}.
    \]
  </p>
  <p>
    Here \(\log\) usually means base 10 and \(\ln\) means base \(e\).
  </p>

  <h2 id="solve-exponential" class="book-prose__heading">Solving exponential equations</h2>
  <p><strong>Case 1: same base.</strong></p>
  <p class="book-formula">\[
    3^{2x-1}=3^5 \Rightarrow 2x-1=5 \Rightarrow x=3.
  \]</p>

  <p><strong>Case 2: take logs.</strong></p>
  <p class="book-formula">\[
    5^x=17 \Rightarrow x=\log_5 17=\frac{\log 17}{\log 5}\approx 1.760.
  \]</p>

  <h2 id="solve-log" class="book-prose__heading">Solving logarithmic equations</h2>
  <p><strong>Example 1.</strong> \(\log_2(x-1)=4\)</p>
  <p>
    Convert to exponential: \(x-1=2^4=16\), so \(x=17\). Domain check: \(x&gt;1\), valid.
  </p>
  <p><strong>Example 2.</strong> \(\log_{10}(x+3)+\log_{10}(x-1)=1\)</p>
  <p>
    \[
    \log_{10}\big((x+3)(x-1)\big)=1
    \Rightarrow (x+3)(x-1)=10.
    \]
    \[
    x^2+2x-3=10 \Rightarrow x^2+2x-13=0.
    \]
    \[
    x=-1\pm\sqrt{14}.
    \]
    Domain requires \(x&gt;1\), so \(x=-1+\sqrt{14}\) only.
  </p>

  <h2 id="growth-decay-models" class="book-prose__heading">Growth and decay models</h2>
  <p>
    A common model:
    \[
    A(t)=A_0(1+r)^t
    \]
    for growth (\(r&gt;0\)) or decay (\(r&lt;0\), with \(1+r&gt;0\)).
  </p>
  <p>
    Continuous model:
    \[
    A(t)=A_0e^{kt},
    \]
    where \(k&gt;0\) gives growth and \(k&lt;0\) gives decay.
  </p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>State domain restrictions first in log equations.</li>
    <li>When combining logs, check arguments stay positive.</li>
    <li>Use exact forms before calculator rounding.</li>
    <li>For modeling, define variables and units clearly.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Logarithms were developed in the early 17th century (notably by John Napier) to simplify long
    multiplication and division into addition and subtraction. Before electronic calculators, this was
    a major speed boost for astronomy, navigation, and engineering.
  </p>
  <p>
    Exponential functions became central in science through models of population growth, radioactive
    decay, and continuously changing quantities.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="why-log-laws" class="book-prose__heading">Why log product law works</h3>
  <p>
    Let \(\log_a M=p\) and \(\log_a N=q\). Then \(M=a^p\), \(N=a^q\), so
    \[
    MN=a^{p+q}.
    \]
    Taking \(\log_a\) gives:
    \[
    \log_a(MN)=p+q=\log_a M+\log_a N.
    \]
  </p>

  <h3 id="inverse-view" class="book-prose__heading">Inverse relationship view</h3>
  <p>
    If \(y=a^x\), swapping \(x,y\) gives \(x=a^y\), so \(y=\log_a x\). That is why exponential and
    logarithmic graphs are mirror images across \(y=x\).
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">
      Evaluate \(\log_3 81\) and \(\log_{10}0.01\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\log_3 81=4\), \(\log_{10}0.01=-2\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      Expand: \(\log_2(8x^3)\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\log_2 8 + \log_2 x^3 = 3 + 3\log_2 x\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      Solve \(2^{x+1}=7\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(x+1=\log_2 7\), so \(x=\log_2 7-1 \approx 1.807\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      Solve \(\log_5(x-4)=2\) and state domain condition.
    </summary>
    <div class="book-question__solution">
      <p><strong>Domain:</strong> \(x-4&gt;0\Rightarrow x&gt;4\).</p>
      <p><strong>Answer:</strong> \(x-4=25\Rightarrow x=29\), valid.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      A population starts at 500 and grows 6% per year. Write the model and find \(A(4)\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Model:</strong> \(A(t)=500(1.06)^t\).</p>
      <p><strong>Value:</strong> \(A(4)=500(1.06)^4\approx 631.24\), about 631.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      A substance follows \(A(t)=120e^{-0.18t}\). Is this growth or decay? Why?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Decay, because exponent coefficient is negative (\(k=-0.18\)).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <h3 id="compound-interest" class="book-prose__heading">Compound interest</h3>
  <p>
    Savings and loans often follow exponential rules. Logarithms are used to solve for unknown time
    or interest rate.
  </p>

  <h3 id="half-life" class="book-prose__heading">Half-life and decay</h3>
  <p>
    Radioactive substances and medicine concentration in the body are modeled with exponential decay.
  </p>

  <h3 id="scales" class="book-prose__heading">Logarithmic scales</h3>
  <p>
    pH, decibels, and Richter magnitude use logarithmic scales to represent very large ratio ranges
    in manageable numbers.
  </p>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school curricula on exponential and logarithmic functions (IGCSE, IB, A-Level, AP).</li>
    <li>Precalculus and algebra references on log laws, inverse functions, and modeling.</li>
  </ul>
</div>
