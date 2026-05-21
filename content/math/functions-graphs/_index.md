+++
title = "Functions & graphs"
description = "Model input-output rules, work with domain and range, and sketch key function graphs and transformations."
template = "chapter.html"
weight = 15
[extra]
subject = "math"
chapter_id = "functions-graphs"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    A <strong>function</strong> is a rule that assigns exactly one output to each allowed input.
    In high school, functions help you connect equations, tables, and graphs.
  </p>

  <h2 id="what-is-a-function" class="book-prose__heading">What is a function?</h2>
  <p>
    If \(f\) is a function, then \(f(x)\) means “the output when input is \(x\).”
    Example:
  </p>
  <p class="book-formula">
    \[
    f(x)=2x+3.
    \]
  </p>
  <p>
    Then \(f(1)=5\), \(f(4)=11\), and \(f(-2)=-1\).
  </p>
  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Key idea</p>
    <p class="book-formula">
      \[
      \text{One input} \rightarrow \text{one output}.
      \]
    </p>
  </div>

  <h2 id="domain-range" class="book-prose__heading">Domain and range</h2>
  <p>
    The <strong>domain</strong> is the set of allowed inputs. The <strong>range</strong> is the set of
    outputs produced from that domain.
  </p>
  <p><strong>Example 1.</strong> \(f(x)=\frac{1}{x-2}\)</p>
  <ul>
    <li>Domain: all real \(x\) except \(x=2\).</li>
    <li>Range: all real \(y\) except \(y=0\).</li>
  </ul>
  <p><strong>Example 2.</strong> \(g(x)=\sqrt{x+1}\)</p>
  <ul>
    <li>Domain: \(x \ge -1\) (square root needs non-negative inside).</li>
    <li>Range: \(y \ge 0\).</li>
  </ul>

  <h2 id="function-vs-relation" class="book-prose__heading">Function vs relation</h2>
  <p>
    Not every relation is a function. If one input gives two outputs, it is not a function.
  </p>
  <p>
    On a graph, use the <strong>vertical line test</strong>: if any vertical line crosses the curve
    more than once, it is not a function.
  </p>

  <h2 id="graphs-basics" class="book-prose__heading">Graph basics</h2>
  <p>
    To sketch a graph:
  </p>
  <ol>
    <li>Choose key \(x\)-values and make a value table.</li>
    <li>Plot points \((x,f(x))\) on labeled axes.</li>
    <li>Connect appropriately (line, curve, or separate branches).</li>
    <li>Identify intercepts and turning features.</li>
  </ol>

  <h2 id="key-families" class="book-prose__heading">Important function families</h2>
  <h3 id="linear" class="book-prose__heading">Linear: \(y=mx+c\)</h3>
  <p>
    Straight line with slope \(m\) and \(y\)-intercept \(c\). A larger \(|m|\) means steeper line.
  </p>

  <h3 id="quadratic" class="book-prose__heading">Quadratic: \(y=ax^2+bx+c\)</h3>
  <p>
    Parabola. If \(a>0\), opens upward; if \(a<0\), opens downward.
  </p>

  <h3 id="absolute-value" class="book-prose__heading">Absolute value: \(y=|x|\)</h3>
  <p>
    V-shaped graph with vertex at the origin before transformations.
  </p>

  <h3 id="rational" class="book-prose__heading">Rational: \(y=\frac{1}{x}\)</h3>
  <p>
    Hyperbola with asymptotes \(x=0\) and \(y=0\). Graph has two separate branches.
  </p>

  <h2 id="transformations" class="book-prose__heading">Transformations</h2>
  <p>
    Start from \(y=f(x)\):
  </p>
  <ul>
    <li>\(y=f(x)+k\): shift up by \(k\).</li>
    <li>\(y=f(x-h)\): shift right by \(h\).</li>
    <li>\(y=af(x)\): vertical stretch/compression by factor \(|a|\), and reflect if \(a&lt;0\).</li>
    <li>\(y=f(bx)\): horizontal scale by factor \(\frac{1}{|b|}\), and reflect in \(y\)-axis if \(b&lt;0\).</li>
  </ul>
  <p><strong>Example.</strong> From \(y=x^2\) to \(y=(x-3)^2+2\): move right 3, up 2.</p>

  <h2 id="intercepts-and-meaning" class="book-prose__heading">Intercepts and meaning</h2>
  <ul>
    <li><strong>\(y\)-intercept:</strong> set \(x=0\).</li>
    <li><strong>\(x\)-intercepts:</strong> solve \(f(x)=0\).</li>
  </ul>
  <p>
    In applications, intercepts often represent starting value and break-even/zero-output points.
  </p>

  <h2 id="piecewise" class="book-prose__heading">Piecewise functions</h2>
  <p>
    Some rules change in different intervals. Example:
  </p>
  <p class="book-formula">
    \[
    f(x)=
    \begin{cases}
    x+2, & x&lt;1\\
    3, & x\ge 1
    \end{cases}
    \]
  </p>
  <p>
    Graph each rule only on its stated interval, and mark endpoints correctly (open/closed points).
  </p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>State domain restrictions before graphing.</li>
    <li>Use a neat value table near turning points or asymptotes.</li>
    <li>Label key coordinates: intercepts, vertex, asymptote equations.</li>
    <li>Check whether a requested equation is function form or relation form.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    The modern idea of a function developed over centuries. Early algebra connected formulas to
    unknown quantities, while analytic geometry (Descartes) linked equations to curves on coordinate
    axes.
  </p>
  <p>
    Later, Euler and others formalized function notation such as \(f(x)\). Today, function thinking
    is central in mathematics, science, economics, and computing because it models how one quantity
    depends on another.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="slope-intercept" class="book-prose__heading">From two points to line equation</h3>
  <p>
    If a line passes through \((x_1,y_1)\) and \((x_2,y_2)\), slope is:
    \[
    m=\frac{y_2-y_1}{x_2-x_1}.
    \]
    Then use \(y=mx+c\) and substitute one point to find \(c\).
  </p>

  <h3 id="vertex-form" class="book-prose__heading">Why vertex form helps for quadratics</h3>
  <p>
    Writing \(y=a(x-h)^2+k\) shows the turning point immediately: vertex \((h,k)\). This is why
    completing the square is useful for sketching and transformations.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">
      For \(f(x)=3x-2\), find \(f(5)\) and \(f(-1)\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(f(5)=13\), \(f(-1)=-5\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      State domain and range of \(g(x)=\sqrt{x-4}\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Domain \(x\ge 4\), range \(y\ge 0\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      Is \(x=y^2\) a function of \(x\)? Use the vertical line test idea.
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> No.</p>
      <p>
        For a positive \(x\), there are two \(y\)-values (\(+\sqrt{x}\) and \(-\sqrt{x}\)), so one
        \(x\) maps to two outputs.
      </p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      For \(y=(x+1)^2-3\), state the transformation from \(y=x^2\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Shift left 1 and down 3.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      Find intercepts of \(y=x^2-4x+3\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(y\)-intercept: \((0,3)\).</p>
      <p><strong>Answer:</strong> \(x\)-intercepts: solve \(x^2-4x+3=0\Rightarrow(x-1)(x-3)=0\), so \((1,0)\), \((3,0)\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      Sketch idea: \(f(x)=\frac{1}{x-2}+1\). What are its asymptotes?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Vertical asymptote \(x=2\), horizontal asymptote \(y=1\).</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <h3 id="finance" class="book-prose__heading">Finance and budgeting</h3>
  <p>
    Linear functions model plans with fixed charges plus per-unit costs, such as phone plans or
    transport fares.
  </p>

  <h3 id="motion" class="book-prose__heading">Motion and science</h3>
  <p>
    Position-time or velocity-time graphs are function graphs. Intercepts, gradients, and curvature
    describe physical behavior.
  </p>

  <h3 id="data-models" class="book-prose__heading">Data modeling</h3>
  <p>
    Exponential, quadratic, and rational models are used to approximate trends, optimize designs,
    and make predictions from measured data.
  </p>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school algebra curricula on functions, graphs, and transformations.</li>
    <li>Analytic geometry and precalculus references covering domain/range and graph families.</li>
  </ul>
</div>
